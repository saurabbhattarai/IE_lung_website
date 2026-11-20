import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  ADMIN_COOKIE_NAME,
  JWT_ALGORITHM,
  JWT_AUDIENCE,
  JWT_ISSUER,
} from "./lib/auth/constants";

const PUBLIC_ADMIN_PATHS = ["/ielung-admin/login"];

/**
 * Sanitizes return path to prevent open redirect vulnerabilities.
 * Ensures the destination is strictly a relative internal path.
 */
function getSafeReturnPath(pathname: string, search: string): string {
  if (
    pathname.startsWith("/") &&
    !pathname.startsWith("//") &&
    !pathname.includes(":")
  ) {
    return `${pathname}${search}`;
  }
  return "/ielung-admin";
}

/**
 * Next.js 16 Route Proxy & Guard
 * Protects all /ielung-admin/:path* routes while keeping public website untouched.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Only intercept /ielung-admin routes; let all public site routes pass through
  if (!pathname.startsWith("/ielung-admin")) {
    return NextResponse.next();
  }

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.includes(pathname);
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secretEnv = process.env.JWT_SECRET;
  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  let isAuthenticated = false;

  // 2. Validate session token if present
  if (token && secretEnv && secretEnv.length >= 32) {
    try {
      const secretKey = new TextEncoder().encode(secretEnv);
      const { payload } = await jwtVerify(token, secretKey, {
        algorithms: [JWT_ALGORITHM],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });

      if (
        payload.email &&
        payload.email === configuredAdminEmail &&
        payload.role === "admin"
      ) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 3. Unauthenticated access to protected admin route -> redirect to login
  if (!isAuthenticated && !isPublicAdminPath) {
    const loginUrl = new URL("/ielung-admin/login", request.url);
    const safeFrom = getSafeReturnPath(pathname, search);

    // Only set from if it's not the default dashboard
    if (safeFrom !== "/ielung-admin") {
      loginUrl.searchParams.set("from", safeFrom);
    }

    const response = NextResponse.redirect(loginUrl);

    // If an invalid or expired token cookie exists, clear it
    if (token) {
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

    return response;
  }

  // 4. Authenticated visitor accessing login page -> redirect to dashboard
  if (isAuthenticated && isPublicAdminPath) {
    const returnUrl = request.nextUrl.searchParams.get("from");
    const safeDestination =
      returnUrl && returnUrl.startsWith("/") && !returnUrl.startsWith("//") && !returnUrl.includes(":")
        ? returnUrl
        : "/ielung-admin";

    return NextResponse.redirect(new URL(safeDestination, request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/ielung-admin/:path*"],
};
