import { requireAdminSession } from "@/lib/auth/session";
import GalleryForm from "@/components/admin/gallery/GalleryForm";

export const dynamic = "force-dynamic";

export default async function NewGalleryPage() {
  await requireAdminSession();

  return <GalleryForm isEdit={false} />;
}
