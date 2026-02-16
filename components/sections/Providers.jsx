"use client";

import { User } from "lucide-react";

export default function Providers() {
  const providers = [
    {
      name: "Dr. Sarah Williams",
      specialty: "Pulmonary & Sleep Medicine",
      credentials: "MD, Board Certified",
      bio: "With over 18 years of experience in pulmonary medicine, Dr. Williams specializes in complex respiratory conditions.",
      image: "https://via.placeholder.com/300x300?text=Dr.+Williams",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Sleep Medicine Specialist",
      credentials: "MD, FCCP, Board Certified Sleep",
      bio: "Dr. Chen is dedicated to providing personalized sleep solutions with state-of-the-art diagnostic technology.",
      image: "https://via.placeholder.com/300x300?text=Dr.+Chen",
    },
    {
      name: "Dr. Jennifer Rodriguez",
      specialty: "Pulmonary Medicine",
      credentials: "MD, Board Certified",
      bio: "Dr. Rodriguez brings compassionate care and innovative treatment approaches to her patients.",
      image: "https://via.placeholder.com/300x300?text=Dr.+Rodriguez",
    },
    {
      name: "Dr. James Lee",
      specialty: "Sleep & Respiratory Disorders",
      credentials: "MD, Board Certified",
      bio: "With a focus on integrated care, Dr. Lee treats both pulmonary and sleep conditions holistically.",
      image: "https://via.placeholder.com/300x300?text=Dr.+Lee",
    },
  ];

  return (
    <section id="providers" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">
            Expert Team
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
            Meet Our Providers
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
            Our board-certified physicians bring decades of combined experience
            and genuine compassion to every patient interaction.
          </p>
        </div>

        {/* Providers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((provider, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg overflow-hidden border border-secondary hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-primary/5 flex items-center justify-center relative">
                {/* Animated Pulse Rings*/} 
                <div className="absolute w-24 h-24 bg-accent/10 rounded-full animate-ping opacity-20" />
                <div className="absolute w-32 h-32 bg-accent/5 rounded-full animate-pulse" />

                <div className="bg-white p-4 rounded-full shadow-sm border border-accent/20 z-10">
                  <User className="w-20 h-20 text-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-primary text-lg mb-1">
                  {provider.name}
                </h3>
                <p className="text-accent text-sm font-semibold mb-2">
                  {provider.specialty}
                </p>
                <p className="text-xs text-foreground/60 mb-4">
                  {provider.credentials}
                </p>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {provider.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-accent/5 rounded-lg p-8 border border-accent/20 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Professional Excellence
          </h3>
          <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
            All our providers are board-certified, actively involved in
            continuing medical education, and committed to staying at the
            forefront of pulmonary and sleep medicine.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-2xl font-bold text-accent">95+</p>
              <p className="text-sm text-foreground/70">
                Combined Years Experience
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">4</p>
              <p className="text-sm text-foreground/70">Expert Providers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">100%</p>
              <p className="text-sm text-foreground/70">Board Certified</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
