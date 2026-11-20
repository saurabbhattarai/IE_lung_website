import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations/auth.validation";
import { verifyPassword } from "@/lib/auth/password";
import { signAdminToken } from "@/lib/auth/jwt";
import {
  getAdminCredentials,
  setAdminSessionCookie,
} from "@/lib/auth/session";

// In-memory rate limiter for login attempts (IP-based)
// Note: For multi-instance/serverless production deployments, an external store
// (such as Redis / Upstash) should be used so state is shared across containers.
interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown-client";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) {
    return { allowed: true };
  }

  if (now > entry.resetAt) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { attempts: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.attempts += 1;
  }
}

function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Validates that the request origin matches the host header to guard against cross-site request forgery.
 */
function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    // If running in same-origin context where browsers omit Origin for same-origin fetch, check referer
    const referer = request.headers.get("referer");
    if (referer) {
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
  if (!isValidOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }

  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Please try again in ${Math.ceil(
          (rateLimit.retryAfterSeconds || 60) / 60,
        )} minutes.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds || 900),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request format." },
      { status: 400 },
    );
  }

  const parseResult = LoginSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid email or password format." },
      { status: 400 },
    );
  }

  const { email, password } = parseResult.data;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { email: configuredEmail, passwordHash: configuredPasswordHash } =
      getAdminCredentials();

    const isEmailValid = normalizedEmail === configuredEmail;
    const isPasswordValid = isEmailValid
      ? await verifyPassword(password, configuredPasswordHash)
      : false;

    if (!isEmailValid || !isPasswordValid) {
      recordFailedAttempt(clientIp);
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // Login successful
    resetRateLimit(clientIp);
    const token = await signAdminToken(configuredEmail);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
    });

    setAdminSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("ADMIN_AUTH_ERROR:", error);
    return NextResponse.json(
      { error: "Server authentication configuration error." },
      { status: 500 },
    );
  }
}
