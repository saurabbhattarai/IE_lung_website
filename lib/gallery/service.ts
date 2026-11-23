import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  deleteMediaFromCloudinary,
  isMediaReferencedInDatabase,
} from "@/lib/media/cloudinary";
import { CLOUDINARY_GALLERY_FOLDER } from "@/lib/media/validation";
import type {
  CreateGalleryImageInput,
  UpdateGalleryImageInput,
  GalleryQueryParams,
  ReorderGalleryImagesInput,
} from "@/lib/validations/gallery.validation";

export interface PaginatedGalleryResult {
  items: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GalleryStatsResult {
  total: number;
  published: number;
  drafts: number;
  categories: { name: string; count: number }[];
}

/**
 * Retrieves paginated gallery images with search, category, and status filters.
 */
export async function getGalleryListService(
  params: GalleryQueryParams
): Promise<PaginatedGalleryResult> {
  const { page, limit, search, category, status } = params;
  const skip = (page - 1) * limit;

  // Build Prisma where filter
  const where: Prisma.GalleryImageWhereInput = {};

  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { title: { contains: term } },
      { alt: { contains: term } },
      { category: { contains: term } },
    ];
  }

  if (category && category !== "ALL" && category.trim()) {
    where.category = category.trim();
  }

  if (status && status !== "ALL") {
    where.status = status;
  }

  const [items, total] = await Promise.all([
    prisma.galleryImage.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.galleryImage.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Retrieves aggregate statistics for Gallery CMS.
 */
export async function getGalleryStatsService(): Promise<GalleryStatsResult> {
  const [total, published, drafts, categoryGroups] = await Promise.all([
    prisma.galleryImage.count(),
    prisma.galleryImage.count({ where: { status: "PUBLISHED" } }),
    prisma.galleryImage.count({ where: { status: "DRAFT" } }),
    prisma.galleryImage.groupBy({
      by: ["category"],
      _count: { _all: true },
    }),
  ]);

  const categories = categoryGroups.map((g) => ({
    name: g.category,
    count: g._count._all,
  }));

  return {
    total,
    published,
    drafts,
    categories,
  };
}

/**
 * Retrieves an individual gallery image by its ID.
 */
export async function getGalleryImageByIdService(id: string) {
  const item = await prisma.galleryImage.findUnique({
    where: { id },
  });

  if (!item) {
    throw new Error(`Gallery image with ID "${id}" was not found.`);
  }

  return item;
}

/**
 * Creates a new gallery image record.
 */
export async function createGalleryImageService(input: CreateGalleryImageInput) {
  return prisma.galleryImage.create({
    data: {
      title: input.title,
      category: input.category || "Opening Day",
      src: input.src,
      publicId: input.publicId || null,
      alt: input.alt,
      aspect: input.aspect || "landscape",
      sortOrder: input.sortOrder ?? 0,
      status: input.status || "PUBLISHED",
    },
  });
}

/**
 * Updates an existing gallery image record with safe Cloudinary asset replacement cleanup.
 */
export async function updateGalleryImageService(
  id: string,
  input: UpdateGalleryImageInput
) {
  const existing = await prisma.galleryImage.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Gallery image with ID "${id}" was not found.`);
  }

  // Build update payload
  const data: Prisma.GalleryImageUpdateInput = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.category !== undefined) data.category = input.category;
  if (input.src !== undefined) data.src = input.src;
  if (input.publicId !== undefined) data.publicId = input.publicId || null;
  if (input.alt !== undefined) data.alt = input.alt;
  if (input.aspect !== undefined) data.aspect = input.aspect;
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;
  if (input.status !== undefined) data.status = input.status;

  // 1. Update database record first
  const updated = await prisma.galleryImage.update({
    where: { id },
    data,
  });

  // 2. If Cloudinary publicId was changed/replaced, safely delete the old unreferenced asset
  const oldPublicId = existing.publicId;
  const newPublicId = input.publicId;

  if (
    oldPublicId &&
    oldPublicId.startsWith(CLOUDINARY_GALLERY_FOLDER) &&
    oldPublicId !== newPublicId
  ) {
    try {
      const refCheck = await isMediaReferencedInDatabase(oldPublicId);
      if (!refCheck.isReferenced) {
        await deleteMediaFromCloudinary(oldPublicId);
      }
    } catch (cleanupErr) {
      console.error(
        `[GALLERY CMS] Safe cleanup for replaced asset "${oldPublicId}" failed:`,
        cleanupErr instanceof Error ? cleanupErr.message : cleanupErr
      );
    }
  }

  return updated;
}

/**
 * Publishes a gallery image.
 */
export async function publishGalleryImageService(id: string) {
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Gallery image with ID "${id}" was not found.`);
  }

  return prisma.galleryImage.update({
    where: { id },
    data: { status: "PUBLISHED" },
  });
}

/**
 * Unpublishes a gallery image (sets to DRAFT).
 */
export async function unpublishGalleryImageService(id: string) {
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Gallery image with ID "${id}" was not found.`);
  }

  return prisma.galleryImage.update({
    where: { id },
    data: { status: "DRAFT" },
  });
}

/**
 * Reorders gallery images within a transaction.
 */
export async function reorderGalleryImagesService(
  items: ReorderGalleryImagesInput["items"]
) {
  return prisma.$transaction(
    items.map((item) =>
      prisma.galleryImage.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );
}

/**
 * Deletes a gallery image with safe database-first and Cloudinary cleanup.
 * Preserves local static files and protects multi-referenced Cloudinary assets.
 */
export async function deleteGalleryImageService(id: string) {
  const existing = await prisma.galleryImage.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Gallery image with ID "${id}" was not found.`);
  }

  const { publicId, src } = existing;

  // 1. Delete database record first
  await prisma.galleryImage.delete({
    where: { id },
  });

  // 2. Safe Cloudinary cleanup
  // Never delete local files (e.g. /images/opening-images/...)
  if (
    publicId &&
    publicId.startsWith(CLOUDINARY_GALLERY_FOLDER) &&
    !src.startsWith("/")
  ) {
    try {
      const refCheck = await isMediaReferencedInDatabase(publicId);
      if (!refCheck.isReferenced) {
        await deleteMediaFromCloudinary(publicId);
      }
    } catch (cleanupErr) {
      // Log error without failing or restoring the database record
      console.error(
        `[GALLERY CMS] Safe Cloudinary deletion for publicId "${publicId}" failed:`,
        cleanupErr instanceof Error ? cleanupErr.message : cleanupErr
      );
    }
  }

  return { success: true, id };
}

/**
 * Retrieves all published gallery images for public display.
 * Ordered by sortOrder ASC, createdAt ASC.
 */
export async function getPublicGalleryImagesService() {
  try {
    return await prisma.galleryImage.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (error) {
    console.error("[GALLERY PUBLIC] Failed to query published gallery images:", error);
    throw error;
  }
}

/**
 * Retrieves the first 6 published gallery images for the homepage opening gallery.
 * Ordered by sortOrder ASC, createdAt ASC.
 */
export async function getHomepageOpeningGalleryImagesService() {
  try {
    return await prisma.galleryImage.findMany({
      where: { status: "PUBLISHED" },
      take: 6,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (error) {
    console.error("[GALLERY HOMEPAGE] Failed to query homepage gallery images:", error);
    throw error;
  }
}
