"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import AdminSidebar from "./AdminSidebar";

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileNav({ isOpen, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-72 sm:w-80">
        <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
        <AdminSidebar onNavClick={() => onOpenChange(false)} className="border-r-0" />
      </SheetContent>
    </Sheet>
  );
}
