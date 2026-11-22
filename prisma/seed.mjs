import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { calculateReadingTimeMinutes } from "../lib/blog/reading-time.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

export async function seedInitialPost() {
  const seedDataPath = path.resolve(__dirname, "seed-data", "initial-post.json");
  if (!fs.existsSync(seedDataPath)) {
    throw new Error(`Seed data file not found at ${seedDataPath}`);
  }

  const rawData = fs.readFileSync(seedDataPath, "utf-8");
  const postData = JSON.parse(rawData);

  // Calculate reading time dynamically from Tiptap content
  const dynamicReadingTime = calculateReadingTimeMinutes(postData.content);

  // Check if article already exists by unique slug
  const existing = await prisma.blogPost.findUnique({
    where: { slug: postData.slug },
  });

  if (existing) {
    console.log(
      `[SEED] Blog post with slug "${postData.slug}" already exists (ID: ${existing.id}). Skipping insertion.`
    );
    return { status: "skipped", post: existing };
  }

  const created = await prisma.blogPost.create({
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

async function main() {
  try {
    await seedInitialPost();
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
