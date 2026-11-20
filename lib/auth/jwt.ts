import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import {
  JWT_ALGORITHM,
  JWT_AUDIENCE,
  JWT_ISSUER,
  ADMIN_COOKIE_MAX_AGE,
} from "./constants";

export interface AdminTokenPayload extends JWTPayload {
  email: string;
  role: "admin";
}

/**
 * Validates and retrieves the JWT secret from environment variables.
 * Enforces a minimum key length of 32 bytes (256 bits) for HS256 security.
 */
export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "CRITICAL: JWT_SECRET environment variable is missing. It must be at least 32 characters long.",
    );
  }

  const encoded = new TextEncoder().encode(secret);

  if (encoded.length < 32) {
    throw new Error(
      `CRITICAL: JWT_SECRET is too short (${encoded.length} bytes). HS256 requires at least 32 bytes (256 bits).`,
    );
  }

  return encoded;
}

/**
 * Signs a 24-hour admin session JWT using HS256 and strict claims.
 */
export async function signAdminToken(email: string): Promise<string> {
  const secret = getJwtSecretKey();

  return new SignJWT({
    email: email.trim().toLowerCase(),
    role: "admin",
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM, typ: "JWT" })
    .setSubject(email.trim().toLowerCase())
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_COOKIE_MAX_AGE}s`)
    .sign(secret);
}

/**
 * Verifies a JWT's signature, algorithm, issuer, audience, and expiration.
 * Rejects expired, tampered, or incorrectly signed tokens.
 */
export async function verifyAdminToken(
  token: string,
): Promise<AdminTokenPayload | null> {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const secret = getJwtSecretKey();
    const { payload } = await jwtVerify<AdminTokenPayload>(token, secret, {
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    if (!payload.email || payload.role !== "admin") {
      return null;
    }

    return payload;
  } catch {
    // Jose throws on expired tokens, bad signatures, or wrong alg/iss/aud
    return null;
  }
}
