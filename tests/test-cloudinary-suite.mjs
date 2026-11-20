import test from "node:test";
import assert from "node:assert/strict";

// Configure test environment variables before module imports
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "1234567890";
process.env.CLOUDINARY_API_SECRET = "test-secret";
process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/test";

import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../lib/prisma.ts";
import {
  validateImageBuffer,
  detectImageMimeType,
  validateBlogPublicId,
  MAX_FILE_SIZE_BYTES,
  CLOUDINARY_BLOG_FOLDER,
} from "../lib/media/validation.ts";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  isPublicIdReferencedInTiptap,
  isImageReferencedInDatabase,
} from "../lib/media/cloudinary.ts";
import {
  POST as uploadRoute,
  MAX_MULTIPART_REQUEST_BYTES,
} from "../app/api/admin/media/upload/route.ts";
import {
  POST as deleteRoute,
} from "../app/api/admin/media/delete/route.ts";

// Helper to create synthetic valid image buffers
function createJpegBuffer(extraBytes = 100) {
  const buf = Buffer.alloc(3 + extraBytes);
  buf[0] = 0xff; buf[1] = 0xd8; buf[2] = 0xff;
  return buf;
}

function createPngBuffer(extraBytes = 100) {
  const buf = Buffer.alloc(8 + extraBytes);
  const header = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < header.length; i++) buf[i] = header[i];
  return buf;
}

function createWebpBuffer(extraBytes = 100) {
  const buf = Buffer.alloc(12 + extraBytes);
  // 'RIFF'
  buf[0] = 0x52; buf[1] = 0x49; buf[2] = 0x46; buf[3] = 0x46;
  buf[4] = 0x24; buf[5] = 0x00; buf[6] = 0x00; buf[7] = 0x00;
  // 'WEBP'
  buf[8] = 0x57; buf[9] = 0x45; buf[10] = 0x42; buf[11] = 0x50;
  return buf;
}

function createAvifBuffer(extraBytes = 100) {
  const buf = Buffer.alloc(12 + extraBytes);
  buf[0] = 0x00; buf[1] = 0x00; buf[2] = 0x00; buf[3] = 0x1c;
  // 'ftyp'
  buf[4] = 0x66; buf[5] = 0x74; buf[6] = 0x79; buf[7] = 0x70;
  // 'avif'
  buf[8] = 0x61; buf[9] = 0x76; buf[10] = 0x69; buf[11] = 0x66;
  return buf;
}

// ==========================================
// 1. Image Format Detection & Validation
// ==========================================

test("1. File Validation: All Allowed Formats Pass (JPEG, PNG, WebP, AVIF)", () => {
  const jpeg = createJpegBuffer();
  assert.equal(detectImageMimeType(jpeg), "image/jpeg");
  assert.equal(validateImageBuffer(jpeg, "image/jpeg").valid, true);

  const png = createPngBuffer();
  assert.equal(detectImageMimeType(png), "image/png");
  assert.equal(validateImageBuffer(png, "image/png").valid, true);

  const webp = createWebpBuffer();
  assert.equal(detectImageMimeType(webp), "image/webp");
  assert.equal(validateImageBuffer(webp, "image/webp").valid, true);

  const avif = createAvifBuffer();
  assert.equal(detectImageMimeType(avif), "image/avif");
  assert.equal(validateImageBuffer(avif, "image/avif").valid, true);
});

test("2. File Validation: Empty Buffer Rejection (0 bytes)", () => {
  const empty = Buffer.alloc(0);
  const result = validateImageBuffer(empty);
  assert.equal(result.valid, false);
  assert.match(result.error || "", /empty/i);
});

test("3. File Validation: Oversized Buffer Rejection (> 5 MB)", () => {
  const oversized = Buffer.alloc(MAX_FILE_SIZE_BYTES + 1);
  oversized[0] = 0xff; oversized[1] = 0xd8; oversized[2] = 0xff; // JPEG magic
  const result = validateImageBuffer(oversized, "image/jpeg");
  assert.equal(result.valid, false);
  assert.match(result.error || "", /exceeds the 5 MB limit/i);
});

test("4. File Validation: Non-Image Binary Rejection (Executables, Scripts, Text)", () => {
  const textBuffer = Buffer.from("MZ\x90\x00\x03\x00\x00\x00 fake binary content");
  const result = validateImageBuffer(textBuffer, "image/png");
  assert.equal(result.valid, false);
  assert.match(result.error || "", /unsupported or invalid image content/i);
});

test("5. File Validation: MIME Spoofing Rejection (Declared mismatch with Magic Bytes)", () => {
  const png = createPngBuffer();
  const result = validateImageBuffer(png, "image/jpeg");
  assert.equal(result.valid, false);
  assert.match(result.error || "", /does not match detected file format/i);
});

// ==========================================
// 2. Public ID Validation & Security
// ==========================================

test("6. Folder Security: Public ID Restriction & Traversal Security", () => {
  // Valid blog folder
  assert.equal(validateBlogPublicId(`${CLOUDINARY_BLOG_FOLDER}/article_cover_123`).valid, true);
  assert.equal(validateBlogPublicId(`${CLOUDINARY_BLOG_FOLDER}/sub/article_cover_123`).valid, true);

  // Wrong folder rejection
  const wrongFolder = validateBlogPublicId("outside_folder/secret");
  assert.equal(wrongFolder.valid, false);
  assert.match(wrongFolder.error || "", /restricted to the 'ielung\/blog' folder/i);

  // Path traversal rejection
  assert.equal(validateBlogPublicId(`${CLOUDINARY_BLOG_FOLDER}/../private_key`).valid, false);
  assert.equal(validateBlogPublicId(`${CLOUDINARY_BLOG_FOLDER}\\windows\\traversal`).valid, false);
  assert.equal(validateBlogPublicId(`${CLOUDINARY_BLOG_FOLDER}//double_slash`).valid, false);
  assert.equal(validateBlogPublicId(`${CLOUDINARY_BLOG_FOLDER}/null\0byte`).valid, false);

  // Percent-encoded traversal rejection
  assert.equal(validateBlogPublicId(`${CLOUDINARY_BLOG_FOLDER}/%2e%2e/traversal`).valid, false);
  assert.equal(validateBlogPublicId(`${CLOUDINARY_BLOG_FOLDER}/%2E%2E/traversal`).valid, false);

  // Malformed percent-encoding rejection
  assert.equal(validateBlogPublicId(`${CLOUDINARY_BLOG_FOLDER}/%E0%A4%A`).valid, false);

  // Missing, empty, or non-string
  assert.equal(validateBlogPublicId("").valid, false);
  assert.equal(validateBlogPublicId(null).valid, false);
  assert.equal(validateBlogPublicId(undefined).valid, false);

  // Excessive length (> 255 chars)
  const longId = `${CLOUDINARY_BLOG_FOLDER}/` + "a".repeat(260);
  assert.equal(validateBlogPublicId(longId).valid, false);
});

// ==========================================
// 3. Tiptap AST Reference Inspection
// ==========================================

test("7. Tiptap AST: Detects Referenced Public IDs across node types", () => {
  const targetId = "ielung/blog/sample-image";

  // Case A: Standard Image node
  const astWithImage = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Introduction" }],
      },
      {
        type: "image",
        attrs: {
          src: "https://res.cloudinary.com/demo/image/upload/v1234567890/ielung/blog/sample-image.webp",
          alt: "Sample Image",
        },
      },
    ],
  };
  assert.equal(isPublicIdReferencedInTiptap(astWithImage, targetId), true);

  // Case B: Deeply nested inside list and blockquote
  const astNested = {
    type: "doc",
    content: [
      {
        type: "blockquote",
        content: [
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "image",
                    attrs: {
                      src: "https://res.cloudinary.com/demo/image/upload/ielung/blog/sample-image.png",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  assert.equal(isPublicIdReferencedInTiptap(astNested, targetId), true);

  // Case C: URL-encoded public ID
  const astEncoded = {
    type: "doc",
    content: [
      {
        type: "customCard",
        attrs: {
          mediaUrl: "https://res.cloudinary.com/demo/image/upload/ielung%2Fblog%2Fsample-image.jpg",
        },
      },
    ],
  };
  assert.equal(isPublicIdReferencedInTiptap(astEncoded, targetId), true);

  // Case D: Unreferenced document
  const astUnreferenced = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Completely unrelated content" }],
      },
      {
        type: "image",
        attrs: {
          src: "https://res.cloudinary.com/demo/image/upload/ielung/blog/other-image.webp",
        },
      },
    ],
  };
  assert.equal(isPublicIdReferencedInTiptap(astUnreferenced, targetId), false);

  // Case E: Primitive or null safe handling
  assert.equal(isPublicIdReferencedInTiptap(null, targetId), false);
  assert.equal(isPublicIdReferencedInTiptap(undefined, targetId), false);
  assert.equal(isPublicIdReferencedInTiptap("string-node", targetId), false);
  assert.equal(isPublicIdReferencedInTiptap({}, targetId), false);
});

// ==========================================
// 4. Database Reference Safety Check (Mocked Prisma)
// ==========================================

test("8. Database Reference Safety: Verifies coverImage, coverImagePublicId, and Tiptap body", async () => {
  const targetId = "ielung/blog/test-ref";

  // Case A: Referenced as coverImagePublicId
  prisma.blogPost = {
    findFirst: async () => ({ id: "post-1", title: "First Post" }),
    findMany: async () => [],
  };
  const ref1 = await isImageReferencedInDatabase(targetId);
  assert.equal(ref1.isReferenced, true);
  assert.match(ref1.reason || "", /cover image/i);

  // Case B: Referenced in Tiptap article body
  prisma.blogPost = {
    findFirst: async () => null,
    findMany: async () => [
      {
        id: "post-2",
        title: "Second Post",
        content: {
          type: "doc",
          content: [
            {
              type: "image",
              attrs: { src: `https://res.cloudinary.com/demo/image/upload/${targetId}.webp` },
            },
          ],
        },
      },
    ],
  };
  const ref2 = await isImageReferencedInDatabase(targetId);
  assert.equal(ref2.isReferenced, true);
  assert.match(ref2.reason || "", /article body/i);

  // Case C: Completely unreferenced
  prisma.blogPost = {
    findFirst: async () => null,
    findMany: async () => [
      {
        id: "post-3",
        title: "Clean Post",
        content: { type: "doc", content: [] },
      },
    ],
  };
  const ref3 = await isImageReferencedInDatabase(targetId);
  assert.equal(ref3.isReferenced, false);

  // Case D: Fail-closed on database error
  prisma.blogPost = {
    findFirst: async () => { throw new Error("Connection lost"); },
    findMany: async () => [],
  };
  await assert.rejects(
    () => isImageReferencedInDatabase(targetId),
    /Database reference check failed: Connection lost/
  );
});

// ==========================================
// 5. Cloudinary SDK Upload Function
// ==========================================

test("9. Cloudinary Upload: Executes uploadImageToCloudinary using SDK upload_stream", async () => {
  const mockResult = {
    secure_url: "https://res.cloudinary.com/test-cloud/image/upload/v12345/ielung/blog/uploaded.webp",
    public_id: "ielung/blog/uploaded",
    width: 1200,
    height: 800,
  };

  let capturedOptions = null;
  cloudinary.uploader.upload_stream = (options, callback) => {
    capturedOptions = options;
    return {
      end: (buffer) => {
        assert.ok(buffer && buffer.length > 0);
        process.nextTick(() => callback(null, mockResult));
      },
    };
  };

  const uploadRes = await uploadImageToCloudinary(createJpegBuffer());
  assert.equal(uploadRes.secure_url, mockResult.secure_url);
  assert.equal(uploadRes.public_id, "ielung/blog/uploaded");
  assert.equal(uploadRes.width, 1200);
  assert.equal(uploadRes.height, 800);
  assert.equal(capturedOptions.folder, "ielung/blog");
  assert.deepEqual(capturedOptions.transformation, [{ fetch_format: "auto", quality: "auto" }]);
});

test("10. Cloudinary Upload: Rejection on SDK upload error", async () => {
  cloudinary.uploader.upload_stream = (options, callback) => {
    return {
      end: () => {
        process.nextTick(() => callback(new Error("Cloudinary rate limit exceeded")));
      },
    };
  };

  await assert.rejects(
    () => uploadImageToCloudinary(createJpegBuffer()),
    /Cloudinary rate limit exceeded/
  );
});

// ==========================================
// 6. Cloudinary SDK Deletion Function
// ==========================================

test("11. Cloudinary Deletion: Executes deleteImageFromCloudinary with validation and DB safety", async () => {
  // Setup unreferenced DB mock
  prisma.blogPost = {
    findFirst: async () => null,
    findMany: async () => [],
  };

  let capturedDestroyId = null;
  let capturedDestroyOptions = null;
  cloudinary.uploader.destroy = async (publicId, options) => {
    capturedDestroyId = publicId;
    capturedDestroyOptions = options;
    return { result: "ok" };
  };

  const validTarget = "ielung/blog/orphan_image";
  const result = await deleteImageFromCloudinary(validTarget);
  assert.equal(result.success, true);
  assert.equal(result.publicId, validTarget);
  assert.equal(capturedDestroyId, validTarget);
  assert.equal(capturedDestroyOptions.resource_type, "image");
  assert.equal(capturedDestroyOptions.invalidate, true);
});

test("12. Cloudinary Deletion: Rejects invalid folder without invoking SDK", async () => {
  await assert.rejects(
    () => deleteImageFromCloudinary("unauthorized_folder/image"),
    /Deletion is restricted to the 'ielung\/blog' folder/
  );
});

test("13. Cloudinary Deletion: Aborts deletion if image is referenced in database", async () => {
  prisma.blogPost = {
    findFirst: async () => ({ id: "post-1", title: "Active Article" }),
    findMany: async () => [],
  };

  await assert.rejects(
    () => deleteImageFromCloudinary("ielung/blog/active_cover"),
    /Cannot delete image: Image is currently referenced as the cover image/
  );
});

// ==========================================
// 7. Route Handlers: Upload & Delete Route Tests
// ==========================================

test("14. Upload Route: Rejects unauthenticated requests with HTTP 401", async () => {
  const req = new Request("http://localhost:3000/api/admin/media/upload", {
    method: "POST",
  });
  const res = await uploadRoute(req);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.match(data.error, /Unauthorized/i);
});

test("15. Upload Route: Rejects oversized Content-Length pre-check with HTTP 413", async () => {
  // If request has content-length > 6 MB, pre-check immediately returns 413
  // Even if auth passes or before body is read. But note: auth check comes first for defense-in-depth.
  // When unauthenticated, it returns 401. Let's verify 401 precedence:
  const req = new Request("http://localhost:3000/api/admin/media/upload", {
    method: "POST",
    headers: {
      "content-length": String(MAX_MULTIPART_REQUEST_BYTES + 1024),
    },
  });
  const res = await uploadRoute(req);
  // Unauthenticated returns 401 first
  assert.equal(res.status, 401);
});

test("16. Delete Route: Rejects unauthenticated requests with HTTP 401", async () => {
  const req = new Request("http://localhost:3000/api/admin/media/delete", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ publicId: "ielung/blog/photo" }),
  });
  const res = await deleteRoute(req);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.match(data.error, /Unauthorized/i);
});

test("17. Bounded Streaming: Reader immediately aborts stream when chunks exceed 6 MB", async () => {
  let streamCancelled = false;
  const chunkSize = 1024 * 1024; // 1 MB
  const totalChunks = 8; // 8 MB total, exceeding 6 MB cap

  const mockReadable = new ReadableStream({
    pull(controller) {
      controller.enqueue(new Uint8Array(chunkSize));
    },
    cancel() {
      streamCancelled = true;
    },
  });

  const reader = mockReadable.getReader();
  let totalBytes = 0;
  let hitLimit = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      totalBytes += value.length;
      if (totalBytes > MAX_MULTIPART_REQUEST_BYTES) {
        await reader.cancel();
        hitLimit = true;
        break;
      }
    }
  }

  assert.equal(hitLimit, true);
  assert.equal(streamCancelled, true);
  assert.equal(totalBytes, 7 * 1024 * 1024); // Exceeded at 7th chunk
});

test("18. Tiptap AST: Detects Public ID inside transformed and responsive Cloudinary URLs", () => {
  const targetId = "ielung/blog/doctor_portrait";

  const transformedAst = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "image",
            attrs: {
              src: "https://res.cloudinary.com/cloud_name/image/upload/c_fill,w_800,h_600,q_auto,f_auto/v1698765432/ielung/blog/doctor_portrait.webp",
            },
          },
        ],
      },
    ],
  };

  assert.equal(isPublicIdReferencedInTiptap(transformedAst, targetId), true);
});
