import { z } from "zod";

export const SubscriberStatusFilterEnum = z.enum(["ALL", "ACTIVE", "UNSUBSCRIBED"]);
export type SubscriberStatusFilter = z.infer<typeof SubscriberStatusFilterEnum>;

/**
 * Validation schema for admin subscriber queries (listing, pagination, filter, search).
 */
export const SubscriberQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().trim().optional(),
  status: SubscriberStatusFilterEnum.optional().default("ALL"),
});

export type SubscriberQueryInput = {
  page?: number;
  limit?: number;
  search?: string;
  status?: SubscriberStatusFilter;
};

/**
 * Validation schema for admin unsubscribe action.
 */
export const UnsubscribeSubscriberSchema = z.object({
  id: z
    .string({ required_error: "Subscriber ID is required." })
    .trim()
    .min(1, "Subscriber ID is required."),
});

export type UnsubscribeSubscriberInput = z.infer<typeof UnsubscribeSubscriberSchema>;
