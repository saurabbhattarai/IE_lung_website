"use client";

import { Menu, Shield } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface AdminHeaderProps {
  adminEmail: string;
  onOpenMobileNav: () => void;
}

export default function AdminHeader({
  adminEmail,
  onOpenMobileNav,
}: AdminHeaderProps) {
  // Extract initial for avatar display
  const initial = adminEmail ? adminEmail.charAt(0).toUpperCase() : "A";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-8 backdrop-blur transition-all">
      {/* Left: Mobile hamburger trigger & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:inline-block">
            Console
          </span>
          <span className="text-slate-300 hidden sm:inline-block">/</span>
          <span className="text-sm font-semibold text-slate-700">
            IE Lung Admin Portal
          </span>
        </div>
      </div>

      {/* Right: Authenticated Admin Indicator & Logout */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Admin profile pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
          <div className="w-6 h-6 rounded-full bg-[#00A389] text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {initial}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[150px] sm:max-w-[200px]">
              {adminEmail}
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-none flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-[#00A389]" />
              Administrator
            </span>
          </div>
        </div>

        {/* Header logout action */}
        <LogoutButton variant="header" />
      </div>
    </header>
  );
}
