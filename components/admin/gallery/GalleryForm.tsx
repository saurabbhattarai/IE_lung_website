"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Images,
  Maximize2,
  Trash2,
} from "lucide-react";
import {
  createGalleryImageAction,
  updateGalleryImageAction,
} from "@/lib/actions/gallery.action";
import type {
  GalleryStatusType,
  GalleryAspectType,
} from "@/lib/validations/gallery.validation";

export interface GalleryFormData {
  id?: string;
  title: string;
  category: string;
  src: string;
  publicId?: string | null;
  alt: string;
  aspect?: GalleryAspectType | string | null;
  sortOrder: number;
  status: GalleryStatusType;
}

interface GalleryFormProps {
  initialData?: GalleryFormData;
  isEdit?: boolean;
}

export default function GalleryForm({ initialData, isEdit = false }: GalleryFormProps) {
  const router = useRouter();

  // Core Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "Opening Day");
  const [src, setSrc] = useState(initialData?.src || "");
  const [publicId, setPublicId] = useState<string | null>(initialData?.publicId || null);
  const [alt, setAlt] = useState(initialData?.alt || "");
  const [aspect, setAspect] = useState<GalleryAspectType>(
    initialData?.aspect === "portrait" ? "portrait" : "landscape"
  );
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sortOrder ?? 0);
  const [status, setStatus] = useState<GalleryStatusType>(initialData?.status || "PUBLISHED");

  // Upload and UI State
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [uploadDetails, setUploadDetails] = useState<{
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
  } | null>(null);

  // Image Upload Handler using /api/admin/media/upload-gallery
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedMimes.includes(file.type)) {
      setErrorMessage("Please select a supported image file (JPEG, PNG, WebP, or AVIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File exceeds the 10 MB limit for gallery photography.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media/upload-gallery", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      // Populate src and publicId from upload response
      const fileUrl = data.secure_url || data.url;
      const filePublicId = data.public_id || data.publicId;
      setSrc(fileUrl);
      setPublicId(filePublicId);
      setUploadDetails({
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      });

      // Automatically determine aspect ratio if available
      if (data.width && data.height) {
        if (data.height > data.width) {
          setAspect("portrait");
        } else {
          setAspect("landscape");
        }
      }

      // If alt is empty, suggest filename as starter
      if (!alt && file.name) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .trim();
        setAlt(`IE Lung - ${cleanName}`);
      }

      // If title is empty, suggest filename as starter
      if (!title && file.name) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .trim();
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
      // Reset input so same file can be re-uploaded if necessary
      e.target.value = "";
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    // Client-side quick checks
    if (!title.trim()) {
      setFieldErrors((prev) => ({ ...prev, title: ["Title is required."] }));
      setErrorMessage("Please fill in the required fields.");
      return;
    }

    if (!src.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        src: ["An image is required. Please upload an image or provide a valid source."],
      }));
      setErrorMessage("Image source is required.");
      return;
    }

    if (!alt.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        alt: ["Alt text is required for accessibility and SEO."],
      }));
      setErrorMessage("Please provide descriptive alt text for this photograph.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        category: category.trim() || "Opening Day",
        src: src.trim(),
        publicId: publicId ? publicId.trim() : null,
        alt: alt.trim(),
        aspect,
        sortOrder: Number(sortOrder) || 0,
        status,
      };

      let result;
      if (isEdit && initialData?.id) {
        result = await updateGalleryImageAction(initialData.id, payload);
      } else {
        result = await createGalleryImageAction(payload);
      }

      if (!result.success) {
        setErrorMessage(result.error);
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        isEdit
          ? "Gallery image updated successfully!"
          : "Gallery image created successfully!"
      );

      // Redirect after brief notification
      setTimeout(() => {
        router.push("/ielung-admin/gallery");
        router.refresh();
      }, 1000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred while saving."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? `Edit: ${initialData?.title || "Gallery Image"}` : "Add New Gallery Image"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure image details, category, responsive aspect ratio, and status.
          </p>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{errorMessage}</p>
              {Object.keys(fieldErrors).length > 0 && (
                <ul className="list-disc pl-5 text-xs space-y-0.5">
                  {Object.entries(fieldErrors).map(([field, msgs]) => (
                    <li key={field}>
                      <strong className="capitalize">{field}</strong>: {msgs.join(", ")}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Image Upload & Preview Section */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-800">
            Photograph File <span className="text-rose-500">*</span>
          </label>

          {/* Current / Uploaded Preview */}
          {src ? (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-w-lg aspect-[4/3] group">
                <Image
                  src={src}
                  alt={alt || "Gallery preview"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all"
                    title="View Full Resolution"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-medium text-slate-700 truncate max-w-md">
                  {src.startsWith("http") ? "Cloudinary Asset" : "Local Static File"}: {src}
                </span>
                {publicId && (
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600">
                    ID: {publicId}
                  </span>
                )}
                {uploadDetails && (
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    {uploadDetails.width}x{uploadDetails.height} px • {(uploadDetails.bytes ? (uploadDetails.bytes / 1024).toFixed(1) + " KB" : "")}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Images className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No image selected</p>
              <p className="text-xs text-slate-400 mt-1">Upload a high-resolution photo below</p>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex items-center gap-4 pt-1">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#00A389] text-white hover:bg-[#008f78] shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50">
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>{src ? "Replace Image" : "Upload Photo"}</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleImageUpload}
                disabled={isUploading || isSubmitting}
                className="hidden"
              />
            </label>
            <span className="text-xs text-slate-400">
              Max 10 MB • JPEG, PNG, WebP, or AVIF
            </span>
          </div>

          {/* Manual source URL field (for local static paths e.g. /images/opening-images/...) */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Or Image URL / Local Asset Path
            </label>
            <input
              type="text"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="https://res.cloudinary.com/... or /images/..."
              className="w-full text-xs font-mono px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00A389]"
            />
            {fieldErrors.src && (
              <p className="text-xs text-rose-600 mt-1">{fieldErrors.src[0]}</p>
            )}
          </div>
        </div>

        {/* Grid: Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-800">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              placeholder="e.g. Opening Day Celebration"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A389]"
            />
            {fieldErrors.title && (
              <p className="text-xs text-rose-600">{fieldErrors.title[0]}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-800">
              Category <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              list="category-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={100}
              placeholder="e.g. Opening Day, Facility, Team"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A389]"
            />
            <datalist id="category-suggestions">
              <option value="Opening Day" />
              <option value="Facility & Reception" />
              <option value="Physicians & Care Team" />
              <option value="Diagnostic Center" />
              <option value="Community Events" />
            </datalist>
            {fieldErrors.category && (
              <p className="text-xs text-rose-600">{fieldErrors.category[0]}</p>
            )}
          </div>
        </div>

        {/* Alt Text */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-800">
            Alt Text (Accessibility & SEO) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            maxLength={500}
            placeholder="Descriptive text of the photo for screen readers and SEO..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A389]"
          />
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Detailed description of the image content</span>
            <span>{alt.length}/500</span>
          </div>
          {fieldErrors.alt && (
            <p className="text-xs text-rose-600">{fieldErrors.alt[0]}</p>
          )}
        </div>

        {/* Aspect Ratio, Sort Order, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Aspect Ratio */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-800">
              Aspect Ratio
            </label>
            <select
              value={aspect}
              onChange={(e) => setAspect(e.target.value as GalleryAspectType)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00A389]"
            >
              <option value="landscape">Landscape (Horizontal)</option>
              <option value="portrait">Portrait (Vertical)</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-800">
              Sort Order
            </label>
            <input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A389]"
            />
            <p className="text-[11px] text-slate-400">Lower numbers appear first</p>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-800">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as GalleryStatusType)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00A389]"
            >
              <option value="PUBLISHED">Published (Visible Publicly)</option>
              <option value="DRAFT">Draft (Admin Only)</option>
            </select>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
          <Link
            href="/ielung-admin/gallery"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-7 py-2.5 rounded-xl text-sm font-bold bg-[#00A389] hover:bg-[#008f78] text-white shadow-md shadow-[#00A389]/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEdit ? "Update Image" : "Save Image"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
