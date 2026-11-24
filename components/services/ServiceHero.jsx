import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import ServiceBreadcrumbs from "./ServiceBreadcrumbs";

export default function ServiceHero({
  category = "Pulmonary Care",
  title,
  subtitle,
  intro,
  breadcrumbs = [],
  ctaText = "Request an Appointment",
  ctaHref = "/#schedule",
  phone = "909-938-1152",
}) {
  const introParagraphs = Array.isArray(intro) ? intro : [intro].filter(Boolean);

  return (
    <section className="relative bg-gradient-to-br from-[#3D4749] via-[#2D3537] to-[#1D2527] text-white overflow-hidden py-16 md:py-24 px-4">
      {/* Subtle ambient light - restrained medical palette */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {breadcrumbs.length > 0 && <ServiceBreadcrumbs items={breadcrumbs} />}

        {category && (
          <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3 select-none">
            {category}
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 max-w-4xl leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 font-medium mb-6 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {introParagraphs.length > 0 && (
          <div className="space-y-4 max-w-3xl text-white/80 text-base md:text-lg leading-relaxed mb-8">
            {introParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base group"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {phone && (
            <a
              href={`tel:${phone.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white/90 hover:text-white font-semibold px-6 py-3.5 rounded-full backdrop-blur-sm transition-all duration-300 text-sm md:text-base"
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
