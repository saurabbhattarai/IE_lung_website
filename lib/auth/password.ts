import crypto from "node:crypto";

/**
 * Timing-safe comparison of two strings using fixed-length SHA-256 digests.
 * Hashing guarantees equal 32-byte buffer lengths, preventing timing leaks and RangeErrors.
 */
export function timingSafeEqualStrings(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  const hashA = crypto.createHash("sha256").update(a, "utf8").digest();
  const hashB = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Verifies submitted password against the configured ADMIN_PASSWORD.
 * If expectedPassword is provided, compares against it; otherwise compares
 * against process.env.ADMIN_PASSWORD directly.
 * Returns false safely if either password is missing or configuration is absent.
 * Never logs or exposes credentials.
 */
export async function verifyPassword(
  submittedPassword: string,
  expectedPassword?: string
): Promise<boolean> {
  if (!submittedPassword || typeof submittedPassword !== "string") {
    return false;
  }

  const targetPassword = expectedPassword ?? process.env.ADMIN_PASSWORD;
  if (!targetPassword || typeof targetPassword !== "string") {
    return false;
  }

  return timingSafeEqualStrings(submittedPassword, targetPassword.trim());
}

/**
 * Verifies submitted admin credentials (email and password) against process.env.
 * Checks that both ADMIN_EMAIL and ADMIN_PASSWORD are configured.
 * Uses timing-safe comparisons for both email and password on the server.
 * Never exposes or logs credentials.
 */
export async function verifyAdminCredentials(
  submittedEmail: string,
  submittedPassword: string
): Promise<boolean> {
  if (!submittedEmail || !submittedPassword) {
    return false;
  }

  const configuredEmail = process.env.ADMIN_EMAIL;
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredEmail || !configuredPassword) {
    return false;
  }

  const normalizedSubmittedEmail = submittedEmail.trim().toLowerCase();
  const normalizedConfiguredEmail = configuredEmail.trim().toLowerCase();

  const isEmailValid = timingSafeEqualStrings(
    normalizedSubmittedEmail,
    normalizedConfiguredEmail
  );
  const isPasswordValid = timingSafeEqualStrings(
    submittedPassword,
    configuredPassword.trim()
  );

  return isEmailValid && isPasswordValid;
}
