import {
  LayoutDashboard,
  FileText,
  Users,
  FileDown,
  Images,
  LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
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
  },
  {
    title: "Downloads",
    href: "/ielung-admin/downloads",
    icon: FileDown,
  },
  {
    title: "Gallery",
    href: "/ielung-admin/gallery",
    icon: Images,
  },
  {
    title: "Subscribers",
    href: "/ielung-admin/subscribers",
    icon: Users,
  },
];
