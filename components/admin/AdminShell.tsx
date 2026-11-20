"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import MobileNav from "./MobileNav";

interface AdminShellProps {
  adminEmail: string;
  children: React.ReactNode;
}

export default function AdminShell({ adminEmail, children }: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 z-30">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <AdminHeader
          adminEmail={adminEmail}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
