import { z } from "zod";
import { validateBlogPublicId } from "../media/validation";
import { validateTiptapDocument } from "./tiptap.validation";

/**
 * Regex for clean, URL-safe slugs.
 * Only lowercase alphanumeric characters and single hyphens are allowed.
 * Example: 'ie-lung-opens-nov-2'
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const FaqItemSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question cannot be empty.")
    .max(300, "Question must not exceed 300 characters."),
  answer: z
    .string()
    .trim()
    .min(1, "Answer cannot be empty.")
    .max(2000, "Answer must not exceed 2000 characters."),
});

export const VALID_DOCTOR_IDS = ["1", "2", "3", "4", "5", "6", "7"] as const;

export const DoctorSpecialtyOverridesSchema = z.record(
  z.enum(VALID_DOCTOR_IDS, {
    errorMap: () => ({
      message: "Doctor specialty override key must be a valid doctor ID ('1' through '7').",
    }),
  }),
  z.string().trim().min(1, "Specialty override cannot be empty.").max(200, "Specialty override must not exceed 200 characters."),
);

/**
 * Custom Zod validator for Tiptap JSON content.
 */
export const TiptapDocumentSchema = z.custom<Record<string, unknown>>(
  (data) => {
    const result = validateTiptapDocument(data);
    return result.valid;
  },
  {
    message:
      "Invalid Tiptap document: Contains unsupported nodes, prohibited heading levels, or unsafe link protocols.",
  },
);

/**
 * Validation schema for creating a new blog post.
 */
export const CreateBlogPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(255, "Title must not exceed 255 characters."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Slug must be at least 1 character.")
    .max(255, "Slug must not exceed 255 characters.")
    .regex(
      SLUG_REGEX,
      "Slug must contain only lowercase alphanumeric characters separated by single hyphens.",
    )
    .optional(),
  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt is required.")
    .max(1000, "Excerpt must not exceed 1000 characters."),
  content: TiptapDocumentSchema,
  coverImage: z
    .string()
    .trim()
    .max(1000, "Cover image URL must not exceed 1000 characters.")
    .refine((url) => {
      if (!url) return true;
      if (url.startsWith("/") && !url.startsWith("//")) return true;
      try {
        const parsed = new URL(url);
        return (
          parsed.protocol === "https:" &&
          parsed.hostname === "res.cloudinary.com"
        );
      } catch {
        return false;
      }
    }, "Cover image must be a valid Cloudinary HTTPS URL or site asset.")
    .nullable()
    .optional(),
  coverImagePublicId: z
    .string()
    .trim()
    .refine((publicId) => {
      if (!publicId) return true;
      return validateBlogPublicId(publicId).valid;
    }, "Cover image public ID must belong strictly to the 'ielung/blog/' folder.")
    .nullable()
    .optional(),
  author: z
    .string()
    .trim()
    .min(1)
    .max(100, "Author name must not exceed 100 characters.")
    .default("Inland Empire Lung & Sleep Institute"),
  showDoctorsSection: z.boolean().default(false),
  doctorSpecialtyOverrides:
    DoctorSpecialtyOverridesSchema.nullable().optional(),
  faqs: z
    .array(FaqItemSchema)
    .max(20, "Maximum of 20 FAQs allowed.")
    .nullable()
    .optional(),
});

export type CreateBlogPostInput = z.infer<typeof CreateBlogPostSchema>;

/**
 * Validation schema for updating an existing blog post.
 * Allows partial updates, preserving omitted fields.
 */
export const UpdateBlogPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(255, "Title must not exceed 255 characters.")
    .optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Slug must be at least 1 character.")
    .max(255, "Slug must not exceed 255 characters.")
    .regex(
      SLUG_REGEX,
      "Slug must contain only lowercase alphanumeric characters separated by single hyphens.",
    )
    .optional(),
  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt is required.")
    .max(1000, "Excerpt must not exceed 1000 characters.")
    .optional(),
  content: TiptapDocumentSchema.optional(),
  coverImage: z
    .string()
    .trim()
    .max(1000, "Cover image URL must not exceed 1000 characters.")
    .refine((url) => {
      if (!url) return true;
      if (url.startsWith("/") && !url.startsWith("//")) return true;
      try {
        const parsed = new URL(url);
        return (
          parsed.protocol === "https:" &&
          parsed.hostname === "res.cloudinary.com"
        );
      } catch {
        return false;
      }
    }, "Cover image must be a valid Cloudinary HTTPS URL or site asset.")
    .nullable()
    .optional(),
  coverImagePublicId: z
    .string()
    .trim()
    .refine((publicId) => {
      if (!publicId) return true;
      return validateBlogPublicId(publicId).valid;
    }, "Cover image public ID must belong strictly to the 'ielung/blog/' folder.")
    .nullable()
    .optional(),
  author: z
    .string()
    .trim()
    .min(1)
    .max(100, "Author name must not exceed 100 characters.")
    .optional(),
  showDoctorsSection: z.boolean().optional(),
  doctorSpecialtyOverrides:
    DoctorSpecialtyOverridesSchema.nullable().optional(),
  faqs: z
    .array(FaqItemSchema)
    .max(20, "Maximum of 20 FAQs allowed.")
    .nullable()
    .optional(),
});

export type UpdateBlogPostInput = z.infer<typeof UpdateBlogPostSchema>;

/**
 * Validation schema for admin listing queries (filtering, search, pagination).
 */
export const BlogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(100).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export type BlogQueryInput = z.infer<typeof BlogQuerySchema>;
