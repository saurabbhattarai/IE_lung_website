import { z } from "zod";
import { validateMediaPublicId, CLOUDINARY_GALLERY_FOLDER } from "@/lib/media/validation";

export const GALLERY_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type GalleryStatusType = (typeof GALLERY_STATUSES)[number];

export const GALLERY_ASPECTS = ["landscape", "portrait"] as const;
export type GalleryAspectType = (typeof GALLERY_ASPECTS)[number];

/**
 * Validates image src to be either a valid HTTP(S) URL or a local public asset path (e.g. /images/...)
 */
export function isValidImageSrc(src: string): boolean {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (trimmed.startsWith("/") && !trimmed.includes("//") && !trimmed.includes("..")) {
    return true;
  }
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Zod schema for creating a new GalleryImage.
 */
export const CreateGalleryImageSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(255, "Title must not exceed 255 characters."),
    category: z
      .string()
      .trim()
      .min(1, "Category is required.")
      .max(100, "Category must not exceed 100 characters.")
      .default("Opening Day"),
    src: z
      .string()
      .trim()
      .min(1, "Image source URL or local path is required.")
      .max(1000, "Image URL must not exceed 1000 characters.")
      .refine(isValidImageSrc, {
        message: "Image source must be a valid URL (http/https) or local public path starting with '/'.",
      }),
    publicId: z
      .string()
      .trim()
      .max(255, "Public ID must not exceed 255 characters.")
      .optional()
      .nullable(),
    alt: z
      .string()
      .trim()
      .min(1, "Alt text is required for accessibility.")
      .max(500, "Alt text must not exceed 500 characters."),
    aspect: z
      .enum(GALLERY_ASPECTS, {
        errorMap: () => ({ message: "Aspect ratio must be either 'landscape' or 'portrait'." }),
      })
      .default("landscape"),
    sortOrder: z.coerce
      .number()
      .int("Sort order must be an integer.")
      .min(0, "Sort order must be a non-negative number.")
      .default(0),
    status: z
      .enum(GALLERY_STATUSES)
      .default("PUBLISHED"),
  })
  .refine(
    (data) => {
      // If a Cloudinary public ID is supplied, validate folder ownership & traversal
      if (data.publicId) {
        const check = validateMediaPublicId(data.publicId);
        return check.valid && check.folder === CLOUDINARY_GALLERY_FOLDER;
      }
      return true;
    },
    {
      message: "Invalid public ID. Must reside within 'ielung/gallery'.",
      path: ["publicId"],
    }
  );

export type CreateGalleryImageInput = z.infer<typeof CreateGalleryImageSchema>;

/**
 * Zod schema for updating an existing GalleryImage.
 */
export const UpdateGalleryImageSchema = z
  .object({
    id: z.string().trim().min(1, "Resource ID is required."),
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(255, "Title must not exceed 255 characters.")
      .optional(),
    category: z
      .string()
      .trim()
      .min(1, "Category is required.")
      .max(100, "Category must not exceed 100 characters.")
      .optional(),
    src: z
      .string()
      .trim()
      .min(1, "Image source is required.")
      .max(1000, "Image URL must not exceed 1000 characters.")
      .refine(isValidImageSrc, {
        message: "Image source must be a valid URL (http/https) or local public path starting with '/'.",
      })
      .optional(),
    publicId: z
      .string()
      .trim()
      .max(255, "Public ID must not exceed 255 characters.")
      .optional()
      .nullable(),
    alt: z
      .string()
      .trim()
      .min(1, "Alt text is required.")
      .max(500, "Alt text must not exceed 500 characters.")
      .optional(),
    aspect: z
      .enum(GALLERY_ASPECTS)
      .optional(),
    sortOrder: z.coerce
      .number()
      .int()
      .min(0, "Sort order must be a non-negative number.")
      .optional(),
    status: z
      .enum(GALLERY_STATUSES)
      .optional(),
  })
  .refine(
    (data) => {
      if (data.publicId) {
        const check = validateMediaPublicId(data.publicId);
        return check.valid && check.folder === CLOUDINARY_GALLERY_FOLDER;
      }
      return true;
    },
    {
      message: "Invalid public ID. Must reside within 'ielung/gallery'.",
      path: ["publicId"],
    }
  );

export type UpdateGalleryImageInput = z.infer<typeof UpdateGalleryImageSchema>;

/**
 * Query schema for admin gallery listing pagination and filters.
 */
export const GalleryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.enum(["ALL", ...GALLERY_STATUSES]).default("ALL"),
});

export type GalleryQueryParams = z.infer<typeof GalleryQuerySchema>;

/**
 * Schema for reordering multiple gallery images.
 */
export const ReorderGalleryImagesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1, "Image ID is required."),
        sortOrder: z.coerce.number().int().min(0, "Sort order must be non-negative."),
      })
    )
    .min(1, "At least one item is required for reordering."),
});

export type ReorderGalleryImagesInput = z.infer<typeof ReorderGalleryImagesSchema>;
