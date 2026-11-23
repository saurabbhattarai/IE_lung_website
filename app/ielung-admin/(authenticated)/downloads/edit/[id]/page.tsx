import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/session";
import { getDownloadByIdService } from "@/lib/downloads/service";
import DownloadForm from "@/components/admin/downloads/DownloadForm";
import { ArrowLeft, AlertCircle } from "lucide-react";
import type { DownloadFormData } from "@/components/admin/downloads/DownloadForm";

export const dynamic = "force-dynamic";

interface EditDownloadPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDownloadPage({
  params,
}: EditDownloadPageProps) {
  await requireAdminSession();
  const { id } = await params;

  if (!id || typeof id !== "string") {
    notFound();
  }

  let item = null;
  let fetchError: string | null = null;

  try {
    item = await getDownloadByIdService(id);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load resource.";
  }

  if (!item && !fetchError) {
    notFound();
  }

  if (fetchError || !item) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/ielung-admin/downloads"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A389] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Downloads
        </Link>
        <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 space-y-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <h2 className="text-lg font-bold">Resource Not Found</h2>
          </div>
          <p className="text-sm text-rose-700">
            {fetchError || "The requested download resource does not exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  const formData: DownloadFormData = {
    id: item.id,
    category: item.category as DownloadFormData["category"],
    title: item.title,
    subtitle: item.subtitle,
    issueNumber: item.issueNumber,
    edition: item.edition,
    publicationDate: item.publicationDate,
    description: item.description,
    fileUrl: item.fileUrl,
    filePublicId: item.filePublicId,
    fileSize: item.fileSize,
    pageCount: item.pageCount,
    topics: Array.isArray(item.topics) ? (item.topics as string[]) : null,
    featured: item.featured,
    sortOrder: item.sortOrder,
    status: item.status as DownloadFormData["status"],
  };

  return <DownloadForm initialData={formData} isEdit={true} />;
}
