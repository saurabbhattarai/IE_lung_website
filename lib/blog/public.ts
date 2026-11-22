import "server-only";
import { prisma } from "../prisma";

export interface PublicBlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  readingTimeMinutes: number;
  publishedAt: Date | null;
}

export interface GetPublicBlogPostsResult {
  posts: PublicBlogPostSummary[];
  error?: string;
}

export interface PublicArticleFaq {
  question: string;
  answer: string;
}

export interface PublicArticleDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  coverImage: string | null;
  author: string;
  readingTimeMinutes: number;
  publishedAt: Date | null;
  showDoctorsSection: boolean;
  doctorSpecialtyOverrides: Record<string, string> | null;
  faqs: PublicArticleFaq[] | null;
}

export interface PublicArticleMetadataResult {
  title: string;
  description?: string;
  alternates?: {
    canonical: string;
  };
  openGraph?: {
    title: string;
    description?: string;
    url: string;
    type: string;
    publishedTime?: string;
    authors?: string[];
    images?: Array<{ url: string; alt?: string }>;
  };
}

/**
 * Formats a publication date into the standard public blog display format.
 * E.g., 'October 28, 2026'.
 * Handles null, undefined, or invalid dates safely without throwing.
 */
export function formatPublicDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return "";
  }
}

/**
 * Formats reading time minutes into the public label string.
 * E.g., '3 min read'.
 */
export function formatReadingTime(minutes: number | null | undefined): string {
  const mins = typeof minutes === "number" && minutes > 0 ? minutes : 1;
  return `${mins} min read`;
}

/**
 * Builds schema.org FAQPage structured data from article FAQs.
 */
export function buildFaqJsonLd(faqs: PublicArticleFaq[] | null | undefined) {
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Server-only data access function for the public blog listing.
 * - Queries ONLY posts with status: 'PUBLISHED'.
 * - Orders by publishedAt descending (with createdAt as secondary sort).
 * - Selects ONLY fields required for public display (excludes content, faqs, doctor overrides, etc.).
 * - Gracefully catches database errors without exposing technical internals.
 */
export async function getPublicBlogPosts(): Promise<GetPublicBlogPostsResult> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        readingTimeMinutes: true,
        publishedAt: true,
      },
    });

    return { posts };
  } catch (error) {
    console.error(
      "[PUBLIC BLOG ERROR] Failed to fetch public blog posts:",
      error instanceof Error ? error.message : "Database error"
    );
    return {
      posts: [],
      error: "Unable to load articles at this time. Please check back later.",
    };
  }
}

/**
 * Server-only data access function for an individual public blog article.
 * - Queries BlogPost by unique slug.
 * - STRICTLY enforces status === 'PUBLISHED'.
 * - Returns null for non-existent or DRAFT posts.
 * - Catches database errors gracefully without leaking internals.
 */
export async function getPublicBlogPostBySlug(
  slug: string
): Promise<PublicArticleDetail | null> {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug: slug.trim(),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        author: true,
        readingTimeMinutes: true,
        status: true,
        publishedAt: true,
        showDoctorsSection: true,
        doctorSpecialtyOverrides: true,
        faqs: true,
      },
    });

    if (!post || post.status !== "PUBLISHED") {
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      author: post.author,
      readingTimeMinutes: post.readingTimeMinutes,
      publishedAt: post.publishedAt,
      showDoctorsSection: post.showDoctorsSection,
      doctorSpecialtyOverrides: post.doctorSpecialtyOverrides as Record<string, string> | null,
      faqs: (post.faqs as unknown as PublicArticleFaq[]) || null,
    };
  } catch (error) {
    console.error(
      `[PUBLIC BLOG ERROR] Failed to fetch article by slug '${slug}':`,
      error instanceof Error ? error.message : "Database error"
    );
    return null;
  }
}

/**
 * Generates SEO metadata for dynamic public blog article routes.
 */
export async function getPublicBlogMetadata(
  slug: string
): Promise<PublicArticleMetadataResult> {
  const post = await getPublicBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | IE Lung",
      description: "The requested article could not be found.",
    };
  }

  const canonicalUrl = `https://ielung.com/blog/${post.slug}`;
  const coverImage = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `https://ielung.com${post.coverImage}`
    : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author || "Inland Empire Lung & Sleep Institute"],
      images: coverImage
        ? [
            {
              url: coverImage,
              alt: post.title,
            },
          ]
        : undefined,
    },
  };
}
