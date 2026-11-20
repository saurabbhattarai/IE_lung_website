import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
} from "./constants";
import { verifyAdminToken, type AdminTokenPayload } from "./jwt";

/**
 * Validates that configured environment variables for admin authentication exist.
 */
export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !passwordHash) {
    throw new Error(
      "CRITICAL: ADMIN_EMAIL or ADMIN_PASSWORD_HASH environment variable is not configured.",
    );
  }

  return {
    email: email.trim().toLowerCase(),
    passwordHash: passwordHash.trim(),
  };
}

/**
 * Retrieves and validates the current admin session from incoming cookies.
 * Returns the verified token payload if valid and matching ADMIN_EMAIL, otherwise null.
 */
export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyAdminToken(token);
    if (!payload) {
      return null;
    }

    const { email: configuredEmail } = getAdminCredentials();
    if (payload.email !== configuredEmail) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Server-side authorization check (Defense-in-depth).
 * Must be called at the beginning of every sensitive admin Server Action or Route Handler.
 * Throws an Error if unauthenticated or unauthorized.
 */
export async function requireAdminSession(): Promise<AdminTokenPayload> {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("UNAUTHORIZED: A valid admin session is required.");
  }

  return session;
}

/**
 * Sets the HttpOnly admin session cookie on an outgoing NextResponse.
 */
export function setAdminSessionCookie(
  response: NextResponse,
  token: string,
): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
}

/**
 * Clears the admin session cookie on an outgoing NextResponse using matching attributes.
 */
export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
