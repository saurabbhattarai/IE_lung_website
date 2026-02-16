"use client";

import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Margaret Johnson",
      condition: "Sleep Apnea Patient",
      text: "The team at IE Lung changed my life. After just a few weeks of CPAP therapy prescribed by Dr. Williams, I finally feel rested and energized again. Their compassionate care made all the difference.",
      rating: 5,
    },
    {
      name: "Robert Martinez",
      condition: "COPD Management",
      text: "Dr. Chen takes time to really listen and understand your concerns. The personalized treatment plan he created has helped me manage my COPD symptoms effectively and improve my quality of life.",
      rating: 5,
    },
    {
      name: "Patricia Lee",
      condition: "Asthma Patient",
      text: "From the moment I walked in, I felt welcomed and cared for. The staff is professional yet warm, and Dr. Rodriguez has given me tools to better control my asthma.",
      rating: 5,
    },
    {
      name: "David Thompson",
      condition: "Sleep Study Patient",
      text: "The sleep lab was incredibly comfortable - it felt like sleeping in a nice hotel room! The results helped identify my sleep issues, and now I sleep better than I have in years.",
      rating: 5,
    },
    {
      name: "Elizabeth Garcia",
      condition: "Pulmonary Function Testing",
      text: "Professional, efficient, and caring. The entire experience was smooth from scheduling to the actual appointment. I highly recommend IE Lung to anyone seeking respiratory care.",
      rating: 5,
    },
    {
      name: "Michael Patel",
      condition: "Sleep Medicine Patient",
      text: "Finally found a clinic that treats patients as individuals, not just cases. Dr. Lee worked with me to find the right treatment approach, and I have never felt better.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto py-12 border-t border-gray-200">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">
            Patient Success Stories
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
            What Our Patients Say
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
            Real stories from real patients about their transformative
            experiences with IE Lung.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-md hover:shadow-lg transition-all duration-500 flex flex-col hover:-translate-y-2 overflow-hidden group"
            >
              {/* Header: Stars & Quote */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4  text-secondary group-hover:text-yellow-400 group-hover:scale-110 transition-transform duration-300"
                    />
                  ))}
                </div>
                <Quote className="w-10 h-10 text-slate-100 group-hover:text-accent/20 transition-colors duration-500 rotate-12" />
              </div>

              {/* Body: Text */}
              <p className="text-slate-600 mb-8 flex-1 leading-relaxed text-lg font-medium italic relative z-10">
                "{testimonial.text}"
              </p>

              {/* Footer: Author with Visual Identity */}
              <div className="flex items-center gap-4 border-t border-slate-50 pt-6 mt-auto">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-bold text-primary leading-tight">
                    {testimonial.name}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest">
                    {testimonial.condition}
                  </span>
                </div>
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
  );
}
