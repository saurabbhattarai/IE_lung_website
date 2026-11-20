import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/session";
import { ArrowLeft, Clock, FilePlus, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPlaceholderPage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link
              href="/ielung-admin"
              className="hover:text-slate-600 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <Link
              href="/ielung-admin/blog"
              className="hover:text-slate-600 transition-colors"
            >
              Blog Posts
            </Link>
            <span>/</span>
            <span className="text-slate-600">New Post</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D4749] tracking-tight">
            Create Blog Post
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author and draft a new clinical article or health notice.
          </p>
        </div>
      </div>

      {/* Placeholder State Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-6 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#00A389]/10 text-[#00A389] flex items-center justify-center mx-auto shadow-xs">
          <FilePlus className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A389]/10 text-[#00A389] text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Scheduled for Phase 4D.3</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#3D4749]">
            Blog Creation Form Under Development
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            The post creation form with Tiptap WYSIWYG rich text, Cloudinary image upload, FAQ builder, and doctor assignment will be integrated in Phase 4D.3.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/ielung-admin/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog Posts</span>
          </Link>
          <div className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-[#00A389]" />
            <span>Blog CMS Backend & Listing Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
