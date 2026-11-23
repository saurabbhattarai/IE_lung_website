import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/session";
import { getGalleryImageByIdService } from "@/lib/gallery/service";
import GalleryForm from "@/components/admin/gallery/GalleryForm";
import { ArrowLeft, AlertCircle } from "lucide-react";
import type { GalleryFormData } from "@/components/admin/gallery/GalleryForm";

export const dynamic = "force-dynamic";

interface EditGalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryPage({
  params,
}: EditGalleryPageProps) {
  await requireAdminSession();
  const { id } = await params;

  if (!id || typeof id !== "string") {
    notFound();
  }

  let item = null;
  let fetchError: string | null = null;

  try {
    item = await getGalleryImageByIdService(id);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load image.";
  }

  if (!item && !fetchError) {
    notFound();
  }

  if (fetchError || !item) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/ielung-admin/gallery"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A389] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Gallery
        </Link>
        <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 space-y-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <h2 className="text-lg font-bold">Image Not Found</h2>
          </div>
          <p className="text-sm leading-relaxed">
            {fetchError || "The requested gallery image could not be found."}
          </p>
        </div>
      </div>
    );
  }

  const formData: GalleryFormData = {
    id: item.id,
    title: item.title,
    category: item.category,
    src: item.src,
    publicId: item.publicId,
    alt: item.alt,
    aspect: item.aspect,
    sortOrder: item.sortOrder,
    status: item.status as "DRAFT" | "PUBLISHED",
  };

  return <GalleryForm initialData={formData} isEdit={true} />;
}
