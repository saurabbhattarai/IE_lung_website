/**
 * Reusable server-side reading time calculator for Tiptap JSON content.
 * Adheres strictly to a standard 200 words-per-minute (WPM) reading pace.
 */

export interface TiptapNode {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

const WORDS_PER_MINUTE = 200;

/**
 * Recursively extracts plain text from a Tiptap / ProseMirror document tree.
 * Traverses all block, inline, and custom nodes safely.
 */
export function extractPlainTextFromTiptap(node: unknown): string {
  if (!node || typeof node !== "object") {
    return "";
  }

  const tiptapNode = node as TiptapNode;

  // Text leaf node
  if (tiptapNode.type === "text" && typeof tiptapNode.text === "string") {
    return tiptapNode.text;
  }

  // Node with child contents (doc, paragraph, heading, list, callout, etc.)
  if (Array.isArray(tiptapNode.content) && tiptapNode.content.length > 0) {
    return tiptapNode.content
      .map(extractPlainTextFromTiptap)
      .filter(Boolean)
      .join(" ");
  }

  return "";
}

/**
 * Counts words in a string accurately, normalizing spaces and punctuation.
 */
export function countWords(text: string): number {
  if (!text || typeof text !== "string") {
    return 0;
  }
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  return tokens.length;
}

/**
 * Calculates reading time in whole minutes from a Tiptap JSON document.
 * Enforces a minimum of 1 minute.
 * Always computed server-side; does not trust client-provided reading times.
 */
export function calculateReadingTimeMinutes(doc: unknown): number {
  const plainText = extractPlainTextFromTiptap(doc);
  const wordCount = countWords(plainText);

  if (wordCount <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
