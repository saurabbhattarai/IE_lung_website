"use client";

import React, { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import {
  FileDown,
  Search,
  X,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown,
  BookOpen,
} from "lucide-react";
import {
  publishDownloadAction,
  unpublishDownloadAction,
  deleteDownloadAction,
  setFeaturedNewsletterAction,
  reorderDownloadsAction,
} from "@/lib/actions/download.action";
import DeleteDownloadModal from "./DeleteDownloadModal";

export interface DownloadResourceItem {
  id: string;
  category: "NEWSLETTER" | "FORMS" | "GUIDES" | "BROCHURES";
  title: string;
  subtitle: string | null;
  issueNumber: number | null;
  edition: string | null;
  publicationDate: Date | string | null;
  description: string;
  fileUrl: string;
  filePublicId: string | null;
  fileSize: string | null;
  pageCount: string | null;
  topics: unknown;
  featured: boolean;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DownloadsListClientProps {
  initialItems: DownloadResourceItem[];
  initialStats: {
    total: number;
    published: number;
    drafts: number;
    newsletters: number;
    forms: number;
  };
}

export default function DownloadsListClient({
  initialItems,
  initialStats,
}: DownloadsListClientProps) {
  const [items, setItems] = useState<DownloadResourceItem[]>(initialItems);
  const [stats, setStats] = useState(initialStats);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Action states
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<DownloadResourceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter items in memory for responsive real-time client responsiveness
  const filteredItems = items.filter((item) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSubtitle) return false;
    }

    // Category filter
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedStatus !== "ALL" && item.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  // Toggle publish/unpublish
  const handleToggleStatus = (item: DownloadResourceItem) => {
    startTransition(async () => {
      setActionMessage(null);
      const isPublished = item.status === "PUBLISHED";
      const action = isPublished ? unpublishDownloadAction : publishDownloadAction;

      const res = await action(item.id);
      if (res.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: isPublished ? "DRAFT" : "PUBLISHED",
                  featured: isPublished ? false : i.featured,
                }
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
          text: `"${item.title}" is now ${isPublished ? "a draft" : "published"}.`,
        });
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to update status." });
      }
    });
  };

  // Set as featured newsletter
  const handleSetFeatured = (item: DownloadResourceItem) => {
    if (item.category !== "NEWSLETTER" || item.status !== "PUBLISHED") return;

    startTransition(async () => {
      setActionMessage(null);
      const res = await setFeaturedNewsletterAction(item.id);
      if (res.success) {
        setItems((prev) =>
          prev.map((i) => ({
            ...i,
            featured: i.id === item.id,
          }))
        );
        setActionMessage({
          type: "success",
          text: `"${item.title}" is now the singular featured newsletter.`,
        });
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to set featured newsletter." });
      }
    });
  };

  // Reorder single step up or down
  const handleMoveOrder = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredItems.length) return;

    const currentItem = filteredItems[index];
    const adjacentItem = filteredItems[targetIndex];

    const updated = [...items];
    const currIdxInAll = updated.findIndex((i) => i.id === currentItem.id);
    const adjIdxInAll = updated.findIndex((i) => i.id === adjacentItem.id);

    // Swap sortOrder
    const tempSort = currentItem.sortOrder;
    updated[currIdxInAll].sortOrder = adjacentItem.sortOrder;
    updated[adjIdxInAll].sortOrder = tempSort;

    setItems(updated.sort((a, b) => a.sortOrder - b.sortOrder));

    startTransition(async () => {
      await reorderDownloadsAction({
        items: [
          { id: currentItem.id, sortOrder: adjacentItem.sortOrder },
          { id: adjacentItem.id, sortOrder: tempSort },
        ],
      });
    });
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setActionMessage(null);

    try {
      const res = await deleteDownloadAction(deleteTarget.id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          published: deleteTarget.status === "PUBLISHED" ? prev.published - 1 : prev.published,
          drafts: deleteTarget.status === "DRAFT" ? prev.drafts - 1 : prev.drafts,
          newsletters: deleteTarget.category === "NEWSLETTER" ? prev.newsletters - 1 : prev.newsletters,
          forms: deleteTarget.category === "FORMS" ? prev.forms - 1 : prev.forms,
        }));
        setActionMessage({
          type: "success",
          text: `Deleted "${deleteTarget.title}" successfully.`,
        });
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to delete resource." });
      }
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Deletion failed.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl flex items-start justify-between gap-3 text-sm animate-in fade-in ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
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

      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A389]/10 text-[#00A389] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Downloads & Publications CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D4749] tracking-tight">
            Downloads Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage community newsletters, physician referral forms, patient guides, and brochures.
          </p>
        </div>

        <Link
          href="/ielung-admin/downloads/new"
          className="px-5 py-3 rounded-2xl bg-[#00A389] hover:bg-[#008f78] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#00A389]/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Resource</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Resources</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Published</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{stats.published}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Drafts</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{stats.drafts}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-[#00A389] uppercase tracking-wider">Newsletters</p>
          <p className="text-2xl font-bold text-[#00A389] mt-1">{stats.newsletters}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by title or description..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {(["ALL", "PUBLISHED", "DRAFT"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStatus === st
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {st === "ALL" && "All Status"}
                {st === "PUBLISHED" && "Published"}
                {st === "DRAFT" && "Drafts"}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Category:
          </span>
          {(["ALL", "NEWSLETTER", "FORMS", "GUIDES", "BROCHURES"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                selectedCategory === cat
                  ? "bg-[#00A389] text-white border-[#00A389]"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat === "ALL" && "All Categories"}
              {cat === "NEWSLETTER" && "Newsletters"}
              {cat === "FORMS" && "Clinical Forms"}
              {cat === "GUIDES" && "Patient Guides"}
              {cat === "BROCHURES" && "Brochures"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table / Resource List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <FileDown className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-700">No resources found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchQuery || selectedCategory !== "ALL" || selectedStatus !== "ALL"
                ? "No download resources match your filter criteria. Try adjusting your search query."
                : "No download resources have been created yet. Click 'Add New Resource' to publish one."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6 w-16 text-center">Order</th>
                  <th className="py-4 px-6">Resource Title & Category</th>
                  <th className="py-4 px-4">File Info</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Sort Order & Reorder Controls */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, "up")}
                          disabled={index === 0 || isPending}
                          className="text-slate-300 hover:text-[#00A389] disabled:opacity-20 p-0.5"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {item.sortOrder}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, "down")}
                          disabled={index === filteredItems.length - 1 || isPending}
                          className="text-slate-300 hover:text-[#00A389] disabled:opacity-20 p-0.5"
                          title="Move Down"
                        >
                          ▼
                        </button>
                      </div>
                    </td>

                    {/* Title & Metadata */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              item.category === "NEWSLETTER"
                                ? "bg-[#00A389]/10 text-[#00A389]"
                                : item.category === "FORMS"
                                ? "bg-blue-50 text-blue-700"
                                : item.category === "GUIDES"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.category}
                          </span>

                          {item.featured && item.category === "NEWSLETTER" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>Featured Hero</span>
                            </span>
                          )}

                          {item.issueNumber && (
                            <span className="text-[11px] font-medium text-slate-400">
                              Issue #{item.issueNumber}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 group-hover:text-[#00A389] transition-colors">
                          {item.title}
                        </h4>

                        {item.subtitle && (
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* File Info */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>PDF • {item.fileSize || "Document"}</span>
                        </span>
                        <div>
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#00A389] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> View Asset
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                          item.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "PUBLISHED" ? "bg-emerald-600" : "bg-amber-600"
                          }`}
                        />
                        <span>{item.status === "PUBLISHED" ? "Published" : "Draft"}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Featured Button (Newsletter only) */}
                        {item.category === "NEWSLETTER" && item.status === "PUBLISHED" && (
                          <button
                            type="button"
                            onClick={() => handleSetFeatured(item)}
                            disabled={item.featured || isPending}
                            title={item.featured ? "Currently Featured" : "Set as Featured Newsletter"}
                            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                              item.featured
                                ? "text-amber-500 bg-amber-50"
                                : "text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                            }`}
                          >
                            <Star className={`w-4 h-4 ${item.featured ? "fill-amber-500" : ""}`} />
                          </button>
                        )}

                        {/* Publish / Unpublish Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          disabled={isPending}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
                        >
                          {item.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </button>

                        {/* Edit Button */}
                        <Link
                          href={`/ielung-admin/downloads/edit/${item.id}`}
                          className="p-2 rounded-xl text-slate-500 hover:text-[#00A389] hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          disabled={isPending}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteDownloadModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.title || ""}
        category={deleteTarget?.category || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
