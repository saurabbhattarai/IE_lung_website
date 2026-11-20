"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSONContent } from "@tiptap/react";
import {
  FileText,
  Save,
  Globe,
  Upload,
  Trash2,
  Plus,
  ArrowLeft,
  RotateCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import BlogContentEditor from "./BlogContentEditor";
import { providers } from "@/lib/constants/doctorsData";
import {
  createBlogPostAction,
  updateBlogPostAction,
  publishBlogPostAction,
  unpublishBlogPostAction,
} from "@/lib/actions/blog.action";

import {
  FormSnapshotInput,
  serializeFormSnapshot,
  isFormSnapshotDirty,
  NavigationInterceptOptions,
  shouldInterceptNavigation,
} from "./form-utils";

export type { FormSnapshotInput, NavigationInterceptOptions };
export {
  serializeFormSnapshot,
  isFormSnapshotDirty,
  shouldInterceptNavigation,
};

export interface BlogPostFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: JSONContent;
  coverImage?: string | null;
  coverImagePublicId?: string | null;
  author: string;
  status?: "DRAFT" | "PUBLISHED";
  publishedAt?: Date | string | null;
  readingTimeMinutes?: number;
  showDoctorsSection: boolean;
  doctorSpecialtyOverrides?: Record<string, string> | null;
  faqs?: Array<{ question: string; answer: string }> | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

interface BlogPostFormProps {
  mode: "create" | "edit";
  initialPost?: BlogPostFormData | null;
}

/**
 * Normalizes title string into a clean, URL-safe slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogPostForm({
  mode,
  initialPost,
}: BlogPostFormProps) {
  const router = useRouter();

  // Basic information state
  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    mode === "edit" || (Boolean(initialPost?.slug) && initialPost?.slug !== slugify(initialPost?.title || ""))
  );
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [author, setAuthor] = useState(
    initialPost?.author || "Inland Empire Lung & Sleep Institute"
  );

  // Article content
  const [content, setContent] = useState<JSONContent>(
    initialPost?.content || {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
      ],
    }
  );

  // Cover image
  const [coverImage, setCoverImage] = useState<string | null>(
    initialPost?.coverImage || null
  );
  const [coverImagePublicId, setCoverImagePublicId] = useState<string | null>(
    initialPost?.coverImagePublicId || null
  );
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Status & timestamps
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    initialPost?.status || "DRAFT"
  );
  const [publishedAt, setPublishedAt] = useState<Date | string | null>(
    initialPost?.publishedAt || null
  );
  const [readingTime, setReadingTime] = useState(
    initialPost?.readingTimeMinutes || 1
  );

  // FAQs
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    Array.isArray(initialPost?.faqs) ? initialPost.faqs : []
  );

  // Doctor section & overrides
  const [showDoctorsSection, setShowDoctorsSection] = useState(
    initialPost?.showDoctorsSection || false
  );
  const [doctorOverrides, setDoctorOverrides] = useState<Record<string, string>>(
    (initialPost?.doctorSpecialtyOverrides as Record<string, string>) || {}
  );

  // Form submission and dirty tracking
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isDirtyRef = useRef(false);
  const hasGuardedHistoryRef = useRef(false);

  // Baseline snapshot ref to reliably track dirty state across all fields
  const initialSnapshotRef = useRef<string>(
    serializeFormSnapshot({
      title: initialPost?.title || "",
      slug: initialPost?.slug || "",
      excerpt: initialPost?.excerpt || "",
      author: initialPost?.author || "Inland Empire Lung & Sleep Institute",
      content: initialPost?.content || {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "" }],
          },
        ],
      },
      coverImage: initialPost?.coverImage || null,
      coverImagePublicId: initialPost?.coverImagePublicId || null,
      showDoctorsSection: Boolean(initialPost?.showDoctorsSection),
      doctorSpecialtyOverrides:
        (initialPost?.doctorSpecialtyOverrides as Record<string, string>) || {},
      faqs: Array.isArray(initialPost?.faqs) ? initialPost.faqs : [],
    })
  );

  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successNotification, setSuccessNotification] = useState<string | null>(
    null
  );

  // Synchronize dirty state against baseline snapshot whenever any form value changes
  useEffect(() => {
    const currentSnapshot: FormSnapshotInput = {
      title,
      slug,
      excerpt,
      author,
      content,
      coverImage,
      coverImagePublicId,
      showDoctorsSection,
      doctorSpecialtyOverrides: doctorOverrides,
      faqs,
    };
    const dirty = isFormSnapshotDirty(
      initialSnapshotRef.current,
      currentSnapshot
    );
    setIsDirty(dirty);
    isDirtyRef.current = dirty;
  }, [
    title,
    slug,
    excerpt,
    author,
    content,
    coverImage,
    coverImagePublicId,
    showDoctorsSection,
    doctorOverrides,
    faqs,
  ]);

  // 1. Intercept internal client-side navigation (breadcrumbs, back-to-list, sidebar, etc.)
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      if (!isDirtyRef.current) return;

      if (e.defaultPrevented || e.button !== 0) return;
      const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

      const anchor = (e.target as Element).closest("a");
      if (!anchor || !anchor.href) return;

      const shouldIntercept = shouldInterceptNavigation({
        isDirty: isDirtyRef.current,
        targetHref: anchor.href,
        currentLocationHref: window.location.href,
        targetAttr: anchor.getAttribute("target"),
        hasDownloadAttr: anchor.hasAttribute("download"),
        isModifiedClick,
      });

      if (!shouldIntercept) return;

      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page without saving?"
      );

      if (!confirmed) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }
      } else {
        // User confirmed navigation: clear dirty ref so no subsequent guards fire
        isDirtyRef.current = false;
        setIsDirty(false);
        hasGuardedHistoryRef.current = false;
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  // 2. Intercept browser Back/Forward navigation (popstate)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      if (!isDirtyRef.current) {
        hasGuardedHistoryRef.current = false;
        return;
      }

      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page without saving?"
      );

      if (!confirmed) {
        // User cancelled: restore sentinel in history stack so user remains here
        window.history.pushState(
          { ...window.history.state, __ielungBlogDirtyGuard: true },
          "",
          window.location.href
        );
      } else {
        // User confirmed leaving
        isDirtyRef.current = false;
        setIsDirty(false);
        hasGuardedHistoryRef.current = false;
        window.history.back();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Push guard history state when transitioning to dirty
  useEffect(() => {
    if (
      isDirty &&
      !hasGuardedHistoryRef.current &&
      typeof window !== "undefined"
    ) {
      window.history.pushState(
        { ...window.history.state, __ielungBlogDirtyGuard: true },
        "",
        window.location.href
      );
      hasGuardedHistoryRef.current = true;
    }
  }, [isDirty]);

  // 3. Tab close and page refresh warning (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Handle Title input and auto-slug generation
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  // Handle manual Slug input
  const handleSlugChange = (val: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    setIsDirty(true);
  };

  // Regenerate slug from title
  const handleRegenerateSlug = () => {
    setIsSlugManuallyEdited(false);
    setSlug(slugify(title));
    setIsDirty(true);
  };

  // Cover Image Upload Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setGeneralError("Cover image must not exceed 5 MB.");
      return;
    }

    setIsUploadingCover(true);
    setGeneralError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Upload failed with status ${res.status}`);
      }

      setCoverImage(data.secure_url);
      setCoverImagePublicId(data.public_id);
      setIsDirty(true);
      setSuccessNotification("Cover image uploaded successfully.");
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : "Failed to upload cover image."
      );
    } finally {
      setIsUploadingCover(false);
      if (coverFileInputRef.current) {
        coverFileInputRef.current.value = "";
      }
    }
  };

  // Remove Cover Image
  const handleRemoveCover = () => {
    setCoverImage(null);
    setCoverImagePublicId(null);
    setIsDirty(true);
  };

  // FAQ management
  const handleAddFaq = () => {
    if (faqs.length >= 20) return;
    setFaqs([...faqs, { question: "", answer: "" }]);
    setIsDirty(true);
  };

  const handleUpdateFaq = (
    index: number,
    field: "question" | "answer",
    val: string
  ) => {
    const next = [...faqs];
    next[index][field] = val;
    setFaqs(next);
    setIsDirty(true);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Doctor override management
  const handleDoctorOverrideChange = (docId: number, val: string) => {
    const next = { ...doctorOverrides };
    const key = String(docId);
    if (!val.trim()) {
      delete next[key];
    } else {
      next[key] = val;
    }
    setDoctorOverrides(next);
    setIsDirty(true);
  };

  // Prepare payload for Server Action
  const preparePayload = () => {
    // Filter FAQs to only non-empty questions
    const cleanFaqs = faqs
      .filter((f) => f.question.trim().length > 0)
      .map((f) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
      }));

    // Clean doctor overrides (only valid keys with content)
    const cleanDoctorOverrides: Record<string, string> = {};
    Object.entries(doctorOverrides).forEach(([k, v]) => {
      if (v && v.trim().length > 0) {
        cleanDoctorOverrides[k] = v.trim();
      }
    });

    return {
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim(),
      content,
      coverImage: coverImage || null,
      coverImagePublicId: coverImagePublicId || null,
      author: author.trim() || "Inland Empire Lung & Sleep Institute",
      showDoctorsSection,
      doctorSpecialtyOverrides:
        Object.keys(cleanDoctorOverrides).length > 0
          ? cleanDoctorOverrides
          : null,
      faqs: cleanFaqs.length > 0 ? cleanFaqs : null,
    };
  };

  // Save Draft Action (or Save Changes in Edit mode)
  const handleSaveDraftOrUpdate = async () => {
    setIsSubmitting(true);
    setGeneralError(null);
    setFieldErrors({});
    setSuccessNotification(null);

    try {
      const payload = preparePayload();

      if (mode === "create") {
        const res = await createBlogPostAction(payload);
        if (!res.success) {
          setGeneralError(res.error || "Failed to create draft.");
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
          return;
        }

        const createdPost = res.data as { id: string };
        // Update baseline snapshot & clear dirty guard
        initialSnapshotRef.current = serializeFormSnapshot({
          ...payload,
          author: payload.author,
          slug: payload.slug || slugify(payload.title),
        });
        isDirtyRef.current = false;
        hasGuardedHistoryRef.current = false;
        setIsDirty(false);

        setSuccessNotification("Draft post created successfully.");
        // Redirect to edit page of newly created post
        router.push(`/ielung-admin/blog/edit/${createdPost.id}`);
      } else {
        if (!initialPost?.id) throw new Error("Missing blog post ID.");

        const res = await updateBlogPostAction(initialPost.id, payload);
        if (!res.success) {
          setGeneralError(res.error || "Failed to update blog post.");
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
          return;
        }

        const updatedPost = res.data as { readingTimeMinutes: number };
        // Update baseline snapshot & clear dirty guard
        initialSnapshotRef.current = serializeFormSnapshot({
          ...payload,
          author: payload.author,
          slug: payload.slug || slug,
        });
        isDirtyRef.current = false;
        hasGuardedHistoryRef.current = false;
        setIsDirty(false);

        setReadingTime(updatedPost.readingTimeMinutes);
        setSuccessNotification("Post updated successfully.");
      }
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Publish Workflow Action
  const handlePublish = async () => {
    setIsSubmitting(true);
    setGeneralError(null);
    setFieldErrors({});
    setSuccessNotification(null);

    try {
      const payload = preparePayload();

      if (mode === "create") {
        // Step 1: Create draft first
        const createRes = await createBlogPostAction(payload);
        if (!createRes.success) {
          setGeneralError(createRes.error || "Failed to create post.");
          if (createRes.fieldErrors) setFieldErrors(createRes.fieldErrors);
          return;
        }

        const createdPost = createRes.data as { id: string };
        const newId = createdPost.id;

        // Step 2: Publish the created post
        const publishRes = await publishBlogPostAction(newId);
        if (!publishRes.success) {
          // If publish fails, draft remains intact! Navigate to edit page and show warning
          initialSnapshotRef.current = serializeFormSnapshot({
            ...payload,
            author: payload.author,
            slug: payload.slug || slugify(payload.title),
          });
          isDirtyRef.current = false;
          hasGuardedHistoryRef.current = false;
          setIsDirty(false);

          setGeneralError(
            `Draft saved, but publishing failed: ${publishRes.error}`
          );
          router.push(`/ielung-admin/blog/edit/${newId}`);
          return;
        }

        initialSnapshotRef.current = serializeFormSnapshot({
          ...payload,
          author: payload.author,
          slug: payload.slug || slugify(payload.title),
        });
        isDirtyRef.current = false;
        hasGuardedHistoryRef.current = false;
        setIsDirty(false);

        setSuccessNotification("Post created and published successfully.");
        router.push(`/ielung-admin/blog/edit/${newId}`);
      } else {
        if (!initialPost?.id) throw new Error("Missing blog post ID.");

        // Step 1: Save any pending form changes
        const updateRes = await updateBlogPostAction(initialPost.id, payload);
        if (!updateRes.success) {
          setGeneralError(updateRes.error || "Failed to save post changes.");
          if (updateRes.fieldErrors) setFieldErrors(updateRes.fieldErrors);
          return;
        }

        // Step 2: Publish post
        const publishRes = await publishBlogPostAction(initialPost.id);
        if (!publishRes.success) {
          // Edits were saved, so update baseline snapshot to saved edits
          initialSnapshotRef.current = serializeFormSnapshot({
            ...payload,
            author: payload.author,
            slug: payload.slug || slug,
          });
          isDirtyRef.current = false;
          hasGuardedHistoryRef.current = false;
          setIsDirty(false);

          setGeneralError(publishRes.error || "Failed to publish post.");
          return;
        }

        const publishedPost = publishRes.data as {
          publishedAt: Date | string | null;
        };
        initialSnapshotRef.current = serializeFormSnapshot({
          ...payload,
          author: payload.author,
          slug: payload.slug || slug,
        });
        isDirtyRef.current = false;
        hasGuardedHistoryRef.current = false;
        setIsDirty(false);

        setStatus("PUBLISHED");
        setPublishedAt(publishedPost.publishedAt);
        setSuccessNotification("Post published successfully.");
      }
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unpublish Workflow Action
  const handleUnpublish = async () => {
    if (!initialPost?.id) return;

    setIsSubmitting(true);
    setGeneralError(null);
    setSuccessNotification(null);

    try {
      const res = await unpublishBlogPostAction(initialPost.id);
      if (!res.success) {
        setGeneralError(res.error || "Failed to unpublish post.");
        return;
      }

      setStatus("DRAFT");
      setSuccessNotification("Post unpublished and moved to drafts.");
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : "Failed to unpublish post."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Notifications */}
      {generalError && (
        <div
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 font-medium flex items-center justify-between gap-3 shadow-xs"
          role="alert"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{generalError}</span>
          </div>
          <button
            type="button"
            onClick={() => setGeneralError(null)}
            className="text-red-400 hover:text-red-700"
            aria-label="Dismiss error notification"
          >
            &times;
          </button>
        </div>
      )}

      {successNotification && (
        <div
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 font-medium flex items-center justify-between gap-3 shadow-xs"
          role="status"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNotification(null)}
            className="text-emerald-400 hover:text-emerald-700"
            aria-label="Dismiss success notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Article Details, Content Editor, FAQs, Doctors */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Title, Slug, Excerpt */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#3D4749] uppercase tracking-wider">
                Article Details
              </h2>
              {isDirty && (
                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Unsaved edits
                </span>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="article-title" className="text-xs font-semibold text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="article-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Understanding Pulmonary Fibrosis: Symptoms and Care"
                maxLength={255}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A389]/30 focus:border-[#00A389] transition-all font-semibold"
              />
              {fieldErrors.title && (
                <p className="text-[11px] text-red-600 font-medium">{fieldErrors.title[0]}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="article-slug" className="text-xs font-semibold text-slate-700">
                  URL Slug
                </label>
                {isSlugManuallyEdited && (
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    className="text-[11px] font-semibold text-[#00A389] hover:underline"
                  >
                    Reset from title
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 pointer-events-none">
                  /blog/
                </span>
                <input
                  id="article-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="understanding-pulmonary-fibrosis"
                  maxLength={255}
                  className="w-full pl-16 pr-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A389]/30 focus:border-[#00A389] transition-all"
                />
              </div>
              {fieldErrors.slug && (
                <p className="text-[11px] text-red-600 font-medium">{fieldErrors.slug[0]}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="article-excerpt" className="text-xs font-semibold text-slate-700">
                  Excerpt / Summary <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {excerpt.length}/1000
                </span>
              </div>
              <textarea
                id="article-excerpt"
                rows={3}
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setIsDirty(true);
                }}
                maxLength={1000}
                placeholder="Brief summary displayed on article listing cards and search engine results..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A389]/30 focus:border-[#00A389] transition-all resize-y"
              />
              {fieldErrors.excerpt && (
                <p className="text-[11px] text-red-600 font-medium">{fieldErrors.excerpt[0]}</p>
              )}
            </div>
          </div>

          {/* Section 2: Article Rich Text Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Article Body Content <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Tiptap JSON AST with Cloudinary uploads
              </span>
            </div>

            <BlogContentEditor
              initialContent={content}
              onChange={(newContent) => {
                setContent(newContent);
                setIsDirty(true);
              }}
              disabled={isSubmitting}
            />

            {fieldErrors.content && (
              <p className="text-[11px] text-red-600 font-medium">{fieldErrors.content[0]}</p>
            )}
          </div>

          {/* Section 3: FAQs Management */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#00A389]" />
                <h3 className="text-sm font-bold text-[#3D4749]">
                  Frequently Asked Questions (FAQs)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                disabled={faqs.length >= 20 || isSubmitting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#00A389] bg-[#00A389]/10 hover:bg-[#00A389]/20 transition-colors disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {faqs.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">
                No FAQs added for this article yet. Click &ldquo;Add Question&rdquo; to include patient FAQs.
              </p>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        FAQ #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(index)}
                        disabled={isSubmitting}
                        aria-label={`Remove FAQ question ${index + 1}`}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        maxLength={300}
                        onChange={(e) =>
                          handleUpdateFaq(index, "question", e.target.value)
                        }
                        placeholder="e.g. How is pulmonary fibrosis diagnosed?"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A389]/30 focus:border-[#00A389] bg-white transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">
                        Answer
                      </label>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        maxLength={2000}
                        onChange={(e) =>
                          handleUpdateFaq(index, "answer", e.target.value)
                        }
                        placeholder="Comprehensive explanation addressing the question..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A389]/30 focus:border-[#00A389] bg-white transition-all resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Doctor Section & Specialty Overrides */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#00A389]" />
                <h3 className="text-sm font-bold text-[#3D4749]">
                  Physician Profile Display
                </h3>
              </div>

              {/* Toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDoctorsSection}
                  onChange={(e) => {
                    setShowDoctorsSection(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A389]"></div>
              </label>
            </div>

            <p className="text-xs text-slate-500">
              When enabled, Inland Empire Lung & Sleep Institute physician profiles are rendered at the conclusion of this article.
            </p>

            {showDoctorsSection && (
              <div className="pt-2 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Physician Specialty Overrides (Optional)
                </span>
                <div className="divide-y divide-slate-100">
                  {providers.map((doc) => {
                    const currentOverride = doctorOverrides[String(doc.id)] || "";

                    return (
                      <div key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#3D4749]">
                            {doc.name}, {doc.credentials}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            Default: {doc.speciality}
                          </span>
                        </div>

                        <div className="w-full sm:w-72">
                          <input
                            type="text"
                            value={currentOverride}
                            maxLength={200}
                            onChange={(e) =>
                              handleDoctorOverrideChange(doc.id, e.target.value)
                            }
                            placeholder="Override specialty..."
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A389]/30 focus:border-[#00A389] transition-all bg-slate-50/60"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Publishing Status, Actions, Cover Image */}
        <div className="space-y-6">
          {/* Card 1: Publish & Status Controls */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Publishing Status
              </span>
              {status === "PUBLISHED" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Published</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Draft</span>
                </span>
              )}
            </div>

            {/* Timestamps & Info */}
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Reading Time:</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {readingTime} min read
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Published Date:</span>
                <span className="font-semibold text-slate-700">
                  {publishedAt
                    ? new Date(publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not published"}
                </span>
              </div>
            </div>

            {/* Author field */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <label htmlFor="article-author" className="text-xs font-semibold text-slate-700">
                Author
              </label>
              <input
                id="article-author"
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  setIsDirty(true);
                }}
                maxLength={100}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A389]/30 focus:border-[#00A389]"
              />
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {/* Save Draft / Update button */}
              <button
                type="button"
                disabled={isSubmitting || isUploadingCover}
                onClick={handleSaveDraftOrUpdate}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{mode === "create" ? "Save Draft" : "Save Changes"}</span>
                  </>
                )}
              </button>

              {/* Publish button */}
              {status === "DRAFT" ? (
                <button
                  type="button"
                  disabled={isSubmitting || isUploadingCover}
                  onClick={handlePublish}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#00A389] hover:bg-[#00826e] text-white transition-colors shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      <span>Publish Now</span>
                    </>
                  )}
                </button>
              ) : (
                /* Unpublish button for published posts */
                <button
                  type="button"
                  disabled={isSubmitting || isUploadingCover}
                  onClick={handleUnpublish}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Revert to Draft (Unpublish)</span>
                  )}
                </button>
              )}
              {/* Cancel & Return link */}
              <Link
                href="/ielung-admin/blog"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-slate-200/80 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel & Return to Blog</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Cover Image Upload & Preview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cover Media
              </span>
              <span className="text-[11px] text-slate-400">Max 5 MB</span>
            </div>

            {/* Hidden cover file input */}
            <input
              ref={coverFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleCoverUpload}
              className="hidden"
              disabled={isUploadingCover || isSubmitting}
            />

            {coverImage ? (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Article cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {coverImagePublicId && (
                  <p className="text-[10px] font-mono text-slate-400 truncate">
                    ID: {coverImagePublicId}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUploadingCover || isSubmitting}
                    onClick={() => coverFileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors disabled:opacity-50"
                  >
                    {isUploadingCover ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCw className="w-3.5 h-3.5" />
                    )}
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    disabled={isUploadingCover || isSubmitting}
                    onClick={handleRemoveCover}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove cover image"
                    aria-label="Remove cover image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => coverFileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#00A389]/50 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:text-[#00A389] group-hover:bg-[#00A389]/10 flex items-center justify-center mx-auto transition-colors">
                  {isUploadingCover ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#00A389]" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-[#00A389] transition-colors block">
                    {isUploadingCover ? "Uploading image..." : "Upload Cover Image"}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    JPEG, PNG, WebP or AVIF
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
