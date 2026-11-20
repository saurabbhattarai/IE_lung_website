import "server-only";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { prisma } from "../prisma";
import {
  CLOUDINARY_BLOG_FOLDER,
  validateBlogPublicId,
} from "./validation";

export { CLOUDINARY_BLOG_FOLDER, validateBlogPublicId };

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

export interface CloudinaryDeleteResult {
  success: boolean;
  message: string;
  publicId: string;
  result?: string;
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
 * Uploads an image buffer directly to Cloudinary using upload_stream.
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
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Dedicated recursive inspector that traverses a Tiptap / ProseMirror document tree
 * to detect any reference to a target Cloudinary public ID.
 *
 * Inspects:
 * - Image nodes (`node.type === "image"`) checking `attrs.src`
 * - Any node attribute containing the public ID directly or inside a Cloudinary URL
 * - URL-encoded variants (e.g. `ielung%2Fblog%2Fphoto`)
 * - Deeply nested structures (blocks, columns, callouts, lists, quotes, tables)
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
          // Check for URL path boundary after / or before .
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
 * Checks whether an image public ID is currently referenced by any BlogPost in the database.
 * Returns true if referenced, false if unreferenced.
 * Throws if the database cannot be queried, ensuring deletion cannot proceed blindly (fail-closed).
 */
export async function isImageReferencedInDatabase(publicId: string): Promise<{
  isReferenced: boolean;
  reason?: string;
}> {
  const normalizedTarget = publicId.trim();

  try {
    // 1. Check if referenced as a cover image by public ID OR by cover image URL
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

    // 2. Recursively inspect article content JSON in all blog posts
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
  } catch (error) {
    throw new Error(
      `Database reference check failed: ${error instanceof Error ? error.message : "Database unavailable"}. Deletion aborted for safety.`
    );
  }
}

/**
 * Safely deletes an unreferenced image from Cloudinary.
 * Enforces folder safety, database reference check, and server-side authentication.
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<CloudinaryDeleteResult> {
  // 1. Enforce folder and path security
  const pathCheck = validateBlogPublicId(publicId);
  if (!pathCheck.valid) {
    throw new Error(pathCheck.error);
  }

  // 2. Enforce database reference safety check
  const referenceCheck = await isImageReferencedInDatabase(publicId);
  if (referenceCheck.isReferenced) {
    throw new Error(`Cannot delete image: ${referenceCheck.reason}`);
  }

  // 3. Execute deletion via official Cloudinary SDK
  const client = getCloudinaryClient();
  const result = await client.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  return {
    success: true,
    message: "Image successfully removed from media storage.",
    publicId,
    result: result.result,
  };
}
