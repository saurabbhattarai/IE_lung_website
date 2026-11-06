"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Maximize2, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { openingDayImages } from "@/lib/constants/galleryData";

export default function OpeningGallery() {
  const [selectedIdx, setSelectedIdx] = useState(null);

  // Close lightbox on Escape and support keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : openingDayImages.length - 1));
      }
      if (e.key === "ArrowRight") {
        setSelectedIdx((prev) => (prev !== null && prev < openingDayImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx]);

  // Preview first 6 on homepage
  const previewImages = openingDayImages.slice(0, 6);

  return (
    <section id="gallery" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-accent font-semibold uppercase tracking-widest text-sm flex items-center gap-2 mb-3">
              <Camera size={16} /> Photo Gallery
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Glimpses of Opening Day
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Memorable moments from the grand opening of Inland Empire Lung & Sleep Institute in Redlands, CA on November 2, 2026.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors shrink-0 group border border-slate-200 hover:border-accent/40 rounded-xl px-5 py-3 shadow-sm hover:shadow"
          >
            <span>View Full Gallery ({openingDayImages.length} Photos)</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setSelectedIdx(idx)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer aspect-[4/3]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-accent mb-1">
                  Opening Day • Nov 2, 2026
                </span>
                <h4 className="font-bold text-sm sm:text-base leading-snug">
                  {img.title}
                </h4>
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Maximize2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to Gallery Page */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-[#3D4749] hover:bg-[#252C2D] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-sm"
          >
            <span>Explore All Opening Day Moments in Gallery</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedIdx(null)}
        >
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all z-20"
            aria-label="Close photo preview"
          >
            <X size={24} />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIdx((prev) =>
                prev !== null && prev > 0 ? prev - 1 : openingDayImages.length - 1
              );
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-20"
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIdx((prev) =>
                prev !== null && prev < openingDayImages.length - 1 ? prev + 1 : 0
              );
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-20"
            aria-label="Next photo"
          >
            <ChevronRight size={28} />
          </button>

          {/* Image & Caption */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[65vh] sm:h-[75vh]">
              <Image
                src={openingDayImages[selectedIdx].src}
                alt={openingDayImages[selectedIdx].alt}
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-bold">
                {openingDayImages[selectedIdx].title}
              </p>
              <p className="text-xs text-white/60 mt-1">
                Photo {selectedIdx + 1} of {openingDayImages.length} • Glimpses of Opening Day (Nov 2, 2026)
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

