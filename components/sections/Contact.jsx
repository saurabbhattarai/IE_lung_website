"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Download,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 bg-slate-50/50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-accent font-semibold uppercase tracking-widest mb-4">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
            Contact Us
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Our specialized team is ready to assist you. Whether you are a
            patient or a provider, we are here to ensure a seamless experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start mb-20">
          {/* Contact Info Sidebar (Left) */}
          <div className="lg:col-span-4 space-y-6">
            {[
              {
                icon: MapPin,
                title: "Our Location",
                lines: ["12047 4th Street", "Yucaipa, CA 92399"],
                linkText: "Get Directions",
                href: "https://maps.google.com",
              },
              {
                icon: Phone,
                title: "Phone Number",
                lines: ["+1 (840) 258-0972"],
                sub: "Mon-Fri: 8AM - 5PM",
                href: "tel:+18402580972",
              },
              {
                icon: Mail,
                title: "Email Address",
                lines: ["info@ielung.com"],
                sub: "Patient & Provider inquiries",
                href: "mailto:info@ielung.com",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                    <item.icon
                      size={22}
                      className="text-accent group-hover:text-white"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3D4749] text-lg mb-1">
                      {item.title}
                    </h4>
                    {item.lines.map((line, idx) => (
                      <p key={idx} className="text-slate-500 leading-relaxed">
                        {line}
                      </p>
                    ))}
                    {item.sub && (
                      <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                        {item.sub}
                      </p>
                    )}
                    {item.href && (
                      <a
                        href={item.href}
                        className="text-accent text-sm font-bold mt-3 inline-block hover:translate-x-1 transition-transform"
                      >
                        {item.linkText || "Connect Now"} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form (Right) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-200 relative overflow-hidden">
              {submitted ? (
                <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-[#3D4749] mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 text-lg">
                    Thank you for reaching out. A team member will contact you
                    shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-[#3D4749] mb-2">
                      Send us a Message
                    </h3>
                    <p className="text-slate-400">
                      Please fill out the form below and we will respond within
                      24 hours.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-slate-300"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-slate-300"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-slate-300 resize-none"
                        placeholder="How can we help you today?"
                      />
                    </div>
                    <div className="md:col-span-2 pt-4">
                      <button
                        type="submit"
                        className="w-full md:w-auto bg-[#3D4749] hover:bg-accent text-white sm:px-10 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                      >
                        <Send size={18} />
                        SEND MESSAGE
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Provider Referral Box - Nested nicely below form */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between p-8 bg-gradient-to-r from-primary to-[#2D3537] rounded-[2rem] text-white overflow-hidden relative">
              <div className="relative z-10 mb-6 md:mb-0">
                <h4 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <Download className="text-accent" /> Provider Referrals
                </h4>
                <p className="text-primary-foreground/70 text-sm">
                  Download our secure referral form for your patients.
                </p>
              </div>
              <button className="relative z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
                <Download size={18} />
                DOWNLOAD PDF
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* Map Section */}
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
  );
}
