/**
 * Media file and public ID validation utilities for admin media uploads.
 * Enforces size limits, folder path containment, and strict binary magic-byte inspection
 * to prevent MIME-spoofing and malicious file uploads across images and documents.
 *
 * Folders:
 * - ielung/blog      -> Raster blog images (max 5 MB)
 * - ielung/gallery   -> High-res gallery photography (max 10 MB)
 * - ielung/downloads -> PDF newsletters, forms, and clinical guides (max 25 MB)
 */

export const CLOUDINARY_BLOG_FOLDER = "ielung/blog";
export const CLOUDINARY_GALLERY_FOLDER = "ielung/gallery";
export const CLOUDINARY_DOWNLOADS_FOLDER = "ielung/downloads";

export const ALLOWED_MEDIA_FOLDERS = [
  CLOUDINARY_BLOG_FOLDER,
  CLOUDINARY_GALLERY_FOLDER,
  CLOUDINARY_DOWNLOADS_FOLDER,
] as const;

export type AllowedMediaFolder = (typeof ALLOWED_MEDIA_FOLDERS)[number];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB for blog images
export const MAX_GALLERY_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB for gallery images
export const MAX_PDF_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB for PDF documents

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const ALLOWED_PDF_MIME_TYPES = ["application/pdf"] as const;
export type AllowedPdfMimeType = (typeof ALLOWED_PDF_MIME_TYPES)[number];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  detectedMime?: AllowedMimeType;
}

export interface PdfValidationResult {
  valid: boolean;
  error?: string;
  detectedMime?: AllowedPdfMimeType;
}

export interface MediaPublicIdValidationResult {
  valid: boolean;
  error?: string;
  normalizedPublicId?: string;
  folder?: AllowedMediaFolder;
  resourceType?: "image" | "raw";
}

/**
 * Sanitizes a user-supplied original filename for safe use in Cloudinary public IDs.
 * Strips path separators, keeps only URL-safe alphanumeric characters, hyphens, and underscores.
 */
export function sanitizeFilename(filename?: string): string {
  if (!filename || typeof filename !== "string") {
    return "document";
  }

  // Strip path directory components
  const base = filename.replace(/^.*[\\/]/, "");
  // Strip extension
  const nameWithoutExt = base.replace(/\.[^/.]+$/, "");

  // Normalize to safe characters
  const sanitized = nameWithoutExt
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || "document";
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
 * Inspects binary magic bytes from the start of a buffer
 * to reliably verify the PDF binary signature (%PDF-).
 */
export function detectPdfMimeType(buffer: Buffer): AllowedPdfMimeType | null {
  if (!buffer || buffer.length < 5) {
    return null;
  }

  // PDF signature: %PDF- (0x25, 0x50, 0x44, 0x46, 0x2D)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  ) {
    return "application/pdf";
  }

  return null;
}

/**
 * Validates an uploaded raster image buffer against size, emptiness,
 * and genuine binary content. Supports custom max size (5 MB for blog, 10 MB for gallery).
 */
export function validateImageBuffer(
  buffer: Buffer,
  declaredMimeType?: string,
  maxSizeBytes: number = MAX_FILE_SIZE_BYTES
): ImageValidationResult {
  // 1. Check for empty file
  if (!buffer || buffer.length === 0) {
    return {
      valid: false,
      error: "Uploaded file is empty (0 bytes).",
    };
  }

  // 2. Enforce maximum file size
  if (buffer.length > maxSizeBytes) {
    const limitMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    const actualMb = (buffer.length / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds the ${limitMb} MB limit (actual: ${actualMb} MB).`,
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
      error:
        "Unsupported or invalid image content. Only genuine JPEG, PNG, WebP, and AVIF images are permitted.",
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

/**
 * Validates an uploaded gallery image buffer (up to 10 MB).
 */
export function validateGalleryImageBuffer(
  buffer: Buffer,
  declaredMimeType?: string
): ImageValidationResult {
  return validateImageBuffer(buffer, declaredMimeType, MAX_GALLERY_FILE_SIZE_BYTES);
}

/**
 * Validates an uploaded PDF buffer against emptiness, size (up to 25 MB),
 * and strict binary magic-byte inspection (%PDF-).
 */
export function validatePdfBuffer(
  buffer: Buffer,
  declaredMimeType?: string
): PdfValidationResult {
  // 1. Check for empty file
  if (!buffer || buffer.length === 0) {
    return {
      valid: false,
      error: "Uploaded PDF file is empty (0 bytes).",
    };
  }

  // 2. Enforce maximum file size (25 MB)
  if (buffer.length > MAX_PDF_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 25 MB limit (actual: ${(
        buffer.length /
        (1024 * 1024)
      ).toFixed(2)} MB).`,
    };
  }

  // 3. Verify minimum buffer length for PDF header inspection
  if (buffer.length < 5) {
    return {
      valid: false,
      error: "File is malformed or too small to be a valid PDF document.",
    };
  }

  // 4. Verify binary signature (%PDF-)
  const detectedMime = detectPdfMimeType(buffer);
  if (!detectedMime) {
    return {
      valid: false,
      error:
        "Unsupported or invalid PDF content. File lacks a valid %PDF- binary signature.",
    };
  }

  // 5. If declared MIME type was provided, verify it is application/pdf
  if (declaredMimeType) {
    const normalizedDeclared = declaredMimeType.toLowerCase().trim();
    if (normalizedDeclared !== "application/pdf") {
      return {
        valid: false,
        error: `Declared MIME type (${declaredMimeType}) must be application/pdf.`,
      };
    }
  }

  return {
    valid: true,
    detectedMime,
  };
}

/**
 * Validates that a target public ID belongs strictly to an authorized folder
 * (ielung/blog, ielung/gallery, or ielung/downloads) and does not contain path traversal,
 * control characters, or invalid separators.
 */
export function validateMediaPublicId(publicId: unknown): MediaPublicIdValidationResult {
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

  // 3. Must match an authorized folder prefix
  let matchedFolder: AllowedMediaFolder | undefined;
  for (const folder of ALLOWED_MEDIA_FOLDERS) {
    const prefix = `${folder}/`;
    if (decoded.startsWith(prefix) && trimmed.startsWith(prefix)) {
      matchedFolder = folder;
      break;
    }
  }

  if (!matchedFolder) {
    return {
      valid: false,
      error: `Deletion is restricted to authorized folders: ${ALLOWED_MEDIA_FOLDERS.join(", ")}.`,
    };
  }

  // 4. Must specify a valid relative path within the folder
  const relativePart = decoded.slice(`${matchedFolder}/`.length);
  if (!relativePart || relativePart.startsWith("/") || relativePart.endsWith("/")) {
    return {
      valid: false,
      error: "Public ID must specify a valid file name within the authorized folder.",
    };
  }

  // 5. Verify character safety for Cloudinary public IDs (alphanumeric, underscores, hyphens, periods, single internal slashes)
  const segments = relativePart.split("/");
  for (const segment of segments) {
    if (!segment || segment === "." || segment === "..") {
      return {
        valid: false,
        error: "Public ID contains an invalid path component.",
      };
    }
    // Allow dots for file extensions in raw assets (e.g. filename.pdf)
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(segment)) {
      return {
        valid: false,
        error:
          "Public ID contains invalid characters. Only alphanumeric, underscores, hyphens, and periods are permitted.",
      };
    }
  }

  const resourceType = matchedFolder === CLOUDINARY_DOWNLOADS_FOLDER ? "raw" : "image";

  return {
    valid: true,
    normalizedPublicId: trimmed,
    folder: matchedFolder,
    resourceType,
  };
}

/**
 * Backward-compatible validation strictly for blog images.
 * Preserves the exact signature, error text, and behavior of existing blog tests.
 */
export function validateBlogPublicId(publicId: unknown): {
  valid: boolean;
  error?: string;
  normalizedPublicId?: string;
} {
  const result = validateMediaPublicId(publicId);
  if (!result.valid) {
    // If the error was generic folder error, preserve the legacy blog error message
    if (result.error?.includes("Deletion is restricted to authorized folders")) {
      return {
        valid: false,
        error: `Deletion is restricted to the '${CLOUDINARY_BLOG_FOLDER}' folder.`,
      };
    }
    return { valid: false, error: result.error };
  }

  if (result.folder !== CLOUDINARY_BLOG_FOLDER) {
    return {
      valid: false,
      error: `Deletion is restricted to the '${CLOUDINARY_BLOG_FOLDER}' folder.`,
    };
  }

  return { valid: true, normalizedPublicId: result.normalizedPublicId };
}
