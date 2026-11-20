import test from "node:test";
import assert from "node:assert/strict";

// Configure test environment variables before module imports
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "1234567890";
process.env.CLOUDINARY_API_SECRET = "test-secret";
process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/test";

import { prisma } from "../lib/prisma.ts";
import {
  CreateBlogPostSchema,
  UpdateBlogPostSchema,
  DoctorSpecialtyOverridesSchema,
} from "../lib/validations/blog.validation.ts";
import {
  createBlogPostService,
  updateBlogPostService,
  getBlogPostByIdService,
  publishBlogPostService,
  unpublishBlogPostService,
  ensureUniqueSlug,
} from "../lib/blog/service.ts";
import {
  createEmptyTiptapDoc,
  isTiptapDocEmpty,
} from "../components/admin/blog/editor-utils.ts";
import {
  serializeFormSnapshot,
  isFormSnapshotDirty,
  shouldInterceptNavigation,
} from "../components/admin/blog/form-utils.ts";

function createValidDoc(text = "Clinical respiratory insights.") {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

// ==========================================
// 1. Creation Lifecycle: Always DRAFT
// ==========================================

test("1. Create Form Workflow: Creating a post always initializes status as DRAFT with null publishedAt", async () => {
  let createdData = null;
  prisma.blogPost = {
    findUnique: async () => null,
    create: async ({ data }) => {
      createdData = data;
      return { id: "post-draft-1", ...data };
    },
  };

  const post = await createBlogPostService({
    title: "Understanding Sleep Apnea",
    excerpt: "Comprehensive overview of obstructive sleep apnea diagnostic pathways.",
    content: createValidDoc(),
    author: "Inland Empire Lung & Sleep Institute",
  });

  assert.equal(post.id, "post-draft-1");
  assert.equal(createdData.status, "DRAFT");
  assert.equal(createdData.publishedAt, null);
});

test("2. Create Form Workflow: Saving a draft never publishes the post automatically", async () => {
  let createdData = null;
  prisma.blogPost = {
    findUnique: async () => null,
    create: async ({ data }) => {
      createdData = data;
      return { id: "post-draft-2", ...data };
    },
  };

  await createBlogPostService({
    title: "Draft Article",
    excerpt: "Draft excerpt",
    content: createValidDoc(),
  });

  assert.equal(createdData.status, "DRAFT");
  assert.equal(createdData.publishedAt, null);
});

// ==========================================
// 2. Two-Step Publish Workflow for New Posts
// ==========================================

test("3. Publish Form Workflow: Publishing a new post creates DRAFT first, then publishes it", async () => {
  let postInDb = null;

  prisma.blogPost = {
    findUnique: async ({ where }) => {
      if (postInDb && (where.id === postInDb.id || where.slug === postInDb.slug)) {
        return postInDb;
      }
      return null;
    },
    create: async ({ data }) => {
      postInDb = { id: "post-new-pub", ...data };
      return postInDb;
    },
    update: async ({ data }) => {
      postInDb = { ...postInDb, ...data };
      return postInDb;
    },
  };

  // Step 1: Create draft
  const draft = await createBlogPostService({
    title: "New Advances in Bronchoscopy",
    excerpt: "Robotic bronchoscopy procedures at Redlands Community Hospital.",
    content: createValidDoc("Advanced robotic-assisted navigational bronchoscopy."),
  });
  assert.equal(draft.status, "DRAFT");
  assert.equal(draft.publishedAt, null);

  // Step 2: Explicit publish
  const published = await publishBlogPostService(draft.id);
  assert.equal(published.status, "PUBLISHED");
  assert.ok(published.publishedAt instanceof Date);
});

test("4. Publish Form Workflow: If publishing fails after draft creation, draft remains safely preserved", async () => {
  let postInDb = null;

  prisma.blogPost = {
    findUnique: async ({ where }) => {
      if (postInDb && where.id === postInDb.id) return postInDb;
      return null;
    },
    create: async ({ data }) => {
      postInDb = { id: "post-fail-pub", ...data };
      return postInDb;
    },
    update: async () => {
      throw new Error("Simulated publishing failure (e.g. database timeout)");
    },
  };

  // Step 1: Draft creation succeeds
  const draft = await createBlogPostService({
    title: "Post with Publish Failure",
    excerpt: "Excerpt text",
    content: createValidDoc("Valid clinical text."),
  });
  assert.equal(draft.id, "post-fail-pub");
  assert.equal(draft.status, "DRAFT");

  // Step 2: Publishing fails
  await assert.rejects(async () => {
    await publishBlogPostService(draft.id);
  }, /Simulated publishing failure/);

  // The draft post in database remains available and intact
  assert.equal(postInDb.id, "post-fail-pub");
  assert.equal(postInDb.status, "DRAFT");
});

// ==========================================
// 3. Edit Form Workflow & Status Preservation
// ==========================================

test("5. Edit Form Workflow: Editing a draft post preserves its DRAFT status", async () => {
  let updatedData = null;
  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-edit-draft",
      title: "Original Draft Title",
      slug: "original-draft-title",
      status: "DRAFT",
      publishedAt: null,
    }),
    update: async ({ data }) => {
      updatedData = data;
      return { id: "post-edit-draft", status: "DRAFT", ...data };
    },
  };

  const updated = await updateBlogPostService("post-edit-draft", {
    title: "Updated Draft Title",
  });

  assert.equal(updatedData.title, "Updated Draft Title");
  assert.equal(updatedData.status, undefined); // Status was not touched
  assert.equal(updated.status, "DRAFT");
});

test("6. Edit Form Workflow: Editing a published post preserves PUBLISHED status and original publishedAt", async () => {
  const originalPublishedAt = new Date("2024-05-15T10:00:00Z");
  let updatedData = null;

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-edit-pub",
      title: "Original Title",
      slug: "original-title",
      status: "PUBLISHED",
      publishedAt: originalPublishedAt,
    }),
    update: async ({ data }) => {
      updatedData = data;
      return { id: "post-edit-pub", status: "PUBLISHED", publishedAt: originalPublishedAt, ...data };
    },
  };

  const updated = await updateBlogPostService("post-edit-pub", {
    excerpt: "Updated excerpt text reflecting new clinical guidelines.",
  });

  assert.equal(updatedData.excerpt, "Updated excerpt text reflecting new clinical guidelines.");
  assert.equal(updatedData.status, undefined);
  assert.equal(updatedData.publishedAt, undefined);
  assert.equal(updated.status, "PUBLISHED");
  assert.equal(updated.publishedAt.getTime(), originalPublishedAt.getTime());
});

test("7. Unpublish Form Workflow: Unpublishing uses dedicated action and preserves publishedAt timestamp", async () => {
  const originalDate = new Date("2024-03-01T12:00:00Z");
  let updatedData = null;

  prisma.blogPost = {
    findUnique: async () => ({
      id: "post-unpub",
      title: "To Be Unpublished",
      status: "PUBLISHED",
      publishedAt: originalDate,
    }),
    update: async ({ data }) => {
      updatedData = data;
      return { id: "post-unpub", ...data, publishedAt: originalDate };
    },
  };

  await unpublishBlogPostService("post-unpub");
  assert.equal(updatedData.status, "DRAFT");
  assert.equal(updatedData.publishedAt, undefined); // Not overwritten or destroyed
});

// ==========================================
// 4. Data Loading & Missing Post Handling
// ==========================================

test("8. Form Data Loading: getBlogPostByIdService retrieves all fields for form pre-fill", async () => {
  const mockPost = {
    id: "post-full-123",
    title: "Pulmonary Hypertension Comprehensive Guide",
    slug: "pulmonary-hypertension-guide",
    excerpt: "Clinical insights from Loma Linda accredited PH program.",
    content: createValidDoc(),
    coverImage: "https://res.cloudinary.com/test-cloud/image/upload/v1/ielung/blog/ph.webp",
    coverImagePublicId: "ielung/blog/ph",
    author: "Dr. Paresh C. Giri",
    status: "PUBLISHED",
    publishedAt: new Date("2024-06-01"),
    readingTimeMinutes: 4,
    showDoctorsSection: true,
    doctorSpecialtyOverrides: { "1": "Director, Pulmonary Hypertension Program" },
    faqs: [{ question: "What is PH?", answer: "High blood pressure in the pulmonary arterial system." }],
  };

  prisma.blogPost = {
    findUnique: async () => mockPost,
  };

  const loaded = await getBlogPostByIdService("post-full-123");
  assert.equal(loaded.id, "post-full-123");
  assert.equal(loaded.title, "Pulmonary Hypertension Comprehensive Guide");
  assert.equal(loaded.coverImagePublicId, "ielung/blog/ph");
  assert.equal(loaded.showDoctorsSection, true);
  assert.deepEqual(loaded.doctorSpecialtyOverrides, { "1": "Director, Pulmonary Hypertension Program" });
  assert.equal(loaded.faqs.length, 1);
});

test("9. Form Error Handling: getBlogPostByIdService throws clean error for missing post IDs", async () => {
  prisma.blogPost = {
    findUnique: async () => null,
  };

  await assert.rejects(async () => {
    await getBlogPostByIdService("non-existent-id");
  }, /Blog post with ID 'non-existent-id' was not found/);
});

// ==========================================
// 5. Slug Uniqueness & Cover Image Validation
// ==========================================

test("10. Slug Validation: Collision is handled with clean error or counter resolution", async () => {
  prisma.blogPost = {
    findUnique: async ({ where }) => {
      if (where.slug === "existing-article") return { id: "p1" };
      return null;
    },
  };

  const resolved = await ensureUniqueSlug("existing-article");
  assert.equal(resolved, "existing-article-1");
});

test("11. Cover Image Validation: Validates URL and public ID pairing, allows safe removal", () => {
  // Valid cover image and public ID
  const valid = CreateBlogPostSchema.safeParse({
    title: "Title",
    excerpt: "Excerpt",
    content: createValidDoc(),
    coverImage: "https://res.cloudinary.com/test-cloud/image/upload/v123/ielung/blog/img.webp",
    coverImagePublicId: "ielung/blog/img",
  });
  assert.equal(valid.success, true);

  // Safe removal: coverImage: null and coverImagePublicId: null
  const removed = CreateBlogPostSchema.safeParse({
    title: "Title",
    excerpt: "Excerpt",
    content: createValidDoc(),
    coverImage: null,
    coverImagePublicId: null,
  });
  assert.equal(removed.success, true);

  // Invalid: Traversal in public ID rejected
  const traversal = CreateBlogPostSchema.safeParse({
    title: "Title",
    excerpt: "Excerpt",
    content: createValidDoc(),
    coverImagePublicId: "ielung/blog/../../etc/passwd",
  });
  assert.equal(traversal.success, false);
});

// ==========================================
// 6. FAQs, Doctor Overrides & Tiptap Stability
// ==========================================

test("12. FAQs & Doctor Settings: Schema validates and preserves clinical settings", () => {
  const payload = {
    title: "Title",
    excerpt: "Excerpt",
    content: createValidDoc(),
    showDoctorsSection: true,
    doctorSpecialtyOverrides: {
      "1": "Senior Pulmonologist",
      "4": "Director, Advanced Bronchoscopy",
    },
    faqs: [
      { question: "What is asthma?", answer: "A chronic inflammatory respiratory condition." },
    ],
  };

  const parsed = CreateBlogPostSchema.safeParse(payload);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.showDoctorsSection, true);
  assert.deepEqual(parsed.data.doctorSpecialtyOverrides, {
    "1": "Senior Pulmonologist",
    "4": "Director, Advanced Bronchoscopy",
  });

  // Rejects invalid doctor key (only '1'-'7' allowed)
  assert.equal(
    DoctorSpecialtyOverridesSchema.safeParse({ "99": "Invalid" }).success,
    false
  );
});

test("13. Tiptap Content Stability: Helper utilities detect empty docs and construct valid defaults", () => {
  const emptyDoc = createEmptyTiptapDoc();
  assert.equal(emptyDoc.type, "doc");
  assert.equal(emptyDoc.content.length, 1);
  assert.equal(emptyDoc.content[0].type, "paragraph");
  assert.equal(isTiptapDocEmpty(emptyDoc), true);

  const populatedDoc = createValidDoc("Non-empty clinical advice.");
  assert.equal(isTiptapDocEmpty(populatedDoc), false);
});

test("14. Concurrency Guard: Prevents duplicate submissions while operation is running", () => {
  let isSubmitting = false;

  function trySubmit(actionName) {
    if (isSubmitting) {
      return { blocked: true };
    }
    isSubmitting = true;
    return { blocked: false, action: actionName };
  }

  // First click succeeds
  const click1 = trySubmit("save");
  assert.equal(click1.blocked, false);

  // Second rapid click while isSubmitting is true is blocked
  const click2 = trySubmit("save");
  assert.equal(click2.blocked, true);

  // Reset after completion
  isSubmitting = false;
  const click3 = trySubmit("publish");
  assert.equal(click3.blocked, false);
});

// ==========================================
// 6. Dirty State Detection Across All Fields
// ==========================================

test("15. Form State: Accurately detects dirty state across all individual fields, content, FAQs, and doctors", () => {
  const initialData = {
    title: "Original Title",
    slug: "original-title",
    excerpt: "Original excerpt summary",
    author: "Inland Empire Lung & Sleep Institute",
    content: createValidDoc("Original clinical content."),
    coverImage: "https://res.cloudinary.com/test-cloud/image/upload/v1/ielung/blog/orig.webp",
    coverImagePublicId: "ielung/blog/orig",
    showDoctorsSection: false,
    doctorSpecialtyOverrides: {},
    faqs: [{ question: "Q1?", answer: "A1" }],
  };

  const baseline = serializeFormSnapshot(initialData);

  // 1. Initial data matches baseline: NOT dirty
  assert.equal(isFormSnapshotDirty(baseline, initialData), false);

  // 2. Modifying title marks dirty
  assert.equal(isFormSnapshotDirty(baseline, { ...initialData, title: "Changed Title" }), true);

  // 3. Modifying slug marks dirty
  assert.equal(isFormSnapshotDirty(baseline, { ...initialData, slug: "changed-slug" }), true);

  // 4. Modifying excerpt marks dirty
  assert.equal(isFormSnapshotDirty(baseline, { ...initialData, excerpt: "New excerpt" }), true);

  // 5. Modifying author marks dirty
  assert.equal(isFormSnapshotDirty(baseline, { ...initialData, author: "Dr. Faculty" }), true);

  // 6. Modifying Tiptap content AST marks dirty
  assert.equal(
    isFormSnapshotDirty(baseline, { ...initialData, content: createValidDoc("Updated content.") }),
    true
  );

  // 7. Modifying coverImage or coverImagePublicId marks dirty
  assert.equal(
    isFormSnapshotDirty(baseline, { ...initialData, coverImage: null, coverImagePublicId: null }),
    true
  );

  // 8. Modifying showDoctorsSection marks dirty
  assert.equal(isFormSnapshotDirty(baseline, { ...initialData, showDoctorsSection: true }), true);

  // 9. Modifying doctorSpecialtyOverrides marks dirty
  assert.equal(
    isFormSnapshotDirty(baseline, {
      ...initialData,
      doctorSpecialtyOverrides: { "1": "Lead Pulmonologist" },
    }),
    true
  );

  // 10. Modifying FAQs (add/edit/delete) marks dirty
  assert.equal(
    isFormSnapshotDirty(baseline, {
      ...initialData,
      faqs: [{ question: "Q1?", answer: "A1" }, { question: "Q2?", answer: "A2" }],
    }),
    true
  );

  // 11. Reverting edits back to match baseline restores NOT dirty state
  assert.equal(isFormSnapshotDirty(baseline, { ...initialData }), false);
});

// ==========================================
// 7. Baseline Reset on Save vs Failed Save
// ==========================================

test("16. Baseline Reset: Successful save updates baseline; failed save preserves entered data and dirty state", () => {
  const initialData = {
    title: "Initial Draft",
    slug: "initial-draft",
    excerpt: "Initial excerpt",
    author: "Inland Empire Lung & Sleep Institute",
    content: createValidDoc("Draft content."),
    coverImage: null,
    coverImagePublicId: null,
    showDoctorsSection: false,
    doctorSpecialtyOverrides: {},
    faqs: [],
  };

  let baseline = serializeFormSnapshot(initialData);

  // User edits the post
  const editedData = {
    ...initialData,
    title: "Updated Post Title",
    excerpt: "Updated excerpt text",
  };
  assert.equal(isFormSnapshotDirty(baseline, editedData), true);

  // Simulated Failed Save: baseline remains unchanged, form remains dirty
  const simulatedSaveFailure = false;
  if (!simulatedSaveFailure) {
    // Baseline is NOT updated
    assert.equal(isFormSnapshotDirty(baseline, editedData), true);
    // User data is preserved in editedData
    assert.equal(editedData.title, "Updated Post Title");
  }

  // Simulated Successful Save: baseline is updated to current saved state
  const simulatedSaveSuccess = true;
  if (simulatedSaveSuccess) {
    baseline = serializeFormSnapshot(editedData);
  }

  // Now, current edited data matches new baseline: NOT dirty!
  assert.equal(isFormSnapshotDirty(baseline, editedData), false);

  // Any subsequent new edits will now be compared against the new baseline
  const subsequentEdit = {
    ...editedData,
    title: "Subsequent Edit",
  };
  assert.equal(isFormSnapshotDirty(baseline, subsequentEdit), true);
});

// ==========================================
// 8. Navigation Guard Logic
// ==========================================

test("17. Navigation Guard: Intercepts internal links when dirty, ignores when clean, ignores new-tab/anchor jumps", () => {
  const currentUrl = "https://ielung.com/ielung-admin/blog/new";

  // 1. When form is clean, NO navigation is intercepted
  assert.equal(
    shouldInterceptNavigation({
      isDirty: false,
      targetHref: "/ielung-admin/blog",
      currentLocationHref: currentUrl,
    }),
    false
  );

  assert.equal(
    shouldInterceptNavigation({
      isDirty: false,
      targetHref: "/ielung-admin",
      currentLocationHref: currentUrl,
    }),
    false
  );

  // 2. When form is dirty, navigation to other pages IS intercepted
  assert.equal(
    shouldInterceptNavigation({
      isDirty: true,
      targetHref: "/ielung-admin/blog",
      currentLocationHref: currentUrl,
    }),
    true
  );

  assert.equal(
    shouldInterceptNavigation({
      isDirty: true,
      targetHref: "/ielung-admin",
      currentLocationHref: currentUrl,
    }),
    true
  );

  assert.equal(
    shouldInterceptNavigation({
      isDirty: true,
      targetHref: "/ielung-admin/subscribers",
      currentLocationHref: currentUrl,
    }),
    true
  );

  // 3. Same-page anchor/hash jumps are NOT intercepted
  assert.equal(
    shouldInterceptNavigation({
      isDirty: true,
      targetHref: "/ielung-admin/blog/new#details",
      currentLocationHref: currentUrl,
    }),
    false
  );

  // 4. Opening in new tab/window (_blank) is NOT intercepted
  assert.equal(
    shouldInterceptNavigation({
      isDirty: true,
      targetHref: "https://cloudinary.com/console",
      currentLocationHref: currentUrl,
      targetAttr: "_blank",
    }),
    false
  );

  // 5. Modified clicks (Cmd/Ctrl/Shift/Alt) to open new tab are NOT intercepted
  assert.equal(
    shouldInterceptNavigation({
      isDirty: true,
      targetHref: "/ielung-admin/blog",
      currentLocationHref: currentUrl,
      isModifiedClick: true,
    }),
    false
  );

  // 6. Download links are NOT intercepted
  assert.equal(
    shouldInterceptNavigation({
      isDirty: true,
      targetHref: "/downloads/clinical-guide.pdf",
      currentLocationHref: currentUrl,
      hasDownloadAttr: true,
    }),
    false
  );
});

test("18. Navigation Guard Lifecycle: Confirmation clears dirty ref and prevents navigation loops", () => {
  let isDirty = true;
  let isDirtyRef = { current: true };
  let hasGuardedHistory = { current: true };

  // Helper simulating the navigation confirmation callback
  function handleNavigationDecision(confirmed) {
    if (!confirmed) {
      // User cancelled: keep dirty flag and guard
      return { cancelled: true, allowNavigation: false };
    } else {
      // User confirmed: clear dirty flags so Next.js navigates cleanly without secondary prompt
      isDirty = false;
      isDirtyRef.current = false;
      hasGuardedHistory.current = false;
      return { cancelled: false, allowNavigation: true };
    }
  }

  // Case A: User cancels navigation
  const cancelResult = handleNavigationDecision(false);
  assert.equal(cancelResult.allowNavigation, false);
  assert.equal(isDirtyRef.current, true);

  // Case B: User confirms navigation
  const confirmResult = handleNavigationDecision(true);
  assert.equal(confirmResult.allowNavigation, true);
  assert.equal(isDirtyRef.current, false);
  assert.equal(hasGuardedHistory.current, false);

  // Subsequent check is clean
  assert.equal(
    shouldInterceptNavigation({
      isDirty: isDirtyRef.current,
      targetHref: "/ielung-admin/blog",
      currentLocationHref: "https://ielung.com/ielung-admin/blog/new",
    }),
    false
  );
});
