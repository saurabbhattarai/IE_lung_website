import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function ServiceCtaBanner({
  title = "Ready to Breathe Easier?",
  subtitle = "Our board-certified specialists provide science-driven, compassionate pulmonary and sleep care in Redlands, CA. Schedule your evaluation today.",
  ctaText = "Request an Appointment",
  ctaHref = "/#schedule",
  phone = "909-938-1152",
}) {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-[#3D4749] to-[#2D3537] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/80 text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base group"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          {phone && (
            <a
              href={`tel:${phone.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white font-semibold px-7 py-3.5 rounded-full backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
            >
              <Phone className="w-4 h-4 text-accent" />
              <span>Call {phone}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
