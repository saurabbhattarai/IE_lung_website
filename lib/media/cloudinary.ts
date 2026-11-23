import "server-only";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { prisma } from "../prisma";
import {
  CLOUDINARY_BLOG_FOLDER,
  CLOUDINARY_GALLERY_FOLDER,
  CLOUDINARY_DOWNLOADS_FOLDER,
  validateBlogPublicId,
  validateMediaPublicId,
  sanitizeFilename,
} from "./validation";

export {
  CLOUDINARY_BLOG_FOLDER,
  CLOUDINARY_GALLERY_FOLDER,
  CLOUDINARY_DOWNLOADS_FOLDER,
  validateBlogPublicId,
  validateMediaPublicId,
};

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format?: string;
}

export interface CloudinaryPdfUploadResult {
  secure_url: string;
  public_id: string;
  originalFilename: string;
  fileSize: string;
  bytes: number;
}

export interface CloudinaryDeleteResult {
  success: boolean;
  message: string;
  publicId: string;
  result?: string;
  resourceType?: "image" | "raw";
}

/**
 * Validates that required server-side Cloudinary credentials exist.
 * Throws a clean error without leaking sensitive values.
 */
export function getCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary configuration missing: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET is not configured on the server."
    );
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Initializes and returns the official Cloudinary Node.js SDK instance
 * configured with HTTPS and server-only credentials.
 */
export function getCloudinaryClient() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

/**
 * Uploads a blog image buffer directly to Cloudinary (folder: ielung/blog).
 * Applies automatic WebP/AVIF format and quality optimizations.
 */
export async function uploadImageToCloudinary(
  buffer: Buffer
): Promise<CloudinaryUploadResult> {
  const client = getCloudinaryClient();

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder: CLOUDINARY_BLOG_FOLDER,
        resource_type: "image",
        transformation: [
          {
            fetch_format: "auto",
            quality: "auto",
          },
        ],
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          return reject(
            error ||
              new Error("Cloudinary upload failed: no result returned from media service.")
          );
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Uploads a gallery photo buffer directly to Cloudinary (folder: ielung/gallery).
 * Applies automatic format and quality optimizations for high-resolution photography.
 */
export async function uploadGalleryImageToCloudinary(
  buffer: Buffer
): Promise<CloudinaryUploadResult> {
  const client = getCloudinaryClient();

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder: CLOUDINARY_GALLERY_FOLDER,
        resource_type: "image",
        transformation: [
          {
            fetch_format: "auto",
            quality: "auto",
          },
        ],
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          return reject(
            error ||
              new Error("Cloudinary gallery upload failed: no result returned from media service.")
          );
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Uploads a PDF document buffer directly to Cloudinary (folder: ielung/downloads).
 * Uses resource_type: "raw" to preserve binary PDF structure and disable image transformations.
 */
export async function uploadPdfToCloudinary(
  buffer: Buffer,
  originalFilename?: string
): Promise<CloudinaryPdfUploadResult> {
  const client = getCloudinaryClient();
  const safeBaseName = sanitizeFilename(originalFilename);
  const uniquePublicId = `${safeBaseName}_${Date.now()}`;

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder: CLOUDINARY_DOWNLOADS_FOLDER,
        public_id: uniquePublicId,
        resource_type: "raw",
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          return reject(
            error ||
              new Error("Cloudinary PDF upload failed: no result returned from media service.")
          );
        }

        const bytes = result.bytes || buffer.length;
        const fileSize =
          bytes >= 1024 * 1024
            ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(bytes / 1024)} KB`;

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          originalFilename: originalFilename || `${safeBaseName}.pdf`,
          fileSize,
          bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Dedicated recursive inspector that traverses a Tiptap / ProseMirror document tree
 * to detect any reference to a target Cloudinary public ID.
 */
export function isPublicIdReferencedInTiptap(
  node: unknown,
  targetPublicId: string
): boolean {
  if (!node || typeof node !== "object") {
    return false;
  }

  const normalizedTarget = targetPublicId.trim();
  const encodedTarget = encodeURIComponent(normalizedTarget);
  const filenameOnly = normalizedTarget.includes("/")
    ? normalizedTarget.split("/").pop()!
    : normalizedTarget;

  const n = node as {
    type?: string;
    attrs?: Record<string, unknown>;
    content?: unknown[];
  };

  // 1. Inspect all node attributes (e.g. attrs.src, attrs.publicId, attrs.href)
  if (n.attrs && typeof n.attrs === "object") {
    for (const val of Object.values(n.attrs)) {
      if (typeof val === "string") {
        const valTrimmed = val.trim();

        // Direct match, exact substring, or percent-encoded substring
        if (
          valTrimmed === normalizedTarget ||
          valTrimmed.includes(normalizedTarget) ||
          valTrimmed.includes(encodedTarget)
        ) {
          return true;
        }

        // If val is a Cloudinary URL, inspect whether it references this public ID
        if (valTrimmed.includes("cloudinary.com") && valTrimmed.includes(filenameOnly)) {
          const regex = new RegExp(`[/=]${filenameOnly}(\\.[a-zA-Z0-9]+)?([?#&]|$)`);
          if (regex.test(valTrimmed) || valTrimmed.includes(normalizedTarget)) {
            return true;
          }
        }
      }
    }
  }

  // 2. Recursively inspect all child nodes in the Tiptap document tree
  if (Array.isArray(n.content)) {
    for (const child of n.content) {
      if (isPublicIdReferencedInTiptap(child, targetPublicId)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks whether a media asset (blog image, gallery image, or download PDF) is referenced in the database.
 * Blocks deletion if referenced by draft or published records across all supported models.
 * Throws if the database cannot be queried, ensuring deletion cannot proceed blindly (fail-closed).
 */
export async function isMediaReferencedInDatabase(publicId: string): Promise<{
  isReferenced: boolean;
  reason?: string;
}> {
  const normalizedTarget = publicId.trim();

  // Validate public ID to determine folder ownership and security
  const pathCheck = validateMediaPublicId(normalizedTarget);
  if (!pathCheck.valid || !pathCheck.folder) {
    throw new Error(pathCheck.error || "Invalid public ID.");
  }

  try {
    // 1. Blog Images (ielung/blog)
    if (pathCheck.folder === CLOUDINARY_BLOG_FOLDER) {
      // Check if referenced as a cover image by public ID OR by cover image URL
      const postWithCover = await prisma.blogPost.findFirst({
        where: {
          OR: [
            { coverImagePublicId: normalizedTarget },
            { coverImage: { contains: normalizedTarget } },
          ],
        },
        select: {
          id: true,
          title: true,
        },
      });

      if (postWithCover) {
        return {
          isReferenced: true,
          reason: `Image is currently referenced as the cover image for post "${postWithCover.title}".`,
        };
      }

      // Recursively inspect article content JSON in all blog posts
      const allPosts = await prisma.blogPost.findMany({
        select: {
          id: true,
          title: true,
          content: true,
        },
      });

      for (const post of allPosts) {
        if (
          post.content &&
          isPublicIdReferencedInTiptap(post.content, normalizedTarget)
        ) {
          return {
            isReferenced: true,
            reason: `Image is currently embedded within the article body of post "${post.title}".`,
          };
        }
      }

      return { isReferenced: false };
    }

    // 2. Gallery Images (ielung/gallery)
    if (pathCheck.folder === CLOUDINARY_GALLERY_FOLDER) {
      const referencedGalleryImage = await prisma.galleryImage.findFirst({
        where: {
          OR: [
            { publicId: normalizedTarget },
            { src: { contains: normalizedTarget } },
          ],
        },
        select: {
          id: true,
          title: true,
        },
      });

      if (referencedGalleryImage) {
        return {
          isReferenced: true,
          reason: `Image is currently referenced by gallery item "${referencedGalleryImage.title}".`,
        };
      }

      return { isReferenced: false };
    }

    // 3. Download Documents (ielung/downloads)
    if (pathCheck.folder === CLOUDINARY_DOWNLOADS_FOLDER) {
      const referencedDownload = await prisma.downloadResource.findFirst({
        where: {
          OR: [
            { filePublicId: normalizedTarget },
            { fileUrl: { contains: normalizedTarget } },
          ],
        },
        select: {
          id: true,
          title: true,
        },
      });

      if (referencedDownload) {
        return {
          isReferenced: true,
          reason: `Document is currently referenced by download resource "${referencedDownload.title}".`,
        };
      }

      return { isReferenced: false };
    }

    return { isReferenced: false };
  } catch (error) {
    throw new Error(
      `Database reference check failed: ${error instanceof Error ? error.message : "Database unavailable"}. Deletion aborted for safety.`
    );
  }
}

/**
 * Checks whether an image public ID is currently referenced by any BlogPost in the database.
 * Backward-compatible helper.
 */
export async function isImageReferencedInDatabase(publicId: string): Promise<{
  isReferenced: boolean;
  reason?: string;
}> {
  return isMediaReferencedInDatabase(publicId);
}

/**
 * Safely deletes an unreferenced asset (blog image, gallery image, or PDF document) from Cloudinary.
 * Enforces folder safety, proper Cloudinary resource_type, and database reference checks where applicable.
 */
export async function deleteMediaFromCloudinary(
  publicId: string
): Promise<CloudinaryDeleteResult> {
  // 1. Enforce folder and path security
  const pathCheck = validateMediaPublicId(publicId);
  if (!pathCheck.valid || !pathCheck.folder || !pathCheck.resourceType) {
    throw new Error(pathCheck.error || "Invalid public ID.");
  }

  // 2. Enforce database reference safety check for all media assets (blog, gallery, downloads)
  const referenceCheck = await isMediaReferencedInDatabase(publicId);
  if (referenceCheck.isReferenced) {
    throw new Error(`Cannot delete image: ${referenceCheck.reason}`);
  }

  // 3. Execute deletion via official Cloudinary SDK with correct resource_type
  const client = getCloudinaryClient();
  const result = await client.uploader.destroy(publicId, {
    resource_type: pathCheck.resourceType,
    invalidate: true,
  });

  return {
    success: true,
    message: "Media asset successfully removed from storage.",
    publicId,
    result: result.result,
    resourceType: pathCheck.resourceType,
  };
}

/**
 * Backward-compatible helper for blog image deletion.
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<CloudinaryDeleteResult> {
  return deleteMediaFromCloudinary(publicId);
}
