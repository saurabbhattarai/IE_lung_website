import test from "node:test";
import assert from "node:assert/strict";

// Configure test environment variables before module imports
process.env.ADMIN_EMAIL = "admin@ielung.com";
process.env.ADMIN_PASSWORD = "StrongAdminPassword2026!";
process.env.JWT_SECRET = "super-secret-jwt-key-that-is-at-least-32-chars-long";
process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/test";

import { prisma } from "../lib/prisma.ts";
import {
  getPublicBlogPosts,
  formatPublicDate,
  formatReadingTime,
} from "../lib/blog/public.ts";
import {
  publishBlogPostAction,
  unpublishBlogPostAction,
  deleteBlogPostAction,
  updateBlogPostAction,
} from "../lib/actions/blog.action.ts";
import { setRevalidationHookForTesting } from "../lib/blog/revalidate.ts";
import { setMockAdminSessionForTesting } from "../lib/auth/session.ts";

// ==========================================
// 1. Filtering & Query Requirements
// ==========================================

test("1. Public Blog Query: Filters strictly by status: PUBLISHED and passes expected query structure", async () => {
  let capturedQuery = null;

  prisma.blogPost = {
    findMany: async (query) => {
      capturedQuery = query;
      return [
        {
          id: "post-1",
          title: "First Published Post",
          slug: "first-published-post",
          excerpt: "Excerpt 1",
          coverImage: "/logo.png",
          readingTimeMinutes: 3,
          publishedAt: new Date("2026-10-28T12:00:00Z"),
        },
      ];
    },
  };

  const result = await getPublicBlogPosts();

  assert.equal(result.posts.length, 1);
  assert.equal(result.posts[0].slug, "first-published-post");
  assert.equal(capturedQuery.where.status, "PUBLISHED");
  assert.deepEqual(capturedQuery.orderBy, [
    { publishedAt: "desc" },
    { createdAt: "desc" },
  ]);
});

test("2. Public Blog Query: Excludes DRAFT posts completely", async () => {
  // Simulate mock database query verifying status filter excludes DRAFT
  prisma.blogPost = {
    findMany: async ({ where }) => {
      // Simulate underlying database filter: only return matches where status is PUBLISHED
      const allPosts = [
        {
          id: "draft-1",
          status: "DRAFT",
          title: "Unpublished Draft",
          slug: "unpublished-draft",
        },
        {
          id: "published-1",
          status: "PUBLISHED",
          title: "Live Post",
          slug: "live-post",
          excerpt: "Live excerpt",
          coverImage: "/logo.png",
          readingTimeMinutes: 2,
          publishedAt: new Date("2026-11-01T00:00:00Z"),
        },
      ];

      return allPosts
        .filter((p) => p.status === where.status)
        .map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          coverImage: p.coverImage,
          readingTimeMinutes: p.readingTimeMinutes,
          publishedAt: p.publishedAt,
        }));
    },
  };

  const result = await getPublicBlogPosts();

  assert.equal(result.posts.length, 1);
  assert.equal(result.posts[0].slug, "live-post");
  assert.equal(result.posts.some((p) => p.slug === "unpublished-draft"), false);
});

// ==========================================
// 2. Ordering & Null Handling
// ==========================================

test("3. Public Blog Query: Posts are ordered by publication date descending", async () => {
  const dateNewer = new Date("2026-11-10T12:00:00Z");
  const dateOlder = new Date("2026-10-28T12:00:00Z");

  prisma.blogPost = {
    findMany: async () => [
      {
        id: "post-newer",
        title: "Newer Article",
        slug: "newer-article",
        excerpt: "Newer excerpt",
        coverImage: "/newer.jpg",
        readingTimeMinutes: 4,
        publishedAt: dateNewer,
      },
      {
        id: "post-older",
        title: "Older Article",
        slug: "older-article",
        excerpt: "Older excerpt",
        coverImage: "/older.jpg",
        readingTimeMinutes: 2,
        publishedAt: dateOlder,
      },
    ],
  };

  const result = await getPublicBlogPosts();

  assert.equal(result.posts.length, 2);
  assert.equal(result.posts[0].slug, "newer-article");
  assert.equal(result.posts[1].slug, "older-article");
  assert.ok(result.posts[0].publishedAt.getTime() > result.posts[1].publishedAt.getTime());
});

test("4. Public Blog Query: Safely handles null or missing publication dates without throwing", async () => {
  prisma.blogPost = {
    findMany: async () => [
      {
        id: "post-null-date",
        title: "Post with null date",
        slug: "post-null-date",
        excerpt: "Excerpt",
        coverImage: null,
        readingTimeMinutes: 1,
        publishedAt: null,
      },
    ],
  };

  const result = await getPublicBlogPosts();
  assert.equal(result.posts.length, 1);
  assert.equal(result.posts[0].publishedAt, null);

  // Date formatter safely handles null
  const formatted = formatPublicDate(result.posts[0].publishedAt);
  assert.equal(formatted, "");
});

// ==========================================
// 3. Data Mapping & Field Sanitization
// ==========================================

test("5. Public Blog Query: Selects only required public fields, omitting internal details", async () => {
  let capturedSelect = null;

  prisma.blogPost = {
    findMany: async (query) => {
      capturedSelect = query.select;
      return [];
    },
  };

  await getPublicBlogPosts();

  assert.deepEqual(capturedSelect, {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    coverImage: true,
    readingTimeMinutes: true,
    publishedAt: true,
  });

  // Verify internal and large admin fields are NOT selected
  assert.equal(capturedSelect.content, undefined);
  assert.equal(capturedSelect.faqs, undefined);
  assert.equal(capturedSelect.doctorSpecialtyOverrides, undefined);
  assert.equal(capturedSelect.coverImagePublicId, undefined);
  assert.equal(capturedSelect.createdAt, undefined);
  assert.equal(capturedSelect.updatedAt, undefined);
});

test("6. Formatting Utilities: formatPublicDate and formatReadingTime produce expected UI strings", () => {
  // Valid UTC date
  const dateStr = formatPublicDate("2026-10-28T12:00:00.000Z");
  assert.equal(dateStr, "October 28, 2026");

  // Date instance
  const dateObj = formatPublicDate(new Date("2026-11-02T00:00:00.000Z"));
  assert.equal(dateObj, "November 2, 2026");

  // Invalid or null dates return empty string safely
  assert.equal(formatPublicDate(null), "");
  assert.equal(formatPublicDate(undefined), "");
  assert.equal(formatPublicDate("not-a-date"), "");

  // Reading time
  assert.equal(formatReadingTime(3), "3 min read");
  assert.equal(formatReadingTime(1), "1 min read");
  assert.equal(formatReadingTime(0), "1 min read");
  assert.equal(formatReadingTime(null), "1 min read");
});

// ==========================================
// 4. Empty Results & Database Error Handling
// ==========================================

test("7. Public Blog Query: Returns clean empty array when no published posts exist", async () => {
  prisma.blogPost = {
    findMany: async () => [],
  };

  const result = await getPublicBlogPosts();
  assert.equal(result.posts.length, 0);
  assert.deepEqual(result.posts, []);
  assert.equal(result.error, undefined);
});

test("8. Public Blog Query: Gracefully catches database errors without leaking internal details", async () => {
  prisma.blogPost = {
    findMany: async () => {
      throw new Error("P2010: Raw query failed: Table 'ielung.blog_posts' doesn't exist");
    },
  };

  const result = await getPublicBlogPosts();
  assert.equal(result.posts.length, 0);
  assert.ok(result.error);
  assert.equal(result.error, "Unable to load articles at this time. Please check back later.");
  // Ensure sensitive DB connection or table info is not in the user error
  assert.equal(result.error.includes("Table 'ielung.blog_posts'"), false);
  assert.equal(result.error.includes("P2010"), false);
});

// ==========================================
// 5. Cache Revalidation on Mutations
// ==========================================

test("9. Cache Revalidation: Publishing a post triggers revalidation of /blog", async () => {
  const revalidatedPaths = [];
  setRevalidationHookForTesting((path) => revalidatedPaths.push(path));

  setMockAdminSessionForTesting({
    userId: "admin-1",
    email: "admin@ielung.com",
    role: "ADMIN",
  });

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-to-pub",
      title: "Publish Me",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Some content" }] }] },
      publishedAt: null,
    }),
    update: async ({ data }) => ({
      id: "post-to-pub",
      title: "Publish Me",
      ...data,
    }),
  };

  try {
    const res = await publishBlogPostAction("post-to-pub");
    assert.equal(res.success, true);
    assert.ok(revalidatedPaths.includes("/blog"), "Expected /blog to be revalidated upon publishing");
  } finally {
    setRevalidationHookForTesting(null);
    setMockAdminSessionForTesting(null);
  }
});

test("10. Cache Revalidation: Unpublishing a post triggers revalidation of /blog", async () => {
  const revalidatedPaths = [];
  setRevalidationHookForTesting((path) => revalidatedPaths.push(path));

  setMockAdminSessionForTesting({
    userId: "admin-1",
    email: "admin@ielung.com",
    role: "ADMIN",
  });

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-to-unpub",
      title: "Unpublish Me",
      status: "PUBLISHED",
      publishedAt: new Date(),
    }),
    update: async ({ data }) => ({
      id: "post-to-unpub",
      ...data,
    }),
  };

  try {
    const res = await unpublishBlogPostAction("post-to-unpub");
    assert.equal(res.success, true);
    assert.ok(revalidatedPaths.includes("/blog"), "Expected /blog to be revalidated upon unpublishing");
  } finally {
    setRevalidationHookForTesting(null);
    setMockAdminSessionForTesting(null);
  }
});

test("11. Cache Revalidation: Deleting a post triggers revalidation of /blog", async () => {
  const revalidatedPaths = [];
  setRevalidationHookForTesting((path) => revalidatedPaths.push(path));

  setMockAdminSessionForTesting({
    userId: "admin-1",
    email: "admin@ielung.com",
    role: "ADMIN",
  });

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-to-del",
      title: "Delete Me",
      coverImagePublicId: null,
    }),
    delete: async () => ({
      id: "post-to-del",
    }),
  };

  try {
    const res = await deleteBlogPostAction("post-to-del");
    assert.equal(res.success, true);
    assert.ok(revalidatedPaths.includes("/blog"), "Expected /blog to be revalidated upon deletion");
  } finally {
    setRevalidationHookForTesting(null);
    setMockAdminSessionForTesting(null);
  }
});

test("12. Cache Revalidation: Updating a post triggers revalidation of /blog", async () => {
  const revalidatedPaths = [];
  setRevalidationHookForTesting((path) => revalidatedPaths.push(path));

  setMockAdminSessionForTesting({
    userId: "admin-1",
    email: "admin@ielung.com",
    role: "ADMIN",
  });

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-to-update",
      title: "Original Title",
      slug: "original-title",
      excerpt: "Original excerpt",
    }),
    update: async ({ data }) => ({
      id: "post-to-update",
      ...data,
    }),
  };

  try {
    const res = await updateBlogPostAction("post-to-update", {
      title: "Updated Title",
    });
    assert.equal(res.success, true);
    assert.ok(revalidatedPaths.includes("/blog"), "Expected /blog to be revalidated upon updating");
  } finally {
    setRevalidationHookForTesting(null);
    setMockAdminSessionForTesting(null);
  }
});
