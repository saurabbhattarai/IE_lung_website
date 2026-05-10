"use client";

import { Quote } from "lucide-react";
import { testimonials } from "../../lib/constants/testimonialData";

const StarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none">
      <path
        fill="#ffef5e"
        d="M11.523 1.332a.511.511 0 0 1 .957 0l2.59 7.343h7.315a.512.512 0 0 1 .332.9l-6.112 5.067l2.558 7.685a.512.512 0 0 1-.788.574L12 18.224L5.622 22.9a.511.511 0 0 1-.785-.574l2.559-7.685l-6.113-5.067a.512.512 0 0 1 .332-.9h7.316z"
      />
      <path
        fill="#fff9bf"
        d="M12 18.224L5.622 22.9a.511.511 0 0 1-.785-.574l2.559-7.685l-6.113-5.067a.512.512 0 0 1 .332-.9h7.316l2.59-7.343a.51.51 0 0 1 .48-.332z"
      />
      <path
        stroke="#e3d354"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.523 1.332a.511.511 0 0 1 .957 0l2.59 7.343h7.315a.512.512 0 0 1 .332.9l-6.112 5.067l2.558 7.685a.512.512 0 0 1-.788.574L12 18.224L5.622 22.9a.511.511 0 0 1-.785-.574l2.559-7.685l-6.113-5.067a.512.512 0 0 1 .332-.9h7.316z"
      />
    </g>
  </svg>
);

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto py-12 border-t border-gray-200">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">
            Patient Success Stories
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            What Our Patients Say
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Real stories from real patients about their transformative
            experiences with IE Lung.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-md hover:shadow-lg transition-all duration-500 flex flex-col hover:-translate-y-2"
            >
              {/* Stars + Quote */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                    />
                  ))}
                </div>
                <Quote className="w-10 h-10 text-slate-100 group-hover:text-accent/20 transition-colors duration-500 rotate-12" />
              </div>

              {/* Text */}
              <p className="text-slate-600 mb-8 flex-1 leading-relaxed text-lg font-medium italic">
                "{testimonial.text}"
              </p>

              {/* Footer */}
              <div className="flex items-center gap-4 border-t border-slate-50 pt-6 mt-auto">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* Info */}
                <div>
                  <p className="font-bold text-primary leading-tight">
                    {testimonial.name}
                  </p>

                  <div className="flex flex-col gap-1 mt-1">
                    {/* Condition */}
                    <span className="inline-block w-fit px-2 py-0.5 rounded bg-secondary/40 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      {testimonial.condition}
                    </span>

                    {/* Doctor name added */}
                    <span className="text-xs text-slate-400 italic">
                      Examined by
                      <span className="pl-1 text-accent font-medium">
                        {testimonial.doctor}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
