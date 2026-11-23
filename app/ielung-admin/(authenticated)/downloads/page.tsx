import { requireAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import DownloadsListClient, {
  DownloadResourceItem,
} from "@/components/admin/downloads/DownloadsListClient";

export const dynamic = "force-dynamic";

export default async function AdminDownloadsPage() {
  await requireAdminSession();

  let items: DownloadResourceItem[] = [];
  let stats = {
    total: 0,
    published: 0,
    drafts: 0,
    newsletters: 0,
    forms: 0,
  };

  try {
    const [fetchedItems, total, published, drafts, newsletters, forms] =
      await Promise.all([
        prisma.downloadResource.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
        prisma.downloadResource.count(),
        prisma.downloadResource.count({ where: { status: "PUBLISHED" } }),
        prisma.downloadResource.count({ where: { status: "DRAFT" } }),
        prisma.downloadResource.count({ where: { category: "NEWSLETTER" } }),
        prisma.downloadResource.count({ where: { category: "FORMS" } }),
      ]);

    items = fetchedItems as unknown as DownloadResourceItem[];
    stats = {
      total,
      published,
      drafts,
      newsletters,
      forms,
    };
  } catch (err) {
    console.error("[ADMIN DOWNLOADS] Failed to fetch items:", err);
  }

  return (
    <DownloadsListClient initialItems={items} initialStats={stats} />
  );
}
