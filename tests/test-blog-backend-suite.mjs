import test from "node:test";
import assert from "node:assert/strict";

// Configure test environment variables before module imports
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "1234567890";
process.env.CLOUDINARY_API_SECRET = "test-secret";
process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/test";

import { prisma } from "../lib/prisma.ts";
import { v2 as cloudinary } from "cloudinary";
import { validateTiptapDocument } from "../lib/validations/tiptap.validation.ts";
import {
  CreateBlogPostSchema,
  UpdateBlogPostSchema,
  BlogQuerySchema,
  SLUG_REGEX,
} from "../lib/validations/blog.validation.ts";
import {
  slugifyTitle,
  ensureUniqueSlug,
  createBlogPostService,
  getBlogPostByIdService,
  getBlogPostsListService,
  updateBlogPostService,
  publishBlogPostService,
  unpublishBlogPostService,
  deleteBlogPostService,
} from "../lib/blog/service.ts";
import {
  createBlogPostAction,
  updateBlogPostAction,
  getBlogPostByIdAction,
  getBlogPostsListAction,
  publishBlogPostAction,
  unpublishBlogPostAction,
  deleteBlogPostAction,
} from "../lib/actions/blog.action.ts";

// Helper to construct a valid minimum Tiptap document
function createSampleValidDoc(text = "Sample article content for pulmonary health.") {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

// ==========================================
// 1. Tiptap Document Validation
// ==========================================

test("1. Tiptap Validation: Accepts standard valid nodes and marks", () => {
  const validDoc = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Section Title" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "bold" }, { type: "italic" }, { type: "underline" }],
            text: "Formatted text",
          },
          {
            type: "text",
            marks: [
              {
                type: "link",
                attrs: { href: "https://ielung.com/about" },
              },
            ],
            text: "Link to about",
          },
        ],
      },
      {
        type: "callout",
        attrs: { variant: "info" },
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Important clinic notice." }],
          },
        ],
      },
      {
        type: "image",
        attrs: {
          src: "https://res.cloudinary.com/test-cloud/image/upload/v123/ielung/blog/photo.webp",
          alt: "Clinic entrance",
        },
      },
      {
        type: "horizontalRule",
      },
    ],
  };

  const result = validateTiptapDocument(validDoc);
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test("2. Tiptap Validation: Rejects Level 1 Heading (prohibited in article content)", () => {
  const h1Doc = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Prohibited H1 Heading" }],
      },
    ],
  };

  const result = validateTiptapDocument(h1Doc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.message.includes("Heading level 1 is prohibited")));
});

test("3. Tiptap Validation: Rejects unsafe link protocols (javascript:, data:)", () => {
  const xssDoc = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [
              {
                type: "link",
                attrs: { href: "javascript:alert(document.domain)" },
              },
            ],
            text: "Click me",
          },
        ],
      },
    ],
  };

  const result = validateTiptapDocument(xssDoc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.message.includes("unsafe or malformed 'href'")));
});

test("4. Tiptap Validation: Rejects non-Cloudinary external images", () => {
  const unapprovedImageDoc = {
    type: "doc",
    content: [
      {
        type: "image",
        attrs: { src: "https://unapproved-cdn.com/malicious.png" },
      },
    ],
  };

  const result = validateTiptapDocument(unapprovedImageDoc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.message.includes("res.cloudinary.com")));
});

test("5. Tiptap Validation: Rejects unsupported arbitrary node types", () => {
  const rawHtmlDoc = {
    type: "doc",
    content: [
      {
        type: "rawHtml",
        attrs: { html: "<script>alert(1)</script>" },
      },
    ],
  };

  const result = validateTiptapDocument(rawHtmlDoc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.message.includes("Unsupported node type 'rawHtml'")));
});

test("5b. Tiptap Validation: Image alt text is bounded to 500 characters", () => {
  // Valid image with acceptable alt text (under 500 chars)
  const validImageDoc = {
    type: "doc",
    content: [
      {
        type: "image",
        attrs: {
          src: "https://res.cloudinary.com/test-cloud/image/upload/v123/ielung/blog/photo.webp",
          alt: "A".repeat(500),
        },
      },
    ],
  };
  assert.equal(validateTiptapDocument(validImageDoc).valid, true);

  // Rejected image with alt text exceeding 500 chars
  const oversizedAltDoc = {
    type: "doc",
    content: [
      {
        type: "image",
        attrs: {
          src: "https://res.cloudinary.com/test-cloud/image/upload/v123/ielung/blog/photo.webp",
          alt: "A".repeat(501),
        },
      },
    ],
  };
  const result = validateTiptapDocument(oversizedAltDoc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.message.includes("must not exceed 500 characters")));
});

// ==========================================
// 2. Blog Post Zod Schema Validation
// ==========================================

test("6. Zod Validation: CreateBlogPostSchema accepts complete valid payload", () => {
  const validPayload = {
    title: "New Advances in Pulmonary Medicine",
    slug: "new-advances-in-pulmonary-medicine",
    excerpt: "Discover the latest treatments available at Inland Empire Lung & Sleep Institute.",
    content: createSampleValidDoc(),
    coverImage: "https://res.cloudinary.com/test-cloud/image/upload/v123/ielung/blog/cover.webp",
    coverImagePublicId: "ielung/blog/cover",
    author: "Inland Empire Lung & Sleep Institute",
    showDoctorsSection: true,
    faqs: [
      {
        question: "What treatments are offered?",
        answer: "We offer comprehensive diagnosis and management for all pulmonary conditions.",
      },
    ],
    doctorSpecialtyOverrides: {
      "1": "Senior Pulmonologist",
    },
  };

  const parsed = CreateBlogPostSchema.safeParse(validPayload);
  assert.equal(parsed.success, true);
});

test("7. Zod Validation: Rejects missing title, excerpt, and malformed slugs", () => {
  assert.equal(CreateBlogPostSchema.safeParse({}).success, false);

  // Invalid slug with uppercase or special characters
  const badSlug = {
    title: "Valid Title",
    slug: "Bad_Slug!",
    excerpt: "Valid excerpt",
    content: createSampleValidDoc(),
  };
  assert.equal(CreateBlogPostSchema.safeParse(badSlug).success, false);

  // Traversal cover image public ID rejected
  const badCoverId = {
    title: "Valid Title",
    excerpt: "Valid excerpt",
    content: createSampleValidDoc(),
    coverImagePublicId: "ielung/blog/../secret",
  };
  assert.equal(CreateBlogPostSchema.safeParse(badCoverId).success, false);

  // Doctor specialty overrides rejects invalid doctor IDs (only '1' through '7' allowed)
  const invalidDoctorKey = {
    title: "Valid Title",
    excerpt: "Valid excerpt",
    content: createSampleValidDoc(),
    doctorSpecialtyOverrides: {
      "99": "Invalid Doctor ID",
    },
  };
  assert.equal(CreateBlogPostSchema.safeParse(invalidDoctorKey).success, false);

  const unknownDoctorKey = {
    title: "Valid Title",
    excerpt: "Valid excerpt",
    content: createSampleValidDoc(),
    doctorSpecialtyOverrides: {
      "unknown_doc": "Invalid Key",
    },
  };
  assert.equal(CreateBlogPostSchema.safeParse(unknownDoctorKey).success, false);

  // Accepts all valid doctor IDs ('1' through '7')
  const validDoctorKeys = {
    title: "Valid Title",
    excerpt: "Valid excerpt",
    content: createSampleValidDoc(),
    doctorSpecialtyOverrides: {
      "1": "Pulmonology Chief",
      "7": "Critical Care Specialist",
    },
  };
  assert.equal(CreateBlogPostSchema.safeParse(validDoctorKeys).success, true);
});

// ==========================================
// 3. Slug Generation & Uniqueness
// ==========================================

test("8. Slug Utility: slugifyTitle correctly formats URL-safe strings", () => {
  assert.equal(slugifyTitle("IE Lung Opens Nov 2!"), "ie-lung-opens-nov-2");
  assert.equal(slugifyTitle("  Multiple   Spaces  &  Symbols! "), "multiple-spaces-symbols");
  assert.equal(slugifyTitle(""), "");
  assert.match(slugifyTitle("Test Article 2026"), SLUG_REGEX);
});

test("9. Slug Utility: ensureUniqueSlug resolves duplicate collision by appending counter", async () => {
  // Mock Prisma findUnique: 'existing-post' and 'existing-post-1' exist, 'existing-post-2' is free
  prisma.blogPost = {
    findUnique: async ({ where }) => {
      if (where.slug === "existing-post") return { id: "p1" };
      if (where.slug === "existing-post-1") return { id: "p2" };
      return null;
    },
  };

  const uniqueSlug = await ensureUniqueSlug("existing-post");
  assert.equal(uniqueSlug, "existing-post-2");

  // If the matching slug belongs to the post itself being edited, it is retained
  const selfSlug = await ensureUniqueSlug("existing-post", "p1");
  assert.equal(selfSlug, "existing-post");
});

// ==========================================
// 4. Blog Service: CRUD Operations & Reading Time
// ==========================================

test("10. Blog Service: createBlogPostService creates DRAFT with server-calculated reading time", async () => {
  let createdData = null;
  prisma.blogPost = {
    findUnique: async () => null, // Slug is unique
    create: async ({ data }) => {
      createdData = data;
      return { id: "new-post-123", ...data };
    },
  };

  // Generate ~400 words to test reading time calculation (400 words / 200 WPM = 2 minutes)
  const words400 = "pulmonary medicine sleep care treatment ".repeat(80);
  const post = await createBlogPostService({
    title: "Comprehensive Breathing Care",
    excerpt: "Overview of outpatient pulmonary care.",
    content: createSampleValidDoc(words400),
  });

  assert.equal(post.id, "new-post-123");
  assert.equal(createdData.status, "DRAFT");
  assert.equal(createdData.publishedAt, null);
  assert.equal(createdData.slug, "comprehensive-breathing-care");
  assert.equal(createdData.readingTimeMinutes, 2);
});

test("11. Blog Service: updateBlogPostService recalculates reading time and preserves existing slug", async () => {
  let updatedData = null;
  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-1",
      title: "Original Title",
      slug: "original-slug",
      status: "DRAFT",
    }),
    update: async ({ data }) => {
      updatedData = data;
      return { id: "post-1", ...data };
    },
  };

  // Updating only title must NOT change existing slug
  await updateBlogPostService("post-1", {
    title: "Updated Title Only",
  });
  assert.equal(updatedData.title, "Updated Title Only");
  assert.equal(updatedData.slug, undefined);

  // Updating content recalculates reading time
  const words600 = "advances in diagnostic bronchoscopy and sleep ".repeat(100);
  await updateBlogPostService("post-1", {
    content: createSampleValidDoc(words600),
  });
  assert.equal(updatedData.readingTimeMinutes, 3);
});

// ==========================================
// 5. Blog Service: Publishing & Unpublishing
// ==========================================

test("12. Blog Service: publishBlogPostService sets publishedAt and rejects empty content", async () => {
  let updateData = null;
  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-1",
      title: "Ready Post",
      content: createSampleValidDoc("Healthy respiratory function is essential."),
      publishedAt: null,
      status: "DRAFT",
    }),
    update: async ({ data }) => {
      updateData = data;
      return { id: "post-1", ...data };
    },
  };

  const published = await publishBlogPostService("post-1");
  assert.equal(updateData.status, "PUBLISHED");
  assert.ok(updateData.publishedAt instanceof Date);

  // Reject publishing empty content
  prisma.blogPost.findUnique = async () => ({
    id: "post-empty",
    title: "Empty Post",
    content: { type: "doc", content: [{ type: "paragraph", content: [] }] },
    status: "DRAFT",
  });

  await assert.rejects(
    () => publishBlogPostService("post-empty"),
    /Cannot publish a blog post with empty content/
  );
});

test("13. Blog Service: Preserves historical publishedAt date on unpublish and republish", async () => {
  const originalDate = new Date("2026-10-28T12:00:00.000Z");
  let updateData = null;

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-hist",
      title: "Historical Post",
      content: createSampleValidDoc(),
      publishedAt: originalDate,
      status: "PUBLISHED",
    }),
    update: async ({ data }) => {
      updateData = data;
      return { id: "post-hist", ...data };
    },
  };

  // Unpublishing retains historical publishedAt
  await unpublishBlogPostService("post-hist");
  assert.equal(updateData.status, "DRAFT");
  assert.equal(updateData.publishedAt, undefined); // Not overwritten or destroyed

  // Republishing uses existing publishedAt
  await publishBlogPostService("post-hist");
  assert.equal(updateData.status, "PUBLISHED");
  assert.equal(updateData.publishedAt.getTime(), originalDate.getTime());
});

// ==========================================
// 6. Blog Service: Deletion & Cloudinary Safeguards
// ==========================================

test("14. Blog Service: deleteBlogPostService cleans up unreferenced media and safeguards shared media", async () => {
  let postDeleted = false;
  let cloudinaryDestroyCalled = false;

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-to-delete",
      title: "Post to Delete",
      coverImagePublicId: "ielung/blog/solo_image",
    }),
    findFirst: async () => null, // No other post references this cover image
    findMany: async () => [],
    delete: async () => {
      postDeleted = true;
      return {};
    },
  };

  cloudinary.uploader.destroy = async (publicId) => {
    cloudinaryDestroyCalled = true;
    return { result: "ok" };
  };

  const result = await deleteBlogPostService("post-to-delete");
  assert.equal(result.success, true);
  assert.equal(postDeleted, true);
  assert.equal(cloudinaryDestroyCalled, true);
});

// ==========================================
// 7. Server Actions: Authorization & Protection
// ==========================================

test("15. Server Actions: Rejects unauthorized calls without valid admin session", async () => {
  // In node unit test environment without Next.js cookies, requireAdminSession rejects with 401/unauthorized
  const createRes = await createBlogPostAction({
    title: "Unauthorized Post",
    excerpt: "Excerpt",
    content: createSampleValidDoc(),
  });
  assert.equal(createRes.success, false);
  assert.match(createRes.error, /UNAUTHORIZED/i);

  const updateRes = await updateBlogPostAction("any-id", { title: "New Title" });
  assert.equal(updateRes.success, false);
  assert.match(updateRes.error, /UNAUTHORIZED/i);

  const publishRes = await publishBlogPostAction("any-id");
  assert.equal(publishRes.success, false);
  assert.match(publishRes.error, /UNAUTHORIZED/i);

  const deleteRes = await deleteBlogPostAction("any-id");
  assert.equal(deleteRes.success, false);
  assert.match(deleteRes.error, /UNAUTHORIZED/i);

  // Read actions reject unauthenticated calls
  const getByIdRes = await getBlogPostByIdAction("any-id");
  assert.equal(getByIdRes.success, false);
  assert.match(getByIdRes.error, /UNAUTHORIZED/i);

  const getListRes = await getBlogPostsListAction({});
  assert.equal(getListRes.success, false);
  assert.match(getListRes.error, /UNAUTHORIZED/i);
});
