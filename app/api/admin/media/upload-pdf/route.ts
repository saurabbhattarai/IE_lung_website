import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { validatePdfBuffer } from "@/lib/media/validation";
import { uploadPdfToCloudinary } from "@/lib/media/cloudinary";

export const dynamic = "force-dynamic";

/**
 * Maximum allowed size for the incoming multipart request body: 26 MB.
 * (25 MB max allowed PDF file + 1 MB multipart boundary and header overhead).
 */
export const MAX_PDF_MULTIPART_REQUEST_BYTES = 26 * 1024 * 1024; // 27,262,976 bytes

/**
 * Protected Admin PDF Document Upload Endpoint
 * Accepts: multipart/form-data with a "file" field
 * Security:
 * - Requires valid admin JWT session (401).
 * - Enforces pre-check and bounded streaming body limit of 26 MB to prevent memory exhaustion (413).
 * - Validates binary magic bytes (%PDF-) and caps actual file size at 25 MB (400).
 * - Uploads through server-side official Cloudinary SDK to 'ielung/downloads' with resource_type: "raw" (201).
 */
export async function POST(request: NextRequest) {
  // 1. Enforce Server-Side Admin Authentication
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
    if (!Number.isNaN(parsedLength) && parsedLength > MAX_PDF_MULTIPART_REQUEST_BYTES) {
      return NextResponse.json(
        { error: "Payload Too Large: Request body exceeds the 26 MB maximum limit for PDF documents." },
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
        if (totalBytes > MAX_PDF_MULTIPART_REQUEST_BYTES) {
          await reader.cancel();
          return NextResponse.json(
            { error: "Payload Too Large: Request body exceeds the 26 MB maximum limit for PDF documents." },
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

    // Validate size (up to 25 MB) and %PDF- binary signature
    const validation = validatePdfBuffer(buffer, file.type);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "File validation failed." },
        { status: 400 }
      );
    }

    // 6. Upload to Cloudinary 'ielung/downloads' as raw resource
    const result = await uploadPdfToCloudinary(buffer, file.name);

    return NextResponse.json(
      {
        secure_url: result.secure_url,
        public_id: result.public_id,
        originalFilename: result.originalFilename,
        fileSize: result.fileSize,
        bytes: result.bytes,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media upload failed.";

    if (message.includes("Cloudinary configuration missing")) {
      return NextResponse.json(
        { error: "Media service is not configured on the server. Please check Cloudinary environment variables." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process PDF upload. Please try again or check media service status." },
      { status: 500 }
    );
  }
}
