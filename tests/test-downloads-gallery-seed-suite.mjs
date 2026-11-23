import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { newsletters, clinicalForms } from "../lib/constants/downloadsData.ts";
import { openingDayImages } from "../lib/constants/galleryData.ts";
import { seedDownloads, seedGallery, seedAll } from "../prisma/seed.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// 1. Prisma Schema & Migration SQL Verification
// ==========================================

test("1. Schema Verification: Prisma schema defines DownloadResource and GalleryImage models", () => {
  const schemaPath = path.resolve(__dirname, "..", "prisma", "schema.prisma");
  const schemaContent = fs.readFileSync(schemaPath, "utf-8");

  // Enums
  assert.match(schemaContent, /enum\s+DownloadCategory\s*\{[\s\S]*?NEWSLETTER[\s\S]*?FORMS[\s\S]*?GUIDES[\s\S]*?BROCHURES[\s\S]*?\}/);
  assert.match(schemaContent, /enum\s+DownloadStatus\s*\{[\s\S]*?DRAFT[\s\S]*?PUBLISHED[\s\S]*?\}/);
  assert.match(schemaContent, /enum\s+GalleryStatus\s*\{[\s\S]*?DRAFT[\s\S]*?PUBLISHED[\s\S]*?\}/);

  // DownloadResource model
  assert.match(schemaContent, /model\s+DownloadResource\s*\{/);
  assert.match(schemaContent, /category\s+DownloadCategory/);
  assert.match(schemaContent, /title\s+String/);
  assert.match(schemaContent, /subtitle\s+String\?/);
  assert.match(schemaContent, /issueNumber\s+Int\?/);
  assert.match(schemaContent, /edition\s+String\?/);
  assert.match(schemaContent, /publicationDate\s+DateTime\?/);
  assert.match(schemaContent, /fileUrl\s+String/);
  assert.match(schemaContent, /filePublicId\s+String\?/);
  assert.match(schemaContent, /fileSize\s+String\?/);
  assert.match(schemaContent, /pageCount\s+String\?/);
  assert.match(schemaContent, /topics\s+Json\?/);
  assert.match(schemaContent, /featured\s+Boolean\s+@default\(false\)/);
  assert.match(schemaContent, /sortOrder\s+Int\s+@default\(0\)/);
  assert.match(schemaContent, /status\s+DownloadStatus\s+@default\(PUBLISHED\)/);
  assert.match(schemaContent, /@@map\("download_resources"\)/);

  // GalleryImage model
  assert.match(schemaContent, /model\s+GalleryImage\s*\{/);
  assert.match(schemaContent, /title\s+String/);
  assert.match(schemaContent, /category\s+String/);
  assert.match(schemaContent, /src\s+String/);
  assert.match(schemaContent, /publicId\s+String\?/);
  assert.match(schemaContent, /alt\s+String/);
  assert.match(schemaContent, /aspect\s+String\?/);
  assert.match(schemaContent, /sortOrder\s+Int\s+@default\(0\)/);
  assert.match(schemaContent, /status\s+GalleryStatus\s+@default\(PUBLISHED\)/);
  assert.match(schemaContent, /@@map\("gallery_images"\)/);
});

test("2. Migration SQL Review: Migration strictly adds new tables and does not alter existing tables", () => {
  const migrationsDir = path.resolve(__dirname, "..", "prisma", "migrations");
  const migrationEntries = fs.readdirSync(migrationsDir).filter((e) => e.includes("add_download_resource_and_gallery_image"));

  assert.ok(migrationEntries.length >= 1, "Expected migration folder to exist");
  const migrationFolder = migrationEntries[0];
  const sqlContent = fs.readFileSync(path.join(migrationsDir, migrationFolder, "migration.sql"), "utf-8");

  // Verifies tables are created
  assert.match(sqlContent, /CREATE TABLE `download_resources`/);
  assert.match(sqlContent, /CREATE TABLE `gallery_images`/);

  // Verifies existing tables are NOT dropped or altered
  assert.doesNotMatch(sqlContent, /DROP TABLE/i);
  assert.doesNotMatch(sqlContent, /ALTER TABLE `blog_posts`/i);
  assert.doesNotMatch(sqlContent, /ALTER TABLE `newsletter_subscribers`/i);
  assert.doesNotMatch(sqlContent, /DELETE FROM/i);
});

// ==========================================
// 2. Download Resource Seed Mapping & Idempotency
// ==========================================

test("3. Download Seed: Maps all existing newsletters and clinical forms with exact fields", async () => {
  const inMemoryDownloads = new Map();

  const mockClient = {
    downloadResource: {
      findUnique: async ({ where }) => inMemoryDownloads.get(where.id) || null,
      create: async ({ data }) => {
        inMemoryDownloads.set(data.id, data);
        return data;
      },
    },
  };

  const seedResult = await seedDownloads(mockClient);

  assert.equal(seedResult.created.length, 2);
  assert.equal(seedResult.skipped.length, 0);

  // Inspect newsletter
  const seededNl = inMemoryDownloads.get("issue-1-nov-2026");
  assert.ok(seededNl, "Expected newsletter to be seeded");
  assert.equal(seededNl.id, "issue-1-nov-2026");
  assert.equal(seededNl.category, "NEWSLETTER");
  assert.equal(seededNl.issueNumber, 1);
  assert.equal(seededNl.title, "IE Lung Newsletter — Issue 1");
  assert.equal(seededNl.subtitle, "Breathing is Life: The Science of Breathing & Respiratory Wellness");
  assert.equal(seededNl.edition, "November 2026");
  assert.equal(seededNl.fileUrl, "/news-letter/IE_Lung_November_2026_Newsletter-Issue 1-11-5-2026.pdf");
  assert.equal(seededNl.filePublicId, null);
  assert.equal(seededNl.fileSize, "680 KB");
  assert.equal(seededNl.pageCount, "4 Pages");
  assert.deepEqual(seededNl.topics, newsletters[0].topics);
  assert.equal(seededNl.featured, true);
  assert.equal(seededNl.sortOrder, 0);
  assert.equal(seededNl.status, "PUBLISHED");

  // Inspect clinical form
  const seededForm = inMemoryDownloads.get("provider-referral-form");
  assert.ok(seededForm, "Expected form to be seeded");
  assert.equal(seededForm.id, "provider-referral-form");
  assert.equal(seededForm.category, "FORMS");
  assert.equal(seededForm.title, "Physician & Provider Referral Form");
  assert.equal(seededForm.fileUrl, "/referral-form.pdf");
  assert.equal(seededForm.filePublicId, null);
  assert.equal(seededForm.fileSize, "30 KB");
  assert.equal(seededForm.featured, false);
  assert.equal(seededForm.sortOrder, 1);
  assert.equal(seededForm.status, "PUBLISHED");
});

test("4. Download Seed Idempotency: Subsequent runs skip existing items without modifying them", async () => {
  const inMemoryDownloads = new Map();
  let createCalls = 0;

  const mockClient = {
    downloadResource: {
      findUnique: async ({ where }) => inMemoryDownloads.get(where.id) || null,
      create: async ({ data }) => {
        createCalls++;
        inMemoryDownloads.set(data.id, data);
        return data;
      },
    },
  };

  // Run 1: Initial seed
  const run1 = await seedDownloads(mockClient);
  assert.equal(run1.created.length, 2);
  assert.equal(run1.skipped.length, 0);
  assert.equal(createCalls, 2);

  // Modify an in-memory attribute to verify it is NOT overwritten
  inMemoryDownloads.get("issue-1-nov-2026").customMarker = "preserve-this";

  // Run 2: Re-run seed
  const run2 = await seedDownloads(mockClient);
  assert.equal(run2.created.length, 0);
  assert.equal(run2.skipped.length, 2);
  assert.equal(createCalls, 2); // No new creates

  // Verify record was untouched
  assert.equal(inMemoryDownloads.get("issue-1-nov-2026").customMarker, "preserve-this");
});

// ==========================================
// 3. Gallery Seed Mapping & Idempotency
// ==========================================

test("5. Gallery Seed: Maps all 7 opening day images preserving alt, aspect, src, and sortOrder", async () => {
  const inMemoryGallery = new Map();

  const mockClient = {
    galleryImage: {
      findUnique: async ({ where }) => inMemoryGallery.get(where.id) || null,
      create: async ({ data }) => {
        inMemoryGallery.set(data.id, data);
        return data;
      },
    },
  };

  const seedResult = await seedGallery(mockClient);

  assert.equal(seedResult.created.length, 7);
  assert.equal(seedResult.skipped.length, 0);

  // Verify all 7 images
  for (let i = 0; i < openingDayImages.length; i++) {
    const original = openingDayImages[i];
    const seeded = inMemoryGallery.get(original.id);

    assert.ok(seeded, `Expected gallery image ${original.id} to be seeded`);
    assert.equal(seeded.title, original.title);
    assert.equal(seeded.category, "Opening Day");
    assert.equal(seeded.src, original.src);
    assert.equal(seeded.publicId, null);
    assert.equal(seeded.alt, original.alt);
    assert.equal(seeded.aspect, original.aspect || "landscape");
    assert.equal(seeded.sortOrder, i);
    assert.equal(seeded.status, "PUBLISHED");
  }
});

test("6. Gallery Seed Idempotency: Re-running does not duplicate or overwrite gallery items", async () => {
  const inMemoryGallery = new Map();
  let createCalls = 0;

  const mockClient = {
    galleryImage: {
      findUnique: async ({ where }) => inMemoryGallery.get(where.id) || null,
      create: async ({ data }) => {
        createCalls++;
        inMemoryGallery.set(data.id, data);
        return data;
      },
    },
  };

  // Run 1: Initial seed
  const run1 = await seedGallery(mockClient);
  assert.equal(run1.created.length, 7);
  assert.equal(createCalls, 7);

  // Run 2: Re-run seed
  const run2 = await seedGallery(mockClient);
  assert.equal(run2.created.length, 0);
  assert.equal(run2.skipped.length, 7);
  assert.equal(createCalls, 7);
});

// ==========================================
// 4. Combined seedAll Orchestration
// ==========================================

test("7. Combined Seed: seedAll runs initial post, downloads, and gallery safely", async () => {
  const inMemoryDb = {
    posts: new Map(),
    downloads: new Map(),
    gallery: new Map(),
  };

  const mockClient = {
    blogPost: {
      findUnique: async ({ where }) => inMemoryDb.posts.get(where.slug) || null,
      create: async ({ data }) => {
        inMemoryDb.posts.set(data.slug, data);
        return data;
      },
    },
    downloadResource: {
      findUnique: async ({ where }) => inMemoryDb.downloads.get(where.id) || null,
      create: async ({ data }) => {
        inMemoryDb.downloads.set(data.id, data);
        return data;
      },
    },
    galleryImage: {
      findUnique: async ({ where }) => inMemoryDb.gallery.get(where.id) || null,
      create: async ({ data }) => {
        inMemoryDb.gallery.set(data.id, data);
        return data;
      },
    },
  };

  const result = await seedAll(mockClient);
  assert.equal(result.downloads.created.length, 2);
  assert.equal(result.gallery.created.length, 7);
  assert.ok(result.post);
});
