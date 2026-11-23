import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/session";
import { getBlogPostByIdService } from "@/lib/blog/service";
import BlogPostForm from "@/components/admin/blog/BlogPostForm";
import { JSONContent } from "@tiptap/react";
import { ArrowLeft, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  await requireAdminSession();
  const { id } = await params;

  if (!id || typeof id !== "string") {
    notFound();
  }

  let post = null;
  let fetchError: string | null = null;

  try {
    post = await getBlogPostByIdService(id);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load post.";
  }

  if (fetchError || !post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link
            href="/ielung-admin/blog"
            className="hover:text-slate-600 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Blog Posts</span>
          </Link>
          <span>/</span>
          <span className="text-slate-600">Edit Post</span>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#3D4749]">Blog Post Not Found</h2>
          <p className="text-xs text-slate-500">
            {fetchError || `The requested blog post with ID '${id}' was not found or may have been deleted.`}
          </p>
          <Link
            href="/ielung-admin/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00A389] text-white hover:bg-[#00826e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Blog Listing</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D4749] tracking-tight">
            Edit Blog Post
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update clinical content, FAQs, or publishing settings.
          </p>
        </div>

        <Link
          href="/ielung-admin/blog"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to List</span>
        </Link>
      </div>

      {/* Interactive Blog Post Edit Form */}
      <BlogPostForm
        mode="edit"
        initialPost={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content as JSONContent,
          coverImage: post.coverImage,
          coverImagePublicId: post.coverImagePublicId,
          author: post.author,
          status: post.status as "DRAFT" | "PUBLISHED",
          publishedAt: post.publishedAt,
          readingTimeMinutes: post.readingTimeMinutes,
          showDoctorsSection: post.showDoctorsSection,
          doctorSpecialtyOverrides: post.doctorSpecialtyOverrides as Record<string, string> | null,
          faqs: post.faqs as Array<{ question: string; answer: string }> | null,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        }}
      />
    </div>
  );
}
