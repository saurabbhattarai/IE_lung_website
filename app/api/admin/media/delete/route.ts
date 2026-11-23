import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "../../../../../lib/auth/session";
import {
  deleteMediaFromCloudinary,
  isMediaReferencedInDatabase,
} from "../../../../../lib/media/cloudinary";
import {
  validateMediaPublicId,
} from "../../../../../lib/media/validation";

export const dynamic = "force-dynamic";

/**
 * Handles safe deletion of an unreferenced asset (blog image, gallery image, or PDF document) from Cloudinary.
 */
async function handleDelete(request: NextRequest) {
  // 1. Enforce Server-Side Admin Authentication
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: A valid admin session is required." },
      { status: 401 }
    );
  }

  // 2. Parse and Validate Request Payload
  let publicId: string | undefined;

  try {
    const body = await request.json();
    publicId = body.publicId;
  } catch {
    return NextResponse.json(
      { error: "Invalid request: Expected JSON body with 'publicId'." },
      { status: 400 }
    );
  }

  // 3. Validate Public ID Folder & Path Traversal
  const pathValidation = validateMediaPublicId(publicId);
  if (!pathValidation.valid) {
    return NextResponse.json(
      { error: pathValidation.error || "Invalid public ID." },
      { status: 400 }
    );
  }

  const validPublicId = publicId!.trim();

  // 4. Verify Database References (Prevent deleting assets used by published or draft records across blog, gallery, or downloads)
  try {
    const referenceCheck = await isMediaReferencedInDatabase(validPublicId);
    if (referenceCheck.isReferenced) {
      return NextResponse.json(
        {
          error: `Cannot delete image: ${referenceCheck.reason}`,
        },
        { status: 409 } // 409 Conflict
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Database reference check failed. Deletion aborted for safety.",
      },
      { status: 500 }
    );
  }

  // 5. Delete via Official Cloudinary SDK
  try {
    const result = await deleteMediaFromCloudinary(validPublicId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Deletion failed.";
    return NextResponse.json(
      { error: message || "Failed to delete media asset from Cloudinary." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  return handleDelete(request);
}

export async function POST(request: NextRequest) {
  return handleDelete(request);
}
