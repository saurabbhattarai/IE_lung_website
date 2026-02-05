'use client'

import { Stethoscope, Wind, Radio } from 'lucide-react'

export default function Services() {
  const services = [
    {
      id: 1,
      title: 'Pulmonary Care',
      description: 'Comprehensive evaluation and treatment of obstructive, restrictive, and vascular lung diseases including COPD, asthma, and interstitial lung disease.',
      icon: Wind,
      highlights: ['Diagnosis', 'Treatment Plans', 'Chronic Disease Management']
    },
    {
      id: 2,
      title: 'Sleep Medicine',
      description: 'Expert diagnosis and treatment of sleep disorders including obstructive sleep apnea, insomnia, and other sleep disturbances affecting your quality of life.',
      icon: Radio,
      highlights: ['Sleep Studies', 'CPAP Therapy', 'Behavioral Treatment']
    },
    {
      id: 3,
      title: 'Diagnostic Testing',
      description: 'State-of-the-art pulmonary function testing, sleep studies, and other diagnostic procedures to accurately assess your respiratory health.',
      icon: Stethoscope,
      highlights: ['Spirometry', 'Sleep Lab', 'Blood Gas Analysis']
    }
  ]

  return (
    <section id="services" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">Our Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
            Comprehensive Respiratory & Sleep Care
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
            From diagnosis to ongoing treatment and management, we provide complete care for your respiratory and sleep health needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <div key={service.id} className="bg-background rounded-lg border border-secondary p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <IconComponent className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{service.title}</h3>
                <p className="text-foreground/70 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-primary text-sm">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-accent/10 to-primary/5 rounded-lg p-12 text-center border border-accent/20">
          <h3 className="text-2xl font-bold text-primary mb-4">Ready to Start Your Journey to Better Health?</h3>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
            Schedule a consultation with our experienced team to discuss your respiratory and sleep health concerns.
          </p>
          <button className="bg-accent hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
            SCHEDULE YOUR APPOINTMENT
          </button>
        </div>
      </div>
    </section>
  )
}
