"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Activity,
  Plane,
  HeartPulse,
  Footprints,
  Wind,
  Mountain,
  Flame,
  CheckCircle2,
  Gauge,
} from "lucide-react";

export default function ExerciseOxygenHighAltitudeTesting() {
  const decisionCards = [
    {
      symptom:
        "Shortness of breath when you work out or push yourself physically",
      label: "If you experience:",
      test: "Cardiopulmonary Exercise Testing (CPET)",
      icon: Activity,
      color: "bg-rose-50 border-rose-200",
      iconColor: "text-rose-500",
    },
    {
      symptom:
        "You are planning to fly on a plane or visit the mountains, but you have COPD",
      label: "If you experience:",
      test: "High-Altitude Simulation Testing (HAST)",
      icon: Plane,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-500",
    },
    {
      symptom:
        "Your doctor needs to check if you qualify for a home oxygen prescription",
      label: "If you experience:",
      test: "A 6-Minute Walk Test or Ambulatory Oxygen Titration",
      icon: Footprints,
      color: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-500",
    },
    {
      symptom:
        "Your doctor needs to check the oxygen and carbon dioxide levels in your blood",
      label: "If you experience:",
      test: "A Blood Gas Analysis",
      icon: Gauge,
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-500",
    },
  ];

  const exerciseTests = [
    {
      name: "Cardiopulmonary Exercise Testing (CPET)",
      description:
        "Evaluates exercise limitation, unexplained breathlessness, and overall cardiopulmonary fitness while exercising on a bike or treadmill.",
    },
    {
      name: "Six-Minute Walk Test",
      description:
        "Measures your walking capacity, fatigue symptoms, and oxygen saturation during light exertion in a controlled clinical environment.",
    },
  ];

  const altitudeOxygenTests = [
    {
      name: "High-Altitude Simulation Testing (HAST)",
      description:
        "Assesses potential oxygen needs during air travel or altitude exposure by breathing a specialized air mixture mimicking commercial airplane cabins.",
    },
    {
      name: "Ambulatory Oximetry & Oxygen Titration",
      description:
        "Evaluates oxygen desaturation with daily activity to determine your exact supplemental oxygen needs and qualify for home oxygen.",
    },
    {
      name: "Blood Gas Analysis Interpretation",
      description:
        "Measures oxygen, carbon dioxide, and acid-base status (usually via arterial sampling) to help evaluate severe respiratory conditions.",
    },
    {
      name: "Resting Pulse Oximetry",
      description:
        "A simple, non-invasive measurement of your resting blood oxygen saturation.",
    },
  ];

  const faqs = [
    {
      question: "What happens during a 6-minute walk test?",
      answer:
        "The 6-minute walk test is a simple functional test. You will be asked to walk at your normal pace up and down a hallway for six minutes. During the test, our team monitors your heart rate and oxygen levels to see how your lungs handle light physical activity.",
    },
    {
      question: "Where can I get CPET testing near me?",
      answer:
        "The Inland Empire Lung & Sleep Institute offers complete Cardiopulmonary Exercise Testing (CPET) at our clinic in Redlands, CA. This test requires specialized equipment to monitor your gas exchange and cardiac rhythm simultaneously during exercise.",
    },
    {
      question: "Why would I need an arterial blood gas test?",
      answer:
        "An arterial blood gas (ABG) analysis is used to precisely measure the balance of oxygen and carbon dioxide in your blood, as well as your blood's acid-base (pH) level. Pulmonologists use this interpretation to manage chronic lung diseases or evaluate respiratory failure.",
    },
  ];

  return (
    <main className="bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3D4749] via-[#2D3537] to-[#1D2527] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/#services" className="hover:text-accent transition-colors">
              Services
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">Exercise & High-Altitude Testing</span>
          </div>

          <div className="max-w-3xl">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Our Services
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Exercise, Oxygen & High-Altitude Testing
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
              Specialized testing for breathlessness, exertion, and travel clearance in Redlands, CA.
            </p>
            <Link
              href="/#schedule"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 group"
            >
              Request an Appointment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-primary/70 leading-relaxed">
            If your breathing is fine at rest but you struggle during physical
            activity or travel, standard lung tests may not show the full
            picture. At the Inland Empire Lung & Sleep Institute in Redlands, CA,
            our pulmonary team provides specialized functional testing. From
            Cardiopulmonary Exercise Testing (CPET) to High-Altitude Simulation
            Testing (HAST), these tests help your doctor see how your heart,
            lungs, and muscles use oxygen under stress.{" "}
            <Link
              href="/#schedule"
              className="text-accent font-semibold hover:underline"
            >
              Request an appointment
            </Link>{" "}
            to get started.
          </p>
        </div>
      </section>

      {/* SECTION 1: THE SYMPTOM MATCHER */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Diagnostic Guide
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Which Functional Breathing Test Do I Need?
            </h2>
            <p className="text-primary/60 max-w-2xl mx-auto">
              Your doctor decides which test is right for you. These examples
              show what each test helps evaluate.
            </p>
          </div>

          {/* Emergency Warning */}
          <div className="max-w-3xl mx-auto mb-12 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm leading-relaxed">
              <strong>
                If you have a medical emergency or severe trouble breathing,
                call 911 or go to the nearest emergency room.
              </strong>
            </p>
          </div>

          {/* Decision Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {decisionCards.map((card, i) => (
              <div
                key={i}
                className={`rounded-2xl border-2 p-6 ${card.color} transition-all hover:shadow-lg`}
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-5 shadow-sm">
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <p className="text-sm text-primary/60 font-medium mb-2 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-primary font-medium mb-6 text-[15px] leading-relaxed">
                  {card.symptom}
                </p>
                <div className="border-t border-current/10 pt-4">
                  <p className="text-xs text-primary/50 font-semibold uppercase tracking-wider mb-1">
                    Your doctor may recommend:
                  </p>
                  <p className="text-primary font-bold text-lg">{card.test}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep-Dive: CPET & HAST */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* CPET */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              What is Cardiopulmonary Exercise Testing (CPET)?
            </h2>
            <p className="text-primary/70 leading-relaxed mb-6">
              Cardiopulmonary Exercise Testing (CPET) is a specialized lung
              exercise test that measures your heart, lungs, and muscle function
              at the same time while you exercise (usually on a stationary bike
              or treadmill).
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-accent" />
                  </div>
                  How it works
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  You breathe into a specialized mask that measures your oxygen
                  intake and carbon dioxide output, while ECG wires monitor your
                  heart rate and cardiac rhythm in real time.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  What it evaluates
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  It helps your doctor identify the true underlying cause of
                  unexplained breathlessness and precisely measures your
                  physical exercise limitations.
                </p>
              </div>
            </div>
          </div>

          {/* HAST */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              What is High-Altitude Simulation Testing (HAST)?
            </h2>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-2">
                    Fit-to-Fly & High Altitude Clearance
                  </h3>
                  <p className="text-primary/70 leading-relaxed">
                    A High-Altitude Simulation Test (HAST), sometimes called a
                    &ldquo;fit-to-fly&rdquo; test, helps check your potential need for
                    supplemental oxygen during air travel or exposure to high mountain
                    altitudes. Patients breathe a specialized air mixture that mimics
                    the lower oxygen levels found in commercial airplane cabins to
                    ensure they can travel safely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Test Menu */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Exercise & Exertion Diagnostics */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-[#3D4749] text-white p-6">
                <div className="flex items-center gap-3 mb-1">
                  <Flame className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold">
                    Exercise & Exertion Diagnostics
                  </h3>
                </div>
                <p className="text-white/60 text-sm">
                  Functional evaluation under physical stress
                </p>
              </div>
              <div className="p-6 space-y-5">
                {exerciseTests.map((test, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                      {test.name}
                    </h4>
                    <p className="text-primary/60 text-sm leading-relaxed pl-4">
                      {test.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Oxygen & Altitude Testing */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-accent text-white p-6">
                <div className="flex items-center gap-3 mb-1">
                  <Mountain className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold">
                    Oxygen & Altitude Testing
                  </h3>
                </div>
                <p className="text-white/80 text-sm">
                  Travel clearance & home oxygen evaluations
                </p>
              </div>
              <div className="p-6 space-y-5">
                {altitudeOxygenTests.map((test, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                      {test.name}
                    </h4>
                    <p className="text-primary/60 text-sm leading-relaxed pl-4">
                      {test.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
              >
                <h3 className="font-bold text-primary mb-3 text-lg">
                  {faq.question}
                </h3>
                <p className="text-primary/60 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#3D4749] to-[#2D3537]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Evaluate Your Breathing Capacity?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Our pulmonary specialists provide expert functional and exertion
            testing to keep you active and traveling safely.
          </p>
          <Link
            href="/#schedule"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 group"
          >
            Request an Appointment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Medical Review */}
      <section className="py-8 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-primary/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0" />
            <span>
              <strong className="text-primary/70">
                Medically Reviewed by:
              </strong>{" "}
              Dr. Aalok Shah, MD | Board-Certified Pulmonologist & Critical Care
              Physician
            </span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-2">
          <p className="text-xs text-primary/40">
            Last Updated: October 2026. This content is for informational
            purposes only and should not replace professional medical
            consultation.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

