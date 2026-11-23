import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  FileText,
  FileDown,
  Images,
  Users,
  Plus,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();

  let metrics = {
    blog: { total: 0, published: 0, drafts: 0 },
    downloads: { total: 0, published: 0, newsletters: 0, forms: 0 },
    gallery: { total: 0, published: 0, categories: 0 },
    subscribers: { total: 0, active: 0, unsubscribed: 0 },
  };
  let isDatabaseError = false;

  try {
    const [
      blogTotal,
      blogPublished,
      blogDrafts,
      downloadTotal,
      downloadPublished,
      downloadNewsletters,
      downloadForms,
      galleryTotal,
      galleryPublished,
      galleryCategoryGroups,
      subTotal,
      subActive,
      subUnsub,
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
      prisma.blogPost.count({ where: { status: "DRAFT" } }),
      prisma.downloadResource.count(),
      prisma.downloadResource.count({ where: { status: "PUBLISHED" } }),
      prisma.downloadResource.count({ where: { category: "NEWSLETTER" } }),
      prisma.downloadResource.count({ where: { category: "FORMS" } }),
      prisma.galleryImage.count(),
      prisma.galleryImage.count({ where: { status: "PUBLISHED" } }),
      prisma.galleryImage.groupBy({ by: ["category"], _count: { _all: true } }),
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
      prisma.newsletterSubscriber.count({ where: { status: "UNSUBSCRIBED" } }),
    ]);

    metrics = {
      blog: { total: blogTotal, published: blogPublished, drafts: blogDrafts },
      downloads: {
        total: downloadTotal,
        published: downloadPublished,
        newsletters: downloadNewsletters,
        forms: downloadForms,
      },
      gallery: {
        total: galleryTotal,
        published: galleryPublished,
        categories: galleryCategoryGroups.length,
      },
      subscribers: {
        total: subTotal,
        active: subActive,
        unsubscribed: subUnsub,
      },
    };
  } catch {
    isDatabaseError = true;
  }

  return (
    <div className="space-y-6">
      {/* Restrained Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#3D4749] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational overview of website articles, resources, media, and subscribers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <span className="text-xs text-slate-500 font-mono hidden md:inline">
            {session.email}
          </span>
        </div>
      </div>

      {isDatabaseError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          Metrics temporarily unavailable. System running in safe fallback mode.
        </div>
      )}

      {/* 4 Operational Metric Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Blog Articles */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Blog Articles
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#3D4749]">
              {isDatabaseError ? "—" : metrics.blog.total}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">
                {metrics.blog.published} Published
              </span>
              <span>•</span>
              <span>{metrics.blog.drafts} Drafts</span>
            </div>
          </div>
          <Link
            href="/ielung-admin/blog"
            className="pt-3 border-t border-slate-100 text-xs font-semibold text-[#00A389] hover:text-[#008f78] flex items-center justify-between transition-colors"
          >
            <span>Manage Posts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metric 2: Downloads */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Downloads
            </span>
            <FileDown className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#3D4749]">
              {isDatabaseError ? "—" : metrics.downloads.total}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">
                {metrics.downloads.published} Published
              </span>
              <span>•</span>
              <span>{metrics.downloads.newsletters} Newsletters</span>
            </div>
          </div>
          <Link
            href="/ielung-admin/downloads"
            className="pt-3 border-t border-slate-100 text-xs font-semibold text-[#00A389] hover:text-[#008f78] flex items-center justify-between transition-colors"
          >
            <span>Manage Resources</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metric 3: Gallery */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Gallery Photos
            </span>
            <Images className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#3D4749]">
              {isDatabaseError ? "—" : metrics.gallery.total}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">
                {metrics.gallery.published} Published
              </span>
              <span>•</span>
              <span>{metrics.gallery.categories} Categories</span>
            </div>
          </div>
          <Link
            href="/ielung-admin/gallery"
            className="pt-3 border-t border-slate-100 text-xs font-semibold text-[#00A389] hover:text-[#008f78] flex items-center justify-between transition-colors"
          >
            <span>Manage Photos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metric 4: Newsletter Subscribers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Subscribers
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#3D4749]">
              {isDatabaseError ? "—" : metrics.subscribers.total}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">
                {metrics.subscribers.active} Active
              </span>
              <span>•</span>
              <span>{metrics.subscribers.unsubscribed} Unsubscribed</span>
            </div>
          </div>
          <Link
            href="/ielung-admin/subscribers"
            className="pt-3 border-t border-slate-100 text-xs font-semibold text-[#00A389] hover:text-[#008f78] flex items-center justify-between transition-colors"
          >
            <span>View Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Compact Quick Actions */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#3D4749] uppercase tracking-wider">
            Quick Actions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Shortcuts for common content authoring and publishing workflows
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/ielung-admin/blog/new"
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-[#00A389]/10 hover:border-[#00A389]/30 text-slate-700 hover:text-[#00A389] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:border-[#00A389]/40 flex items-center justify-center text-slate-500 group-hover:text-[#00A389] shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">New Blog Post</span>
          </Link>

          <Link
            href="/ielung-admin/downloads/new"
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-[#00A389]/10 hover:border-[#00A389]/30 text-slate-700 hover:text-[#00A389] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:border-[#00A389]/40 flex items-center justify-center text-slate-500 group-hover:text-[#00A389] shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Add Download</span>
          </Link>

          <Link
            href="/ielung-admin/gallery/new"
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-[#00A389]/10 hover:border-[#00A389]/30 text-slate-700 hover:text-[#00A389] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:border-[#00A389]/40 flex items-center justify-center text-slate-500 group-hover:text-[#00A389] shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Add Gallery Photo</span>
          </Link>

          <Link
            href="/ielung-admin/subscribers"
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-[#00A389]/10 hover:border-[#00A389]/30 text-slate-700 hover:text-[#00A389] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:border-[#00A389]/40 flex items-center justify-center text-slate-500 group-hover:text-[#00A389] shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">View Subscribers</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
