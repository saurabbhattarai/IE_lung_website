import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/session";
import { getSubscribersListService } from "@/lib/subscriber/service";
import SubscribersManagementClient from "@/components/admin/subscribers/SubscribersManagementClient";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubscribersAdminPage() {
  await requireAdminSession();

  let initialData: Awaited<ReturnType<typeof getSubscribersListService>> | null =
    null;
  let initialError: string | null = null;

  try {
    initialData = await getSubscribersListService({ page: 1, limit: 20 });
  } catch (err) {
    initialError =
      err instanceof Error
        ? err.message
        : "Failed to load newsletter subscribers.";
  }

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link
              href="/ielung-admin"
              className="hover:text-slate-600 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-slate-600">Subscribers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D4749] tracking-tight">
            Newsletter Subscribers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage patient newsletter subscriptions, view active status, unsubscribe recipients, and export filtered audience lists.
          </p>
        </div>
      </div>

      {/* Interactive Subscribers Management Console */}
      <SubscribersManagementClient
        initialData={initialData}
        initialError={initialError}
      />
    </div>
  );
}
