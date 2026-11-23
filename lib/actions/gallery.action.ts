"use server";

import { requireAdminSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import {
  CreateGalleryImageSchema,
  UpdateGalleryImageSchema,
  GalleryQuerySchema,
  ReorderGalleryImagesSchema,
} from "@/lib/validations/gallery.validation";
import {
  getGalleryListService,
  getGalleryStatsService,
  getGalleryImageByIdService,
  createGalleryImageService,
  updateGalleryImageService,
  publishGalleryImageService,
  unpublishGalleryImageService,
  reorderGalleryImagesService,
  deleteGalleryImageService,
} from "@/lib/gallery/service";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Revalidates relevant public and admin cache paths.
 */
function revalidateGalleryCache() {
  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/ielung-admin/gallery");
  revalidatePath("/ielung-admin");
}

/**
 * Server Action: Retrieves paginated gallery images for admin management.
 */
export async function getGalleryListAction(
  rawQuery?: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const parsed = GalleryQuerySchema.safeParse(rawQuery || {});
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid query parameters.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await getGalleryListService(parsed.data);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load gallery images.",
    };
  }
}

/**
 * Server Action: Retrieves aggregate statistics for Gallery CMS.
 */
export async function getGalleryStatsAction(): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const stats = await getGalleryStatsService();
    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load gallery statistics.",
    };
  }
}

/**
 * Server Action: Retrieves an individual gallery image by ID.
 */
export async function getGalleryImageByIdAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid image ID is required." };
    }

    const item = await getGalleryImageByIdService(id);
    return { success: true, data: item };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve gallery image.",
    };
  }
}

/**
 * Server Action: Creates a new gallery image.
 */
export async function createGalleryImageAction(
  rawInput: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const parsed = CreateGalleryImageSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed. Please verify the form inputs.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const created = await createGalleryImageService(parsed.data);
    revalidateGalleryCache();

    return {
      success: true,
      data: created,
      message: `Gallery image "${created.title}" successfully created.`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create gallery image.",
    };
  }
}

/**
 * Server Action: Updates an existing gallery image.
 */
export async function updateGalleryImageAction(
  id: string,
  rawInput: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid image ID is required." };
    }

    const inputWithId = {
      ...(typeof rawInput === "object" && rawInput !== null ? rawInput : {}),
      id,
    };

    const parsed = UpdateGalleryImageSchema.safeParse(inputWithId);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed. Please verify the form inputs.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const updated = await updateGalleryImageService(id, parsed.data);
    revalidateGalleryCache();

    return {
      success: true,
      data: updated,
      message: `Gallery image "${updated.title}" successfully updated.`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update gallery image.",
    };
  }
}

/**
 * Server Action: Publishes a gallery image.
 */
export async function publishGalleryImageAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid image ID is required." };
    }

    const item = await publishGalleryImageService(id);
    revalidateGalleryCache();

    return {
      success: true,
      data: item,
      message: `Image "${item.title}" is now published and visible to the public.`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish gallery image.",
    };
  }
}

/**
 * Server Action: Unpublishes a gallery image.
 */
export async function unpublishGalleryImageAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid image ID is required." };
    }

    const item = await unpublishGalleryImageService(id);
    revalidateGalleryCache();

    return {
      success: true,
      data: item,
      message: `Image "${item.title}" has been moved to drafts.`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unpublish gallery image.",
    };
  }
}

/**
 * Server Action: Reorders gallery images.
 */
export async function reorderGalleryImagesAction(
  rawInput: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const parsed = ReorderGalleryImagesSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid reorder payload.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    await reorderGalleryImagesService(parsed.data.items);
    revalidateGalleryCache();

    return {
      success: true,
      data: null,
      message: "Gallery images successfully reordered.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder gallery images.",
    };
  }
}

/**
 * Server Action: Deletes a gallery image safely.
 */
export async function deleteGalleryImageAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid image ID is required." };
    }

    const result = await deleteGalleryImageService(id);
    revalidateGalleryCache();

    return {
      success: true,
      data: result,
      message: "Gallery image successfully deleted.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete gallery image.",
    };
  }
}
