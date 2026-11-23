import "server-only";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import type { SubscribeNewsletterInput } from "../validations/newsletter.validation";

export interface SubscribeResult {
  success: boolean;
  message: string;
}

export const GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE =
  "Thank you for subscribing! You are now signed up for our newsletter.";

/**
 * Subscribes an email to the public newsletter.
 *
 * Rules:
 * 1. Email is normalized to lowercase and trimmed.
 * 2. If new email: creates record with ACTIVE status.
 * 3. If existing UNSUBSCRIBED: reactivates to ACTIVE with fresh subscribedAt timestamp and clears unsubscribedAt.
 * 4. If existing ACTIVE: returns generic success without creating duplicates.
 * 5. Handles P2002 unique constraint race conditions safely.
 * 6. Enumeration prevention: always returns identical generic success message.
 */
export async function subscribeNewsletterService(
  input: SubscribeNewsletterInput
): Promise<SubscribeResult> {
  const normalizedEmail = input.email.trim().toLowerCase();

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existing) {
      // Create new active subscription
      await prisma.newsletterSubscriber.create({
        data: {
          email: normalizedEmail,
          status: "ACTIVE",
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      });
    } else if (existing.status === "UNSUBSCRIBED") {
      // Reactivate previously unsubscribed subscriber upon explicit consent
      await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          status: "ACTIVE",
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      });
    }
    // If existing and already ACTIVE, preserve existing record without modification

    return {
      success: true,
      message: GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE,
    };
  } catch (error) {
    // Handle concurrent unique constraint collision gracefully
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: true,
        message: GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE,
      };
    }

    console.error(
      "[NEWSLETTER SUBSCRIPTION ERROR] Failed to subscribe:",
      error instanceof Error ? error.message : "Database error"
    );
    throw new Error("Unable to complete subscription at this time. Please try again later.");
  }
}
