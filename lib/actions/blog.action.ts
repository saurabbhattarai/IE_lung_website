"use server";

import { requireAdminSession } from "@/lib/auth/session";
import {
  CreateBlogPostSchema,
  UpdateBlogPostSchema,
  BlogQuerySchema,
} from "@/lib/validations/blog.validation";
import {
  createBlogPostService,
  updateBlogPostService,
  getBlogPostByIdService,
  getBlogPostsListService,
  publishBlogPostService,
  unpublishBlogPostService,
  deleteBlogPostService,
} from "@/lib/blog/service";

export type ActionResult<T = unknown> =
  | { success: true; data: T; warning?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Server Action: Create a new blog post in DRAFT status.
 * Requires valid admin session. Validates payload server-side.
 */
export async function createBlogPostAction(
  rawData: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const parsed = CreateBlogPostSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed. Please check the required fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const post = await createBlogPostService(parsed.data);
    return { success: true, data: post };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create blog post.",
    };
  }
}

/**
 * Server Action: Update an existing blog post.
 * Requires valid admin session. Recalculates reading time if content changed.
 */
export async function updateBlogPostAction(
  id: string,
  rawData: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid post ID is required." };
    }

    const parsed = UpdateBlogPostSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed. Please check the updated fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const updated = await updateBlogPostService(id, parsed.data);
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update blog post.",
    };
  }
}

/**
 * Server Action: Retrieve an individual post by ID for admin editing.
 * Requires valid admin session.
 */
export async function getBlogPostByIdAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid post ID is required." };
    }

    const post = await getBlogPostByIdService(id);
    return { success: true, data: post };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve blog post.",
    };
  }
}

/**
 * Server Action: Retrieve paginated posts with search and status filtering.
 * Requires valid admin session.
 */
export async function getBlogPostsListAction(
  rawQuery?: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const parsed = BlogQuerySchema.safeParse(rawQuery || {});
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid query parameters.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await getBlogPostsListService(parsed.data);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve blog posts list.",
    };
  }
}

/**
 * Server Action: Publish a blog post.
 * Requires valid admin session. Enforces non-empty content. Sets publishedAt on initial publication.
 */
export async function publishBlogPostAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid post ID is required." };
    }

    const published = await publishBlogPostService(id);
    return { success: true, data: published };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish blog post.",
    };
  }
}

/**
 * Server Action: Unpublish a blog post (reverts to DRAFT status).
 * Requires valid admin session. Preserves historical publication date.
 */
export async function unpublishBlogPostAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid post ID is required." };
    }

    const unpublished = await unpublishBlogPostService(id);
    return { success: true, data: unpublished };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unpublish blog post.",
    };
  }
}

/**
 * Server Action: Delete a blog post.
 * Requires valid admin session. Safely removes unreferenced Cloudinary media.
 */
export async function deleteBlogPostAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid post ID is required." };
    }

    const result = await deleteBlogPostService(id);
    return {
      success: true,
      data: { id: result.deletedId, title: result.title },
      warning: result.warning,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete blog post.",
    };
  }
}
