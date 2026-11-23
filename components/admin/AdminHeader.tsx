"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";

interface AdminHeaderProps {
  adminEmail: string;
  onOpenMobileNav: () => void;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isLast: boolean;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  if (pathname === "/ielung-admin" || pathname === "/ielung-admin/") {
    return [{ label: "Dashboard", href: "/ielung-admin", isLast: true }];
  }

  const crumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/ielung-admin", isLast: false },
  ];

  const segments = pathname
    .replace(/^\/ielung-admin\/?/, "")
    .split("/")
    .filter(Boolean);

  const section = segments[0];
  const action = segments[1];

  if (section === "blog") {
    if (segments.length === 1) {
      crumbs.push({ label: "Blog Posts", isLast: true });
    } else {
      crumbs.push({ label: "Blog Posts", href: "/ielung-admin/blog", isLast: false });
      if (action === "new") {
        crumbs.push({ label: "New Article", isLast: true });
      } else if (action === "edit") {
        crumbs.push({ label: "Edit Article", isLast: true });
      } else {
        crumbs.push({ label: action, isLast: true });
      }
    }
  } else if (section === "downloads") {
    if (segments.length === 1) {
      crumbs.push({ label: "Downloads", isLast: true });
    } else {
      crumbs.push({ label: "Downloads", href: "/ielung-admin/downloads", isLast: false });
      if (action === "new") {
        crumbs.push({ label: "New Resource", isLast: true });
      } else if (action === "edit") {
        crumbs.push({ label: "Edit Resource", isLast: true });
      } else {
        crumbs.push({ label: action, isLast: true });
      }
    }
  } else if (section === "gallery") {
    if (segments.length === 1) {
      crumbs.push({ label: "Gallery", isLast: true });
    } else {
      crumbs.push({ label: "Gallery", href: "/ielung-admin/gallery", isLast: false });
      if (action === "new") {
        crumbs.push({ label: "Add Photo", isLast: true });
      } else if (action === "edit") {
        crumbs.push({ label: "Edit Photo", isLast: true });
      } else {
        crumbs.push({ label: action, isLast: true });
      }
    }
  } else if (section === "subscribers") {
    crumbs.push({ label: "Subscribers", isLast: true });
  } else if (section) {
    const formatted = section.charAt(0).toUpperCase() + section.slice(1);
    crumbs.push({ label: formatted, isLast: true });
  }

  return crumbs;
}

export default function AdminHeader({
  adminEmail,
  onOpenMobileNav,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  // Extract initial for clean avatar display
  const initial = adminEmail ? adminEmail.charAt(0).toUpperCase() : "A";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 md:px-8 backdrop-blur transition-all">
      {/* Left: Mobile menu button & Dynamic Breadcrumb Navigation */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm overflow-hidden">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap min-w-0">
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              {crumb.isLast ? (
                <span className="font-semibold text-slate-800 truncate">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href || "/ielung-admin"}
                  className="font-medium text-slate-500 hover:text-[#00A389] transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right: Authenticated User Pill (Sign-out is kept in the sidebar) */}
      <div className="flex items-center gap-3 shrink-0 ml-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
          <div className="w-6 h-6 rounded-full bg-[#00A389] text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {initial}
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px] sm:max-w-[200px]">
            {adminEmail}
          </span>
        </div>
      </div>
    </header>
  );
}
