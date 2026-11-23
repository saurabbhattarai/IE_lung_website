"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  category: string;
  isDeleting: boolean;
}

export default function DeleteGalleryModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  category,
  isDeleting,
}: DeleteGalleryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 scale-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-delete-modal-title"
      >
        <div className="flex items-center gap-4 text-rose-600 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="gallery-delete-modal-title" className="text-lg font-bold text-slate-800">
              Delete Gallery Image
            </h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              {category || "Gallery"}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Are you sure you want to delete <strong className="text-slate-900">&ldquo;{title}&rdquo;</strong>?
          If this record references a Cloudinary image that is not used anywhere else, it will be safely removed from storage. Local static files are always preserved.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
