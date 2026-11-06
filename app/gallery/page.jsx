"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ChevronRight,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Calendar,
  MapPin,
  ArrowRight,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { openingDayImages } from "@/lib/constants/galleryData";

export default function GalleryPage() {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Opening Day"];

  const filteredImages =
    activeFilter === "All"
      ? openingDayImages
      : openingDayImages.filter((img) => img.category === activeFilter);

  // Keyboard controls for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) =>
          prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1
        );
      }
      if (e.key === "ArrowRight") {
        setSelectedIdx((prev) =>
          prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, filteredImages.length]);

  return (
    <main className="bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#3D4749] via-[#2D3537] to-[#1D2527] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-24 relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">Gallery</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent/20 text-accent">
                <Camera size={14} /> Photo Gallery
              </span>
              <span className="text-xs text-white/60 flex items-center gap-1">
                <Calendar size={13} /> November 2, 2026
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Glimpses of Opening Day
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              Step inside the grand opening of Inland Empire Lung & Sleep Institute at 245 Terracina Boulevard, Suite 108 in Redlands, CA.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-slate-50/60">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Top Bar with Filter & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeFilter === cat
                      ? "bg-[#3D4749] text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat === "All" ? "All Photos" : cat}
                </button>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Showing {filteredImages.length} of {openingDayImages.length} photographs
            </p>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setSelectedIdx(idx)}
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                      <Maximize2 size={20} />
                    </div>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-primary text-sm sm:text-base">
                      {img.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Opening Day • Redlands, CA
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Event Context Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-sm">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Milestone Moment
                </span>
                <h3 className="text-2xl font-bold text-primary">
                  Bringing Comprehensive Lung & Sleep Medicine to Redlands
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  On November 2, 2026, IE Lung officially opened its doors with seven board-certified specialists across pulmonary medicine, critical care, sleep medicine, and interventional pulmonology. We are proud to serve patients and referring providers across San Bernardino County and Riverside County.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-accent" /> 245 Terracina Blvd, Suite 108, Redlands
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-accent" /> Accepting New Patients
                  </span>
                </div>
              </div>
              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
                <Link
                  href="/#schedule"
                  className="bg-[#3D4749] hover:bg-[#252C2D] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center text-sm shadow-sm"
                >
                  Book an Appointment
                </Link>
                <Link
                  href="/#contact"
                  className="border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center text-sm bg-white hover:bg-slate-50"
                >
                  Contact Clinic
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-[#2D3537] to-primary py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Experience Our Science-Led, Patient-Centered Care
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Whether you need asthma evaluation, sleep study testing, or an expert second opinion, our team is here for you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/#schedule"
              className="bg-accent hover:bg-accent/90 text-primary font-bold px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              Schedule Appointment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

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
                prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1
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
                prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0
              );
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-20"
            aria-label="Next photo"
          >
            <ChevronRightIcon size={28} />
          </button>

          {/* Image & Caption */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[65vh] sm:h-[75vh]">
              <Image
                src={filteredImages[selectedIdx].src}
                alt={filteredImages[selectedIdx].alt}
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-bold">
                {filteredImages[selectedIdx].title}
              </p>
              <p className="text-xs text-white/60 mt-1">
                Photo {selectedIdx + 1} of {filteredImages.length} • Glimpses of Opening Day (November 2, 2026)
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

