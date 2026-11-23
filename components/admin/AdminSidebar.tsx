"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "./nav-items";
import LogoutButton from "./LogoutButton";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onNavClick?: () => void;
  className?: string;
}

export default function AdminSidebar({
  onNavClick,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white border-r border-slate-200/80",
        className,
      )}
    >
      {/* Brand Header with Official Logo */}
      <div className="h-20 flex items-center justify-start md:justify-center px-6 md:px-4 border-b border-slate-200/80">
        <Link
          href="/ielung-admin"
          onClick={onNavClick}
          className="flex items-center justify-center hover:opacity-90 transition-opacity py-1"
        >
          <Image
            src="/logo.png"
            alt="Inland Empire Lung & Sleep Institute"
            width={180}
            height={52}
            className="object-contain w-auto h-11 sm:h-12 max-w-[200px]"
            priority
          />
        </Link>
      </div>

      {/* Navigation Section */}
      <nav aria-label="Admin Navigation" className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/ielung-admin"
              ? pathname === "/ielung-admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-[#00A389]/10 text-[#00A389] font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive
                    ? "text-[#00A389]"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Utilities Section */}
      <div className="p-3 border-t border-slate-200/80 space-y-1.5">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <LogoutButton variant="sidebar" />
      </div>
    </aside>
  );
}
