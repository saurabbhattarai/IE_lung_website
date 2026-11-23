import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/session";
import BlogPostForm from "@/components/admin/blog/BlogPostForm";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D4749] tracking-tight">
            Create Blog Post
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author and draft a new clinical article or health notice for Inland Empire Lung & Sleep Institute.
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

      {/* Interactive Blog Post Creation Form */}
      <BlogPostForm mode="create" />
    </div>
  );
}
