import { ReactNode } from "react";
import { requireAdminSession } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AuthenticatedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Enforce server-side authorization check (defense-in-depth)
  const session = await requireAdminSession();

  return (
    <AdminShell adminEmail={session.email}>
      {children}
    </AdminShell>
  );
}
