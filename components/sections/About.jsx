'use client'

import { Bug as Lung, Heart, Users } from 'lucide-react'

export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">Who We Are</p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
            Your Trusted Partner in Respiratory & Sleep Health
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
            At IE Lung, we believe that quality healthcare comes from combining medical expertise with genuine compassion.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Mission */}
          <div>
            <h3 className="text-3xl font-bold text-primary mb-6">Our Mission</h3>
            <p className="text-foreground/80 text-lg leading-relaxed mb-6">
              We provide comprehensive care for obstructive, restrictive, and pulmonary vascular lung diseases, as well as sleep disorders. Our mission is to deliver science-driven care that aligns with what matters most to you.
            </p>
            <div className="bg-secondary/50 border-l-4 border-accent p-6 rounded-lg">
              <p className="text-primary font-semibold italic">
                {'"'}Every visit brings together two experts: our clinicians and you. Your insights matter as much as our medical knowledge.{'"'}
              </p>
            </div>
          </div>

          {/* Right - Values */}
          <div className="grid gap-6">
            <div className="bg-white rounded-lg p-6 border border-secondary shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-bold text-primary mb-2">Patient-Centered</h4>
              <p className="text-foreground/70">We listen, partner with you, and support your journey to better health.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-secondary shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Lung className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-bold text-primary mb-2">Science-Driven</h4>
              <p className="text-foreground/70">Our treatment plans are based on latest medical evidence and research.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-secondary shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-bold text-primary mb-2">Community Focused</h4>
              <p className="text-foreground/70">We are deeply committed to strengthening respiratory health in the Inland Empire.</p>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-accent/10 rounded-lg p-8 text-center">
            <p className="text-3xl font-bold text-accent mb-2">15+</p>
            <p className="text-primary font-medium">Years Experience</p>
          </div>
          <div className="bg-accent/10 rounded-lg p-8 text-center">
            <p className="text-3xl font-bold text-accent mb-2">5000+</p>
            <p className="text-primary font-medium">Patients Served</p>
          </div>
          <div className="bg-accent/10 rounded-lg p-8 text-center">
            <p className="text-3xl font-bold text-accent mb-2">98%</p>
            <p className="text-primary font-medium">Patient Satisfaction</p>
          </div>
          <div className="bg-accent/10 rounded-lg p-8 text-center">
            <p className="text-3xl font-bold text-accent mb-2">24/7</p>
            <p className="text-primary font-medium">Emergency Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
