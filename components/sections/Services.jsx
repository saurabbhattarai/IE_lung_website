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
    <section id="services" className="py-24 px-4 bg-white border-t border-primary/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">SERVICES</p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-5 mx-auto max-w-3xl">
            Comprehensive Respiratory & Sleep Care
          </h2>
          <p className="text-lg text-primary/60 max-w-2xl mx-auto leading-relaxed">
            From diagnosis to ongoing treatment and management, we provide complete care for your respiratory and sleep health needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div 
                key={service.id} 
                className="group relative bg-white border-2 border-primary/10 rounded-2xl p-8 hover:border-accent/30 transition-all duration-300"
              >
                {/* Number badge */}
                <div className="absolute top-8 right-8 text-5xl font-bold text-primary/5 group-hover:text-accent/30 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="relative">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                  <p className="text-primary/60 text-[15px] leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2.5 pt-4 border-t border-primary/10">
                    {service.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-primary/70 text-sm">
                        <div className="w-1 h-1 bg-accent rounded-full" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
   
      </div>
    </section>
  )
}