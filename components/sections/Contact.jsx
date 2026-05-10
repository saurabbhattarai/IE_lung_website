"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Download,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { submitContactForm } from "../../lib/actions/contact.action";

const initialState = {
  success: false,
  message: "",
};

export default function Contact() {
  // useActionState handles the form state and pending status
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  );

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
          {/* Contact Info Sidebar */}
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
                lines: [" contact@ielung.com"],
                sub: "Patient & Provider inquiries",
                href: "mailto: contact@ielung.com",
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
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-200 relative overflow-hidden">
              {state.success ? (
                <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-[#3D4749] mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 text-lg">{state.message}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-8 text-accent font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-[#3D4749] mb-2">
                      Send us a Message
                    </h3>
                    <p className="text-slate-400">
                      Please fill out the form below.
                    </p>
                  </div>

                  <form
                    action={formAction}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-accent/20 transition-all ${
                          state.errors?.name
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="John Doe"
                      />
                      {state.errors?.name && (
                        <p className="text-red-500 text-xs ml-1">
                          {state.errors.name[0]}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-accent/20 transition-all ${
                          state.errors?.email
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="john@example.com"
                      />
                      {state.errors?.email && (
                        <p className="text-red-500 text-xs ml-1">
                          {state.errors.email[0]}
                        </p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Message
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-accent/20 transition-all resize-none ${
                          state.errors?.message
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="How can we help you today?"
                      />
                      {state.errors?.message && (
                        <p className="text-red-500 text-xs ml-1">
                          {state.errors.message[0]}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 pt-4">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full md:w-auto bg-[#3D4749] hover:bg-accent text-white sm:px-10 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isPending ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                        {isPending ? "SENDING..." : "SEND MESSAGE"}
                      </button>

                      {state.message && !state.success && (
                        <p className="text-red-500 text-sm mt-4 text-center">
                          {state.message}
                        </p>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Provider Referral Box */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 bg-gradient-to-r from-primary to-[#2D3537] rounded-[2rem] text-white relative">
              <div className="relative z-10 mb-6 md:mb-0">
                <h4 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <Download className="text-accent" /> Provider Referrals
                </h4>
                <p className="text-primary-foreground/70 text-sm">
                  Download our secure referral form for your patients.
                </p>
              </div>
              <a
                href="/referral-form.pdf"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <Download size={18} /> DOWNLOAD PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
