"use client";

import React, { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, X, Check } from "lucide-react";

interface ImageAltModalProps {
  isOpen: boolean;
  initialAlt: string;
  imageSrc?: string;
  onSave: (alt: string) => void;
  onClose: () => void;
}

export default function ImageAltModal({
  isOpen,
  initialAlt,
  imageSrc,
  onSave,
  onClose,
}: ImageAltModalProps) {
  const [alt, setAlt] = useState(initialAlt);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAlt(initialAlt || "");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialAlt]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(alt.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-alt-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-[#00A389]/10 text-[#00A389] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 id="image-alt-modal-title" className="text-sm font-bold text-[#3D4749]">
                Edit Image Alt Text
              </h3>
              <p className="text-[11px] text-slate-400">
                Helps screen readers and search engines understand this image
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close alt text modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {imageSrc && (
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={alt || "Image preview"}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
              />
              <span className="text-[11px] font-mono text-slate-500 truncate">
                {imageSrc}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="alt-text-input" className="text-xs font-semibold text-slate-700">
                Alternative Description (Alt Text)
              </label>
              <span className="text-[11px] text-slate-400">
                {alt.length}/500
              </span>
            </div>
            <input
              id="alt-text-input"
              ref={inputRef}
              type="text"
              value={alt}
              maxLength={500}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="e.g. Pulmonologist reviewing diagnostic chest CT scan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A389]/30 focus:border-[#00A389] transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00A389] hover:bg-[#00826e] text-white transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Alt Text</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
