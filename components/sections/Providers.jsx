"use client";

import { useEffect, useState } from "react";
import { providers } from "../../lib/constants/doctorsData";
import DoctorModal from "../DoctorsModal";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Providers() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    if (selectedDoctor) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedDoctor]);

  return (
    <section id="providers" className="py-24 px-4 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">
            Expert Team
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-5 mx-auto max-w-3xl">
            Meet Our Specialists
          </h2>
          <p className="text-lg text-primary/60 max-w-2xl mx-auto leading-relaxed">
            Trusted pulmonary and sleep medicine experts delivering
            compassionate, world-class care.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {providers.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => setSelectedDoctor(doctor)}
              className="group relative cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Visual Gradient Layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80" />

                {/* Content over Image */}
                <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
                  <span className="bg-accent/90 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                    {doctor.credentials}
                  </span>
                  <h4 className="text-2xl font-bold mb-1 group-hover:text-accent transition-colors">
                    {doctor.name}
                  </h4>
                  <p className="text-white/80 text-sm font-medium line-clamp-1 italic">
                    {doctor.speciality}
                  </p>
                </div>
              </div>

              {/* Hover Secondary View (Quick Bio) */}
              <div className="absolute inset-0 bg-primary px-10 py-4 flex flex-col transform translate-y-full group-hover:translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-20">
                <h4 className="text-2xl font-bold text-white mb-2">
                  {doctor.name}
                </h4>
                <div className="w-8 h-1 bg-accent mb-4" />
                <p className="text-white/80 text-sm line-clamp-4 leading-relaxed mb-8">
                  {doctor.fullDescription}
                </p>
                <button className="flex items-center gap-3 text-accent font-bold text-xs uppercase tracking-widest self-start group/btn">
                  View Profile{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-2 transition-transform"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <DoctorModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      </div>
    </section>
  );
}
