"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  Building2,
  Monitor,
  DoorOpen,
  Microscope,
} from "lucide-react";

export default function FacilityTour() {
  const [activeTab, setActiveTab] = useState(0);

  const facilities = [
    {
      title: "Modern Clinic Spaces",
      description:
        "Our comfortable, state-of-the-art examination rooms are designed for patient comfort and efficient care delivery with the latest medical equipment.",
      icon: Building2,
      color: "from-teal-400/20 to-primary/10",
    },
    {
      title: "Advanced Sleep Lab",
      description:
        "ISO-certified sleep laboratory with private, hotel-like sleep rooms equipped with cutting-edge monitoring technology for accurate sleep studies.",
      icon: Monitor,
      color: "from-secondary/20 to-teal-500/10",
    },
    {
      title: "Relaxation Areas",
      description:
        "Welcoming waiting areas and patient lounges designed to reduce anxiety and create a peaceful environment during your visit.",
      icon: DoorOpen,
      color: "from-cyan-400/20 to-primary/10",
    },
    {
      title: "Diagnostic Center",
      description:
        "Equipped with spirometry, cardiopulmonary exercise testing, and other advanced diagnostic tools for comprehensive respiratory assessment.",
      icon: Microscope,
      color: "from-primary/20 to-secondary/10",
    },
  ];

  return (
    <section
      id="facility"
      className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-secondary font-semibold uppercase tracking-widest mb-4 animate-slide-down">
            Our Facilities
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance animate-slide-up">
            State-of-the-Art Facilities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty animate-fade-in-delayed">
            We invest in the latest technology and create comfortable spaces to
            provide you the best care experience.
          </p>
        </div>

        {/* Tour Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch mb-16">
          {/* Left - Tabs */}
          <div className="flex flex-col space-y-4">
            {facilities.map((facility, idx) => {
              const IconComponent = facility.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-500 flex items-start gap-4 group hover:shadow-lg transform hover:-translate-y-1 ${
                    activeTab === idx
                      ? "bg-gradient-to-r from-secondary/10 to-primary/5 border-secondary shadow-lg scale-[1.02]"
                      : "bg-white border-gray-200 hover:border-secondary/50"
                  }`}
                  style={{
                    animation: `slideInLeft 0.5s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      activeTab === idx
                        ? "bg-secondary text-white shadow-lg scale-110"
                        : "bg-gray-100 text-primary group-hover:bg-secondary/20 group-hover:scale-105"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-bold text-base mb-1 transition-colors ${
                        activeTab === idx ? "text-primary" : "text-gray-800"
                      }`}
                    >
                      {facility.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {facility.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 flex-shrink-0 mt-1 transition-all duration-300 ${
                      activeTab === idx
                        ? "text-secondary translate-x-1"
                        : "text-gray-400 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right - Content Display */}
          <div
            key={activeTab}
            className={`bg-gradient-to-br ${facilities[activeTab].color} rounded-2xl p-10 flex flex-col justify-center border-2 border-gray-200 shadow-xl relative overflow-hidden animate-fade-in-scale`}
          >
            {/* Decorative Circle */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="mb-6 inline-block p-4 bg-white rounded-2xl shadow-md animate-bounce-subtle">
                {React.createElement(facilities[activeTab].icon, {
                  className: "w-14 h-14 text-secondary",
                })}
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4 animate-slide-up">
                {facilities[activeTab].title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 animate-fade-in-delayed">
                {facilities[activeTab].description}
              </p>
              <div className="flex flex-wrap gap-3">
                {["Modern", "Comfortable", "Advanced"].map((tag, idx) => (
                  <span
                    key={tag}
                    className="px-5 py-2 bg-white/80 backdrop-blur-sm text-secondary rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default"
                    style={{
                      animation: `slideInUp 0.5s ease-out ${idx * 0.1}s both`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Tour CTA */}
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-12 text-center text-white shadow-2xl relative overflow-hidden group animate-fade-in-scale">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full animate-float-delayed"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-float-slow"></div>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">
              Schedule a Facility Tour
            </h3>
            <p className="mb-8 max-w-xl mx-auto text-gray-100 text-lg">
              We welcome visitors to explore our state-of-the-art facilities and
              meet our team in person.
            </p>
            <button className="bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group inline-flex items-center gap-2">
              REQUEST A TOUR
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

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

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounceSubtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes floatDelayed {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-15px) translateX(-10px);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-25px) scale(1.1);
          }
        }

        .animate-fade-in {
          animation: fadeInScale 0.6s ease-out;
        }

        .animate-fade-in-delayed {
          animation: fadeInScale 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slideInUp 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slideInUp 0.6s ease-out reverse;
        }

        .animate-bounce-subtle {
          animation: bounceSubtle 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: floatSlow 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
