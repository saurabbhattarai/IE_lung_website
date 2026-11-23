import { requireAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import GalleryListClient, {
  GalleryListItem,
} from "@/components/admin/gallery/GalleryListClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAdminSession();

  let items: GalleryListItem[] = [];
  let stats = {
    total: 0,
    published: 0,
    drafts: 0,
    categories: [] as { name: string; count: number }[],
  };

  try {
    const [fetchedItems, total, published, drafts, categoryGroups] =
      await Promise.all([
        prisma.galleryImage.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
        prisma.galleryImage.count(),
        prisma.galleryImage.count({ where: { status: "PUBLISHED" } }),
        prisma.galleryImage.count({ where: { status: "DRAFT" } }),
        prisma.galleryImage.groupBy({
          by: ["category"],
          _count: { _all: true },
        }),
      ]);

    items = fetchedItems as unknown as GalleryListItem[];
    stats = {
      total,
      published,
      drafts,
      categories: categoryGroups.map((g) => ({
        name: g.category,
        count: g._count._all,
      })),
    };
  } catch (err) {
    console.error("[ADMIN GALLERY] Failed to fetch items:", err);
  }

  return <GalleryListClient initialItems={items} initialStats={stats} />;
}
