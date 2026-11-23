import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/session";
import { getBlogPostsListAction } from "@/lib/actions/blog.action";
import BlogManagementClient, { BlogPostItem } from "@/components/admin/blog/BlogManagementClient";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  await requireAdminSession();

  let initialData: {
    posts: BlogPostItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null = null;
  let initialError: string | null = null;

  try {
    const result = await getBlogPostsListAction({ page: 1, limit: 10 });
    if (result.success) {
      initialData = result.data as {
        posts: BlogPostItem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    } else {
      initialError = result.error || "Failed to load blog posts.";
    }
  } catch (err) {
    initialError =
      err instanceof Error ? err.message : "Failed to load blog posts.";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D4749] tracking-tight">
            Blog Articles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage, draft, and publish clinical articles for Inland Empire Lung & Sleep Institute.
          </p>
        </div>

        <Link
          href="/ielung-admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#00A389] hover:bg-[#00826e] text-white transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </Link>
      </div>

      {/* Interactive Blog Posts Management Client */}
      <BlogManagementClient
        initialData={initialData}
        initialError={initialError}
      />
    </div>
  );
}
