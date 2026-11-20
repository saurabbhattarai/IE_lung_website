"use client";

import React, { useState, useEffect, useRef, useTransition, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  X,
  Plus,
  Edit,
  Trash2,
  Clock,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  FileEdit,
  ArrowUpRight,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  getBlogPostsListAction,
  publishBlogPostAction,
  unpublishBlogPostAction,
  deleteBlogPostAction,
} from "@/lib/actions/blog.action";
import DeletePostModal from "./DeletePostModal";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  readingTimeMinutes: number;
  coverImage: string | null;
  author: string;
}

interface BlogManagementClientProps {
  initialData?: {
    posts: BlogPostItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  initialError?: string | null;
}

type StatusFilter = "ALL" | "PUBLISHED" | "DRAFT";

export default function BlogManagementClient({
  initialData,
  initialError,
}: BlogManagementClientProps) {
  // Query parameters state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(initialData?.page || 1);
  const limit = 10;

  // Data state
  const [posts, setPosts] = useState<BlogPostItem[]>(initialData?.posts || []);
  const [total, setTotal] = useState(initialData?.total || 0);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(initialError || null);

  // Row-level action loading state
  const [actionPostId, setActionPostId] = useState<string | null>(null);

  // Notification feedback
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<BlogPostItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Monotonically increasing request ID tracker to prevent search/filter race conditions
  const latestRequestIdRef = useRef(0);
  // Track parameters of the most recently initiated or completed fetch to prevent duplicate requests
  const lastFetchedParamsRef = useRef<{
    page: number;
    search: string;
    status: StatusFilter;
  }>({
    page: initialData?.page || 1,
    search: "",
    status: "ALL",
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search term
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Load posts function with request sequencing
  const fetchPosts = useCallback(
    async (
      targetPage: number,
      targetSearch: string,
      targetStatus: StatusFilter
    ) => {
      const requestId = ++latestRequestIdRef.current;
      lastFetchedParamsRef.current = {
        page: targetPage,
        search: targetSearch,
        status: targetStatus,
      };

      setIsLoading(true);
      setError(null);

      try {
        const queryPayload = {
          page: targetPage,
          limit,
          search: targetSearch.trim() || undefined,
          status: targetStatus === "ALL" ? undefined : targetStatus,
        };

        const result = await getBlogPostsListAction(queryPayload);

        // If a newer request was dispatched while this was in-flight, discard stale result
        if (requestId !== latestRequestIdRef.current) {
          return;
        }

        if (result.success) {
          const data = result.data as {
            posts: BlogPostItem[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
          setPosts(data.posts);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        } else {
          setError(result.error || "Failed to load blog posts.");
        }
      } catch (err) {
        if (requestId !== latestRequestIdRef.current) {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Failed to load blog posts."
        );
      } finally {
        // Only clear loading state if this is still the active latest request
        if (requestId === latestRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [limit]
  );

  // Trigger fetch when parameters change
  useEffect(() => {
    // Only re-fetch if this isn't the initial mount with valid initialData
    const isInitialMount =
      initialData &&
      page === initialData.page &&
      debouncedSearch === "" &&
      statusFilter === "ALL";

    if (!isInitialMount) {
      // Avoid duplicate fetch if these exact parameters were already fetched (e.g. after deletion or manual trigger)
      const last = lastFetchedParamsRef.current;
      if (
        last.page === page &&
        last.search === debouncedSearch &&
        last.status === statusFilter
      ) {
        return;
      }

      fetchPosts(page, debouncedSearch, statusFilter);
    }
  }, [page, debouncedSearch, statusFilter, fetchPosts, initialData]);

  // Handle status filter change
  const handleStatusChange = (newStatus: StatusFilter) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  // Publish action
  const handlePublish = async (post: BlogPostItem) => {
    setActionPostId(post.id);
    setFeedback(null);

    startTransition(async () => {
      try {
        const result = await publishBlogPostAction(post.id);
        if (result.success) {
          setFeedback({
            type: "success",
            message: `"${post.title}" has been published successfully.`,
          });
          // Refresh list to show updated status
          await fetchPosts(page, debouncedSearch, statusFilter);
        } else {
          setFeedback({
            type: "error",
            message: result.error || "Failed to publish post.",
          });
        }
      } catch (err) {
        setFeedback({
          type: "error",
          message:
            err instanceof Error ? err.message : "Failed to publish post.",
        });
      } finally {
        setActionPostId(null);
      }
    });
  };

  // Unpublish action
  const handleUnpublish = async (post: BlogPostItem) => {
    setActionPostId(post.id);
    setFeedback(null);

    startTransition(async () => {
      try {
        const result = await unpublishBlogPostAction(post.id);
        if (result.success) {
          setFeedback({
            type: "success",
            message: `"${post.title}" has been unpublished and moved to drafts.`,
          });
          // Refresh list to show updated status
          await fetchPosts(page, debouncedSearch, statusFilter);
        } else {
          setFeedback({
            type: "error",
            message: result.error || "Failed to unpublish post.",
          });
        }
      } catch (err) {
        setFeedback({
          type: "error",
          message:
            err instanceof Error ? err.message : "Failed to unpublish post.",
        });
      } finally {
        setActionPostId(null);
      }
    });
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteBlogPostAction(deleteTarget.id);

      if (result.success) {
        setFeedback({
          type: result.warning ? "warning" : "success",
          message: result.warning
            ? `Post deleted. Note: ${result.warning}`
            : `"${deleteTarget.title}" was permanently deleted.`,
        });
        setDeleteTarget(null);

        // If the current page had only one post and page > 1, navigate to previous page
        // so the user does not remain stranded on an empty page.
        const targetPage = posts.length === 1 && page > 1 ? page - 1 : page;
        if (targetPage !== page) {
          setPage(targetPage);
        }

        // Fetch using the calculated target page, preserving any active search or status filters
        await fetchPosts(targetPage, debouncedSearch, statusFilter);
      } else {
        setDeleteError(result.error || "Failed to delete post.");
      }
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete post."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date helper
  const formatDate = (date: Date | string | null) => {
    if (!date) return "Not published";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Invalid date";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Calculate showing range
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-start justify-between gap-3 p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : feedback.type === "warning"
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
          role="alert"
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            )}
            {feedback.type === "warning" && (
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            )}
            {feedback.type === "error" && (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded-lg"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Bar: Search & Status Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or slug..."
              className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A389]/30 focus:border-[#00A389] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Refresh Action */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => fetchPosts(page, debouncedSearch, statusFilter)}
              disabled={isLoading || isPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-50"
              title="Refresh blog post list"
              aria-label="Refresh blog post list"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${
                  isLoading || isPending ? "animate-spin text-[#00A389]" : ""
                }`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            Status:
          </span>
          <button
            type="button"
            onClick={() => handleStatusChange("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === "ALL"
                ? "bg-[#00A389] text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            All Posts
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("PUBLISHED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === "PUBLISHED"
                ? "bg-[#00A389] text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            Published
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("DRAFT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === "DRAFT"
                ? "bg-[#00A389] text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {/* Main Content: Table / Loading / Empty / Error */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Error State */}
        {error ? (
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                Failed to Load Blog Posts
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => fetchPosts(page, debouncedSearch, statusFilter)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        ) : isLoading ? (
          /* Loading Skeleton State */
          <div className="p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-slate-100 rounded-md w-1/4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 justify-between"
                >
                  <div className="space-y-2 w-1/3">
                    <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                  </div>
                  <div className="h-6 bg-slate-200 rounded-full w-20" />
                  <div className="h-6 bg-slate-100 rounded w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <div className="p-10 sm:p-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00A389]/10 text-[#00A389] flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-[#3D4749]">
                {debouncedSearch || statusFilter !== "ALL"
                  ? "No matching blog posts found"
                  : "No blog posts yet"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                {debouncedSearch || statusFilter !== "ALL"
                  ? "Try adjusting your search keywords or switching your status filter to see other posts."
                  : "Start writing your first clinical article or news announcement for Inland Empire Lung & Sleep Institute."}
              </p>
            </div>

            <div className="pt-2">
              {debouncedSearch || statusFilter !== "ALL" ? (
                <button
                  type="button"
                  onClick={() => {
                    handleClearSearch();
                    setStatusFilter("ALL");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              ) : (
                <Link
                  href="/ielung-admin/blog/new"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#00A389] text-white hover:bg-[#00826e] transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Post</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Posts Table (Desktop) & Cards (Mobile) */
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Article</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Reading Time</th>
                    <th className="py-3.5 px-4">Published Date</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {posts.map((post) => {
                    const isRowBusy = actionPostId === post.id;

                    return (
                      <tr
                        key={post.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* Title & Slug */}
                        <td className="py-4 px-4 max-w-sm">
                          <div className="flex flex-col space-y-1">
                            <Link
                              href={`/ielung-admin/blog/edit/${post.id}`}
                              className="font-bold text-sm text-[#3D4749] group-hover:text-[#00A389] transition-colors line-clamp-1"
                              title={post.title}
                            >
                              {post.title}
                            </Link>
                            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                              <span className="font-mono text-slate-500 truncate max-w-[240px]">
                                /blog/{post.slug}
                              </span>
                              {post.author && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{post.author}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {post.status === "PUBLISHED" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Published</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>Draft</span>
                            </span>
                          )}
                        </td>

                        {/* Reading Time */}
                        <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                          <span className="inline-flex items-center gap-1 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{post.readingTimeMinutes} min read</span>
                          </span>
                        </td>

                        {/* Published Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                          <div className="text-[11px]">
                            {post.publishedAt ? (
                              formatDate(post.publishedAt)
                            ) : (
                              <span className="text-slate-400 italic">
                                Not published
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Last Updated */}
                        <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                          {formatDate(post.updatedAt)}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Edit Button */}
                            <Link
                              href={`/ielung-admin/blog/edit/${post.id}`}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-[#00A389] hover:bg-[#00A389]/10 transition-colors"
                              title={`Edit article: ${post.title}`}
                              aria-label={`Edit article: ${post.title}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            {/* Publish / Unpublish Toggle */}
                            {post.status === "PUBLISHED" ? (
                              <button
                                type="button"
                                disabled={isRowBusy || isPending}
                                onClick={() => handleUnpublish(post)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors disabled:opacity-50"
                                title="Revert to Draft"
                              >
                                {isRowBusy ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <span>Unpublish</span>
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isRowBusy || isPending}
                                onClick={() => handlePublish(post)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition-colors disabled:opacity-50"
                                title="Publish article"
                              >
                                {isRowBusy ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <span>Publish</span>
                                )}
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              type="button"
                              disabled={isRowBusy || isPending}
                              onClick={() => {
                                setDeleteError(null);
                                setDeleteTarget(post);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                              title={`Delete article: ${post.title}`}
                              aria-label={`Delete article: ${post.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {posts.map((post) => {
                const isRowBusy = actionPostId === post.id;

                return (
                  <div key={post.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <Link
                          href={`/ielung-admin/blog/edit/${post.id}`}
                          className="font-bold text-sm text-[#3D4749] line-clamp-2"
                        >
                          {post.title}
                        </Link>
                        <p className="font-mono text-[11px] text-slate-400 truncate">
                          /blog/{post.slug}
                        </p>
                      </div>

                      {post.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                          Draft
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.readingTimeMinutes} min read</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Updated {formatDate(post.updatedAt)}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                      <Link
                        href={`/ielung-admin/blog/edit/${post.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        title={`Edit article: ${post.title}`}
                        aria-label={`Edit article: ${post.title}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      {post.status === "PUBLISHED" ? (
                        <button
                          type="button"
                          disabled={isRowBusy || isPending}
                          onClick={() => handleUnpublish(post)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors disabled:opacity-50"
                        >
                          {isRowBusy ? "Updating..." : "Unpublish"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isRowBusy || isPending}
                          onClick={() => handlePublish(post)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
                        >
                          {isRowBusy ? "Updating..." : "Publish"}
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isRowBusy || isPending}
                        onClick={() => {
                          setDeleteError(null);
                          setDeleteTarget(post);
                        }}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title={`Delete article: ${post.title}`}
                        aria-label={`Delete article: ${post.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination Footer */}
        {total > 0 && !error && (
          <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
            <div>
              Showing <strong className="text-slate-800">{startItem}</strong> to{" "}
              <strong className="text-slate-800">{endItem}</strong> of{" "}
              <strong className="text-slate-800">{total}</strong> posts
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1 px-2">
                <span className="text-slate-400">Page</span>
                <span className="font-bold text-slate-800">{page}</span>
                <span className="text-slate-400">of</span>
                <span className="font-bold text-slate-800">{totalPages}</span>
              </div>

              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeletePostModal
        isOpen={deleteTarget !== null}
        onClose={() => {
          if (!isDeleting) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        postTitle={deleteTarget?.title || ""}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
}
