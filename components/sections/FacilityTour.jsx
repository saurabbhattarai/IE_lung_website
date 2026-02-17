"use client";

import React, { useState, useEffect } from "react"; // Added useEffect
import {
  ChevronRight,
  Building2,
  Monitor,
  DoorOpen,
  Microscope,
} from "lucide-react";
import Image from "next/image";

export default function FacilityTour() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state whenever the tab changes
  useEffect(() => {
    setIsLoading(true);
  }, [activeTab]);

  const facilities = [
    {
      title: "Modern Clinic Spaces",
      description:
        "Our comfortable, state-of-the-art examination rooms are designed for patient comfort and efficient care delivery.",
      icon: Building2,
      image: "/modern-clinic-spaces.jpg",
      tags: ["Minimalist", "Private", "Ergonomic"],
    },
    {
      title: "Advanced Sleep Lab",
      description:
        "ISO-certified sleep laboratory with private, hotel-like sleep rooms equipped with cutting-edge monitoring technology.",
      icon: Monitor,
      image: "/advanced-sleep-lab.jpg",
      tags: ["ISO-Certified", "Monitored", "Hotel-like"],
    },
    {
      title: "Relaxation Areas",
      description:
        "Welcoming waiting areas and patient lounges designed to reduce anxiety and create a peaceful environment.",
      icon: DoorOpen,
      image: "/relaxation-areas.jpg",
      tags: ["Biophilic", "Calming", "Natural Light"],
    },
    {
      title: "Diagnostic Center",
      description:
        "Equipped with spirometry and advanced diagnostic tools for comprehensive respiratory assessment.",
      icon: Microscope,
      image: "/diagnostic-center.jpg",
      tags: ["High-Tech", "Precise", "Comprehensive"],
    },
  ];

  return (
    <section
      id="facility"
      className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">
            Our Facilities
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            State-of-the-Art Facilities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We invest in the latest technology to provide you the best care
            experience.
          </p>
        </div>

        {/* --- ADDED: Tab Navigation Buttons --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {facilities.map((facility, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === index
                  ? "bg-[#3D4749] text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <facility.icon className="w-5 h-5" />
              <span className="hidden md:inline">{facility.title}</span>
            </button>
          ))}
        </div>

        {/* Main Tour Display */}
        <div className="relative rounded-3xl min-h-[500px] flex flex-col justify-end p-8 md:p-12 shadow-2xl overflow-hidden border border-gray-100 mb-20">
          {/* 1. SKELETON LAYER */}
          {isLoading && (
            <div className="absolute inset-0 z-30 bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="absolute bottom-12 left-12 space-y-4 w-full">
                <div className="h-10 w-2/3 bg-gray-300 rounded-lg animate-pulse" />
                <div className="h-6 w-1/2 bg-gray-300 rounded-lg animate-pulse" />
              </div>
            </div>
          )}

          {/* 2. THE IMAGE (Now correctly linked to isLoading) */}
          <Image
            key={facilities[activeTab].image} // Force re-render on tab change
            src={facilities[activeTab].image}
            alt={facilities[activeTab].title}
            fill
            onLoad={() => setIsLoading(false)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              isLoading ? "scale-110 blur-xl" : "scale-100 blur-0"
            }`}
          />

          {/* 3. GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#3D4749] via-[#3D4749]/40 to-transparent z-10" />

          {/* 4. CONTENT LAYER */}
          <div
            className={`relative z-20 transition-opacity duration-700 ${isLoading ? "opacity-0" : "opacity-100"}`}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-up">
              {facilities[activeTab].title}
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed mb-8 max-w-lg">
              {facilities[activeTab].description}
            </p>
            <div className="flex flex-wrap gap-3">
              {facilities[activeTab].tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Virtual Tour CTA */}
        {/* <div className="bg-gradient-to-r from-[#3D4749] to-gray-700 rounded-2xl p-12 text-center text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Schedule a Facility Tour</h3>
            <p className="mb-8 max-w-xl mx-auto text-gray-100 text-lg">
              We welcome visitors to explore our state-of-the-art facilities and meet our team in person.
            </p>
            <button className="bg-white text-[#3D4749] px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group inline-flex items-center gap-2">
              REQUEST A TOUR
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideInUp 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}
