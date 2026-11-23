"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  X,
  Download,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  Mail,
  UserCheck,
  UserX,
  Filter,
} from "lucide-react";
import {
  getSubscribersListAction,
  unsubscribeSubscriberAction,
} from "@/lib/actions/subscriber.action";
import type { SubscriberListItem } from "@/lib/subscriber/service";
import type { SubscriberStatusFilter } from "@/lib/validations/subscriber.validation";
import UnsubscribeModal from "./UnsubscribeModal";

interface SubscribersManagementClientProps {
  initialData?: {
    subscribers: SubscriberListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  initialError?: string | null;
}

export default function SubscribersManagementClient({
  initialData,
  initialError,
}: SubscribersManagementClientProps) {
  // Query state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubscriberStatusFilter>("ALL");
  const [page, setPage] = useState(initialData?.page || 1);
  const limit = 20;

  // Data state
  const [subscribers, setSubscribers] = useState<SubscriberListItem[]>(
    initialData?.subscribers || []
  );
  const [total, setTotal] = useState(initialData?.total || 0);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  // Unsubscribe modal state
  const [unsubscribeTarget, setUnsubscribeTarget] =
    useState<SubscriberListItem | null>(null);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Feedback notifications
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // CSV export loading state
  const [isExporting, setIsExporting] = useState(false);

  // Request sequencing ref
  const latestRequestIdRef = useRef(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Load subscribers from server
  const fetchSubscribers = useCallback(
    async (
      targetPage: number,
      targetSearch: string,
      targetStatus: SubscriberStatusFilter
    ) => {
      const requestId = ++latestRequestIdRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const queryPayload = {
          page: targetPage,
          limit,
          search: targetSearch.trim() || undefined,
          status: targetStatus,
        };

        const result = await getSubscribersListAction(queryPayload);

        // Discard stale response if a newer query was fired
        if (requestId !== latestRequestIdRef.current) {
          return;
        }

        if (result.success) {
          const data = result.data as {
            subscribers: SubscriberListItem[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
          setSubscribers(data.subscribers);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        } else {
          setError(result.error || "Failed to load newsletter subscribers.");
        }
      } catch (err) {
        if (requestId === latestRequestIdRef.current) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load newsletter subscribers."
          );
        }
      } finally {
        if (requestId === latestRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [limit]
  );

  // Effect to re-fetch when search, filter, or page changes (skip on very first mount if initialData is provided)
  const isFirstMountRef = useRef(true);
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    fetchSubscribers(page, debouncedSearch, statusFilter);
  }, [page, debouncedSearch, statusFilter, fetchSubscribers]);

  // Auto-dismiss feedback after 5 seconds
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 5000);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Handle Unsubscribe confirmation
  const handleConfirmUnsubscribe = async () => {
    if (!unsubscribeTarget) return;

    setIsUnsubscribing(true);
    setModalError(null);

    try {
      const result = await unsubscribeSubscriberAction(unsubscribeTarget.id);

      if (result.success) {
        setFeedback({
          type: "success",
          message:
            result.message ||
            `Successfully unsubscribed ${unsubscribeTarget.email}.`,
        });
        setUnsubscribeTarget(null);
        // Refresh list
        fetchSubscribers(page, debouncedSearch, statusFilter);
      } else {
        setModalError(result.error || "Failed to unsubscribe.");
      }
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to unsubscribe."
      );
    } finally {
      setIsUnsubscribing(false);
    }
  };

  // Format date helper
  const formatDate = (dateValue: Date | string | null | undefined): string => {
    if (!dateValue) return "—";
    try {
      const d = new Date(dateValue);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // CSV export handler
  const handleExportCsv = () => {
    setIsExporting(true);
    const params = new URLSearchParams();
    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    }
    if (statusFilter !== "ALL") {
      params.set("status", statusFilter);
    }

    const exportUrl = `/api/admin/subscribers/export?${params.toString()}`;
    window.location.href = exportUrl;

    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 p-4 rounded-2xl text-xs sm:text-sm font-medium border shadow-xs animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 hover:opacity-75 transition-opacity"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email address..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A389]/20 focus:border-[#00A389] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => fetchSubscribers(page, debouncedSearch, statusFilter)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
              title="Refresh list"
            >
              <RotateCw
                className={`w-4 h-4 text-slate-500 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* CSV Export Button */}
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={isExporting || total === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export all filtered subscribers to CSV"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>

          {(
            [
              { label: "All Subscribers", value: "ALL" },
              { label: "Active", value: "ACTIVE" },
              { label: "Unsubscribed", value: "UNSUBSCRIBED" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === tab.value
                  ? "bg-[#00A389] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table / Cards Content */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="p-8 text-center space-y-3">
            <Loader2 className="w-6 h-6 text-[#00A389] animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading subscribers...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-[#3D4749]">
              Failed to Load Subscribers
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {error}
            </p>
            <button
              type="button"
              onClick={() => fetchSubscribers(page, debouncedSearch, statusFilter)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00A389] text-white hover:bg-[#00826e] transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && subscribers.length === 0 && (
          <div className="p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#3D4749]">
                No Subscribers Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {debouncedSearch || statusFilter !== "ALL"
                  ? "No subscriber records match your current search or filter criteria."
                  : "Your newsletter subscriber list is currently empty. Public subscriptions will appear here automatically."}
              </p>
            </div>
            {(debouncedSearch || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setStatusFilter("ALL");
                  setPage(1);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        )}

        {/* Desktop Table View (≥ 768px) */}
        {!isLoading && !error && subscribers.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Subscriber</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Subscribed Date</th>
                  <th className="py-4 px-6">Unsubscribed Date</th>
                  <th className="py-4 px-6">Last Updated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {subscribers.map((subscriber) => {
                  const isActive = subscriber.status === "ACTIVE";
                  return (
                    <tr
                      key={subscriber.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <Mail className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-slate-800 break-all">
                            {subscriber.email}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Unsubscribed</span>
                          </span>
                        )}
                      </td>

                      {/* Subscribed Date */}
                      <td className="py-4 px-6 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(subscriber.subscribedAt)}</span>
                        </div>
                      </td>

                      {/* Unsubscribed Date */}
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {subscriber.unsubscribedAt
                          ? formatDate(subscriber.unsubscribedAt)
                          : "—"}
                      </td>

                      {/* Last Updated */}
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {formatDate(subscriber.updatedAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        {isActive ? (
                          <button
                            type="button"
                            onClick={() => setUnsubscribeTarget(subscriber)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
                            title="Unsubscribe recipient"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Unsubscribe</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Unsubscribed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards View (< 768px) */}
        {!isLoading && !error && subscribers.length > 0 && (
          <div className="block md:hidden divide-y divide-slate-100">
            {subscribers.map((subscriber) => {
              const isActive = subscriber.status === "ACTIVE";
              return (
                <div key={subscriber.id} className="p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm text-slate-800 break-all">
                        {subscriber.email}
                      </span>
                    </div>

                    {isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60 shrink-0">
                        Unsubscribed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Subscribed
                      </span>
                      <span>{formatDate(subscriber.subscribedAt)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Unsubscribed
                      </span>
                      <span>
                        {subscriber.unsubscribedAt
                          ? formatDate(subscriber.unsubscribedAt)
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setUnsubscribeTarget(subscriber)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Unsubscribe</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Server-Side Pagination Bar */}
        {!isLoading && !error && subscribers.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <strong className="text-slate-700">
                {(page - 1) * limit + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-slate-700">
                {Math.min(page * limit, total)}
              </strong>{" "}
              of <strong className="text-slate-700">{total}</strong> subscribers
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <span className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unsubscribe Confirmation Modal */}
      <UnsubscribeModal
        subscriber={unsubscribeTarget}
        isOpen={Boolean(unsubscribeTarget)}
        isSubmitting={isUnsubscribing}
        error={modalError}
        onConfirm={handleConfirmUnsubscribe}
        onCancel={() => {
          setUnsubscribeTarget(null);
          setModalError(null);
        }}
      />
    </div>
  );
}
