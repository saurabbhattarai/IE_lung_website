import { LayoutDashboard, FileText, Users, FileDown, Images, LucideIcon } from "lucide-react";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "accent";
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    title: "Dashboard",
    href: "/ielung-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Blog Posts",
    href: "/ielung-admin/blog",
    icon: FileText,
    badge: "Phase 4",
    badgeVariant: "accent",
  },
  {
    title: "Downloads",
    href: "/ielung-admin/downloads",
    icon: FileDown,
    badge: "Phase 4H",
    badgeVariant: "accent",
  },
  {
    title: "Gallery",
    href: "/ielung-admin/gallery",
    icon: Images,
    badge: "Phase 4H",
    badgeVariant: "accent",
  },
  {
    title: "Subscribers",
    href: "/ielung-admin/subscribers",
    icon: Users,
    badge: "Phase 6",
    badgeVariant: "secondary",
  },
];
