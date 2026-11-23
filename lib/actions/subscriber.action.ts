"use server";

import { requireAdminSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import {
  SubscriberQuerySchema,
  UnsubscribeSubscriberSchema,
} from "@/lib/validations/subscriber.validation";
import {
  getSubscribersListService,
  unsubscribeSubscriberService,
  getSubscriberStatsService,
} from "@/lib/subscriber/service";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Server Action: Retrieves paginated subscribers list with search and status filtering.
 * Requires an active, authenticated admin session.
 */
export async function getSubscribersListAction(
  rawQuery?: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const parsed = SubscriberQuerySchema.safeParse(rawQuery || {});
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid query parameters.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = await getSubscribersListService(parsed.data);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to load subscribers.",
    };
  }
}

/**
 * Server Action: Unsubscribes an ACTIVE subscriber.
 * Sets status = UNSUBSCRIBED and records unsubscribedAt.
 * Requires an active, authenticated admin session.
 */
export async function unsubscribeSubscriberAction(
  rawInput: unknown
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const payload =
      typeof rawInput === "string" ? { id: rawInput } : rawInput;

    const parsed = UnsubscribeSubscriberSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: "Valid subscriber ID is required.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const updated = await unsubscribeSubscriberService(parsed.data.id);

    // Revalidate affected admin consoles
    revalidatePath("/ielung-admin/subscribers");
    revalidatePath("/ielung-admin");

    return {
      success: true,
      data: updated,
      message: `Successfully unsubscribed ${updated.email}.`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to unsubscribe subscriber.",
    };
  }
}

/**
 * Server Action: Retrieves subscriber statistics for the admin dashboard.
 * Requires an active, authenticated admin session.
 */
export async function getSubscriberStatsAction(): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const stats = await getSubscriberStatsService();
    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load subscriber statistics.",
    };
  }
}
