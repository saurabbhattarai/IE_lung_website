import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/session";
import {
  FileText,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#00A389]/10 via-[#00A389]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A389]/10 text-[#00A389] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 3: Shell & Navigation Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#3D4749] tracking-tight">
              Welcome back, Administrator
            </h1>
            <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
              Inland Empire Lung & Sleep Institute Content Management System. Monitor your blog articles, manage newsletter subscribers, and configure website settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-medium">
              <span className="text-slate-400">Account:</span>{" "}
              <strong className="text-slate-700">{session.email}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Blog Posts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#00A389]/10 text-[#00A389] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Phase 4
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Blog Articles
              </p>
              <h2 className="text-3xl font-extrabold text-[#3D4749] mt-1">
                0
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Rich-text authoring & publishing workflow scheduled for Phase 4.
              </p>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100">
            <Link
              href="/ielung-admin/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A389] hover:text-[#00826e] transition-colors"
            >
              <span>Manage Blog Posts</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 2: Newsletter Subscribers */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Phase 6
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Newsletter Subscribers
              </p>
              <h2 className="text-3xl font-extrabold text-[#3D4749] mt-1">
                0
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Audience list filtering & CSV export scheduled for Phase 6.
              </p>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100">
            <Link
              href="/ielung-admin/subscribers"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>View Subscribers</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 3: Security & Session */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors sm:col-span-2 lg:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Guarded
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Security Infrastructure
              </p>
              <h2 className="text-2xl font-extrabold text-[#3D4749] mt-1">
                Active & Verified
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                JWT HS256 HttpOnly session verified with server-side authorization.
              </p>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Role: <strong className="text-slate-700 uppercase">{session.role}</strong></span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Next.js 16 Proxy
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions & System Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00A389]" />
            <h3 className="font-bold text-[#3D4749] text-base">Quick Shortcuts</h3>
          </div>
          <p className="text-xs text-slate-500">
            Frequently used administrative navigation and portal destinations:
          </p>

          <div className="space-y-2 pt-2">
            <Link
              href="/ielung-admin/blog"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-[#00A389]/10 border border-slate-200/60 hover:border-[#00A389]/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-[#00A389]" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-[#00A389]">
                  Blog Posts Console
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#00A389]" />
            </Link>

            <Link
              href="/ielung-admin/subscribers"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/60 hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600">
                  Subscribers Directory
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all group"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                <span className="text-xs font-semibold text-slate-700">
                  Public Website Preview
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* CMS Architecture Roadmap (2 cols) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00A389]" />
              <h3 className="font-bold text-[#3D4749] text-base">Backend Architecture & Roadmap</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Step 3 of 6</span>
          </div>

          <p className="text-xs text-slate-500">
            Progress of backend engineering milestones for the Inland Empire Lung & Sleep Institute platform:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Phase 1: Database Foundation</span>
              </div>
              <p className="text-emerald-700 text-[11px] leading-relaxed">
                Prisma ORM schema with MySQL BlogPost and NewsletterSubscriber models.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Phase 2: Authentication & Guard</span>
              </div>
              <p className="text-emerald-700 text-[11px] leading-relaxed">
                Next.js 16 proxy.ts route guard, HS256 JWT, bcrypt, and HttpOnly cookies.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#00A389]/10 border border-[#00A389]/30 space-y-1">
              <div className="flex items-center gap-2 text-[#00826e] font-bold">
                <Sparkles className="w-4 h-4 text-[#00A389]" />
                <span>Phase 3: Shell & Navigation</span>
              </div>
              <p className="text-[#00826e] text-[11px] leading-relaxed">
                Active: Responsive sidebar, authenticated header, and mobile navigation.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1 text-slate-500">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Phase 4: Blog CMS (Upcoming)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                CRUD actions, rich-text markdown/WYSIWYG editor, and Cloudinary image uploads.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1 text-slate-500">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Phase 5: Public Blog (Upcoming)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Public post list, dynamic slug pages, and SEO metadata generation.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1 text-slate-500">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Phase 6: Subscribers (Upcoming)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Public newsletter form, subscriber management console, and CSV export.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
