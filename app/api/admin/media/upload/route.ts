import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "../../../../../lib/auth/session";
import { validateImageBuffer } from "../../../../../lib/media/validation";
import { uploadImageToCloudinary } from "../../../../../lib/media/cloudinary";

export const dynamic = "force-dynamic";

/**
 * Maximum allowed size for the incoming multipart request body: 6 MB.
 * (5 MB max allowed file payload + 1 MB multipart boundary and header overhead).
 */
export const MAX_MULTIPART_REQUEST_BYTES = 6 * 1024 * 1024; // 6,291,456 bytes

/**
 * Protected Admin Media Upload Endpoint
 * Accepts: multipart/form-data with a "file" field
 * Security:
 * - Requires valid admin JWT session (401).
 * - Enforces pre-check and bounded streaming body limit of 6 MB to prevent memory exhaustion (413).
 * - Validates binary magic bytes and caps actual file size at 5 MB (400).
 * - Uploads through server-side official Cloudinary SDK to 'ielung/blog' folder (201).
 */
export async function POST(request: NextRequest) {
  // 1. Enforce Server-Side Admin Authentication (Defense-in-depth)
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: A valid admin session is required." },
      { status: 401 }
    );
  }

  // 2. Pre-check Content-Length header if present
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const parsedLength = parseInt(contentLengthHeader, 10);
    if (!Number.isNaN(parsedLength) && parsedLength > MAX_MULTIPART_REQUEST_BYTES) {
      return NextResponse.json(
        { error: "Payload Too Large: Request body exceeds the 6 MB maximum limit." },
        { status: 413 }
      );
    }
  }

  // 3. Stream and Bound Request Body to prevent unbounded memory buffering
  if (!request.body) {
    return NextResponse.json(
      { error: "Invalid request: Request body is empty." },
      { status: 400 }
    );
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.length;
        if (totalBytes > MAX_MULTIPART_REQUEST_BYTES) {
          // Immediately abort incoming stream to save memory and server resources
          await reader.cancel();
          return NextResponse.json(
            { error: "Payload Too Large: Request body exceeds the 6 MB maximum limit." },
            { status: 413 }
          );
        }
        chunks.push(value);
      }
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to read request body stream." },
      { status: 400 }
    );
  }

  // 4. Parse Multipart Form Data from Bounded Buffer
  const boundedBuffer = Buffer.concat(chunks);
  const headers = new Headers(request.headers);
  headers.set("content-length", String(boundedBuffer.length));

  let formData: FormData;
  try {
    const boundedRequest = new Request(request.url, {
      method: "POST",
      headers,
      body: boundedBuffer,
    });
    formData = await boundedRequest.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid request: Expected valid multipart form data." },
      { status: 400 }
    );
  }

  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "Missing required 'file' field in upload request." },
      { status: 400 }
    );
  }

  // 5. Extract and Validate File Buffer & Content
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate size and binary magic bytes (JPEG, PNG, WebP, AVIF)
    const validation = validateImageBuffer(buffer, file.type);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "File validation failed." },
        { status: 400 }
      );
    }

    // 6. Upload to Cloudinary via Official Node SDK
    const result = await uploadImageToCloudinary(buffer);

    return NextResponse.json(
      {
        secure_url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media upload failed.";

    // If Cloudinary configuration is missing on server
    if (message.includes("Cloudinary configuration missing")) {
      return NextResponse.json(
        { error: "Media service is not configured on the server. Please check Cloudinary environment variables." },
        { status: 500 }
      );
    }

    // General safe error response (avoids leaking credentials or stack traces)
    return NextResponse.json(
      { error: "Failed to process image upload. Please try again or check media service status." },
      { status: 500 }
    );
  }
}
