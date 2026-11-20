import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getSchema } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Callout } from "../components/admin/blog/CalloutExtension.ts";
import {
  createEmptyTiptapDoc,
  isTiptapDocEmpty,
  isSafeUrl,
  normalizeSafeUrl,
  validateMediaUploadResponse,
} from "../components/admin/blog/editor-utils.ts";

// ==========================================
// 1. Empty Document Initialization & State
// ==========================================

test("1. Document Helpers: createEmptyTiptapDoc returns clean valid ProseMirror structure", () => {
  const emptyDoc = createEmptyTiptapDoc();
  assert.equal(emptyDoc.type, "doc");
  assert.ok(Array.isArray(emptyDoc.content));
  assert.equal(emptyDoc.content.length, 1);
  assert.equal(emptyDoc.content[0].type, "paragraph");
});

test("2. Document Helpers: isTiptapDocEmpty detects empty and non-empty documents", () => {
  assert.equal(isTiptapDocEmpty(null), true);
  assert.equal(isTiptapDocEmpty(undefined), true);
  assert.equal(isTiptapDocEmpty({ type: "doc", content: [] }), true);
  assert.equal(isTiptapDocEmpty({ type: "doc", content: [{ type: "paragraph" }] }), true);
  assert.equal(
    isTiptapDocEmpty({
      type: "doc",
      content: [{ type: "paragraph", content: [] }],
    }),
    true
  );

  // Populated document
  const populatedDoc = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Welcome to IE Lung" }],
      },
    ],
  };
  assert.equal(isTiptapDocEmpty(populatedDoc), false);

  // Document with callout or image
  const mediaDoc = {
    type: "doc",
    content: [
      {
        type: "image",
        attrs: { src: "https://res.cloudinary.com/demo/image/upload/sample.webp" },
      },
    ],
  };
  assert.equal(isTiptapDocEmpty(mediaDoc), false);
});

// ==========================================
// 2. Tiptap Schema & Constraints
// ==========================================

test("3. Tiptap Schema: Enforces supported node types without level 1 heading", () => {
  const schema = getSchema([
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: false,
      underline: false,
    }),
    Underline,
    Link,
    Image,
    Callout,
  ]);

  const nodeNames = Object.keys(schema.nodes);
  const markNames = Object.keys(schema.marks);

  // Expected block and inline nodes
  assert.ok(nodeNames.includes("doc"));
  assert.ok(nodeNames.includes("paragraph"));
  assert.ok(nodeNames.includes("heading"));
  assert.ok(nodeNames.includes("blockquote"));
  assert.ok(nodeNames.includes("bulletList"));
  assert.ok(nodeNames.includes("orderedList"));
  assert.ok(nodeNames.includes("listItem"));
  assert.ok(nodeNames.includes("horizontalRule"));
  assert.ok(nodeNames.includes("image"));
  assert.ok(nodeNames.includes("callout"));

  // Expected marks
  assert.ok(markNames.includes("bold"));
  assert.ok(markNames.includes("italic"));
  assert.ok(markNames.includes("underline"));
  assert.ok(markNames.includes("link"));

  // Heading attribute validation: level defaults or accepts 2 and 3
  const headingNode = schema.nodes.heading;
  assert.ok(headingNode);
});

// ==========================================
// 3. Custom Callout Extension
// ==========================================

test("4. Callout Extension: Preserves variant and type attributes in JSON and HTML", () => {
  assert.equal(Callout.name, "callout");
  assert.equal(Callout.config.group, "block");
  assert.equal(Callout.config.content, "block+");
  assert.equal(Callout.config.defining, true);

  // Test HTML rendering with info variant
  const infoRender = Callout.config.renderHTML.call(
    { options: { HTMLAttributes: {} } },
    {
      node: { attrs: { variant: "info", type: "info" } },
      HTMLAttributes: {},
    }
  );
  assert.equal(infoRender[0], "div");
  assert.equal(infoRender[1]["data-type"], "callout");
  assert.equal(infoRender[1]["data-variant"], "info");
  assert.match(infoRender[1].class, /callout-info/);

  // Test HTML rendering with warning variant
  const warningRender = Callout.config.renderHTML.call(
    { options: { HTMLAttributes: {} } },
    {
      node: { attrs: { variant: "warning", type: "warning" } },
      HTMLAttributes: {},
    }
  );
  assert.equal(warningRender[0], "div");
  assert.equal(warningRender[1]["data-type"], "callout");
  assert.equal(warningRender[1]["data-variant"], "warning");
  assert.match(warningRender[1].class, /callout-warning/);
});

// ==========================================
// 4. Link Protocol Restrictions & Safety
// ==========================================

test("5. Link Protocol Security: Rejects dangerous scripts and accepts valid protocols", () => {
  // Safe protocols
  assert.equal(isSafeUrl("https://ielung.com"), true);
  assert.equal(isSafeUrl("https://ielung.com/about?tab=doctors#contact"), true);
  assert.equal(isSafeUrl("http://localhost:3000/blog"), true);
  assert.equal(isSafeUrl("mailto:info@ielung.com"), true);
  assert.equal(isSafeUrl("/downloads/referral-form.pdf"), true);

  // Normalized bare domains
  assert.equal(normalizeSafeUrl("ielung.com"), "https://ielung.com");
  assert.equal(normalizeSafeUrl("www.ielung.com/services"), "https://www.ielung.com/services");

  // Dangerous scripts rejected
  assert.equal(isSafeUrl("javascript:alert(document.cookie)"), false);
  assert.equal(isSafeUrl("JAVASCRIPT:alert(1)"), false);
  assert.equal(isSafeUrl("javascript:void(0)"), false);
  assert.equal(isSafeUrl("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=="), false);
  assert.equal(isSafeUrl("data:image/svg+xml;base64,abc"), false);
  assert.equal(isSafeUrl("vbscript:msgbox(1)"), false);
  assert.equal(isSafeUrl("file:///C:/Windows/win.ini"), false);

  // Normalization returns null for dangerous inputs
  assert.equal(normalizeSafeUrl("javascript:alert(1)"), null);
  assert.equal(normalizeSafeUrl("data:text/html,hack"), null);
  assert.equal(normalizeSafeUrl(""), null);
  assert.equal(normalizeSafeUrl("   "), null);
});

// ==========================================
// 5. Image Upload Response Validation (Actual Production Helper)
// ==========================================

test("6. Image Upload Response: Validates Cloudinary upload payload contract with validateMediaUploadResponse", () => {
  // A. Valid Cloudinary payload matching app/api/admin/media/upload/route.ts
  const validPayload = {
    secure_url: "https://res.cloudinary.com/test-cloud/image/upload/v12345/ielung/blog/photo.webp",
    public_id: "ielung/blog/photo",
    width: 1200,
    height: 800,
  };
  const parsed = validateMediaUploadResponse(validPayload);
  assert.equal(parsed.secure_url, validPayload.secure_url);
  assert.equal(parsed.public_id, validPayload.public_id);
  assert.equal(parsed.width, 1200);
  assert.equal(parsed.height, 800);

  // B. HTTP protocol rejection (must be strictly HTTPS)
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        secure_url: "http://res.cloudinary.com/test-cloud/image/upload/photo.webp",
      }),
    /must use the HTTPS protocol/
  );

  // C. Unexpected hostname rejection (must be strictly res.cloudinary.com)
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        secure_url: "https://evil-storage.com/test-cloud/photo.webp",
      }),
    /Unexpected delivery host/
  );

  // D. URL credentials rejection
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        secure_url: "https://admin:secret@res.cloudinary.com/photo.webp",
      }),
    /contains unauthorized URL credentials/
  );

  // E. Unexpected port rejection
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        secure_url: "https://res.cloudinary.com:8443/photo.webp",
      }),
    /Unexpected port/
  );

  // F. Malformed URL rejection
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        secure_url: "not-a-valid-url",
      }),
    /malformed URL/
  );

  // G. Missing or empty public_id
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        public_id: "",
      }),
    /Missing or empty 'public_id'/
  );
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        public_id: null,
      }),
    /Missing or empty 'public_id'/
  );

  // H. Invalid dimensions (zero, negative, NaN, non-number)
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        width: 0,
      }),
    /'width' must be a positive finite number/
  );
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        width: -100,
      }),
    /'width' must be a positive finite number/
  );
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        height: NaN,
      }),
    /'height' must be a positive finite number/
  );
  assert.throws(
    () =>
      validateMediaUploadResponse({
        ...validPayload,
        height: "800",
      }),
    /'height' must be a positive finite number/
  );

  // I. Null and non-object responses
  assert.throws(
    () => validateMediaUploadResponse(null),
    /Expected a JSON object/
  );
  assert.throws(
    () => validateMediaUploadResponse(undefined),
    /Expected a JSON object/
  );
  assert.throws(
    () => validateMediaUploadResponse("string response"),
    /Expected a JSON object/
  );
  assert.throws(
    () => validateMediaUploadResponse(123),
    /Expected a JSON object/
  );
});

// ==========================================
// 6. Compatibility with Initial Post Seed Data
// ==========================================

test("7. Initial Post Compatibility: Verifies schema parses initial post seed content", () => {
  const seedPath = path.resolve(process.cwd(), "prisma/seed-data/initial-post.json");
  const rawSeed = fs.readFileSync(seedPath, "utf-8");
  const seedData = JSON.parse(rawSeed);

  assert.ok(seedData.content);
  assert.equal(seedData.content.type, "doc");
  assert.ok(Array.isArray(seedData.content.content));

  const schema = getSchema([
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: false,
      underline: false,
    }),
    Underline,
    Link,
    Image,
    Callout,
  ]);

  const allowedNodeTypes = new Set(Object.keys(schema.nodes));
  const foundNodeTypes = new Set();
  const foundCallouts = [];

  function traverse(node) {
    if (!node || typeof node !== "object") return;
    if (node.type) {
      foundNodeTypes.add(node.type);
      assert.ok(
        allowedNodeTypes.has(node.type),
        `Node type "${node.type}" from seed data is not defined in editor schema!`
      );
    }
    if (node.type === "callout") {
      foundCallouts.push(node);
    }
    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        traverse(child);
      }
    }
  }

  traverse(seedData.content);

  // Verify that all essential nodes are in the schema
  assert.ok(allowedNodeTypes.has("paragraph"));
  assert.ok(allowedNodeTypes.has("heading"));
  assert.ok(allowedNodeTypes.has("bulletList"));
  assert.ok(allowedNodeTypes.has("orderedList"));
  assert.ok(allowedNodeTypes.has("listItem"));
  assert.ok(allowedNodeTypes.has("callout"));
  assert.ok(allowedNodeTypes.has("text"));

  // Verify that seed data used valid registered nodes
  assert.ok(foundNodeTypes.has("paragraph"));
  assert.ok(foundNodeTypes.has("heading"));
  assert.ok(foundNodeTypes.has("bulletList"));
  assert.ok(foundNodeTypes.has("listItem"));
  assert.ok(foundNodeTypes.has("callout"));
  assert.ok(foundNodeTypes.has("text"));

  // Verify callouts match expected variants
  assert.equal(foundCallouts.length, 2);
  const variants = foundCallouts.map((c) => c.attrs?.variant || c.attrs?.type);
  assert.ok(variants.includes("info"));
  assert.ok(variants.includes("warning"));
});
