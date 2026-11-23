import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getSubscriberExportDataService } from "@/lib/subscriber/service";
import { generateSubscribersCsv } from "@/lib/subscriber/csv";
import { SubscriberQuerySchema } from "@/lib/validations/subscriber.validation";

export const dynamic = "force-dynamic";

/**
 * Admin API: Authenticated CSV export of newsletter subscribers.
 * Exports all records matching active search and status filters (not restricted by pagination).
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Enforce admin authentication
    await requireAdminSession();
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const rawStatus = searchParams.get("status") || "ALL";

    const parsed = SubscriberQuerySchema.safeParse({
      search,
      status: rawStatus,
    });

    const status = parsed.success ? parsed.data.status : "ALL";
    const searchQuery = parsed.success ? parsed.data.search : undefined;

    // 2. Fetch all matching records across all pages
    const subscribers = await getSubscriberExportDataService({
      search: searchQuery,
      status,
    });

    // 3. Generate sanitized, RFC 4180-compliant UTF-8 CSV with formula injection defense
    const csvContent = generateSubscribersCsv(subscribers);

    // 4. Build response with date-stamped filename
    const today = new Date().toISOString().split("T")[0];
    const filename = `ielung-newsletter-subscribers-${today}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error(
      "[ADMIN SUBSCRIBER EXPORT ERROR]:",
      error instanceof Error ? error.message : "Internal error"
    );
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate subscriber CSV export.",
      },
      { status: 500 }
    );
  }
}
