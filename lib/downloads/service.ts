import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { deleteMediaFromCloudinary } from "@/lib/media/cloudinary";
import type {
  CreateDownloadInput,
  UpdateDownloadInput,
  DownloadQueryParams,
  ReorderDownloadsInput,
} from "@/lib/validations/download.validation";

export interface PaginatedDownloadsResult {
  items: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DownloadStatsResult {
  total: number;
  published: number;
  drafts: number;
  newsletters: number;
  forms: number;
}

/**
 * Retrieves paginated download resources with search, category, and status filters.
 */
export async function getDownloadsListService(
  params: DownloadQueryParams
): Promise<PaginatedDownloadsResult> {
  const { page, limit, search, category, status } = params;
  const skip = (page - 1) * limit;

  // Build Prisma where filter
  const where: Record<string, unknown> = {};

  if (search && search.trim()) {
    where.title = {
      contains: search.trim(),
    };
  }

  if (category && category !== "ALL") {
    where.category = category;
  }

  if (status && status !== "ALL") {
    where.status = status;
  }

  const [items, total] = await Promise.all([
    prisma.downloadResource.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.downloadResource.count({ where }),
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
 * Retrieves aggregate statistics for downloads CMS.
 */
export async function getDownloadStatsService(): Promise<DownloadStatsResult> {
  const [total, published, drafts, newsletters, forms] = await Promise.all([
    prisma.downloadResource.count(),
    prisma.downloadResource.count({ where: { status: "PUBLISHED" } }),
    prisma.downloadResource.count({ where: { status: "DRAFT" } }),
    prisma.downloadResource.count({ where: { category: "NEWSLETTER" } }),
    prisma.downloadResource.count({ where: { category: "FORMS" } }),
  ]);

  return {
    total,
    published,
    drafts,
    newsletters,
    forms,
  };
}

/**
 * Retrieves a single download resource by its ID.
 */
export async function getDownloadByIdService(id: string) {
  const item = await prisma.downloadResource.findUnique({
    where: { id },
  });

  if (!item) {
    throw new Error(`Download resource with ID "${id}" was not found.`);
  }

  return item;
}

/**
 * Creates a new download resource.
 * If creating a featured published newsletter, atomically unsets featured on all other resources.
 */
export async function createDownloadService(data: CreateDownloadInput) {
  const isNewsletter = data.category === "NEWSLETTER";
  const shouldBeFeatured = Boolean(isNewsletter && data.featured && data.status === "PUBLISHED");

  // Determine sortOrder: if not specified or 0, default to next available sortOrder
  let sortOrder = data.sortOrder;
  if (sortOrder === undefined || sortOrder === 0) {
    const highestSort = await prisma.downloadResource.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    sortOrder = highestSort ? highestSort.sortOrder + 1 : 0;
  }

  // Transaction ensures only ONE featured published newsletter exists
  return prisma.$transaction(async (tx) => {
    if (shouldBeFeatured) {
      await tx.downloadResource.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    return tx.downloadResource.create({
      data: {
        category: data.category,
        title: data.title,
        subtitle: isNewsletter ? data.subtitle || null : null,
        issueNumber: isNewsletter ? data.issueNumber || null : null,
        edition: isNewsletter ? data.edition || null : null,
        publicationDate: isNewsletter ? data.publicationDate || null : null,
        description: data.description,
        fileUrl: data.fileUrl,
        filePublicId: data.filePublicId || null,
        fileSize: data.fileSize || null,
        pageCount: isNewsletter ? data.pageCount || null : null,
        topics: isNewsletter && Array.isArray(data.topics) ? data.topics : Prisma.DbNull,
        featured: shouldBeFeatured,
        sortOrder,
        status: data.status,
      },
    });
  });
}

/**
 * Updates an existing download resource.
 * Safely manages featured status uniqueness and preserves existing publication dates if not modified.
 */
export async function updateDownloadService(id: string, data: UpdateDownloadInput) {
  const existing = await getDownloadByIdService(id);

  const effectiveCategory = data.category || existing.category;
  const isNewsletter = effectiveCategory === "NEWSLETTER";
  const effectiveStatus = data.status || existing.status;

  let shouldBeFeatured = existing.featured;
  if (!isNewsletter) {
    shouldBeFeatured = false;
  } else if (data.featured !== undefined) {
    shouldBeFeatured = data.featured && effectiveStatus === "PUBLISHED";
  } else if (effectiveStatus === "DRAFT") {
    // Drafts cannot remain featured
    shouldBeFeatured = false;
  }

  return prisma.$transaction(async (tx) => {
    if (shouldBeFeatured) {
      await tx.downloadResource.updateMany({
        where: {
          id: { not: id },
          featured: true,
        },
        data: { featured: false },
      });
    }

    const updatePayload: Record<string, unknown> = {
      ...(data.category ? { category: data.category } : {}),
      ...(data.title ? { title: data.title } : {}),
      ...(data.description ? { description: data.description } : {}),
      ...(data.fileUrl ? { fileUrl: data.fileUrl } : {}),
      ...(data.filePublicId !== undefined ? { filePublicId: data.filePublicId } : {}),
      ...(data.fileSize !== undefined ? { fileSize: data.fileSize } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      ...(data.status ? { status: data.status } : {}),
      featured: shouldBeFeatured,
    };

    if (isNewsletter) {
      if (data.subtitle !== undefined) updatePayload.subtitle = data.subtitle;
      if (data.issueNumber !== undefined) updatePayload.issueNumber = data.issueNumber;
      if (data.edition !== undefined) updatePayload.edition = data.edition;
      if (data.publicationDate !== undefined) updatePayload.publicationDate = data.publicationDate;
      if (data.pageCount !== undefined) updatePayload.pageCount = data.pageCount;
      if (data.topics !== undefined) {
        updatePayload.topics = data.topics && data.topics.length > 0 ? data.topics : Prisma.DbNull;
      }
    } else {
      // Clear newsletter-specific fields when switching away from NEWSLETTER
      updatePayload.subtitle = null;
      updatePayload.issueNumber = null;
      updatePayload.edition = null;
      updatePayload.publicationDate = null;
      updatePayload.pageCount = null;
      updatePayload.topics = Prisma.DbNull;
    }

    return tx.downloadResource.update({
      where: { id },
      data: updatePayload,
    });
  });
}

/**
 * Publishes a download resource.
 */
export async function publishDownloadService(id: string) {
  const existing = await getDownloadByIdService(id);

  if (existing.status === "PUBLISHED") {
    return existing;
  }

  return prisma.downloadResource.update({
    where: { id },
    data: { status: "PUBLISHED" },
  });
}

/**
 * Unpublishes a download resource.
 * If the item was featured, automatically removes featured flag to protect public hero display.
 */
export async function unpublishDownloadService(id: string) {
  const existing = await getDownloadByIdService(id);

  if (existing.status === "DRAFT") {
    return existing;
  }

  return prisma.downloadResource.update({
    where: { id },
    data: {
      status: "DRAFT",
      featured: false,
    },
  });
}

/**
 * Sets a specific newsletter as the singular featured newsletter.
 * Rejects non-newsletters and unpublished drafts.
 */
export async function setFeaturedNewsletterService(id: string) {
  const item = await getDownloadByIdService(id);

  if (item.category !== "NEWSLETTER") {
    throw new Error("Only newsletter resources can be set as featured.");
  }

  if (item.status !== "PUBLISHED") {
    throw new Error("Only published newsletters can be set as featured.");
  }

  return prisma.$transaction(async (tx) => {
    await tx.downloadResource.updateMany({
      where: { featured: true },
      data: { featured: false },
    });

    return tx.downloadResource.update({
      where: { id },
      data: { featured: true },
    });
  });
}

/**
 * Reorders resources according to provided sortOrder array.
 */
export async function reorderDownloadsService(input: ReorderDownloadsInput) {
  return prisma.$transaction(async (tx) => {
    for (const item of input.items) {
      await tx.downloadResource.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      });
    }
    return { success: true, count: input.items.length };
  });
}

/**
 * Deletes a download resource:
 * 1. Deletes database record first to preserve DB integrity.
 * 2. Checks if Cloudinary PDF is referenced by any other record.
 * 3. Safely deletes from Cloudinary if unreferenced.
 * 4. Never attempts to delete local static assets.
 */
export async function deleteDownloadService(id: string) {
  const existing = await getDownloadByIdService(id);

  const filePublicId = existing.filePublicId;
  const isLocalFile = existing.fileUrl.startsWith("/");

  // 1. Delete database record first
  const deleted = await prisma.downloadResource.delete({
    where: { id },
  });

  // 2. Clean up Cloudinary asset if applicable and safe
  if (filePublicId && !isLocalFile) {
    try {
      // Check if any OTHER download resource references this public ID
      const otherRef = await prisma.downloadResource.findFirst({
        where: {
          OR: [
            { filePublicId },
            { fileUrl: { contains: filePublicId } },
          ],
        },
        select: { id: true },
      });

      // If no other record references it, delete from Cloudinary
      if (!otherRef) {
        await deleteMediaFromCloudinary(filePublicId);
      }
    } catch (err) {
      // Log Cloudinary deletion failure without failing DB delete
      console.warn(
        `[DOWNLOAD DELETE WARNING] Cloudinary asset deletion failed for public ID "${filePublicId}":`,
        err instanceof Error ? err.message : err
      );
    }
  }

  return deleted;
}

/**
 * Retrieves public download resources for public page rendering.
 * Returns only PUBLISHED resources sorted by sortOrder asc.
 */
export async function getPublicDownloadsService() {
  const allPublished = await prisma.downloadResource.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const newsletters = allPublished.filter((item) => item.category === "NEWSLETTER");
  const clinicalForms = allPublished.filter((item) => item.category === "FORMS");
  const guides = allPublished.filter((item) => item.category === "GUIDES");
  const brochures = allPublished.filter((item) => item.category === "BROCHURES");

  // Find featured newsletter, or fallback to first published newsletter
  const featuredNewsletter =
    newsletters.find((item) => item.featured) || newsletters[0] || null;

  return {
    featuredNewsletter,
    newsletters,
    clinicalForms,
    guides,
    brochures,
    all: allPublished,
  };
}
