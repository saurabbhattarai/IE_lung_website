"use client";

import { useState, useEffect, useRef } from "react";
import { Link as LinkIcon, ExternalLink, X, AlertCircle } from "lucide-react";
import { normalizeSafeUrl } from "./editor-utils";

interface LinkModalProps {
  isOpen: boolean;
  initialUrl?: string;
  onSave: (url: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export default function LinkModal({
  isOpen,
  initialUrl = "",
  onSave,
  onRemove,
  onClose,
}: LinkModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a destination URL.");
      return;
    }

    const safeUrl = normalizeSafeUrl(url);
    if (!safeUrl) {
      setError("Invalid URL. Only secure protocols (https, http, mailto) are allowed.");
      return;
    }

    setError(null);
    onSave(safeUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-base">
            <LinkIcon className="w-5 h-5 text-[#00A389]" />
            <span id="link-modal-title">
              {initialUrl ? "Edit Link" : "Insert Link"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="link-url-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
            >
              Destination URL
            </label>
            <div className="relative">
              <input
                id="link-url-input"
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://example.com or mailto:info@ielung.com"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/20 focus:outline-none transition-all"
              />
              <ExternalLink className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 mt-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1.5">
              Only secure protocols (HTTPS, HTTP, mailto) are accepted. Unsafe scripts are blocked.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {initialUrl ? (
              <button
                type="button"
                onClick={() => {
                  onRemove();
                  onClose();
                }}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
              >
                Remove Link
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#00A389] hover:bg-[#00826e] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
              >
                Apply Link
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
