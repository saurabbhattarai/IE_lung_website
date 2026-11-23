import { requireAdminSession } from "@/lib/auth/session";
import { getSubscribersListService } from "@/lib/subscriber/service";
import SubscribersManagementClient from "@/components/admin/subscribers/SubscribersManagementClient";

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
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
