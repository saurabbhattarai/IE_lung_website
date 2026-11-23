import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { calculateReadingTimeMinutes } from "../lib/blog/reading-time.ts";
import { newsletters, clinicalForms } from "../lib/constants/downloadsData.ts";
import { openingDayImages } from "../lib/constants/galleryData.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

export async function seedInitialPost(client = prisma) {
  const seedDataPath = path.resolve(__dirname, "seed-data", "initial-post.json");
  if (!fs.existsSync(seedDataPath)) {
    throw new Error(`Seed data file not found at ${seedDataPath}`);
  }

  const rawData = fs.readFileSync(seedDataPath, "utf-8");
  const postData = JSON.parse(rawData);

  // Calculate reading time dynamically from Tiptap content
  const dynamicReadingTime = calculateReadingTimeMinutes(postData.content);

  // Check if article already exists by unique slug
  const existing = await client.blogPost.findUnique({
    where: { slug: postData.slug },
  });

  if (existing) {
    console.log(
      `[SEED] Blog post with slug "${postData.slug}" already exists (ID: ${existing.id}). Skipping insertion.`
    );
    return { status: "skipped", post: existing };
  }

  const created = await client.blogPost.create({
    data: {
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      coverImage: postData.coverImage || null,
      coverImagePublicId: postData.coverImagePublicId || null,
      author: postData.author || "Inland Empire Lung & Sleep Institute",
      readingTimeMinutes: dynamicReadingTime,
      status: postData.status || "PUBLISHED",
      publishedAt: postData.publishedAt
        ? new Date(postData.publishedAt)
        : new Date("2026-10-28T12:00:00.000Z"),
      faqs: postData.faqs || null,
      showDoctorsSection: Boolean(postData.showDoctorsSection),
      doctorSpecialtyOverrides: postData.doctorSpecialtyOverrides || null,
    },
  });

  console.log(
    `[SEED] Successfully migrated blog post "${created.title}" (ID: ${created.id}, Slug: ${created.slug}, Reading time: ${created.readingTimeMinutes} min).`
  );

  return { status: "created", post: created };
}

export async function seedDownloads(client = prisma) {
  const results = { created: [], skipped: [] };

  // 1. Map and seed newsletters
  for (let i = 0; i < newsletters.length; i++) {
    const nl = newsletters[i];
    const existing = await client.downloadResource.findUnique({
      where: { id: nl.id },
    });

    if (existing) {
      console.log(`[SEED] Download resource "${nl.id}" already exists. Skipping.`);
      results.skipped.push(existing);
      continue;
    }

    const created = await client.downloadResource.create({
      data: {
        id: nl.id,
        category: "NEWSLETTER",
        title: nl.title,
        subtitle: nl.subtitle || null,
        issueNumber: typeof nl.issueNumber === "number" ? nl.issueNumber : null,
        edition: nl.edition || null,
        publicationDate: new Date("2026-11-05T00:00:00.000Z"),
        description: nl.description,
        fileUrl: nl.fileUrl,
        filePublicId: null,
        fileSize: nl.fileSize || null,
        pageCount: nl.pageCount || null,
        topics: nl.topics || null,
        featured: Boolean(nl.featured),
        sortOrder: i,
        status: "PUBLISHED",
      },
    });

    console.log(`[SEED] Seeded newsletter "${created.title}" (ID: ${created.id}).`);
    results.created.push(created);
  }

  // 2. Map and seed clinical forms
  for (let i = 0; i < clinicalForms.length; i++) {
    const form = clinicalForms[i];
    const existing = await client.downloadResource.findUnique({
      where: { id: form.id },
    });

    if (existing) {
      console.log(`[SEED] Download resource "${form.id}" already exists. Skipping.`);
      results.skipped.push(existing);
      continue;
    }

    const created = await client.downloadResource.create({
      data: {
        id: form.id,
        category: "FORMS",
        title: form.title,
        subtitle: null,
        issueNumber: null,
        edition: null,
        publicationDate: null,
        description: form.description,
        fileUrl: form.fileUrl,
        filePublicId: null,
        fileSize: form.fileSize || null,
        pageCount: null,
        topics: null,
        featured: false,
        sortOrder: newsletters.length + i,
        status: "PUBLISHED",
      },
    });

    console.log(`[SEED] Seeded clinical form "${created.title}" (ID: ${created.id}).`);
    results.created.push(created);
  }

  return results;
}

export async function seedGallery(client = prisma) {
  const results = { created: [], skipped: [] };

  for (let i = 0; i < openingDayImages.length; i++) {
    const img = openingDayImages[i];
    const existing = await client.galleryImage.findUnique({
      where: { id: img.id },
    });

    if (existing) {
      console.log(`[SEED] Gallery image "${img.id}" already exists. Skipping.`);
      results.skipped.push(existing);
      continue;
    }

    const created = await client.galleryImage.create({
      data: {
        id: img.id,
        title: img.title,
        category: img.category || "Opening Day",
        src: img.src,
        publicId: null,
        alt: img.alt,
        aspect: img.aspect || "landscape",
        sortOrder: i,
        status: "PUBLISHED",
      },
    });

    console.log(`[SEED] Seeded gallery image "${created.title}" (ID: ${created.id}).`);
    results.created.push(created);
  }

  return results;
}

export async function seedAll(client = prisma) {
  const post = await seedInitialPost(client);
  const downloads = await seedDownloads(client);
  const gallery = await seedGallery(client);
  return { post, downloads, gallery };
}

async function main() {
  try {
    await seedAll(prisma);
  } catch (error) {
    console.error("[SEED ERROR] Seeding failed:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run when executed directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
