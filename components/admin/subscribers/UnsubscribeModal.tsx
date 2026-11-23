"use client";

import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import type { SubscriberListItem } from "@/lib/subscriber/service";

interface UnsubscribeModalProps {
  subscriber: SubscriberListItem | null;
  isOpen: boolean;
  isSubmitting: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UnsubscribeModal({
  subscriber,
  isOpen,
  isSubmitting,
  error,
  onConfirm,
  onCancel,
}: UnsubscribeModalProps) {
  if (!isOpen || !subscriber) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsubscribe-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3
            id="unsubscribe-modal-title"
            className="text-lg font-bold text-[#3D4749]"
          >
            Unsubscribe Recipient?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Are you sure you want to unsubscribe{" "}
            <strong className="text-slate-800 break-all">{subscriber.email}</strong>?
          </p>
          <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-800 leading-relaxed">
            This subscriber will be marked as <strong>UNSUBSCRIBED</strong> and will
            no longer receive newsletter broadcasts. Their record and subscription
            history will be preserved.
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 leading-relaxed"
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Unsubscribing...</span>
              </>
            ) : (
              <span>Confirm Unsubscribe</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
