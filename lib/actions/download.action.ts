"use server";

import { requireAdminSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import {
  CreateDownloadSchema,
  UpdateDownloadSchema,
  DownloadQuerySchema,
  ReorderDownloadsSchema,
} from "@/lib/validations/download.validation";
import {
  getDownloadsListService,
  getDownloadStatsService,
  getDownloadByIdService,
  createDownloadService,
  updateDownloadService,
  publishDownloadService,
  unpublishDownloadService,
  setFeaturedNewsletterService,
  reorderDownloadsService,
  deleteDownloadService,
} from "@/lib/downloads/service";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Revalidates relevant public and admin cache tags.
 */
function revalidateDownloadsCache() {
  revalidatePath("/downloads");
  revalidatePath("/ielung-admin/downloads");
  revalidatePath("/ielung-admin");
}

/**
 * Server Action: Retrieves paginated downloads list for admin management.
 */
export async function getDownloadsListAction(
  rawQuery?: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const parsed = DownloadQuerySchema.safeParse(rawQuery || {});
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid query parameters.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await getDownloadsListService(parsed.data);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load download resources.",
    };
  }
}

/**
 * Server Action: Retrieves aggregate statistics for downloads CMS.
 */
export async function getDownloadStatsAction(): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const stats = await getDownloadStatsService();
    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load download statistics.",
    };
  }
}

/**
 * Server Action: Retrieves an individual download resource by ID.
 */
export async function getDownloadByIdAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid resource ID is required." };
    }

    const item = await getDownloadByIdService(id);
    return { success: true, data: item };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve download resource.",
    };
  }
}

/**
 * Server Action: Creates a new download resource.
 */
export async function createDownloadAction(
  rawData: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const parsed = CreateDownloadSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed. Please check the required fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const created = await createDownloadService(parsed.data);
    revalidateDownloadsCache();

    return {
      success: true,
      data: created,
      message: `Successfully created "${created.title}".`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create download resource.",
    };
  }
}

/**
 * Server Action: Updates an existing download resource.
 */
export async function updateDownloadAction(
  id: string,
  rawData: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid resource ID is required." };
    }

    const parsed = UpdateDownloadSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed. Please check the updated fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const updated = await updateDownloadService(id, parsed.data);
    revalidateDownloadsCache();

    return {
      success: true,
      data: updated,
      message: `Successfully updated "${updated.title}".`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update download resource.",
    };
  }
}

/**
 * Server Action: Publishes a download resource.
 */
export async function publishDownloadAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid resource ID is required." };
    }

    const updated = await publishDownloadService(id);
    revalidateDownloadsCache();

    return {
      success: true,
      data: updated,
      message: `Successfully published "${updated.title}".`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish resource.",
    };
  }
}

/**
 * Server Action: Unpublishes a download resource.
 */
export async function unpublishDownloadAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid resource ID is required." };
    }

    const updated = await unpublishDownloadService(id);
    revalidateDownloadsCache();

    return {
      success: true,
      data: updated,
      message: `Successfully moved "${updated.title}" to drafts.`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unpublish resource.",
    };
  }
}

/**
 * Server Action: Sets a newsletter as the featured publication.
 */
export async function setFeaturedNewsletterAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid resource ID is required." };
    }

    const updated = await setFeaturedNewsletterService(id);
    revalidateDownloadsCache();

    return {
      success: true,
      data: updated,
      message: `"${updated.title}" is now the featured newsletter.`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set featured newsletter.",
    };
  }
}

/**
 * Server Action: Reorders resources.
 */
export async function reorderDownloadsAction(
  rawData: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const parsed = ReorderDownloadsSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid reorder payload.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await reorderDownloadsService(parsed.data);
    revalidateDownloadsCache();

    return {
      success: true,
      data: result,
      message: "Order updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder resources.",
    };
  }
}

/**
 * Server Action: Deletes a download resource and cleans up its Cloudinary asset if unreferenced.
 */
export async function deleteDownloadAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!id || typeof id !== "string") {
      return { success: false, error: "A valid resource ID is required." };
    }

    const deleted = await deleteDownloadService(id);
    revalidateDownloadsCache();

    return {
      success: true,
      data: deleted,
      message: `Successfully deleted "${deleted.title}".`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete download resource.",
    };
  }
}
