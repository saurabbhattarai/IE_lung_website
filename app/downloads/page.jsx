"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Download,
  FileText,
  Calendar,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
} from "lucide-react";
import { newsletters, clinicalForms } from "@/lib/constants/downloadsData";

export default function DownloadsPage() {
  return (
    <main className="bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#3D4749] via-[#2D3537] to-[#1D2527] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-24 relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">Downloads</span>
          </div>
          <div className="max-w-3xl">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Resources & Publications
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Downloads & Newsletters
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              Explore and download our official community newsletters, clinical referral forms, and respiratory health guides from the Inland Empire Lung & Sleep Institute.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 px-4 bg-slate-50/60">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Featured Newsletter */}
          {newsletters
            .filter((n) => n.featured)
            .map((nl) => (
              <div
                key={nl.id}
                className="bg-white rounded-3xl border-2 border-accent/20 p-8 md:p-12 shadow-xl shadow-slate-200/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-accent/15 text-accent">
                    <Sparkles size={14} /> Latest Newsletter • Issue {nl.issueNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Calendar size={14} /> {nl.edition}
                  </span>
                  {nl.fileSize && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                      PDF • {nl.fileSize}
                    </span>
                  )}
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 space-y-4">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                      {nl.title}
                    </h2>
                    <p className="text-lg font-medium text-accent">
                      {nl.subtitle}
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {nl.description}
                    </p>

                    <div className="pt-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">
                        Key Topics in this Issue:
                      </h4>
                      <ul className="grid sm:grid-cols-2 gap-2.5">
                        {nl.topics.map((topic, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-sm text-slate-700"
                          >
                            <CheckCircle2
                              size={18}
                              className="text-accent shrink-0 mt-0.5"
                            />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Download Action Card */}
                  <div className="lg:col-span-4 bg-gradient-to-br from-[#3D4749] to-[#252C2D] text-white p-6 md:p-8 rounded-2xl flex flex-col justify-between h-full shadow-lg">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-accent">
                        <BookOpen size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        Read Issue #{nl.issueNumber}
                      </h3>
                      <p className="text-sm text-white/70 mb-6">
                        Published on {nl.date}. Free download for patients, families, and community members.
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <a
                        href={nl.fileUrl}
                        download
                        className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-3.5 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Download size={18} /> Download PDF
                      </a>
                      <a
                        href={nl.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                      >
                        <ExternalLink size={16} /> Open in Browser
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* All Newsletters Grid */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-2">
                  Archive
                </p>
                <h2 className="text-3xl font-bold text-primary">
                  All Newsletter Editions
                </h2>
              </div>
              <p className="text-slate-500 text-sm max-w-md">
                We regularly publish educational newsletters covering sleep hygiene, lung health, and diagnostic testing. Check back for upcoming releases.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsletters.map((nl) => (
                <div
                  key={nl.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-accent/40 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                      <span className="font-semibold text-accent uppercase tracking-wider">
                        Issue #{nl.issueNumber}
                      </span>
                      <span>{nl.edition}</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {nl.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mb-3">
                      {nl.subtitle}
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-6">
                      {nl.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-400 font-medium">
                      PDF ({nl.fileSize})
                    </span>
                    <a
                      href={nl.fileUrl}
                      download
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:text-accent/80 transition-colors"
                    >
                      <Download size={16} /> Download
                    </a>
                  </div>
                </div>
              ))}

              {/* Upcoming Issue Placeholder Card */}
              <div className="bg-slate-100/70 border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 mb-4">
                  <Clock size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">
                  Issue #2 Coming Soon
                </h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-4">
                  Our clinicians are preparing our next community edition with tips on winter respiratory protection, asthma triggers, and CPAP compliance.
                </p>
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-600">
                  Stay Tuned
                </span>
              </div>
            </div>
          </div>

          {/* Clinical & Provider Forms */}
          <div className="pt-8">
            <div className="mb-8">
              <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-2">
                Clinical Documents
              </p>
              <h2 className="text-3xl font-bold text-primary">
                Provider & Patient Forms
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {clinicalForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {form.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {form.fileSize}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-primary">
                        {form.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2">
                        {form.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <a
                      href={form.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <ExternalLink size={14} /> View
                    </a>
                    <a
                      href={form.fileUrl}
                      download
                      className="bg-primary hover:bg-[#252C2D] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download size={14} /> Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-[#2D3537] to-primary py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Looking for Pulmonary or Sleep Evaluation?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Our team of seven board-certified specialists in Redlands, CA provides comprehensive diagnostic testing and personalized care.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/#schedule"
              className="bg-accent hover:bg-accent/90 text-primary font-bold px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              Request an Appointment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#contact"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300"
            >
              Contact Clinic
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

