import { z } from "zod";
import { validateMediaPublicId } from "@/lib/media/validation";

export const DOWNLOAD_CATEGORIES = ["NEWSLETTER", "FORMS", "GUIDES", "BROCHURES"] as const;
export type DownloadCategoryType = (typeof DOWNLOAD_CATEGORIES)[number];

export const DOWNLOAD_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type DownloadStatusType = (typeof DOWNLOAD_STATUSES)[number];

/**
 * Zod schema for creating a new DownloadResource.
 */
export const CreateDownloadSchema = z
  .object({
    category: z.enum(DOWNLOAD_CATEGORIES, {
      required_error: "Category is required.",
    }),
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(255, "Title must not exceed 255 characters."),
    description: z
      .string()
      .trim()
      .min(1, "Description is required."),
    fileUrl: z
      .string()
      .trim()
      .min(1, "A valid PDF file URL is required.")
      .max(1000, "File URL must not exceed 1000 characters."),
    filePublicId: z
      .string()
      .trim()
      .max(255, "Public ID must not exceed 255 characters.")
      .optional()
      .nullable(),
    fileSize: z
      .string()
      .trim()
      .max(50, "File size string must not exceed 50 characters.")
      .optional()
      .nullable(),
    sortOrder: z.coerce
      .number()
      .int()
      .default(0),
    status: z
      .enum(DOWNLOAD_STATUSES)
      .default("PUBLISHED"),

    // Newsletter-specific fields
    subtitle: z
      .string()
      .trim()
      .max(255, "Subtitle must not exceed 255 characters.")
      .optional()
      .nullable(),
    issueNumber: z.coerce
      .number()
      .int("Issue number must be an integer.")
      .positive("Issue number must be a positive number.")
      .optional()
      .nullable(),
    edition: z
      .string()
      .trim()
      .max(100, "Edition must not exceed 100 characters.")
      .optional()
      .nullable(),
    publicationDate: z
      .union([z.string(), z.date()])
      .optional()
      .nullable()
      .transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }),
    pageCount: z
      .string()
      .trim()
      .max(50, "Page count must not exceed 50 characters.")
      .optional()
      .nullable(),
    topics: z
      .array(z.string().trim().min(1, "Topic cannot be empty."))
      .optional()
      .nullable()
      .default([]),
    featured: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Only newsletters can be featured
      if (data.category !== "NEWSLETTER" && data.featured) {
        return false;
      }
      return true;
    },
    {
      message: "Only newsletter resources can be marked as featured.",
      path: ["featured"],
    }
  )
  .refine(
    (data) => {
      // If a Cloudinary public ID is supplied, validate folder ownership & traversal
      if (data.filePublicId) {
        const check = validateMediaPublicId(data.filePublicId);
        return check.valid && check.folder === "ielung/downloads";
      }
      return true;
    },
    {
      message: "Invalid file public ID. Must reside within 'ielung/downloads'.",
      path: ["filePublicId"],
    }
  );

export type CreateDownloadInput = z.infer<typeof CreateDownloadSchema>;

/**
 * Zod schema for updating an existing DownloadResource.
 */
export const UpdateDownloadSchema = z
  .object({
    category: z.enum(DOWNLOAD_CATEGORIES).optional(),
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(255, "Title must not exceed 255 characters.")
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, "Description is required.")
      .optional(),
    fileUrl: z
      .string()
      .trim()
      .min(1, "A valid PDF file URL is required.")
      .max(1000, "File URL must not exceed 1000 characters.")
      .optional(),
    filePublicId: z
      .string()
      .trim()
      .max(255, "Public ID must not exceed 255 characters.")
      .optional()
      .nullable(),
    fileSize: z
      .string()
      .trim()
      .max(50, "File size string must not exceed 50 characters.")
      .optional()
      .nullable(),
    sortOrder: z.coerce
      .number()
      .int()
      .optional(),
    status: z
      .enum(DOWNLOAD_STATUSES)
      .optional(),

    // Newsletter-specific fields
    subtitle: z
      .string()
      .trim()
      .max(255, "Subtitle must not exceed 255 characters.")
      .optional()
      .nullable(),
    issueNumber: z.coerce
      .number()
      .int("Issue number must be an integer.")
      .positive("Issue number must be a positive number.")
      .optional()
      .nullable(),
    edition: z
      .string()
      .trim()
      .max(100, "Edition must not exceed 100 characters.")
      .optional()
      .nullable(),
    publicationDate: z
      .union([z.string(), z.date()])
      .optional()
      .nullable()
      .transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }),
    pageCount: z
      .string()
      .trim()
      .max(50, "Page count must not exceed 50 characters.")
      .optional()
      .nullable(),
    topics: z
      .array(z.string().trim().min(1, "Topic cannot be empty."))
      .optional()
      .nullable(),
    featured: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.category && data.category !== "NEWSLETTER" && data.featured) {
        return false;
      }
      return true;
    },
    {
      message: "Only newsletter resources can be marked as featured.",
      path: ["featured"],
    }
  )
  .refine(
    (data) => {
      if (data.filePublicId) {
        const check = validateMediaPublicId(data.filePublicId);
        return check.valid && check.folder === "ielung/downloads";
      }
      return true;
    },
    {
      message: "Invalid file public ID. Must reside within 'ielung/downloads'.",
      path: ["filePublicId"],
    }
  );

export type UpdateDownloadInput = z.infer<typeof UpdateDownloadSchema>;

/**
 * Query schema for admin list search, category filters, status filters, and pagination.
 */
export const DownloadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  category: z.enum(["ALL", ...DOWNLOAD_CATEGORIES]).default("ALL"),
  status: z.enum(["ALL", ...DOWNLOAD_STATUSES]).default("ALL"),
});

export type DownloadQueryParams = z.infer<typeof DownloadQuerySchema>;

/**
 * Reordering schema for batch updates.
 */
export const ReorderDownloadsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, "ID is required."),
      sortOrder: z.coerce.number().int(),
    })
  ).min(1, "At least one item required for reordering."),
});

export type ReorderDownloadsInput = z.infer<typeof ReorderDownloadsSchema>;
