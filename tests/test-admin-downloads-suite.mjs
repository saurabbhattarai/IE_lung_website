import test from "node:test";
import assert from "node:assert/strict";

// Mock environment
process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/test";
process.env.JWT_SECRET = "test-secret-at-least-32-chars-long-for-testing-purposes";
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "1234567890";
process.env.CLOUDINARY_API_SECRET = "test-secret";

import { prisma } from "../lib/prisma.ts";
import { v2 as cloudinary } from "cloudinary";
import {
  CreateDownloadSchema,
  UpdateDownloadSchema,
  DownloadQuerySchema,
} from "../lib/validations/download.validation.ts";
import {
  getDownloadsListService,
  getDownloadStatsService,
  getDownloadByIdService,
  createDownloadService,
  updateDownloadService,
  publishDownloadService,
  unpublishDownloadService,
  setFeaturedNewsletterService,
  reorderDownloadsService,
  deleteDownloadService,
  getPublicDownloadsService,
} from "../lib/downloads/service.ts";
import {
  getDownloadsListAction,
  getDownloadByIdAction,
  getDownloadStatsAction,
  createDownloadAction,
  updateDownloadAction,
  publishDownloadAction,
  unpublishDownloadAction,
  setFeaturedNewsletterAction,
  reorderDownloadsAction,
  deleteDownloadAction,
} from "../lib/actions/download.action.ts";

// ==========================================
// 1. Admin Authentication Enforcement
// ==========================================

test("1. Admin Authorization: All server actions reject unauthenticated requests", async () => {
  // Without admin JWT session, actions must return success: false with 401/unauthorized error
  const actions = [
    () => getDownloadsListAction(),
    () => getDownloadByIdAction("item-1"),
    () => getDownloadStatsAction(),
    () => createDownloadAction({ title: "Test" }),
    () => updateDownloadAction("item-1", { title: "Test" }),
    () => publishDownloadAction("item-1"),
    () => unpublishDownloadAction("item-1"),
    () => setFeaturedNewsletterAction("item-1"),
    () => reorderDownloadsAction({ items: [{ id: "1", sortOrder: 1 }] }),
    () => deleteDownloadAction("item-1"),
  ];

  for (const act of actions) {
    const res = await act();
    assert.equal(res.success, false);
    assert.match(res.error, /Unauthorized|admin session/i);
  }
});

// ==========================================
// 2. Validation Schemas (Zod)
// ==========================================

test("2. Validation: Validates required common fields and rejects empty payloads", () => {
  const emptyRes = CreateDownloadSchema.safeParse({});
  assert.equal(emptyRes.success, false);
  const errors = emptyRes.error.flatten().fieldErrors;
  assert.ok(errors.category, "Category should be required");
  assert.ok(errors.title, "Title should be required");
  assert.ok(errors.description, "Description should be required");
  assert.ok(errors.fileUrl, "fileUrl should be required");

  // Valid common fields pass
  const validCommon = CreateDownloadSchema.safeParse({
    category: "FORMS",
    title: "Patient Referral Form",
    description: "Official provider referral form.",
    fileUrl: "/referral-form.pdf",
    fileSize: "30 KB",
  });
  assert.equal(validCommon.success, true);
});

test("3. Validation: Enforces that ONLY newsletter resources can be featured", () => {
  // Clinical Form with featured: true must be rejected
  const invalidForm = CreateDownloadSchema.safeParse({
    category: "FORMS",
    title: "Referral Form",
    description: "Provider document",
    fileUrl: "/referral-form.pdf",
    featured: true,
  });
  assert.equal(invalidForm.success, false);
  assert.match(
    invalidForm.error.issues[0].message,
    /Only newsletter resources can be marked as featured/i
  );

  // Guide with featured: true must be rejected
  const invalidGuide = UpdateDownloadSchema.safeParse({
    category: "GUIDES",
    featured: true,
  });
  assert.equal(invalidGuide.success, false);
  assert.match(
    invalidGuide.error.issues[0].message,
    /Only newsletter resources can be marked as featured/i
  );

  // Newsletter with featured: true is accepted
  const validNewsletter = CreateDownloadSchema.safeParse({
    category: "NEWSLETTER",
    title: "IE Lung Issue 1",
    description: "Issue 1 description",
    fileUrl: "/news-letter/issue-1.pdf",
    featured: true,
  });
  assert.equal(validNewsletter.success, true);
});

test("4. Validation: Enforces Cloudinary public ID folder ownership & security", () => {
  // Valid public ID in ielung/downloads
  const validId = CreateDownloadSchema.safeParse({
    category: "NEWSLETTER",
    title: "Issue 2",
    description: "Desc",
    fileUrl: "https://res.cloudinary.com/demo/raw/upload/ielung/downloads/issue2.pdf",
    filePublicId: "ielung/downloads/issue2",
  });
  assert.equal(validId.success, true);

  // Unauthorized folder (e.g. blog or outside)
  const invalidFolder = CreateDownloadSchema.safeParse({
    category: "NEWSLETTER",
    title: "Issue 2",
    description: "Desc",
    fileUrl: "https://res.cloudinary.com/demo/raw/upload/ielung/blog/photo.pdf",
    filePublicId: "ielung/blog/photo",
  });
  assert.equal(invalidFolder.success, false);
  assert.match(
    invalidFolder.error.issues[0].message,
    /Must reside within 'ielung\/downloads'/i
  );

  // Path traversal attempt in publicId
  const traversalId = CreateDownloadSchema.safeParse({
    category: "NEWSLETTER",
    title: "Issue 2",
    description: "Desc",
    fileUrl: "https://res.cloudinary.com/demo/raw/upload/ielung/downloads/escape.pdf",
    filePublicId: "ielung/downloads/../secret",
  });
  assert.equal(traversalId.success, false);
});

test("5. Validation: Validates newsletter-specific fields (issueNumber, topics, publicationDate)", () => {
  // Negative issue number rejected
  const negIssue = CreateDownloadSchema.safeParse({
    category: "NEWSLETTER",
    title: "Title",
    description: "Desc",
    fileUrl: "/doc.pdf",
    issueNumber: -1,
  });
  assert.equal(negIssue.success, false);

  // Valid newsletter fields with topics array
  const validNewsletter = CreateDownloadSchema.safeParse({
    category: "NEWSLETTER",
    title: "IE Lung Issue 1",
    subtitle: "Breathing Wellness",
    issueNumber: 1,
    edition: "November 2026",
    publicationDate: "2026-11-05",
    description: "Desc",
    fileUrl: "/doc.pdf",
    topics: ["Topic 1", "Topic 2"],
    featured: true,
  });
  assert.equal(validNewsletter.success, true);
  assert.ok(validNewsletter.data.publicationDate instanceof Date);
});

// ==========================================
// 3. Featured Newsletter Uniqueness & Transactions
// ==========================================

test("6. Featured Uniqueness: Creating a featured published newsletter unsets existing featured items", async () => {
  let unsetCalled = false;
  let createdData = null;

  prisma.$transaction = async (callback) => {
    const mockTx = {
      downloadResource: {
        updateMany: async ({ where, data }) => {
          if (where.featured === true && data.featured === false) {
            unsetCalled = true;
          }
          return { count: 1 };
        },
        create: async ({ data }) => {
          createdData = data;
          return { id: "new-issue", ...data };
        },
      },
    };
    return callback(mockTx);
  };

  prisma.downloadResource.findFirst = async () => ({ sortOrder: 0 });

  await createDownloadService({
    category: "NEWSLETTER",
    title: "Newest Issue",
    description: "Description",
    fileUrl: "/news-letter/issue-2.pdf",
    featured: true,
    status: "PUBLISHED",
  });

  assert.equal(unsetCalled, true, "Existing featured items must be un-featured");
  assert.equal(createdData.featured, true);
});

test("7. Featured Uniqueness: setFeaturedNewsletterService atomically sets single featured newsletter", async () => {
  prisma.downloadResource.findUnique = async ({ where }) => ({
    id: where.id,
    category: "NEWSLETTER",
    title: "Issue 1",
    status: "PUBLISHED",
    featured: false,
  });

  let unfeaturedOthers = false;
  let featuredTargetId = null;

  prisma.$transaction = async (callback) => {
    const mockTx = {
      downloadResource: {
        updateMany: async ({ where, data }) => {
          if (where.featured === true && data.featured === false) {
            unfeaturedOthers = true;
          }
          return { count: 1 };
        },
        update: async ({ where, data }) => {
          featuredTargetId = where.id;
          return { id: where.id, featured: data.featured };
        },
      },
    };
    return callback(mockTx);
  };

  const res = await setFeaturedNewsletterService("issue-1");
  assert.equal(unfeaturedOthers, true);
  assert.equal(featuredTargetId, "issue-1");
  assert.equal(res.featured, true);
});

test("8. Featured Uniqueness: Rejects setting unpublished DRAFT or non-newsletter as featured", async () => {
  // Case A: DRAFT newsletter rejected
  prisma.downloadResource.findUnique = async () => ({
    id: "draft-issue",
    category: "NEWSLETTER",
    title: "Draft Issue",
    status: "DRAFT",
    featured: false,
  });

  await assert.rejects(
    () => setFeaturedNewsletterService("draft-issue"),
    /Only published newsletters can be set as featured/i
  );

  // Case B: Clinical Form rejected
  prisma.downloadResource.findUnique = async () => ({
    id: "form-1",
    category: "FORMS",
    title: "Clinical Form",
    status: "PUBLISHED",
    featured: false,
  });

  await assert.rejects(
    () => setFeaturedNewsletterService("form-1"),
    /Only newsletter resources can be set as featured/i
  );
});

// ==========================================
// 4. Safe Deletion & Local File Preservation
// ==========================================

test("9. Safe Deletion: Local static assets are deleted from DB without invoking Cloudinary", async () => {
  prisma.downloadResource.findUnique = async ({ where }) => ({
    id: where.id,
    title: "Provider Referral Form",
    fileUrl: "/referral-form.pdf",
    filePublicId: null,
  });

  let dbDeletedId = null;
  prisma.downloadResource.delete = async ({ where }) => {
    dbDeletedId = where.id;
    return { id: where.id, title: "Provider Referral Form" };
  };

  let cloudinaryCalled = false;
  cloudinary.uploader.destroy = async () => {
    cloudinaryCalled = true;
    return { result: "ok" };
  };

  const res = await deleteDownloadService("provider-referral-form");
  assert.equal(dbDeletedId, "provider-referral-form");
  assert.equal(cloudinaryCalled, false, "Local static files must NEVER trigger Cloudinary destroy");
  assert.equal(res.id, "provider-referral-form");
});

test("10. Safe Deletion: Deletes Cloudinary asset when unreferenced, preserves if referenced elsewhere", async () => {
  const targetPublicId = "ielung/downloads/shared_patient_guide";

  prisma.downloadResource.findUnique = async () => ({
    id: "dl-1",
    title: "Patient Guide Copy",
    fileUrl: `https://res.cloudinary.com/test-cloud/raw/upload/${targetPublicId}.pdf`,
    filePublicId: targetPublicId,
  });

  prisma.downloadResource.delete = async () => ({ id: "dl-1", title: "Patient Guide Copy" });

  let cloudinaryDestroyedId = null;
  cloudinary.uploader.destroy = async (publicId) => {
    cloudinaryDestroyedId = publicId;
    return { result: "ok" };
  };

  // Case A: Unreferenced (otherRef = null) -> Calls Cloudinary destroy
  prisma.downloadResource.findFirst = async () => null;
  await deleteDownloadService("dl-1");
  assert.equal(cloudinaryDestroyedId, targetPublicId);

  // Case B: Referenced elsewhere by another record -> Skips Cloudinary destroy
  cloudinaryDestroyedId = null;
  prisma.downloadResource.findFirst = async () => ({ id: "dl-other" });
  await deleteDownloadService("dl-1");
  assert.equal(cloudinaryDestroyedId, null, "Must NOT destroy asset if referenced elsewhere");
});

// ==========================================
// 5. Public Filtering & Query Service
// ==========================================

test("11. Public Query: Returns only PUBLISHED resources and excludes DRAFTS", async () => {
  prisma.downloadResource.findMany = async ({ where }) => {
    assert.equal(where.status, "PUBLISHED");
    return [
      {
        id: "nl-1",
        category: "NEWSLETTER",
        title: "Issue 1",
        featured: true,
        sortOrder: 0,
        status: "PUBLISHED",
      },
      {
        id: "form-1",
        category: "FORMS",
        title: "Referral Form",
        featured: false,
        sortOrder: 1,
        status: "PUBLISHED",
      },
    ];
  };

  const res = await getPublicDownloadsService();
  assert.ok(res.featuredNewsletter);
  assert.equal(res.featuredNewsletter.id, "nl-1");
  assert.equal(res.newsletters.length, 1);
  assert.equal(res.clinicalForms.length, 1);
  assert.equal(res.all.length, 2);
});

// ==========================================
// 6. Reordering Service
// ==========================================

test("12. Reordering: reorderDownloadsService updates sortOrder in transaction", async () => {
  const updatedOrders = [];

  prisma.$transaction = async (callback) => {
    const mockTx = {
      downloadResource: {
        update: async ({ where, data }) => {
          updatedOrders.push({ id: where.id, sortOrder: data.sortOrder });
          return { id: where.id, ...data };
        },
      },
    };
    return callback(mockTx);
  };

  const res = await reorderDownloadsService({
    items: [
      { id: "item-a", sortOrder: 5 },
      { id: "item-b", sortOrder: 10 },
    ],
  });

  assert.equal(res.success, true);
  assert.equal(updatedOrders.length, 2);
  assert.deepEqual(updatedOrders[0], { id: "item-a", sortOrder: 5 });
  assert.deepEqual(updatedOrders[1], { id: "item-b", sortOrder: 10 });
});
