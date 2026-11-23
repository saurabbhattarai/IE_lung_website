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
  CreateGalleryImageSchema,
  UpdateGalleryImageSchema,
  GalleryQuerySchema,
  ReorderGalleryImagesSchema,
  isValidImageSrc,
} from "../lib/validations/gallery.validation.ts";
import {
  getGalleryListService,
  getGalleryStatsService,
  getGalleryImageByIdService,
  createGalleryImageService,
  updateGalleryImageService,
  publishGalleryImageService,
  unpublishGalleryImageService,
  reorderGalleryImagesService,
  deleteGalleryImageService,
  getPublicGalleryImagesService,
  getHomepageOpeningGalleryImagesService,
} from "../lib/gallery/service.ts";
import {
  getGalleryListAction,
  getGalleryStatsAction,
  getGalleryImageByIdAction,
  createGalleryImageAction,
  updateGalleryImageAction,
  publishGalleryImageAction,
  unpublishGalleryImageAction,
  reorderGalleryImagesAction,
  deleteGalleryImageAction,
} from "../lib/actions/gallery.action.ts";

// ==========================================
// 1. Admin Authorization Enforcement
// ==========================================

test("1. Admin Authorization: All server actions reject unauthenticated requests", async () => {
  const actions = [
    () => getGalleryListAction(),
    () => getGalleryStatsAction(),
    () => getGalleryImageByIdAction("img-1"),
    () => createGalleryImageAction({ title: "Test" }),
    () => updateGalleryImageAction("img-1", { title: "Test" }),
    () => publishGalleryImageAction("img-1"),
    () => unpublishGalleryImageAction("img-1"),
    () => reorderGalleryImagesAction({ items: [{ id: "img-1", sortOrder: 0 }] }),
    () => deleteGalleryImageAction("img-1"),
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

test("2. Validation: Validates required fields and rejects empty payloads", () => {
  const emptyRes = CreateGalleryImageSchema.safeParse({});
  assert.equal(emptyRes.success, false);
  const errors = emptyRes.error.flatten().fieldErrors;
  assert.ok(errors.title, "Title should be required");
  assert.ok(errors.src, "src should be required");
  assert.ok(errors.alt, "alt text should be required");
});

test("3. Validation: Enforces character length limits for title and alt text", () => {
  // Title over 255 characters
  const longTitle = CreateGalleryImageSchema.safeParse({
    title: "A".repeat(256),
    src: "/images/test.jpg",
    alt: "Valid alt text",
  });
  assert.equal(longTitle.success, false);
  assert.match(longTitle.error.issues[0].message, /must not exceed 255 characters/i);

  // Alt text over 500 characters
  const longAlt = CreateGalleryImageSchema.safeParse({
    title: "Valid Title",
    src: "/images/test.jpg",
    alt: "A".repeat(501),
  });
  assert.equal(longAlt.success, false);
  assert.match(longAlt.error.issues[0].message, /must not exceed 500 characters/i);
});

test("4. Validation: Enforces valid aspect values (landscape or portrait)", () => {
  const validLandscape = CreateGalleryImageSchema.safeParse({
    title: "Valid Title",
    src: "/images/test.jpg",
    alt: "Alt",
    aspect: "landscape",
  });
  assert.equal(validLandscape.success, true);

  const validPortrait = CreateGalleryImageSchema.safeParse({
    title: "Valid Title",
    src: "/images/test.jpg",
    alt: "Alt",
    aspect: "portrait",
  });
  assert.equal(validPortrait.success, true);

  const invalidAspect = CreateGalleryImageSchema.safeParse({
    title: "Valid Title",
    src: "/images/test.jpg",
    alt: "Alt",
    aspect: "square",
  });
  assert.equal(invalidAspect.success, false);
});

test("5. Validation: Enforces non-negative sortOrder", () => {
  const negSort = CreateGalleryImageSchema.safeParse({
    title: "Valid Title",
    src: "/images/test.jpg",
    alt: "Alt",
    sortOrder: -1,
  });
  assert.equal(negSort.success, false);

  const zeroSort = CreateGalleryImageSchema.safeParse({
    title: "Valid Title",
    src: "/images/test.jpg",
    alt: "Alt",
    sortOrder: 0,
  });
  assert.equal(zeroSort.success, true);
});

test("6. Validation: Validates image source URLs and local static paths", () => {
  assert.equal(isValidImageSrc("/images/opening-images/Frame 1.png"), true);
  assert.equal(isValidImageSrc("https://res.cloudinary.com/demo/image/upload/sample.jpg"), true);
  assert.equal(isValidImageSrc("http://example.com/photo.webp"), true);
  assert.equal(isValidImageSrc("javascript:alert(1)"), false);
  assert.equal(isValidImageSrc("data:image/png;base64,123"), false);
  assert.equal(isValidImageSrc("../secret/photo.jpg"), false);
});

test("7. Validation: Enforces Cloudinary folder ownership and blocks path traversal", () => {
  // Valid gallery folder
  const validCloudinary = CreateGalleryImageSchema.safeParse({
    title: "Celebration",
    src: "https://res.cloudinary.com/test/image/upload/ielung/gallery/photo1.jpg",
    publicId: "ielung/gallery/photo1",
    alt: "Celebration photo",
  });
  assert.equal(validCloudinary.success, true);

  // Unauthorized folder (e.g. blog or downloads)
  const invalidFolder = CreateGalleryImageSchema.safeParse({
    title: "Celebration",
    src: "https://res.cloudinary.com/test/image/upload/ielung/blog/photo1.jpg",
    publicId: "ielung/blog/photo1",
    alt: "Celebration photo",
  });
  assert.equal(invalidFolder.success, false);
  assert.match(invalidFolder.error.issues[0].message, /Must reside within 'ielung\/gallery'/i);

  // Path traversal in publicId
  const traversal = CreateGalleryImageSchema.safeParse({
    title: "Celebration",
    src: "https://res.cloudinary.com/test/image/upload/ielung/gallery/photo1.jpg",
    publicId: "ielung/gallery/../secret",
    alt: "Celebration photo",
  });
  assert.equal(traversal.success, false);
});

test("8. Validation: ReorderGalleryImagesSchema requires valid item list", () => {
  const emptyReorder = ReorderGalleryImagesSchema.safeParse({ items: [] });
  assert.equal(emptyReorder.success, false);

  const validReorder = ReorderGalleryImagesSchema.safeParse({
    items: [
      { id: "img-1", sortOrder: 0 },
      { id: "img-2", sortOrder: 1 },
    ],
  });
  assert.equal(validReorder.success, true);
});

// ==========================================
// 3. Service Layer CRUD & Behavior
// ==========================================

test("9. Service: createGalleryImageService creates record with default values", async () => {
  let createdData = null;
  prisma.galleryImage.create = async ({ data }) => {
    createdData = data;
    return { id: "created-1", ...data, createdAt: new Date(), updatedAt: new Date() };
  };

  const res = await createGalleryImageService({
    title: "New Photo",
    category: "Opening Day",
    src: "/images/opening-images/Frame 2147224866.png",
    alt: "Opening Day photo",
  });

  assert.equal(res.id, "created-1");
  assert.equal(createdData.title, "New Photo");
  assert.equal(createdData.status, "PUBLISHED");
  assert.equal(createdData.aspect, "landscape");
  assert.equal(createdData.sortOrder, 0);
});

test("10. Service: updateGalleryImageService updates fields correctly", async () => {
  prisma.galleryImage.findUnique = async () => ({
    id: "img-1",
    title: "Old Title",
    category: "Opening Day",
    src: "/images/old.png",
    publicId: null,
    alt: "Old Alt",
    status: "PUBLISHED",
  });

  let updatePayload = null;
  prisma.galleryImage.update = async ({ where, data }) => {
    updatePayload = data;
    return { id: where.id, ...data };
  };

  const res = await updateGalleryImageService("img-1", {
    title: "Updated Title",
    aspect: "portrait",
  });

  assert.equal(updatePayload.title, "Updated Title");
  assert.equal(updatePayload.aspect, "portrait");
});

test("11. Service: publishGalleryImageService and unpublishGalleryImageService toggle status", async () => {
  prisma.galleryImage.findUnique = async () => ({
    id: "img-1",
    title: "Photo",
    status: "DRAFT",
  });

  let updatedStatus = null;
  prisma.galleryImage.update = async ({ data }) => {
    updatedStatus = data.status;
    return { id: "img-1", status: data.status };
  };

  await publishGalleryImageService("img-1");
  assert.equal(updatedStatus, "PUBLISHED");

  await unpublishGalleryImageService("img-1");
  assert.equal(updatedStatus, "DRAFT");
});

test("12. Service: reorderGalleryImagesService updates sortOrder in transaction", async () => {
  let transactionOps = null;
  prisma.$transaction = async (ops) => {
    transactionOps = ops;
    return ops;
  };
  prisma.galleryImage.update = async (params) => params;

  await reorderGalleryImagesService([
    { id: "img-1", sortOrder: 5 },
    { id: "img-2", sortOrder: 10 },
  ]);

  assert.equal(Array.isArray(transactionOps), true);
  assert.equal(transactionOps.length, 2);
});

// ==========================================
// 4. Safe Deletion & Cloudinary Cleanup
// ==========================================

test("13. Safe Deletion: Deletes DB record first and preserves local static files", async () => {
  let dbDeleted = false;
  let cloudinaryDestroyCalled = false;

  prisma.galleryImage.findUnique = async () => ({
    id: "opening-1",
    title: "Opening Day",
    src: "/images/opening-images/Frame 2147224866.png",
    publicId: null,
  });

  prisma.galleryImage.delete = async () => {
    dbDeleted = true;
    return { id: "opening-1" };
  };

  cloudinary.uploader.destroy = async () => {
    cloudinaryDestroyCalled = true;
    return { result: "ok" };
  };

  const res = await deleteGalleryImageService("opening-1");
  assert.equal(res.success, true);
  assert.equal(dbDeleted, true, "Database record must be deleted");
  assert.equal(cloudinaryDestroyCalled, false, "Local static files must NEVER trigger Cloudinary destroy");
});

test("14. Safe Deletion: Deletes unreferenced Cloudinary asset after deleting DB record", async () => {
  let dbDeleted = false;
  let destroyedPublicId = null;

  prisma.galleryImage.findUnique = async () => ({
    id: "img-cloud",
    title: "Cloud Photo",
    src: "https://res.cloudinary.com/test/image/upload/ielung/gallery/temp_photo.jpg",
    publicId: "ielung/gallery/temp_photo",
  });

  prisma.galleryImage.delete = async () => {
    dbDeleted = true;
    return { id: "img-cloud" };
  };

  // Remaining reference check returns false (no other item references temp_photo)
  prisma.galleryImage.findFirst = async () => null;

  cloudinary.uploader.destroy = async (publicId, opts) => {
    destroyedPublicId = publicId;
    assert.equal(opts.resource_type, "image");
    return { result: "ok" };
  };

  const res = await deleteGalleryImageService("img-cloud");
  assert.equal(res.success, true);
  assert.equal(dbDeleted, true);
  assert.equal(destroyedPublicId, "ielung/gallery/temp_photo");
});

test("15. Safe Deletion: Does not delete Cloudinary asset if still referenced by another record", async () => {
  let cloudinaryDestroyCalled = false;

  prisma.galleryImage.findUnique = async () => ({
    id: "img-shared-1",
    title: "Shared Photo 1",
    src: "https://res.cloudinary.com/test/image/upload/ielung/gallery/shared.jpg",
    publicId: "ielung/gallery/shared",
  });

  prisma.galleryImage.delete = async () => ({ id: "img-shared-1" });

  // Still referenced by shared-2
  prisma.galleryImage.findFirst = async () => ({
    id: "img-shared-2",
    title: "Shared Photo 2",
  });

  cloudinary.uploader.destroy = async () => {
    cloudinaryDestroyCalled = true;
    return { result: "ok" };
  };

  await deleteGalleryImageService("img-shared-1");
  assert.equal(cloudinaryDestroyCalled, false, "Must not destroy asset when referenced elsewhere");
});

test("16. Safe Deletion: Cloudinary deletion failure does not revert DB deletion", async () => {
  let dbDeleted = false;

  prisma.galleryImage.findUnique = async () => ({
    id: "img-fail",
    title: "Fail Photo",
    src: "https://res.cloudinary.com/test/image/upload/ielung/gallery/fail.jpg",
    publicId: "ielung/gallery/fail",
  });

  prisma.galleryImage.delete = async () => {
    dbDeleted = true;
    return { id: "img-fail" };
  };

  prisma.galleryImage.findFirst = async () => null;

  cloudinary.uploader.destroy = async () => {
    throw new Error("Network timeout contacting Cloudinary");
  };

  const res = await deleteGalleryImageService("img-fail");
  assert.equal(res.success, true);
  assert.equal(dbDeleted, true, "DB record remains deleted even if Cloudinary cleanup throws");
});

// ==========================================
// 5. Public & Homepage Behavior
// ==========================================

test("17. Public Gallery: getPublicGalleryImagesService returns only published items in sortOrder", async () => {
  let queryParams = null;
  prisma.galleryImage.findMany = async (params) => {
    queryParams = params;
    return [
      { id: "1", title: "Photo 1", sortOrder: 0, status: "PUBLISHED" },
      { id: "2", title: "Photo 2", sortOrder: 1, status: "PUBLISHED" },
    ];
  };

  const res = await getPublicGalleryImagesService();
  assert.equal(queryParams.where.status, "PUBLISHED");
  assert.deepEqual(queryParams.orderBy, [{ sortOrder: "asc" }, { createdAt: "asc" }]);
  assert.equal(res.length, 2);
});

test("18. Homepage Gallery: getHomepageOpeningGalleryImagesService limits results to 6", async () => {
  let queryParams = null;
  prisma.galleryImage.findMany = async (params) => {
    queryParams = params;
    return new Array(6).fill(null).map((_, i) => ({
      id: `img-${i}`,
      title: `Photo ${i}`,
      sortOrder: i,
      status: "PUBLISHED",
    }));
  };

  const res = await getHomepageOpeningGalleryImagesService();
  assert.equal(queryParams.take, 6, "Must limit to first 6 items for homepage");
  assert.equal(queryParams.where.status, "PUBLISHED");
  assert.equal(res.length, 6);
});

test("19. Public Gallery: Handles database query failure explicitly", async () => {
  prisma.galleryImage.findMany = async () => {
    throw new Error("Connection lost");
  };

  await assert.rejects(
    async () => getPublicGalleryImagesService(),
    /Connection lost/
  );
});
