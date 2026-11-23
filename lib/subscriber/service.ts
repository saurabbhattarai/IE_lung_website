import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type {
  SubscriberQueryInput,
  SubscriberStatusFilter,
} from "@/lib/validations/subscriber.validation";

export interface SubscriberListItem {
  id: string;
  email: string;
  status: "ACTIVE" | "UNSUBSCRIBED";
  subscribedAt: Date;
  unsubscribedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriberListResult {
  subscribers: SubscriberListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubscriberStatsResult {
  total: number;
  active: number;
  unsubscribed: number;
}

/**
 * Builds Prisma where input based on search and status filters.
 */
function buildSubscriberWhereClause(
  search?: string,
  status?: SubscriberStatusFilter
): Prisma.NewsletterSubscriberWhereInput {
  const where: Prisma.NewsletterSubscriberWhereInput = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (search && search.trim().length > 0) {
    where.email = {
      contains: search.trim(),
    };
  }

  return where;
}

/**
 * Retrieves paginated list of subscribers for the admin management console.
 * Uses selective field queries to minimize database overhead.
 */
export async function getSubscribersListService(
  query: SubscriberQueryInput
): Promise<SubscriberListResult> {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;

  const where = buildSubscriberWhereClause(query.search, query.status);

  const [subscribers, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ subscribedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        email: true,
        status: true,
        subscribedAt: true,
        unsubscribedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.newsletterSubscriber.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    subscribers: subscribers as SubscriberListItem[],
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Unsubscribes an ACTIVE subscriber.
 *
 * Rules:
 * 1. Subscriber must exist in the database.
 * 2. Only transitions from ACTIVE to UNSUBSCRIBED.
 * 3. Sets status = UNSUBSCRIBED and unsubscribedAt = new Date().
 * 4. Preserves subscribedAt and createdAt intact.
 * 5. Safely rejects repeated unsubscribe requests if already UNSUBSCRIBED.
 * 6. Never deletes records.
 */
export async function unsubscribeSubscriberService(
  id: string
): Promise<SubscriberListItem> {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    throw new Error("A valid subscriber ID is required.");
  }

  const normalizedId = id.trim();

  // 1. Atomic conditional update: executes only if id matches AND current status is ACTIVE
  const updateResult = await prisma.newsletterSubscriber.updateMany({
    where: {
      id: normalizedId,
      status: "ACTIVE",
    },
    data: {
      status: "UNSUBSCRIBED",
      unsubscribedAt: new Date(),
    },
  });

  // 2. If 0 records were updated, check if record does not exist or was already unsubscribed
  if (updateResult.count === 0) {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { id: normalizedId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existing) {
      throw new Error("Subscriber record not found.");
    }

    if (existing.status === "UNSUBSCRIBED") {
      throw new Error("This subscriber is already unsubscribed.");
    }

    throw new Error("Unable to unsubscribe subscriber at this time.");
  }

  // 3. Return the updated record (with original subscribedAt and createdAt preserved)
  const updated = await prisma.newsletterSubscriber.findUniqueOrThrow({
    where: { id: normalizedId },
    select: {
      id: true,
      email: true,
      status: true,
      subscribedAt: true,
      unsubscribedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updated as SubscriberListItem;
}

/**
 * Retrieves all subscriber records matching the active filter and search query
 * for full CSV export (not restricted by pagination).
 */
export async function getSubscriberExportDataService(filter: {
  search?: string;
  status?: SubscriberStatusFilter;
}): Promise<SubscriberListItem[]> {
  const where = buildSubscriberWhereClause(filter.search, filter.status);

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where,
    orderBy: [{ subscribedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      email: true,
      status: true,
      subscribedAt: true,
      unsubscribedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return subscribers as SubscriberListItem[];
}

/**
 * Retrieves subscriber audience aggregate metrics for the admin dashboard.
 */
export async function getSubscriberStatsService(): Promise<SubscriberStatsResult> {
  const [total, active, unsubscribed] = await Promise.all([
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
    prisma.newsletterSubscriber.count({ where: { status: "UNSUBSCRIBED" } }),
  ]);

  return { total, active, unsubscribed };
}
