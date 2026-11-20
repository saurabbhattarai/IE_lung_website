import { NextRequest, NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth/session";

/**
 * Validates that the request origin matches the host header to guard against CSRF.
 */
function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
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

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  clearAdminSessionCookie(response);
  return response;
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Logout requires a POST request." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
