"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Moon,
  Bed,
  Activity,
  HeartPulse,
  Brain,
  Wind,
  Footprints,
  SunMedium,
  CheckCircle2,
} from "lucide-react";

export default function SleepStudiesDiagnostics() {
  const decisionCards = [
    {
      symptom:
        "Loud snoring, waking up gasping for air, or a partner notices you stop breathing",
      label: "If you experience:",
      test: "Home Sleep Apnea Test (HSAT) or In-Lab Polysomnography (PSG)",
      icon: Moon,
      color: "bg-indigo-50 border-indigo-200",
      iconColor: "text-indigo-500",
    },
    {
      symptom:
        "Severe daytime sleepiness or falling asleep uncontrollably during the day",
      label: "If you experience:",
      test: "Multiple Sleep Latency Test (MSLT)",
      icon: SunMedium,
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-500",
    },
    {
      symptom: "You use a CPAP machine but are still exhausted",
      label: "If you experience:",
      test: "PAP Titration Study",
      icon: Wind,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-500",
    },
    {
      symptom:
        "You use supplemental oxygen and need to check your nighttime levels",
      label: "If you experience:",
      test: "Overnight Pulse Oximetry",
      icon: HeartPulse,
      color: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-500",
    },
  ];

  const psgAspects = [
    {
      title: "Brain Waves (EEG)",
      description: "Monitors your sleep cycles (REM and non-REM).",
      icon: Brain,
    },
    {
      title: "Oxygen Levels",
      description:
        "Checks for drops in blood oxygen caused by breathing pauses.",
      icon: HeartPulse,
    },
    {
      title: "Heart Rate & Breathing",
      description: "Identifies apneas (pauses in your breathing).",
      icon: Activity,
    },
    {
      title: "Body Movement",
      description: "Tracks restless legs or other physical disruptions.",
      icon: Footprints,
    },
  ];

  const atHomeTests = [
    {
      name: "Home Sleep Apnea Testing (HSAT)",
      description:
        "Evaluates suspected obstructive sleep apnea in selected patients. You wear a simple monitor in your own bed that records your breathing, heart rate, and oxygen levels overnight.",
    },
    {
      name: "Overnight Pulse Oximetry",
      description:
        "Measures your oxygen levels while you sleep to see if they drop. This test helps evaluate your oxygen needs, but it is not used to diagnose sleep apnea on its own.",
    },
  ];

  const inLabTests = [
    {
      name: "In-Laboratory Polysomnography (PSG)",
      description:
        "An overnight assessment in our sleep clinic. It monitors your sleep cycles, brain waves, breathing, and movements to help diagnose conditions like sleep apnea, periodic limb movement disorder, and narcolepsy.",
    },
    {
      name: "PAP Titration Study",
      description:
        'Helps find the effective positive airway pressure (CPAP or BiPAP) settings to keep your airway open while you sleep. This is often done as a "split-night" test, where the first half diagnoses sleep apnea and the second half tests CPAP settings.',
    },
    {
      name: "Multiple Sleep Latency Test (MSLT)",
      description:
        "A daytime test that measures how quickly you fall asleep in a quiet environment. It helps evaluate narcolepsy and other conditions that cause excessive daytime sleepiness.",
    },
    {
      name: "Maintenance of Wakefulness Test (MWT)",
      description:
        "Measures your ability to stay awake under standardized, quiet conditions. This is often used to assess alertness for occupational safety, such as for commercial drivers.",
    },
  ];

  const faqs = [
    {
      question: "Can you take a sleep apnea test at home?",
      answer:
        "Yes. For many patients, a Home Sleep Apnea Test (HSAT) is the first step. You wear a small, specialized monitor overnight in your own bed that tracks your breathing, heart rate, and oxygen levels.",
    },
    {
      question: "What are the signs you need a sleep study?",
      answer:
        "Common signs that indicate you may need a sleep study include loud and chronic snoring, waking up choking or gasping, severe daytime sleepiness, morning headaches, and difficulty concentrating.",
    },
    {
      question: "Does insurance cover sleep clinic costs?",
      answer:
        "Most major health insurance plans and Medicare cover both home sleep apnea tests and in-lab polysomnography when your doctor determines they are medically necessary. Our clinic team will help verify your specific sleep study coverage prior to testing.",
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
            <span className="text-accent">Sleep Studies & Diagnostics</span>
          </div>

          <div className="max-w-3xl">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Our Services
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Sleep Studies & Diagnostics
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
              Comprehensive testing to evaluate your sleep health.
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
            Sleep studies monitor your body while you rest to help identify the
            cause of snoring, chronic fatigue, or daytime sleepiness. Serving
            the Inland Empire, Redlands, and surrounding communities, our
            board-certified sleep team offers both in-lab and at-home testing. We
            work closely with primary care providers and hospitals in Riverside
            County, CA, and San Bernardino County to help find the cause of your
            symptoms and guide your treatment.{" "}
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

      {/* Which Sleep Test Do I Need? */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Diagnostic Guide
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Which Sleep Test Do I Need?
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

      {/* What is a Sleep Study? */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-6">
            What is a Sleep Study (Polysomnography)?
          </h2>
          <p className="text-primary/70 leading-relaxed mb-8">
            A sleep study, clinically known as Polysomnography (PSG), is a
            non-invasive test used to diagnose sleep disorders. Whether conducted
            in a sleep clinic or via a home sleep test, it monitors your body
            functions as you rest. A complete sleep study evaluates:
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {psgAspects.map((aspect, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                  <aspect.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-primary mb-2 text-base">
                  {aspect.title}
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  {aspect.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Test Menu */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* At-Home Sleep Testing */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-[#3D4749] text-white p-6">
                <div className="flex items-center gap-3 mb-1">
                  <Bed className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold">At-Home Sleep Testing</h3>
                </div>
                <p className="text-white/60 text-sm">
                  Convenient, reliable testing in your own bed
                </p>
              </div>
              <div className="p-6 space-y-5">
                {atHomeTests.map((test, i) => (
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

            {/* In-Lab Sleep Studies & Advanced Diagnostics */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-accent text-white p-6">
                <div className="flex items-center gap-3 mb-1">
                  <Moon className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold">
                    In-Lab Sleep Studies & Advanced Diagnostics
                  </h3>
                </div>
                <p className="text-white/80 text-sm">
                  Comprehensive overnight evaluation in our specialized sleep
                  clinic
                </p>
              </div>
              <div className="p-6 space-y-5">
                {inLabTests.map((test, i) => (
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
            Ready to Get a Better Night&apos;s Sleep?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Our board-certified sleep medicine specialists are here to diagnose
            and treat your sleep disturbances. Schedule your consultation today.
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
              Dr. Roger Seheult, MD | Board-Certified in Sleep Medicine &
              Pulmonology
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

