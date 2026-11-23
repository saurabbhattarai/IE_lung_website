"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Upload,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  ArrowLeft,
  Loader2,
  FileCheck,
} from "lucide-react";
import {
  createDownloadAction,
  updateDownloadAction,
} from "@/lib/actions/download.action";
import type {
  DownloadCategoryType,
  DownloadStatusType,
} from "@/lib/validations/download.validation";

export interface DownloadFormData {
  id?: string;
  category: DownloadCategoryType;
  title: string;
  subtitle?: string | null;
  issueNumber?: number | null;
  edition?: string | null;
  publicationDate?: Date | string | null;
  description: string;
  fileUrl: string;
  filePublicId?: string | null;
  fileSize?: string | null;
  pageCount?: string | null;
  topics?: string[] | null;
  featured: boolean;
  sortOrder: number;
  status: DownloadStatusType;
}

interface DownloadFormProps {
  initialData?: DownloadFormData;
  isEdit?: boolean;
}

export default function DownloadForm({ initialData, isEdit = false }: DownloadFormProps) {
  const router = useRouter();

  // Core Form State
  const [category, setCategory] = useState<DownloadCategoryType>(initialData?.category || "NEWSLETTER");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || "");
  const [filePublicId, setFilePublicId] = useState<string | null>(initialData?.filePublicId || null);
  const [fileSize, setFileSize] = useState<string | null>(initialData?.fileSize || null);
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sortOrder ?? 0);
  const [status, setStatus] = useState<DownloadStatusType>(initialData?.status || "PUBLISHED");

  // Newsletter-Specific State
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [issueNumber, setIssueNumber] = useState<string>(
    initialData?.issueNumber !== null && initialData?.issueNumber !== undefined
      ? String(initialData.issueNumber)
      : ""
  );
  const [edition, setEdition] = useState(initialData?.edition || "");
  const [publicationDate, setPublicationDate] = useState<string>(() => {
    if (!initialData?.publicationDate) return "";
    const d = new Date(initialData.publicationDate);
    return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";
  });
  const [pageCount, setPageCount] = useState(initialData?.pageCount || "");
  const [topics, setTopics] = useState<string[]>(initialData?.topics || []);
  const [newTopicInput, setNewTopicInput] = useState("");
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false);

  // Upload and UI State
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // PDF Upload Handler using existing /api/admin/media/upload-pdf
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Please select a valid PDF file.");
      return;
    }

    setIsUploadingPdf(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Upload failed with status ${res.status}`);
      }

      setFileUrl(data.secure_url);
      setFilePublicId(data.public_id);
      if (data.fileSize) {
        setFileSize(data.fileSize);
      }

      // If title is currently empty, suggest the original filename
      if (!title.trim() && data.originalFilename) {
        const cleanName = data.originalFilename
          .replace(/\.pdf$/i, "")
          .replace(/[_-]+/g, " ")
          .trim();
        setTitle(cleanName);
      }

      setSuccessMessage("PDF document uploaded successfully to Cloudinary.");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to upload PDF.");
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Topic list management
  const handleAddTopic = () => {
    const trimmed = newTopicInput.trim();
    if (!trimmed) return;
    if (topics.includes(trimmed)) return;
    setTopics([...topics, trimmed]);
    setNewTopicInput("");
  };

  const handleRemoveTopic = (index: number) => {
    setTopics(topics.filter((_, idx) => idx !== index));
  };

  const handleKeyDownTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTopic();
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const payload: Record<string, unknown> = {
      category,
      title: title.trim(),
      description: description.trim(),
      fileUrl: fileUrl.trim(),
      filePublicId: filePublicId ? filePublicId.trim() : null,
      fileSize: fileSize ? fileSize.trim() : null,
      sortOrder: Number(sortOrder) || 0,
      status,
    };

    if (category === "NEWSLETTER") {
      payload.subtitle = subtitle.trim() || null;
      payload.issueNumber = issueNumber ? parseInt(issueNumber, 10) : null;
      payload.edition = edition.trim() || null;
      payload.publicationDate = publicationDate ? new Date(publicationDate) : null;
      payload.pageCount = pageCount.trim() || null;
      payload.topics = topics;
      payload.featured = featured;
    } else {
      payload.subtitle = null;
      payload.issueNumber = null;
      payload.edition = null;
      payload.publicationDate = null;
      payload.pageCount = null;
      payload.topics = null;
      payload.featured = false;
    }

    try {
      let result;
      if (isEdit && initialData?.id) {
        result = await updateDownloadAction(initialData.id, payload);
      } else {
        result = await createDownloadAction(payload);
      }

      if (!result.success) {
        setErrorMessage(result.error || "Failed to save resource.");
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        return;
      }

      setSuccessMessage(result.message || "Saved successfully.");
      setTimeout(() => {
        router.push("/ielung-admin/downloads");
        router.refresh();
      }, 700);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/ielung-admin/downloads"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A389] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Downloads
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D4749]">
            {isEdit ? "Edit Download Resource" : "Create New Download Resource"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish newsletters, patient referral forms, or clinical guides to the public Downloads section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/ielung-admin/downloads"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingPdf}
            className="px-6 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008f78] text-white text-xs font-bold shadow-md shadow-[#00A389]/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEdit ? "Update Resource" : "Create Resource"}</span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to save resource</p>
            <p className="text-xs mt-0.5 text-rose-600">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Card 1: Core Resource Information */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#00A389]" />
          <span>Resource Details</span>
        </h2>

        {/* Category Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Resource Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(["NEWSLETTER", "FORMS", "GUIDES", "BROCHURES"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border text-center ${
                  category === cat
                    ? "bg-[#00A389] text-white border-[#00A389] shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat === "NEWSLETTER" && "Newsletter"}
                {cat === "FORMS" && "Clinical Form"}
                {cat === "GUIDES" && "Patient Guide"}
                {cat === "BROCHURES" && "Brochure"}
              </button>
            ))}
          </div>
          {fieldErrors.category && (
            <p className="text-xs text-rose-600 mt-1">{fieldErrors.category[0]}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. IE Lung Newsletter — Issue 1"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/10 transition-all"
            required
          />
          {fieldErrors.title && (
            <p className="text-xs text-rose-600 mt-1">{fieldErrors.title[0]}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Description *
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the publication or form for patients and providers..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/10 transition-all leading-relaxed"
            required
          />
          {fieldErrors.description && (
            <p className="text-xs text-rose-600 mt-1">{fieldErrors.description[0]}</p>
          )}
        </div>
      </div>

      {/* Card 2: PDF Document Upload */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Upload className="w-5 h-5 text-[#00A389]" />
          <span>PDF Document *</span>
        </h2>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 sm:p-8 text-center hover:border-[#00A389]/50 transition-colors bg-slate-50/50">
          <input
            id="pdf-file-input"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handlePdfUpload}
            disabled={isUploadingPdf}
            className="hidden"
          />

          <label
            htmlFor="pdf-file-input"
            className="cursor-pointer flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#00A389]/10 text-[#00A389] flex items-center justify-center">
              {isUploadingPdf ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {isUploadingPdf ? "Uploading PDF document..." : "Click to upload PDF document"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Binary validated (%PDF-), up to 25 MB max. Stored securely in Cloudinary.
              </p>
            </div>
          </label>
        </div>

        {/* Uploaded File Details / Manual File URL */}
        <div className="space-y-4 pt-2">
          <div>
            <label htmlFor="fileUrl" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              File URL *
            </label>
            <div className="flex items-center gap-2">
              <input
                id="fileUrl"
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="/referral-form.pdf or https://res.cloudinary.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-hidden focus:border-[#00A389]"
                required
              />
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Preview
                </a>
              )}
            </div>
            {fieldErrors.fileUrl && (
              <p className="text-xs text-rose-600 mt-1">{fieldErrors.fileUrl[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fileSize" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                File Size
              </label>
              <input
                id="fileSize"
                type="text"
                value={fileSize || ""}
                onChange={(e) => setFileSize(e.target.value || null)}
                placeholder="e.g. 680 KB, 1.2 MB"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#00A389]"
              />
            </div>

            <div>
              <label htmlFor="filePublicId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cloudinary Public ID
              </label>
              <input
                id="filePublicId"
                type="text"
                value={filePublicId || ""}
                onChange={(e) => setFilePublicId(e.target.value || null)}
                placeholder="ielung/downloads/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-hidden focus:border-[#00A389]"
              />
              {fieldErrors.filePublicId && (
                <p className="text-xs text-rose-600 mt-1">{fieldErrors.filePublicId[0]}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Newsletter-Specific Details (Conditional) */}
      {category === "NEWSLETTER" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#00A389]/20 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00A389]" />
              <span>Newsletter Editorial Details</span>
            </h2>
            <span className="text-[11px] font-bold text-[#00A389] uppercase tracking-wider bg-[#00A389]/10 px-2.5 py-1 rounded-full">
              Category Specific
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subtitle */}
            <div className="sm:col-span-2">
              <label htmlFor="subtitle" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Editorial Subtitle
              </label>
              <input
                id="subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Breathing is Life: The Science of Breathing & Respiratory Wellness"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#00A389]"
              />
            </div>

            {/* Issue Number */}
            <div>
              <label htmlFor="issueNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issue Number
              </label>
              <input
                id="issueNumber"
                type="number"
                min="1"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                placeholder="e.g. 1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#00A389]"
              />
            </div>

            {/* Edition */}
            <div>
              <label htmlFor="edition" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Edition Label
              </label>
              <input
                id="edition"
                type="text"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="e.g. November 2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#00A389]"
              />
            </div>

            {/* Publication Date */}
            <div>
              <label htmlFor="publicationDate" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Publication Date
              </label>
              <div className="relative">
                <input
                  id="publicationDate"
                  type="date"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#00A389]"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Page Count */}
            <div>
              <label htmlFor="pageCount" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Page Count
              </label>
              <input
                id="pageCount"
                type="text"
                value={pageCount}
                onChange={(e) => setPageCount(e.target.value)}
                placeholder="e.g. 4 Pages"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#00A389]"
              />
            </div>
          </div>

          {/* Topics Manager */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Featured Topics in this Edition
            </label>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={newTopicInput}
                onChange={(e) => setNewTopicInput(e.target.value)}
                onKeyDown={handleKeyDownTopic}
                placeholder="Add a topic (e.g. When to seek urgent medical care for cough)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#00A389]"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {topics.length > 0 ? (
              <ul className="space-y-2">
                {topics.map((topic, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700"
                  >
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-[#00A389]" />
                      <span>{topic}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No topics added yet. Add key bullet points above.</p>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Featured Newsletter Hero</p>
              <p className="text-xs text-slate-500">
                Display this edition in the prominent hero card at the top of the Downloads page. Only one published newsletter can be featured at a time.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A389]"></div>
            </label>
          </div>
        </div>
      )}

      {/* Card 4: Publishing & Sorting */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-800">Publishing Options</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Publication Status *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("PUBLISHED")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  status === "PUBLISHED"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setStatus("DRAFT")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  status === "DRAFT"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Draft
              </button>
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sortOrder" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Sort Order
            </label>
            <input
              id="sortOrder"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#00A389]"
            />
            <p className="text-[11px] text-slate-400 mt-1">Lower numbers appear first on the public page.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
