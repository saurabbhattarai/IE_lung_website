import { NextRequest, NextResponse } from "next/server";
import { SubscribeNewsletterSchema } from "@/lib/validations/newsletter.validation";
import { subscribeNewsletterService } from "@/lib/newsletter/service";

interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

const subscriptionAttempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export function resetNewsletterRateLimit(): void {
  subscriptionAttempts.clear();
}

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown-client";
}

export function checkNewsletterRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = subscriptionAttempts.get(ip);

  if (!entry) {
    subscriptionAttempts.set(ip, { attempts: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (now > entry.resetAt) {
    subscriptionAttempts.set(ip, { attempts: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.attempts += 1;
  return { allowed: true };
}

/**
 * Validates request origin/referer to prevent cross-site request forgery.
 */
export function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    const referer = request.headers.get("referer");
    if (referer && host) {
      try {
        const refererUrl = new URL(referer);
        return refererUrl.host === host;
      } catch {
        return false;
      }
    }
    return true;
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  // 1. Origin validation
  if (!isValidOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Invalid request origin." },
      { status: 403 }
    );
  }

  // 2. IP-based abuse prevention / rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkNewsletterRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many subscription attempts. Please try again in ${Math.ceil(
          (rateLimit.retryAfterSeconds || 60) / 60
        )} minutes.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds || 600),
        },
      }
    );
  }

  // 3. Payload parsing & Zod schema validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const parsed = SubscribeNewsletterSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstErrorMessage =
      fieldErrors.email?.[0] ||
      fieldErrors.consent?.[0] ||
      "Validation failed. Please verify your email and consent.";

    return NextResponse.json(
      {
        success: false,
        error: firstErrorMessage,
        fieldErrors,
      },
      { status: 400 }
    );
  }

  // 4. Persistence with enumeration prevention
  try {
    const result = await subscribeNewsletterService(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to process subscription at this time.",
      },
      { status: 500 }
    );
  }
}
