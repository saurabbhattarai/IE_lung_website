'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Download, Send } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <section id="contact" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
            Contact Us
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
            Have questions? Ready to schedule your appointment? We{'{'}re{"}"} here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-background rounded-lg p-8 border border-secondary">
            <h3 className="text-2xl font-bold text-primary mb-8">Send us a Message</h3>

            {submitted ? (
              <div className="bg-accent/10 border border-accent rounded-lg p-6 text-center">
                <p className="text-accent font-semibold mb-2">Thank you!</p>
                <p className="text-foreground/70">We{'{'}ve{"}"} received your message and will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-secondary bg-white text-primary placeholder-foreground/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-secondary bg-white text-primary placeholder-foreground/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-secondary bg-white text-primary placeholder-foreground/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  SEND MESSAGE
                </button>
              </form>
            )}

            {/* Referral Form Download */}
            <div className="mt-8 border-t border-secondary pt-8">
              <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-accent" />
                Provider Referral Form
              </h4>
              <p className="text-foreground/70 text-sm mb-4">
                Download our referral form for healthcare providers
              </p>
              <button className="w-full border-2 border-accent text-accent hover:bg-accent/5 px-6 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                DOWNLOAD REFERRAL FORM
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Address */}
            <div className="bg-background rounded-lg p-8 border border-secondary">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-2">Our Location</h4>
                  <p className="text-foreground/70">12047 4th Street</p>
                  <p className="text-foreground/70">Yucaipa, CA 92399</p>
                  <p className="text-foreground/70">United States</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=12047+4th+Street+Yucaipa+CA+92399"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 text-sm font-semibold transition mt-4 inline-block"
              >
                View on Map →
              </a>
            </div>

            {/* Phone */}
            <div className="bg-background rounded-lg p-8 border border-secondary">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-2">Phone Number</h4>
                  <a href="tel:+18402580972" className="text-lg font-semibold text-accent hover:text-accent/80 transition">
                    +1 (840) 258-0972
                  </a>
                  <p className="text-foreground/60 text-sm mt-2">Mon-Fri: 8AM-5PM</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-background rounded-lg p-8 border border-secondary">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-2">Email</h4>
                  <a href="mailto:info@ielung.com" className="text-accent hover:text-accent/80 transition font-semibold">
                    info@ielung.com
                  </a>
                  <p className="text-foreground/60 text-sm mt-2">Response within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Embed */}
        <div className="rounded-lg overflow-hidden border border-secondary h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.1234567890!2d-116.75!3d34.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80db3d3d3d3d3d3d%3A0x0!2s12047%204th%20Street%2C%20Yucaipa%2C%20CA%2092399!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}
