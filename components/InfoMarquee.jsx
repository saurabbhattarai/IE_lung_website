"use client";

import { Phone, Mail, MapPin, Printer } from "lucide-react";

export default function InfoMarquee() {
  const items = [
    {
      icon: MapPin,
      text: "245 Terracina Boulevard, Suite 108, Redlands, CA 92373",
      href: "https://www.google.com/maps/search/245+Terracina+Boulevard,+Suite+108,+Redlands,+CA+92373",
      external: true,
    },
    {
      icon: Phone,
      text: "909 938 1152",
      href: "tel:+19099381152",
    },
    {
      icon: Printer,
      text: "Fax: 909 453 3676",
      href: "tel:+19094533676",
    },
    {
      icon: Mail,
      text: "contact@ielung.com",
      href: "mailto:contact@ielung.com",
    },
  ];

  // Duplicate the list so the scroll looks seamless
  const doubled = [...items, ...items];

  return (
    <div className="bg-[#3D4749] text-white overflow-hidden whitespace-nowrap">
      <div className="inline-flex animate-marquee">
        {doubled.map((item, i) => (
          <a
            key={i}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 px-6 py-2 text-xs sm:text-sm hover:text-accent transition-colors shrink-0"
          >
            <item.icon className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>{item.text}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

