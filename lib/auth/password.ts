import bcrypt from "bcryptjs";
import { BCRYPT_MIN_ROUNDS } from "./constants";

/**
 * Securely compares a plain-text password with a bcrypt hash.
 * Never logs or exposes the password or hash.
 */
export async function verifyPassword(
  plainText: string,
  hashed: string,
): Promise<boolean> {
  if (!plainText || !hashed) {
    return false;
  }

  try {
    return await bcrypt.compare(plainText, hashed);
  } catch (error) {
    // Return false on malformed hashes or comparison errors without throwing
    return false;
  }
}

/**
 * Utility to generate a bcrypt hash with the required cost factor (>= 12).
 * Used for administrative setup and testing.
 */
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, BCRYPT_MIN_ROUNDS);
}
