/**
 * Editor Utility Functions
 * Enforces link safety and safe document fallback creation.
 */

import type { JSONContent } from "@tiptap/core";

export const ALLOWED_PROTOCOLS = ["https:", "http:", "mailto:"] as const;

/**
 * Validates whether a given URL uses safe protocols (https, http, or mailto).
 * Rejects javascript:, data:, and other unsafe or malformed URI schemes.
 */
export function isSafeUrl(url: unknown): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  const trimmed = url.trim();
  if (trimmed.length === 0 || trimmed.length > 2048) {
    return false;
  }

  // Explicitly reject dangerous script / data schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }

  // Support mailto: links
  if (lower.startsWith("mailto:")) {
    const emailPart = trimmed.slice(7).trim();
    // Basic email format check
    return emailPart.length > 3 && emailPart.includes("@");
  }

  // Support absolute HTTP/HTTPS links
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    // Relative URLs or missing protocol: check if it looks like a clean root-relative path
    if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
      return true;
    }
    return false;
  }
}

/**
 * Returns a normalized safe URL with https:// if no protocol was specified,
 * or null if the URL is invalid or unsafe.
 */
export function normalizeSafeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (isSafeUrl(trimmed)) {
    return trimmed;
  }

  // If user typed 'example.com' or 'www.example.com', prepend https:// and re-verify
  if (!trimmed.includes("://") && !trimmed.startsWith("mailto:")) {
    const candidate = `https://${trimmed}`;
    if (isSafeUrl(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Creates an empty default Tiptap document.
 */
export function createEmptyTiptapDoc(): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
  };
}

/**
 * Safely inspects if a Tiptap document is empty (no text and no media/callout nodes).
 */
export function isTiptapDocEmpty(doc?: JSONContent | null): boolean {
  if (!doc || !Array.isArray(doc.content) || doc.content.length === 0) {
    return true;
  }

  if (doc.content.length === 1) {
    const first = doc.content[0];
    if (
      first.type === "paragraph" &&
      (!first.content || first.content.length === 0)
    ) {
      return true;
    }
  }

  return false;
}

export interface ValidatedMediaUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

/**
 * Validates the response object returned by POST /api/admin/media/upload.
 * Enforces strict HTTPS, Cloudinary host verification (res.cloudinary.com),
 * absence of credentials/non-standard ports, non-empty public_id, and positive finite dimensions.
 */
export function validateMediaUploadResponse(
  data: unknown
): ValidatedMediaUploadResult {
  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid response: Expected a JSON object from media upload service."
    );
  }

  const payload = data as Record<string, unknown>;

  // 1. Validate secure_url
  if (typeof payload.secure_url !== "string" || !payload.secure_url.trim()) {
    throw new Error(
      "Invalid response: Missing or empty 'secure_url' in media upload response."
    );
  }

  const rawUrl = payload.secure_url.trim();
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error(
      "Invalid response: 'secure_url' is a malformed URL."
    );
  }

  // Must strictly use HTTPS protocol
  if (parsedUrl.protocol !== "https:") {
    throw new Error(
      `Invalid response: 'secure_url' must use the HTTPS protocol (received: ${parsedUrl.protocol}).`
    );
  }

  // Hostname must be strictly the expected Cloudinary delivery host
  if (parsedUrl.hostname !== "res.cloudinary.com") {
    throw new Error(
      `Invalid response: Unexpected delivery host '${parsedUrl.hostname}'. Expected 'res.cloudinary.com'.`
    );
  }

  // Reject URL credentials
  if (parsedUrl.username || parsedUrl.password) {
    throw new Error(
      "Invalid response: 'secure_url' contains unauthorized URL credentials."
    );
  }

  // Reject non-standard ports
  if (parsedUrl.port && parsedUrl.port !== "443") {
    throw new Error(
      `Invalid response: Unexpected port '${parsedUrl.port}' in 'secure_url'.`
    );
  }

  // 2. Validate public_id
  if (typeof payload.public_id !== "string" || !payload.public_id.trim()) {
    throw new Error(
      "Invalid response: Missing or empty 'public_id' in media upload response."
    );
  }

  // 3. Validate dimensions
  if (
    typeof payload.width !== "number" ||
    !Number.isFinite(payload.width) ||
    payload.width <= 0
  ) {
    throw new Error(
      "Invalid response: 'width' must be a positive finite number."
    );
  }

  if (
    typeof payload.height !== "number" ||
    !Number.isFinite(payload.height) ||
    payload.height <= 0
  ) {
    throw new Error(
      "Invalid response: 'height' must be a positive finite number."
    );
  }

  return {
    secure_url: parsedUrl.toString(),
    public_id: payload.public_id.trim(),
    width: payload.width,
    height: payload.height,
  };
}
