"use client";

import Link from "next/link";
import { X, Calendar, Award, BookOpen } from "lucide-react";
import Image from "next/image";

export default function DoctorModal({ doctor, onClose }) {
  if (!doctor) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] px-4 py-6 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-2xl w-full rounded-[2.5rem] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300 max-h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header/Image Section */}
        <div className="relative bg-slate-50 pt-12 pb-8 px-8 flex flex-col items-center border-b border-slate-100">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-red-500 hover:rotate-90 transition-all duration-300"
          >
            <X size={24} />
          </button>

          {/* THE IMAGE FIX: Scaled & Styled Profile Image */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 group">
            <div className="absolute inset-0 bg-accent rounded-full animate-pulse opacity-20 group-hover:scale-110 transition-transform" />
            <div className="relative w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-accent font-bold text-[10px] uppercase tracking-widest">
              <Award size={14} />
              Board Certified Specialist
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {doctor.name}
            </h2>
            <p className="text-slate-500 font-medium text-sm italic">
              {doctor.credentials}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 md:p-10 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <BookOpen size={20} className="text-accent" />
              <h4 className="font-bold text-sm uppercase tracking-widest">
                About the Provider
              </h4>
            </div>

            <p className="text-slate-600 leading-relaxed text-base">
              <span className="text-primary font-semibold">
                {doctor.speciality}:
              </span>{" "}
              {doctor.fullDescription}
            </p>

            <div className="pt-6">
              <Link href={"/#schedule"} className="block w-full">
                <button
                  onClick={onClose}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold hover:bg-accent hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                >
                  <Calendar size={20} />
                  Schedule Appointment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
