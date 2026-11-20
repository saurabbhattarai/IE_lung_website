/**
 * Image file validation utility for admin media uploads.
 * Enforces size limits and strict binary magic-byte inspection
 * to prevent MIME-spoofing and malicious file uploads.
 *
 * ARCHITECTURAL INTEGRITY NOTE:
 * Magic-byte inspection verifies the binary file signature (header) and prevents
 * clients from disguising HTML, SVGs, scripts, or executables as allowed raster images.
 * However, magic-byte inspection alone does NOT guarantee complete internal image
 * integrity (e.g. truncated or corrupted data mid-stream, or decompression bombs).
 *
 * In this architecture, Cloudinary's dedicated upstream processing workers act as
 * the final decoding, dimension validation, and sanitization layer. If an image is
 * corrupted mid-stream, Cloudinary's uploader will reject it during processing.
 */

export const CLOUDINARY_BLOG_FOLDER = "ielung/blog";

/**
 * Validates that a target public ID belongs strictly to the authorized blog folder
 * and does not contain path traversal, malformed percent-encoding, or unauthorized separators.
 *
 * Requirements:
 * - Normalized and safely decoded.
 * - Rejects malformed percent-encoding.
 * - Rejects traversal sequences (..), backslashes (\), null bytes, and double slashes.
 * - Enforces strictly the 'ielung/blog/' folder prefix.
 * - Preserves valid existing Cloudinary public IDs (alphanumeric, dashes, underscores, subfolders).
 */
export function validateBlogPublicId(publicId: unknown): {
  valid: boolean;
  error?: string;
  normalizedPublicId?: string;
} {
  if (!publicId || typeof publicId !== "string") {
    return { valid: false, error: "Public ID must be a non-empty string." };
  }

  const trimmed = publicId.trim();

  if (trimmed.length === 0 || trimmed.length > 255) {
    return {
      valid: false,
      error: "Public ID must be between 1 and 255 characters.",
    };
  }

  // 1. Safely decode percent-encoding and reject malformed sequences
  let decoded: string;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return {
      valid: false,
      error: "Public ID contains malformed percent-encoding.",
    };
  }

  // 2. Reject control characters, null bytes, backslashes, path traversals, and double slashes
  if (
    decoded.includes("\0") ||
    decoded.includes("..") ||
    decoded.includes("\\") ||
    decoded.includes("//") ||
    trimmed.includes("..") ||
    trimmed.includes("\\") ||
    trimmed.includes("//")
  ) {
    return {
      valid: false,
      error: "Public ID contains invalid path traversal or separator characters.",
    };
  }

  // 3. Must strictly start with the allowed folder path
  const expectedPrefix = `${CLOUDINARY_BLOG_FOLDER}/`;
  if (!decoded.startsWith(expectedPrefix) || !trimmed.startsWith(expectedPrefix)) {
    return {
      valid: false,
      error: `Deletion is restricted to the '${CLOUDINARY_BLOG_FOLDER}' folder.`,
    };
  }

  // 4. Must specify a valid relative path within the blog folder
  const relativePart = decoded.slice(expectedPrefix.length);
  if (!relativePart || relativePart.startsWith("/") || relativePart.endsWith("/")) {
    return {
      valid: false,
      error: "Public ID must specify a valid file name within the blog folder.",
    };
  }

  // 5. Verify character safety for Cloudinary public IDs (alphanumeric, underscores, hyphens, and single internal slashes)
  const segments = relativePart.split("/");
  for (const segment of segments) {
    if (!segment || segment === "." || segment === "..") {
      return {
        valid: false,
        error: "Public ID contains an invalid path component.",
      };
    }
    if (!/^[a-zA-Z0-9_\-]+$/.test(segment)) {
      return {
        valid: false,
        error: "Public ID contains invalid characters. Only alphanumeric, underscores, and hyphens are permitted.",
      };
    }
  }

  return { valid: true, normalizedPublicId: trimmed };
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB (5,242,880 bytes)

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  detectedMime?: AllowedMimeType;
}

/**
 * Inspects binary magic bytes from the start of an image buffer
 * to reliably detect the actual image format.
 */
export function detectImageMimeType(buffer: Buffer): AllowedMimeType | null {
  if (!buffer || buffer.length < 12) {
    return null;
  }

  // 1. JPEG: Starts with FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // 2. PNG: Starts with 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // 3. WebP: Starts with RIFF (bytes 0-3) and WEBP (bytes 8-11)
  // 'RIFF' in ASCII: 0x52, 0x49, 0x46, 0x46
  // 'WEBP' in ASCII: 0x57, 0x42, 0x50
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  // 4. AVIF: ISOBMFF box with 'ftyp' at bytes 4-7 and brand 'avif' / 'avis' at bytes 8-11
  // 'ftyp' in ASCII: 0x66, 0x74, 0x79, 0x70
  if (
    buffer[4] === 0x66 &&
    buffer[5] === 0x74 &&
    buffer[6] === 0x79 &&
    buffer[7] === 0x70
  ) {
    const brand = buffer.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") {
      return "image/avif";
    }
  }

  return null;
}

/**
 * Validates an uploaded image buffer against size, emptiness,
 * and genuine binary content.
 */
export function validateImageBuffer(
  buffer: Buffer,
  declaredMimeType?: string
): ImageValidationResult {
  // 1. Check for empty file
  if (!buffer || buffer.length === 0) {
    return {
      valid: false,
      error: "Uploaded file is empty (0 bytes).",
    };
  }

  // 2. Enforce maximum file size (5 MB)
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5 MB limit (actual: ${(buffer.length / (1024 * 1024)).toFixed(2)} MB).`,
    };
  }

  // 3. Verify minimum buffer length for header inspection
  if (buffer.length < 12) {
    return {
      valid: false,
      error: "File is malformed or too small to be a valid image.",
    };
  }

  // 4. Verify actual binary content via magic bytes
  const detectedMime = detectImageMimeType(buffer);
  if (!detectedMime) {
    return {
      valid: false,
      error: "Unsupported or invalid image content. Only genuine JPEG, PNG, WebP, and AVIF images are permitted.",
    };
  }

  // 5. If declared MIME type was provided, verify it does not conflict with detected type
  if (declaredMimeType) {
    const normalizedDeclared = declaredMimeType.toLowerCase().trim();
    if (
      normalizedDeclared !== detectedMime &&
      !(normalizedDeclared === "image/jpg" && detectedMime === "image/jpeg")
    ) {
      return {
        valid: false,
        error: `Declared MIME type (${declaredMimeType}) does not match detected file format (${detectedMime}).`,
      };
    }
  }

  return {
    valid: true,
    detectedMime,
  };
}
