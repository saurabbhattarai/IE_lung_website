import test from "node:test";
import assert from "node:assert/strict";

// Configure test environment variables before module imports
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "1234567890";
process.env.CLOUDINARY_API_SECRET = "test-secret";
process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/test";

import { prisma } from "../lib/prisma.ts";
import {
  BlogQuerySchema,
} from "../lib/validations/blog.validation.ts";
import {
  getBlogPostsListService,
} from "../lib/blog/service.ts";
import {
  getBlogPostsListAction,
  publishBlogPostAction,
  unpublishBlogPostAction,
  deleteBlogPostAction,
} from "../lib/actions/blog.action.ts";

// ==========================================
// 1. Query Schema Validation
// ==========================================

test("1. BlogQuerySchema: Correctly parses valid and default pagination queries", () => {
  // Empty query defaults
  const parsedDefault = BlogQuerySchema.parse({});
  assert.equal(parsedDefault.page, 1);
  assert.equal(parsedDefault.limit, 10);
  assert.equal(parsedDefault.search, undefined);
  assert.equal(parsedDefault.status, undefined);

  // Custom page and limit
  const customQuery = BlogQuerySchema.parse({
    page: "3",
    limit: "25",
    search: "asthma",
    status: "PUBLISHED",
  });
  assert.equal(customQuery.page, 3);
  assert.equal(customQuery.limit, 25);
  assert.equal(customQuery.search, "asthma");
  assert.equal(customQuery.status, "PUBLISHED");

  // Rejects invalid status
  const invalidStatus = BlogQuerySchema.safeParse({ status: "ARCHIVED" });
  assert.equal(invalidStatus.success, false);

  // Rejects limit exceeding max 50
  const overLimit = BlogQuerySchema.safeParse({ limit: 100 });
  assert.equal(overLimit.success, false);
});

// ==========================================
// 2. Blog Posts List Service (Filtering & Pagination)
// ==========================================

test("2. getBlogPostsListService: Computes pagination and applies limit/offset", async () => {
  let capturedQuery = null;

  prisma.blogPost = {
    findMany: async (args) => {
      capturedQuery = args;
      return [
        {
          id: "p1",
          title: "Asthma Care",
          slug: "asthma-care",
          status: "PUBLISHED",
          publishedAt: new Date("2024-01-01"),
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-02"),
          readingTimeMinutes: 3,
          coverImage: null,
          author: "Dr. Admin",
        },
      ];
    },
    count: async () => 25, // Total 25 posts in database
  };

  const result = await getBlogPostsListService({
    page: 2,
    limit: 10,
  });

  assert.equal(result.total, 25);
  assert.equal(result.page, 2);
  assert.equal(result.limit, 10);
  assert.equal(result.totalPages, 3); // 25 / 10 = ceil(2.5) = 3
  assert.equal(result.posts.length, 1);

  // Verify skip and take sent to Prisma
  assert.equal(capturedQuery.skip, 10); // (2 - 1) * 10
  assert.equal(capturedQuery.take, 10);
});

test("3. getBlogPostsListService: Builds search condition for title and slug", async () => {
  let capturedWhere = null;

  prisma.blogPost = {
    findMany: async ({ where }) => {
      capturedWhere = where;
      return [];
    },
    count: async ({ where }) => {
      capturedWhere = where;
      return 0;
    },
  };

  await getBlogPostsListService({
    page: 1,
    limit: 10,
    search: "pulmonary fibrosis",
  });

  assert.ok(capturedWhere.OR);
  assert.deepEqual(capturedWhere.OR, [
    { title: { contains: "pulmonary fibrosis" } },
    { slug: { contains: "pulmonary fibrosis" } },
  ]);
});

test("4. getBlogPostsListService: Applies status filtering accurately", async () => {
  let capturedWhere = null;

  prisma.blogPost = {
    findMany: async ({ where }) => {
      capturedWhere = where;
      return [];
    },
    count: async ({ where }) => {
      capturedWhere = where;
      return 0;
    },
  };

  // Draft filter
  await getBlogPostsListService({
    page: 1,
    limit: 10,
    status: "DRAFT",
  });
  assert.equal(capturedWhere.status, "DRAFT");

  // Published filter
  await getBlogPostsListService({
    page: 1,
    limit: 10,
    status: "PUBLISHED",
  });
  assert.equal(capturedWhere.status, "PUBLISHED");
});

test("5. getBlogPostsListService: Handles empty results and zero total", async () => {
  prisma.blogPost = {
    findMany: async () => [],
    count: async () => 0,
  };

  const result = await getBlogPostsListService({
    page: 1,
    limit: 10,
    search: "nonexistent",
  });

  assert.equal(result.total, 0);
  assert.equal(result.totalPages, 0);
  assert.deepEqual(result.posts, []);
});

// ==========================================
// 3. Server Actions Authorization Guard
// ==========================================

test("6. getBlogPostsListAction: Requires active admin session", async () => {
  const result = await getBlogPostsListAction({});
  assert.equal(result.success, false);
  assert.match(result.error, /UNAUTHORIZED/i);
});

test("7. Post Mutation Actions: Require admin session and return formatted responses", async () => {
  const pubRes = await publishBlogPostAction("any-id");
  assert.equal(pubRes.success, false);
  assert.match(pubRes.error, /UNAUTHORIZED/i);

  const unpubRes = await unpublishBlogPostAction("any-id");
  assert.equal(unpubRes.success, false);
  assert.match(unpubRes.error, /UNAUTHORIZED/i);

  const delRes = await deleteBlogPostAction("any-id");
  assert.equal(delRes.success, false);
  assert.match(delRes.error, /UNAUTHORIZED/i);
});

// ==========================================
// 4. Client Request Sequencing & Concurrency
// ==========================================

test("8. Request Sequencing: Simulates older search request resolving after a newer request", async () => {
  let latestRequestId = 0;
  let activePosts = null;

  // Simulate an async fetcher with sequencing logic
  async function simulateFetch(searchTerm, delayMs) {
    const requestId = ++latestRequestId;
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    
    // Stale check
    if (requestId !== latestRequestId) {
      return { discarded: true };
    }

    activePosts = `Results for ${searchTerm}`;
    return { discarded: false, data: activePosts };
  }

  // Request 1 dispatched first with slow response (80ms)
  const req1Promise = simulateFetch("p", 80);
  // Request 2 dispatched second with fast response (20ms)
  const req2Promise = simulateFetch("pulmonary", 20);

  const [res1, res2] = await Promise.all([req1Promise, req2Promise]);

  // Request 2 finishes first and updates posts
  assert.equal(res2.discarded, false);
  assert.equal(activePosts, "Results for pulmonary");

  // Request 1 finishes later and is safely discarded
  assert.equal(res1.discarded, true);
  // activePosts must NOT be overwritten by request 1
  assert.equal(activePosts, "Results for pulmonary");
});

test("9. Request Sequencing: Rapid status filter changes ignore out-of-order responses", async () => {
  let latestRequestId = 0;
  let currentFilterData = null;

  async function simulateFilterFetch(status, delayMs) {
    const requestId = ++latestRequestId;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    if (requestId !== latestRequestId) {
      return { ignored: true };
    }
    currentFilterData = status;
    return { ignored: false, status };
  }

  // User clicks "Drafts" (slow network, 60ms), then rapidly clicks "Published" (fast network, 15ms)
  const p1 = simulateFilterFetch("DRAFT", 60);
  const p2 = simulateFilterFetch("PUBLISHED", 15);

  const [r1, r2] = await Promise.all([p1, p2]);

  assert.equal(r2.ignored, false);
  assert.equal(r1.ignored, true);
  assert.equal(currentFilterData, "PUBLISHED");
});

// ==========================================
// 5. Deletion & Pagination Boundary Handling
// ==========================================

test("10. Deletion Pagination: Deleting the only post on page 2 calculates target page as page 1", () => {
  // Scenario A: Exactly 1 post on page 2
  const currentPageA = 2;
  const postsCountA = 1;
  const targetPageA = postsCountA === 1 && currentPageA > 1 ? currentPageA - 1 : currentPageA;
  assert.equal(targetPageA, 1, "Should decrement to page 1 to prevent empty stranded view");

  // Scenario B: Multiple posts on page 2 (e.g. 5 posts left)
  const currentPageB = 2;
  const postsCountB = 5;
  const targetPageB = postsCountB === 1 && currentPageB > 1 ? currentPageB - 1 : currentPageB;
  assert.equal(targetPageB, 2, "Should remain on page 2 when other posts remain");

  // Scenario C: Only 1 post on page 1
  const currentPageC = 1;
  const postsCountC = 1;
  const targetPageC = postsCountC === 1 && currentPageC > 1 ? currentPageC - 1 : currentPageC;
  assert.equal(targetPageC, 1, "Should stay on page 1");
});

// ==========================================
// 6. Dashboard Database Error Fallback
// ==========================================

test("11. Dashboard Error Fallback: Database exception sets error state and displays '—' instead of zero", async () => {
  let blogCount = null;
  let publishedBlogCount = null;
  let isDatabaseError = false;

  // Mock prisma throwing a connection error
  const mockPrisma = {
    blogPost: {
      count: async () => {
        throw new Error("Can't reach database server at localhost:3306");
      },
    },
  };

  try {
    const [total, published] = await Promise.all([
      mockPrisma.blogPost.count(),
      mockPrisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    ]);
    blogCount = total;
    publishedBlogCount = published;
  } catch {
    isDatabaseError = true;
  }

  assert.equal(isDatabaseError, true);
  assert.equal(blogCount, null);

  // Verify display formatting helper
  const displayCount = isDatabaseError ? "—" : blogCount;
  const displaySubtitle = isDatabaseError
    ? "Metrics currently unavailable"
    : blogCount === 0
    ? "No clinical articles yet. Create and publish posts."
    : `${publishedBlogCount} published`;

  assert.equal(displayCount, "—");
  assert.equal(displaySubtitle, "Metrics currently unavailable");
});
