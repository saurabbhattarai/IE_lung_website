"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, ExternalLink } from "lucide-react";
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
        "flex flex-col h-full bg-white border-r border-slate-200",
        className,
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200/80 gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#00A389]/15 text-[#00A389] flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-[#3D4749] tracking-tight">
            IE Lung Admin
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Management Portal
          </span>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
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
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-[#00A389]/10 text-[#00A389] font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-[#00A389]"
                      : "text-slate-400 group-hover:text-slate-600",
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    isActive
                      ? "bg-[#00A389]/20 text-[#00A389] border-[#00A389]/30"
                      : "bg-slate-100 text-slate-500 border-slate-200",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Utilities Section */}
      <div className="p-3 border-t border-slate-200/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-slate-400" />
          <span>View Public Site</span>
        </Link>
        <LogoutButton variant="sidebar" />
      </div>
    </aside>
  );
}
