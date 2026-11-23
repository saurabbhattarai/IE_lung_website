"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Images,
  Search,
  X,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FolderOpen,
} from "lucide-react";
import {
  publishGalleryImageAction,
  unpublishGalleryImageAction,
  deleteGalleryImageAction,
  reorderGalleryImagesAction,
} from "@/lib/actions/gallery.action";
import DeleteGalleryModal from "./DeleteGalleryModal";

export interface GalleryListItem {
  id: string;
  title: string;
  category: string;
  src: string;
  publicId: string | null;
  alt: string;
  aspect: string | null;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface GalleryListClientProps {
  initialItems: GalleryListItem[];
  initialStats: {
    total: number;
    published: number;
    drafts: number;
    categories: { name: string; count: number }[];
  };
}

export default function GalleryListClient({
  initialItems,
  initialStats,
}: GalleryListClientProps) {
  const [items, setItems] = useState<GalleryListItem[]>(initialItems);
  const [stats, setStats] = useState(initialStats);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Action states
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<GalleryListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract all unique categories
  const categoriesList = Array.from(
    new Set(items.map((i) => i.category).filter(Boolean))
  );

  // Filter items in memory
  const filteredItems = items.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchAlt = item.alt.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchAlt && !matchCategory) return false;
    }

    if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
      return false;
    }

    if (selectedStatus !== "ALL" && item.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  // Pagination calculation
  const totalFiltered = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Toggle publish/unpublish
  const handleToggleStatus = (item: GalleryListItem) => {
    startTransition(async () => {
      setActionMessage(null);
      const isPublished = item.status === "PUBLISHED";
      const action = isPublished ? unpublishGalleryImageAction : publishGalleryImageAction;

      const res = await action(item.id);
      if (res.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: isPublished ? "DRAFT" : "PUBLISHED" }
              : i
          )
        );
        setStats((prev) => ({
          ...prev,
          published: isPublished ? prev.published - 1 : prev.published + 1,
          drafts: isPublished ? prev.drafts + 1 : prev.drafts - 1,
        }));
        setActionMessage({
          type: "success",
          text: `Image "${item.title}" ${isPublished ? "moved to drafts" : "published"}.`,
        });
      } else {
        setActionMessage({
          type: "error",
          text: res.error || "Failed to update image status.",
        });
      }
    });
  };

  // Move up/down in sort order
  const handleMoveOrder = (item: GalleryListItem, direction: "up" | "down") => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const targetItem = items[targetIndex];

    // Swap sortOrder
    const newItems = [...items];
    const tempOrder = item.sortOrder;
    item.sortOrder = targetItem.sortOrder === tempOrder
      ? (direction === "up" ? targetItem.sortOrder - 1 : targetItem.sortOrder + 1)
      : targetItem.sortOrder;
    targetItem.sortOrder = tempOrder;

    newItems[currentIndex] = targetItem;
    newItems[targetIndex] = item;
    newItems.sort((a, b) => a.sortOrder - b.sortOrder);

    setItems(newItems);

    startTransition(async () => {
      setActionMessage(null);
      const reorderPayload = {
        items: newItems.map((i, idx) => ({ id: i.id, sortOrder: idx })),
      };
      const res = await reorderGalleryImagesAction(reorderPayload);
      if (!res.success) {
        setActionMessage({
          type: "error",
          text: res.error || "Failed to reorder images.",
        });
      }
    });
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setActionMessage(null);

    try {
      const res = await deleteGalleryImageAction(deleteTarget.id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          published:
            deleteTarget.status === "PUBLISHED" ? prev.published - 1 : prev.published,
          drafts:
            deleteTarget.status === "DRAFT" ? prev.drafts - 1 : prev.drafts,
        }));
        setActionMessage({
          type: "success",
          text: `Image "${deleteTarget.title}" was successfully deleted.`,
        });
        setDeleteTarget(null);
      } else {
        setActionMessage({
          type: "error",
          text: res.error || "Failed to delete image.",
        });
      }
    } catch {
      setActionMessage({
        type: "error",
        text: "An unexpected error occurred while deleting.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Images className="w-7 h-7 text-[#00A389]" />
            Gallery Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage high-resolution clinic photography, categories, responsive aspects, and public display.
          </p>
        </div>
        <Link
          href="/ielung-admin/gallery/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#00A389] text-white hover:bg-[#008f78] shadow-md shadow-[#00A389]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00A389] flex items-center justify-center shrink-0">
            <Images className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Photos
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Published
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{stats.published}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Drafts
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{stats.drafts}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Categories
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">
              {stats.categories?.length || categoriesList.length || 1}
            </p>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="font-medium">{actionMessage.text}</p>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title, alt text, or category..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A389] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Category"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00A389]"
          >
            <option value="ALL">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Status"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00A389]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          {/* Clear Filters */}
          {(searchQuery || selectedCategory !== "ALL" || selectedStatus !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedStatus("ALL");
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {paginatedItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
            <Images className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No photos found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {searchQuery || selectedCategory !== "ALL" || selectedStatus !== "ALL"
              ? "No gallery images matched your current filter criteria."
              : "No gallery photographs have been created yet. Add your first photo above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-sm ${
                      item.status === "PUBLISHED"
                        ? "bg-slate-900/80 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-900/80 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === "PUBLISHED" ? "bg-emerald-400" : "bg-amber-300"
                      }`}
                    />
                    {item.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Aspect Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/80 text-slate-300 border border-white/10 backdrop-blur-sm capitalize">
                    {item.aspect || "landscape"}
                  </span>
                </div>

                {/* Hover overlay preview button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a
                    href={item.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all"
                    title="View Full Resolution"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-[#00A389] uppercase tracking-wider text-[10px]">
                      {item.category}
                    </span>
                    <span className="font-mono text-[11px]">Order: #{item.sortOrder}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.alt}
                  </p>
                </div>

                {/* Action Controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(item, "up")}
                      disabled={isPending || idx === 0 && currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 transition-colors"
                      title="Move Earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(item, "down")}
                      disabled={isPending || idx === paginatedItems.length - 1 && currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 transition-colors"
                      title="Move Later"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit, Publish/Unpublish, Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      disabled={isPending}
                      className={`p-2 rounded-xl transition-colors ${
                        item.status === "PUBLISHED"
                          ? "text-amber-600 hover:bg-amber-50"
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                      title={item.status === "PUBLISHED" ? "Unpublish to Draft" : "Publish to Gallery"}
                    >
                      {item.status === "PUBLISHED" ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    <Link
                      href={`/ielung-admin/gallery/edit/${item.id}`}
                      className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Edit Image Details"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <p className="text-xs sm:text-sm text-slate-500">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalFiltered)} of {totalFiltered} photos
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteGalleryModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.title || ""}
        category={deleteTarget?.category || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
