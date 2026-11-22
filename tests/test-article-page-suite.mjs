import test from "node:test";
import assert from "node:assert/strict";

// Configure test environment variables before module imports
process.env.ADMIN_EMAIL = "admin@ielung.com";
process.env.ADMIN_PASSWORD = "StrongAdminPassword2026!";
process.env.JWT_SECRET = "super-secret-jwt-key-that-is-at-least-32-chars-long";
process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/test";

import { prisma } from "../lib/prisma.ts";
import {
  getPublicBlogPostBySlug,
  getPublicBlogMetadata,
  buildFaqJsonLd,
  formatPublicDate,
  formatReadingTime,
} from "../lib/blog/public.ts";
import { getArticleDoctors } from "../lib/blog/doctors.ts";
import {
  publishBlogPostAction,
  unpublishBlogPostAction,
  deleteBlogPostAction,
  updateBlogPostAction,
} from "../lib/actions/blog.action.ts";
import { setRevalidationHookForTesting } from "../lib/blog/revalidate.ts";
import { setMockAdminSessionForTesting } from "../lib/auth/session.ts";
import { validateTiptapDocument } from "../lib/validations/tiptap.validation.ts";

function createSampleTiptapDoc() {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Introduction paragraph text." }],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Clinical Approach" }],
      },
      {
        type: "callout",
        attrs: { type: "info" },
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", marks: [{ type: "bold" }], text: "Important Notice" }],
          },
        ],
      },
      {
        type: "callout",
        attrs: { type: "warning" },
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Emergency warning notice." }],
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Bullet point 1" }],
              },
            ],
          },
        ],
      },
    ],
  };
}

// ==========================================
// 1. Loading & Status Guard Tests
// ==========================================

test("1. Dynamic Route Data Access: Loads published article by slug with all required fields", async () => {
  const publishedDate = new Date("2026-10-28T12:00:00Z");

  prisma.blogPost = {
    findUnique: async ({ where }) => {
      if (where.slug === "ie-lung-opens-nov-2") {
        return {
          id: "post-1",
          title: "IE Lung Opens Nov 2 | Pulmonary Care in Redlands, CA",
          slug: "ie-lung-opens-nov-2",
          excerpt: "Opening announcement excerpt.",
          content: createSampleTiptapDoc(),
          coverImage: "/logo.png",
          author: "Inland Empire Lung & Sleep Institute",
          readingTimeMinutes: 3,
          status: "PUBLISHED",
          publishedAt: publishedDate,
          showDoctorsSection: true,
          doctorSpecialtyOverrides: { "1": "Custom Specialty" },
          faqs: [{ question: "Where is IE Lung?", answer: "Redlands, CA" }],
        };
      }
      return null;
    },
  };

  const article = await getPublicBlogPostBySlug("ie-lung-opens-nov-2");
  assert.ok(article);
  assert.equal(article.id, "post-1");
  assert.equal(article.slug, "ie-lung-opens-nov-2");
  assert.equal(article.title, "IE Lung Opens Nov 2 | Pulmonary Care in Redlands, CA");
  assert.equal(article.showDoctorsSection, true);
  assert.equal(article.faqs?.length, 1);
});

test("2. Dynamic Route Data Access: Returns null for DRAFT posts (triggering notFound)", async () => {
  prisma.blogPost = {
    findUnique: async ({ where }) => {
      if (where.slug === "draft-article") {
        return {
          id: "draft-1",
          slug: "draft-article",
          title: "Draft Article",
          status: "DRAFT",
          publishedAt: null,
        };
      }
      return null;
    },
  };

  const result = await getPublicBlogPostBySlug("draft-article");
  assert.equal(result, null, "DRAFT articles must return null so page renders notFound()");
});

test("3. Dynamic Route Data Access: Returns null for non-existent slug", async () => {
  prisma.blogPost = {
    findUnique: async () => null,
  };

  const result = await getPublicBlogPostBySlug("non-existent-article");
  assert.equal(result, null);
});

// ==========================================
// 2. Metadata & SEO Generation
// ==========================================

test("4. Dynamic Metadata: Generates title, description, and canonical URL from published post", async () => {
  prisma.blogPost = {
    findUnique: async ({ where }) => {
      if (where.slug === "ie-lung-opens-nov-2") {
        return {
          id: "post-1",
          title: "IE Lung Opens Nov 2 | Pulmonary Care in Redlands, CA",
          slug: "ie-lung-opens-nov-2",
          excerpt: "Inland Empire Lung & Sleep Institute opens November 2, 2026.",
          status: "PUBLISHED",
          publishedAt: new Date("2026-10-28T12:00:00Z"),
          coverImage: "/logo.png",
          author: "Inland Empire Lung & Sleep Institute",
        };
      }
      return null;
    },
  };

  const meta = await getPublicBlogMetadata("ie-lung-opens-nov-2");

  assert.equal(meta.title, "IE Lung Opens Nov 2 | Pulmonary Care in Redlands, CA");
  assert.equal(meta.description, "Inland Empire Lung & Sleep Institute opens November 2, 2026.");
  assert.equal(meta.alternates?.canonical, "https://ielung.com/blog/ie-lung-opens-nov-2");
  assert.equal(meta.openGraph?.type, "article");
  assert.equal(meta.openGraph?.url, "https://ielung.com/blog/ie-lung-opens-nov-2");
});

test("5. Dynamic Metadata: Returns fallback 'Article Not Found' metadata when article does not exist", async () => {
  prisma.blogPost = {
    findUnique: async () => null,
  };

  const meta = await getPublicBlogMetadata("nonexistent");

  assert.equal(meta.title, "Article Not Found | IE Lung");
  assert.equal(meta.description, "The requested article could not be found.");
});

// ==========================================
// 3. FAQ Content & Schema.org JSON-LD
// ==========================================

test("6. FAQ JSON-LD: Generates compliant schema.org FAQPage structured data", () => {
  const faqs = [
    { question: "Where is IE Lung located?", answer: "245 Terracina Boulevard, Suite 108, Redlands, CA 92373." },
    { question: "When does IE Lung open?", answer: "November 2, 2026." },
  ];

  const jsonLd = buildFaqJsonLd(faqs);

  assert.ok(jsonLd);
  assert.equal(jsonLd["@context"], "https://schema.org");
  assert.equal(jsonLd["@type"], "FAQPage");
  assert.equal(jsonLd.mainEntity.length, 2);
  assert.equal(jsonLd.mainEntity[0]["@type"], "Question");
  assert.equal(jsonLd.mainEntity[0].name, "Where is IE Lung located?");
  assert.equal(
    jsonLd.mainEntity[0].acceptedAnswer.text,
    "245 Terracina Boulevard, Suite 108, Redlands, CA 92373."
  );

  // Null or empty handling
  assert.equal(buildFaqJsonLd([]), null);
  assert.equal(buildFaqJsonLd(null), null);
  assert.equal(buildFaqJsonLd(undefined), null);
});

// ==========================================
// 4. Physician Section & Specialty Overrides
// ==========================================

test("7. Physician Section: Preserves 7 physicians and applies article specialty overrides accurately", () => {
  const overrides = {
    "1": "Pulmonary & Critical Care",
    "2": "Sleep Medicine, Pulmonary & Critical Care",
    "4": "Interventional Pulmonology & Critical Care",
  };

  const articleDoctors = getArticleDoctors(overrides);

  assert.equal(articleDoctors.length, 7);
  // Doctor 1 has override
  const doc1 = articleDoctors.find((d) => d.id === 1);
  assert.ok(doc1);
  assert.equal(doc1.specialty, "Pulmonary & Critical Care");

  // Doctor 2 has override
  const doc2 = articleDoctors.find((d) => d.id === 2);
  assert.ok(doc2);
  assert.equal(doc2.specialty, "Sleep Medicine, Pulmonary & Critical Care");

  // Doctor 3 has no override; uses original faculty specialty
  const doc3 = articleDoctors.find((d) => d.id === 3);
  assert.ok(doc3);
  assert.ok(typeof doc3.specialty === "string" && doc3.specialty.length > 0);
});

// ==========================================
// 5. Cache Revalidation on Mutations
// ==========================================

test("8. Cache Revalidation: Publishing a post revalidates both /blog and /blog/[slug]", async () => {
  const revalidated = [];
  setRevalidationHookForTesting((p) => revalidated.push(p));

  setMockAdminSessionForTesting({
    userId: "admin-1",
    email: "admin@ielung.com",
    role: "ADMIN",
  });

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-to-pub",
      slug: "new-article-slug",
      title: "New Article",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Content" }] }] },
      publishedAt: null,
    }),
    update: async ({ data }) => ({
      id: "post-to-pub",
      slug: "new-article-slug",
      title: "New Article",
      ...data,
    }),
  };

  try {
    const res = await publishBlogPostAction("post-to-pub");
    assert.equal(res.success, true);
    assert.ok(revalidated.includes("/blog"), "Expected /blog revalidation");
    assert.ok(revalidated.includes("/blog/new-article-slug"), "Expected /blog/[slug] revalidation");
  } finally {
    setRevalidationHookForTesting(null);
    setMockAdminSessionForTesting(null);
  }
});

test("9. Cache Revalidation: Unpublishing a post revalidates both /blog and /blog/[slug]", async () => {
  const revalidated = [];
  setRevalidationHookForTesting((p) => revalidated.push(p));

  setMockAdminSessionForTesting({
    userId: "admin-1",
    email: "admin@ielung.com",
    role: "ADMIN",
  });

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-to-unpub",
      slug: "article-to-unpublish",
      title: "Article to Unpublish",
      status: "PUBLISHED",
      publishedAt: new Date(),
    }),
    update: async ({ data }) => ({
      id: "post-to-unpub",
      slug: "article-to-unpublish",
      ...data,
    }),
  };

  try {
    const res = await unpublishBlogPostAction("post-to-unpub");
    assert.equal(res.success, true);
    assert.ok(revalidated.includes("/blog"));
    assert.ok(revalidated.includes("/blog/article-to-unpublish"));
  } finally {
    setRevalidationHookForTesting(null);
    setMockAdminSessionForTesting(null);
  }
});

test("10. Cache Revalidation: Deleting a post revalidates both /blog and /blog/[slug]", async () => {
  const revalidated = [];
  setRevalidationHookForTesting((p) => revalidated.push(p));

  setMockAdminSessionForTesting({
    userId: "admin-1",
    email: "admin@ielung.com",
    role: "ADMIN",
  });

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-to-del",
      slug: "article-to-delete",
      title: "Article to Delete",
      coverImagePublicId: null,
    }),
    delete: async () => ({
      id: "post-to-del",
    }),
  };

  try {
    const res = await deleteBlogPostAction("post-to-del");
    assert.equal(res.success, true);
    assert.ok(revalidated.includes("/blog"));
    assert.ok(revalidated.includes("/blog/article-to-delete"));
  } finally {
    setRevalidationHookForTesting(null);
    setMockAdminSessionForTesting(null);
  }
});

test("11. Cache Revalidation: Updating a post revalidates both /blog and /blog/[slug]", async () => {
  const revalidated = [];
  setRevalidationHookForTesting((p) => revalidated.push(p));

  setMockAdminSessionForTesting({
    userId: "admin-1",
    email: "admin@ielung.com",
    role: "ADMIN",
  });

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-to-update",
      slug: "article-to-update",
      title: "Article to Update",
    }),
    update: async ({ data }) => ({
      id: "post-to-update",
      slug: "article-to-update",
      ...data,
    }),
  };

  try {
    const res = await updateBlogPostAction("post-to-update", { title: "Updated Title" });
    assert.equal(res.success, true);
    assert.ok(revalidated.includes("/blog"));
    assert.ok(revalidated.includes("/blog/article-to-update"));
  } finally {
    setRevalidationHookForTesting(null);
    setMockAdminSessionForTesting(null);
  }
});

// ==========================================
// 6. Tiptap Content Integrity & Node Support
// ==========================================

test("12. Tiptap Content Integrity: Validates complete node hierarchy including callouts, headings, and lists", () => {
  const doc = createSampleTiptapDoc();
  const validation = validateTiptapDocument(doc);

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);

  // Check specific node types in sample content
  const types = doc.content.map((n) => n.type);
  assert.ok(types.includes("paragraph"));
  assert.ok(types.includes("heading"));
  assert.ok(types.includes("callout"));
  assert.ok(types.includes("bulletList"));

  const callouts = doc.content.filter((n) => n.type === "callout");
  assert.equal(callouts.length, 2);
  assert.equal(callouts[0].attrs.type, "info");
  assert.equal(callouts[1].attrs.type, "warning");
});

