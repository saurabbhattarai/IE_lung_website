import { requireAdminSession } from "@/lib/auth/session";
import DownloadForm from "@/components/admin/downloads/DownloadForm";

export const dynamic = "force-dynamic";

export default async function NewDownloadPage() {
  await requireAdminSession();

  return <DownloadForm isEdit={false} />;
}
