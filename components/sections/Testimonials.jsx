'use client'

import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Margaret Johnson',
      condition: 'Sleep Apnea Patient',
      text: 'The team at IE Lung changed my life. After just a few weeks of CPAP therapy prescribed by Dr. Williams, I finally feel rested and energized again. Their compassionate care made all the difference.',
      rating: 5
    },
    {
      name: 'Robert Martinez',
      condition: 'COPD Management',
      text: 'Dr. Chen takes time to really listen and understand your concerns. The personalized treatment plan he created has helped me manage my COPD symptoms effectively and improve my quality of life.',
      rating: 5
    },
    {
      name: 'Patricia Lee',
      condition: 'Asthma Patient',
      text: 'From the moment I walked in, I felt welcomed and cared for. The staff is professional yet warm, and Dr. Rodriguez has given me tools to better control my asthma.',
      rating: 5
    },
    {
      name: 'David Thompson',
      condition: 'Sleep Study Patient',
      text: 'The sleep lab was incredibly comfortable - it felt like sleeping in a nice hotel room! The results helped identify my sleep issues, and now I sleep better than I have in years.',
      rating: 5
    },
    {
      name: 'Elizabeth Garcia',
      condition: 'Pulmonary Function Testing',
      text: 'Professional, efficient, and caring. The entire experience was smooth from scheduling to the actual appointment. I highly recommend IE Lung to anyone seeking respiratory care.',
      rating: 5
    },
    {
      name: 'Michael Patel',
      condition: 'Sleep Medicine Patient',
      text: 'Finally found a clinic that treats patients as individuals, not just cases. Dr. Lee worked with me to find the right treatment approach, and I have never felt better.',
      rating: 5
    }
  ]

  return (
    <section id="testimonials" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto py-12 border-t border-gray-200">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">Patient Success Stories</p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
            What Our Patients Say
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
            Real stories from real patients about their transformative experiences with IE Lung.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-lg p-8 border border-secondary hover:shadow-lg transition-all duration-300 flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <Quote className="w-8 h-8 text-accent/20 mb-4" />

              {/* Text */}
              <p className="text-foreground/70 mb-6 flex-1 leading-relaxed text-pretty">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="border-t border-secondary pt-4">
                <p className="font-bold text-primary">{testimonial.name}</p>
                <p className="text-sm text-foreground/60">{testimonial.condition}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {/* <div className="bg-gradient-to-r from-primary to-accent/20 rounded-lg p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">98%</p>
              <p className="text-lg opacity-90">Patient Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">5000+</p>
              <p className="text-lg opacity-90">Patients Treated Successfully</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">4.9/5</p>
              <p className="text-lg opacity-90">Average Patient Rating</p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
