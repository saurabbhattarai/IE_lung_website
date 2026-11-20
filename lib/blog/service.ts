import "server-only";
import { prisma } from "../prisma";
import { calculateReadingTimeMinutes, extractPlainTextFromTiptap } from "./reading-time";
import { isImageReferencedInDatabase, deleteImageFromCloudinary } from "../media/cloudinary";
import type {
  CreateBlogPostInput,
  UpdateBlogPostInput,
  BlogQueryInput,
} from "../validations/blog.validation";
import { Prisma } from "@prisma/client";

/**
 * Converts a plain text title into a normalized, URL-safe slug.
 * Example: 'IE Lung Opens Nov 2!' -> 'ie-lung-opens-nov-2'
 */
export function slugifyTitle(title: string): string {
  if (!title || typeof title !== "string") {
    return "";
  }

  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with single hyphen
    .replace(/-+/g, "-") // Collapse consecutive hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading and trailing hyphens
}

/**
 * Ensures a slug is unique across all blog posts in the database.
 * If a conflict exists with another post, appends incremental counters (-1, -2, etc.).
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  excludePostId?: string
): Promise<string> {
  const normalized = slugifyTitle(baseSlug) || "post";
  let candidate = normalized;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludePostId) {
      return candidate;
    }

    candidate = `${normalized}-${counter}`;
    counter++;
  }
}

/**
 * Creates a new blog post in DRAFT status.
 * Automatically computes reading time server-side from Tiptap JSON content.
 */
export async function createBlogPostService(input: CreateBlogPostInput) {
  // 1. Resolve and ensure unique slug
  const rawSlug = input.slug?.trim() || slugifyTitle(input.title);
  const slug = await ensureUniqueSlug(rawSlug);

  // 2. Server-side reading time calculation (never trust client)
  const readingTimeMinutes = calculateReadingTimeMinutes(input.content);

  // 3. Persist post to database in DRAFT status
  try {
    const post = await prisma.blogPost.create({
      data: {
        title: input.title.trim(),
        slug,
        excerpt: input.excerpt.trim(),
        content: input.content as Prisma.InputJsonValue,
        coverImage: input.coverImage?.trim() || null,
        coverImagePublicId: input.coverImagePublicId?.trim() || null,
        author: input.author?.trim() || "Inland Empire Lung & Sleep Institute",
        readingTimeMinutes,
        status: "DRAFT",
        publishedAt: null,
        showDoctorsSection: input.showDoctorsSection ?? false,
        doctorSpecialtyOverrides: input.doctorSpecialtyOverrides
          ? (input.doctorSpecialtyOverrides as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        faqs: input.faqs ? (input.faqs as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });

    return post;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("A blog post with this slug already exists.");
    }
    throw error;
  }
}

/**
 * Retrieves a single blog post by its unique ID for admin editing.
 */
export async function getBlogPostByIdService(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error(`Blog post with ID '${id}' was not found.`);
  }

  return post;
}

/**
 * Retrieves a paginated list of blog posts with search and status filtering for admin overview.
 */
export async function getBlogPostsListService(query: BlogQueryInput) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(50, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const where: Prisma.BlogPostWhereInput = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.search?.trim()) {
    const term = query.search.trim();
    where.OR = [
      { title: { contains: term } },
      { slug: { contains: term } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        readingTimeMinutes: true,
        coverImage: true,
        author: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Updates an existing blog post.
 * Preserves omitted fields, recalculates reading time if content changed,
 * and preserves the existing slug unless explicitly changed.
 */
export async function updateBlogPostService(
  id: string,
  input: UpdateBlogPostInput
) {
  const existing = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Blog post with ID '${id}' was not found.`);
  }

  const dataToUpdate: Prisma.BlogPostUpdateInput = {};

  if (input.title !== undefined) {
    dataToUpdate.title = input.title.trim();
  }

  if (input.slug !== undefined) {
    const rawSlug = input.slug.trim();
    if (rawSlug !== existing.slug) {
      dataToUpdate.slug = await ensureUniqueSlug(rawSlug, id);
    }
  }

  if (input.excerpt !== undefined) {
    dataToUpdate.excerpt = input.excerpt.trim();
  }

  if (input.content !== undefined) {
    dataToUpdate.content = input.content as Prisma.InputJsonValue;
    // Automatically recalculate reading time server-side
    dataToUpdate.readingTimeMinutes = calculateReadingTimeMinutes(input.content);
  }

  if (input.coverImage !== undefined) {
    dataToUpdate.coverImage = input.coverImage ? input.coverImage.trim() : null;
  }

  if (input.coverImagePublicId !== undefined) {
    dataToUpdate.coverImagePublicId = input.coverImagePublicId
      ? input.coverImagePublicId.trim()
      : null;
  }

  if (input.author !== undefined) {
    dataToUpdate.author = input.author.trim();
  }

  if (input.showDoctorsSection !== undefined) {
    dataToUpdate.showDoctorsSection = input.showDoctorsSection;
  }

  if (input.doctorSpecialtyOverrides !== undefined) {
    dataToUpdate.doctorSpecialtyOverrides = input.doctorSpecialtyOverrides
      ? (input.doctorSpecialtyOverrides as Prisma.InputJsonValue)
      : Prisma.JsonNull;
  }

  if (input.faqs !== undefined) {
    dataToUpdate.faqs = input.faqs
      ? (input.faqs as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull;
  }

  try {
    const updated = await prisma.blogPost.update({
      where: { id },
      data: dataToUpdate,
    });

    return updated;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("A blog post with this slug already exists.");
    }
    throw error;
  }
}

/**
 * Publishes a blog post.
 * Enforces non-empty content. Sets publishedAt on initial publication,
 * while preserving original publication date on subsequent republishing.
 */
export async function publishBlogPostService(id: string) {
  const existing = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Blog post with ID '${id}' was not found.`);
  }

  // Reject publishing empty or blank content
  const textContent = extractPlainTextFromTiptap(existing.content);
  if (!textContent.trim()) {
    throw new Error("Cannot publish a blog post with empty content.");
  }

  // Set publishedAt on first publish; preserve original publishedAt if previously set
  const publishedAt = existing.publishedAt || new Date();

  const published = await prisma.blogPost.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt,
    },
  });

  return published;
}

/**
 * Unpublishes a blog post, moving it back to DRAFT status.
 * Preserves the historical publishedAt date for audit and future republishing.
 */
export async function unpublishBlogPostService(id: string) {
  const existing = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`Blog post with ID '${id}' was not found.`);
  }

  const unpublished = await prisma.blogPost.update({
    where: { id },
    data: {
      status: "DRAFT",
      // Keep existing.publishedAt intact to preserve historical publication record
    },
  });

  return unpublished;
}

/**
 * Deletes a blog post and safeguards associated Cloudinary media.
 * Removes the database record first, then safely attempts removal of unreferenced
 * Cloudinary assets without risking data loss across shared articles.
 */
export async function deleteBlogPostService(id: string) {
  const existing = await prisma.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      coverImagePublicId: true,
    },
  });

  if (!existing) {
    throw new Error(`Blog post with ID '${id}' was not found.`);
  }

  const publicIdToDelete = existing.coverImagePublicId;

  // 1. Delete the post from the database
  await prisma.blogPost.delete({
    where: { id },
  });

  // 2. Safe post-deletion media cleanup
  // If the deleted post owned a Cloudinary cover image, check if any OTHER post references it
  let mediaCleanupWarning: string | undefined;

  if (publicIdToDelete) {
    try {
      const refCheck = await isImageReferencedInDatabase(publicIdToDelete);
      if (!refCheck.isReferenced) {
        await deleteImageFromCloudinary(publicIdToDelete);
      }
    } catch (cleanupError) {
      // Cloudinary deletion is non-blocking to prevent rollback of successful database deletion
      mediaCleanupWarning = `Post was deleted from the database, but associated media (${publicIdToDelete}) could not be removed from Cloudinary: ${
        cleanupError instanceof Error ? cleanupError.message : "Media service unavailable"
      }`;
    }
  }

  return {
    success: true,
    deletedId: id,
    title: existing.title,
    warning: mediaCleanupWarning,
  };
}
