"use client";

import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Moon,
  Activity,
} from "lucide-react";

export default function IELungOpensNov2() {
  const doctors = [
    {
      name: "Dr. Paresh C. Giri, MD",
      specialty: "Pulmonary & Critical Care",
    },
    {
      name: "Dr. Roger Seheult, MD",
      specialty: "Sleep Medicine, Pulmonary & Critical Care",
    },
    {
      name: "Dr. Luke Buxton, DO",
      specialty: "Sleep Medicine, Pulmonary & Critical Care",
    },
    {
      name: "Dr. Tarik Ngab, MD",
      specialty: "Interventional Pulmonology & Critical Care",
    },
    {
      name: "Dr. Sahib Grewal, MD",
      specialty: "Interventional Pulmonology & Critical Care",
    },
    {
      name: "Dr. Enrique G. Gil, MD",
      specialty: "Sleep Medicine, Pulmonary",
    },
    {
      name: "Dr. Aalok Shah, MD",
      specialty: "Pulmonary & Critical Care",
    },
  ];

  const faqs = [
    {
      question: "Where is IE Lung located?",
      answer:
        "IE Lung is located at 245 Terracina Boulevard, Suite 108, Redlands, CA 92373.",
    },
    {
      question: "When does IE Lung open?",
      answer: "We open on November 2, 2026.",
    },
    {
      question: "What conditions do you treat?",
      answer:
        "We treat asthma, COPD, pulmonary hypertension, interstitial lung disease, obstructive sleep apnea, insomnia, and narcolepsy.",
    },
    {
      question: "Are you accepting new patients?",
      answer:
        "Yes. We are accepting new patients starting November 2, 2026.",
    },
    {
      question: "Which insurance plans do you accept?",
      answer:
        "Please call 909 938 1152 to verify your coverage before your visit.",
    },
    {
      question: "Do you offer sleep studies?",
      answer: "Yes. We offer in-lab and at-home sleep studies.",
    },
    {
      question: "How do I book an appointment?",
      answer: "Book online or call 909 938 1152.",
    },
  ];

  return (
    <main className="bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#3D4749] via-[#2D3537] to-[#1D2527] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-20 md:py-24 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/blog"
              className="hover:text-accent transition-colors"
            >
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">IE Lung Opens Nov 2</span>
          </div>

          <div className="flex items-center gap-4 text-white/50 text-sm mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              October 28, 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              5 min read
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-3xl">
            IE Lung Opens November 2 — Pulmonary & Sleep Care in Redlands, CA
          </h1>

          <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
            Seven board-certified specialists. One clinic. Comprehensive care
            for asthma, COPD, sleep apnea, and more.
          </p>
        </div>
      </section>

      {/* Blog Image */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
          <Image
            src="/logo.png"
            alt="Inland Empire Lung & Sleep Institute Logo"
            width={300}
            height={180}
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <div className="prose-section mb-12">
            <p className="text-lg text-primary/70 leading-relaxed mb-6">
              Breathing and sleep are two of the most basic foundations of
              health, and they should come easily. If you live in the Inland
              Empire and deal with a chronic cough, shortness of breath, loud
              snoring, or nights of poor sleep, you know how much these problems
              can affect work, family, and everyday energy.
            </p>
            <p className="text-lg text-primary/70 leading-relaxed mb-6">
              Getting answers often means seeing several providers in different
              places. We built the Inland Empire Lung & Sleep Institute (IE
              Lung) to bring pulmonary and sleep care together in one clinic.
            </p>
            <div className="bg-accent/5 border-2 border-accent/20 rounded-2xl p-6 my-8">
              <p className="text-primary font-bold text-lg mb-2">
                📍 Opening November 2, 2026
              </p>
              <p className="text-primary/70">
                245 Terracina Boulevard, Suite 108, Redlands, CA 92373.
              </p>
              <p className="text-accent font-semibold mt-2">
                We are accepting new patients now.
              </p>
            </div>
          </div>

          {/* Our Approach */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              Our Approach: Science-Led, Patient-Centered
            </h2>
            <p className="text-primary/70 leading-relaxed mb-4">
              We believe every visit brings together two experts. Our physicians
              bring specialized training in pulmonary, critical care, and sleep
              medicine. You bring the most important information: how your
              symptoms feel, when they happen, and what matters most to you in
              your care.
            </p>
            <p className="text-primary/70 leading-relaxed">
              Our care team includes seven board-certified physicians across
              pulmonary medicine, critical care, sleep medicine, and
              interventional pulmonology. Together, we are committed to
              improving respiratory and sleep health for families across
              Redlands and the surrounding communities.
            </p>
          </div>

          {/* What We Treat */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
              What We Treat at Our Redlands Clinic
            </h2>

            <div className="grid gap-6">
              {/* Pulmonary */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-primary">
                    Pulmonary Lung Care
                  </h3>
                </div>
                <p className="text-primary/60 text-sm mb-4">
                  We evaluate and treat conditions that affect how you breathe,
                  including:
                </p>
                <ul className="space-y-2">
                  {[
                    "Asthma",
                    "Chronic obstructive pulmonary disease (COPD)",
                    "Pulmonary hypertension",
                    "Interstitial lung disease (ILD)",
                    "Chronic cough and unexplained shortness of breath",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-primary/70 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sleep Medicine */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Moon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-primary">
                    Sleep Medicine
                  </h3>
                </div>
                <p className="text-primary/60 text-sm mb-4">
                  We diagnose and manage sleep disorders, including:
                </p>
                <ul className="space-y-2">
                  {[
                    "Obstructive sleep apnea (OSA)",
                    "Insomnia",
                    "Narcolepsy",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-primary/70 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Advanced Diagnostics */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-primary">
                    Advanced Diagnostics
                  </h3>
                </div>
                <p className="text-primary/60 text-sm mb-4">
                  Testing on site helps us reach a diagnosis sooner. Our
                  services include:
                </p>
                <ul className="space-y-2">
                  {[
                    "Complete pulmonary function testing (PFTs)",
                    "In-lab and at-home sleep studies",
                    "Minimally invasive robotic bronchoscopy",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-primary/70 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* When Should You See a Specialist */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              When Should You See a Lung or Sleep Specialist?
            </h2>
            <p className="text-primary/70 leading-relaxed mb-6">
              Consider booking a visit if you have:
            </p>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6">
              <ul className="space-y-3">
                {[
                  "A cough that lasts more than eight weeks",
                  "Shortness of breath during everyday activity",
                  "Wheezing or chest tightness that keeps coming back",
                  "Loud snoring, gasping, or pauses in breathing during sleep",
                  "Daytime exhaustion even after a full night in bed",
                  "Trouble falling or staying asleep for weeks at a time",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-primary/70"
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-primary/70 leading-relaxed mb-4">
              These symptoms have many possible causes, and a specialist can
              help find the right one.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">
                <strong>
                  If you have severe trouble breathing, chest pain, or any
                  emergency, call 911.
                </strong>
              </p>
            </div>
          </div>

          {/* First Visit */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              What to Expect at Your First Visit
            </h2>
            <p className="text-primary/70 leading-relaxed">
              Your first appointment starts with a conversation. Your physician
              will review your symptoms, medical history, and medications, then
              discuss which tests, if any, make sense. When testing is needed,
              such as lung function testing or a sleep study, we aim to explain
              each step so you know what to expect.
            </p>
          </div>

          {/* Meet the Physicians */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
              Meet the IE Lung Physicians
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {doctors.map((doc, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-xl p-5 border border-slate-200"
                >
                  <p className="font-bold text-primary">{doc.name}</p>
                  <p className="text-primary/50 text-sm mt-1">
                    {doc.specialty}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
                >
                  <h3 className="font-bold text-primary mb-2">{faq.question}</h3>
                  <p className="text-primary/60 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#3D4749] to-[#2D3537]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Book Your Appointment in Redlands
          </h2>
          <p className="text-white/70 mb-4 max-w-2xl mx-auto">
            You shouldn&apos;t have to live with poor breathing or poor sleep.
            Book a pulmonary or sleep consultation in Redlands. We look forward
            to welcoming you.
          </p>
          <div className="text-white/50 text-sm space-y-1 mb-8">
            <p className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              245 Terracina Boulevard, Suite 108, Redlands, CA 92373
            </p>
            <p className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              909 938 1152 · Mon-Fri: 8AM - 5PM
            </p>
          </div>
          <Link
            href="/#schedule"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 group"
          >
            Book Online
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Back to Blog */}
      <section className="py-8 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary/60 hover:text-accent transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

