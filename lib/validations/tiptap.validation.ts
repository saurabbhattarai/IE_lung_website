/**
 * Server-Side Tiptap Document Validator
 *
 * Enforces strict structure, supported node types, allowed marks,
 * and security rules on stored Tiptap JSON content before database persistence.
 *
 * Supported Nodes:
 * - doc (root)
 * - paragraph
 * - heading (strictly levels 2 and 3; level 1 is prohibited)
 * - text
 * - bulletList
 * - orderedList
 * - listItem
 * - blockquote
 * - horizontalRule
 * - image (Cloudinary HTTPS only)
 * - callout (info and warning variants)
 *
 * Supported Marks:
 * - bold
 * - italic
 * - underline
 * - link (safe protocols only: https, http, mailto, or clean root-relative)
 */

export interface TiptapValidationError {
  path: string;
  message: string;
}

export interface TiptapValidationResult {
  valid: boolean;
  errors: TiptapValidationError[];
}

const ALLOWED_BLOCK_NODES = new Set([
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "horizontalRule",
  "image",
  "callout",
]);

const ALLOWED_MARKS = new Set(["bold", "italic", "underline", "link"]);

/**
 * Validates whether an image URL is an allowed Cloudinary delivery URL or legitimate site asset.
 */
function isValidImageUrl(src: string): boolean {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();

  // Root-relative static asset (e.g. /logo.png)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return false;
    // Hostname must be Cloudinary delivery domain
    return url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

/**
 * Validates whether a hyperlink uses safe protocols (https, http, mailto, or clean root-relative).
 * Rejects javascript:, data:, vbscript:, and protocol-relative schemes.
 */
function isSafeLinkUrl(href: string): boolean {
  if (!href || typeof href !== "string") return false;
  const trimmed = href.trim();
  if (trimmed.length === 0 || trimmed.length > 2048) return false;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    trimmed.startsWith("//")
  ) {
    return false;
  }

  if (lower.startsWith("mailto:")) {
    const email = trimmed.slice(7).trim();
    return email.length > 3 && email.includes("@");
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    // Clean root-relative path
    return trimmed.startsWith("/") && !trimmed.startsWith("//");
  }
}

/**
 * Recursively validates a Tiptap ProseMirror node tree.
 */
function validateNode(
  node: unknown,
  path: string,
  errors: TiptapValidationError[]
): void {
  if (!node || typeof node !== "object") {
    errors.push({ path, message: "Node must be an object." });
    return;
  }

  const n = node as Record<string, unknown>;

  if (typeof n.type !== "string") {
    errors.push({ path, message: "Node must specify a valid 'type' string." });
    return;
  }

  const nodeType = n.type;

  // 1. Text node validation
  if (nodeType === "text") {
    if (typeof n.text !== "string") {
      errors.push({ path: `${path}.text`, message: "Text node must contain a 'text' string." });
    }

    if (n.marks) {
      if (!Array.isArray(n.marks)) {
        errors.push({ path: `${path}.marks`, message: "'marks' must be an array." });
      } else {
        n.marks.forEach((mark, i) => {
          const markPath = `${path}.marks[${i}]`;
          if (!mark || typeof mark !== "object") {
            errors.push({ path: markPath, message: "Mark must be an object." });
            return;
          }
          const m = mark as Record<string, unknown>;
          if (typeof m.type !== "string" || !ALLOWED_MARKS.has(m.type)) {
            errors.push({
              path: markPath,
              message: `Unsupported mark type '${m.type}'. Allowed: bold, italic, underline, link.`,
            });
            return;
          }

          if (m.type === "link") {
            const attrs = m.attrs as Record<string, unknown> | undefined;
            if (!attrs || typeof attrs.href !== "string" || !isSafeLinkUrl(attrs.href)) {
              errors.push({
                path: `${markPath}.attrs.href`,
                message: "Link mark contains an unsafe or malformed 'href' attribute.",
              });
            }
          }
        });
      }
    }
    return;
  }

  // 2. Block nodes validation
  if (!ALLOWED_BLOCK_NODES.has(nodeType)) {
    errors.push({
      path,
      message: `Unsupported node type '${nodeType}'.`,
    });
    return;
  }

  // Heading node: strictly level 2 or 3
  if (nodeType === "heading") {
    const attrs = n.attrs as Record<string, unknown> | undefined;
    const level = attrs?.level;
    if (level !== 2 && level !== 3) {
      errors.push({
        path: `${path}.attrs.level`,
        message: `Heading level must be strictly 2 or 3 (received: ${level}). Heading level 1 is prohibited in article content.`,
      });
    }
  }

  // Callout node: variant must be info or warning
  if (nodeType === "callout") {
    const attrs = n.attrs as Record<string, unknown> | undefined;
    const variant = attrs?.variant || attrs?.type;
    if (variant !== "info" && variant !== "warning") {
      errors.push({
        path: `${path}.attrs.variant`,
        message: `Callout variant must be 'info' or 'warning' (received: '${variant}').`,
      });
    }
  }

  // Image node: Cloudinary HTTPS or root-relative URL, with alt text capped at 500 characters
  if (nodeType === "image") {
    const attrs = n.attrs as Record<string, unknown> | undefined;
    if (!attrs || typeof attrs.src !== "string" || !isValidImageUrl(attrs.src)) {
      errors.push({
        path: `${path}.attrs.src`,
        message: "Image 'src' must be a valid Cloudinary HTTPS URL (res.cloudinary.com) or site asset.",
      });
    }

    if (attrs && attrs.alt !== undefined && attrs.alt !== null) {
      if (typeof attrs.alt !== "string" || attrs.alt.length > 500) {
        errors.push({
          path: `${path}.attrs.alt`,
          message: "Image 'alt' text must not exceed 500 characters.",
        });
      }
    }
  }

  // 3. Child content recursion
  if (n.content !== undefined) {
    if (!Array.isArray(n.content)) {
      errors.push({ path: `${path}.content`, message: "'content' must be an array." });
    } else {
      n.content.forEach((child, i) => {
        validateNode(child, `${path}.content[${i}]`, errors);
      });
    }
  }
}

/**
 * Validates a complete Tiptap document for storage in BlogPost.content.
 */
export function validateTiptapDocument(doc: unknown): TiptapValidationResult {
  const errors: TiptapValidationError[] = [];

  if (!doc || typeof doc !== "object") {
    return {
      valid: false,
      errors: [{ path: "root", message: "Document must be a valid JSON object." }],
    };
  }

  const root = doc as Record<string, unknown>;

  if (root.type !== "doc") {
    return {
      valid: false,
      errors: [{ path: "type", message: "Document root must have type 'doc'." }],
    };
  }

  if (!Array.isArray(root.content)) {
    return {
      valid: false,
      errors: [{ path: "content", message: "Document root 'content' must be an array." }],
    };
  }

  root.content.forEach((node, i) => {
    validateNode(node, `content[${i}]`, errors);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
