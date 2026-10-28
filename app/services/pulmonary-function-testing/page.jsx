"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Wind,
  Activity,
  Gauge,
  HeartPulse,
} from "lucide-react";

export default function PulmonaryFunctionTesting() {
  const decisionCards = [
    {
      symptom:
        "Shortness of breath, a chronic cough, or a doctor's concern about COPD",
      label: "If you experience:",
      test: "Spirometry or Lung Volume Testing",
      icon: Wind,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-500",
    },
    {
      symptom:
        "Wheezing, coughing, or breathlessness only during exercise",
      label: "If you experience:",
      test: "Exercise Bronchoprovocation",
      icon: HeartPulse,
      color: "bg-rose-50 border-rose-200",
      iconColor: "text-rose-500",
    },
    {
      symptom:
        "You use an inhaler but aren't sure it is opening your airways",
      label: "If you experience:",
      test: "Bronchodilator Response Testing",
      icon: Gauge,
      color: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-500",
    },
    {
      symptom:
        "You have asthma and want to track your breathing at home",
      label: "If you experience:",
      test: "Peak Expiratory Flow Measurement",
      icon: Activity,
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-500",
    },
  ];

  const basicTests = [
    {
      name: "Spirometry",
      description:
        "The most common breathing test. It measures how much air you can blow out, and how fast, to help identify obstructive lung diseases such as asthma and COPD.",
    },
    {
      name: "Lung Volume Testing (Body Plethysmography)",
      description:
        "Measures the total amount of air your lungs can hold. It shows whether air is trapped in your lungs or whether a restrictive condition keeps them from fully expanding.",
    },
    {
      name: "Diffusing Capacity (DLCO)",
      description:
        "Measures how well oxygen passes from the air sacs in your lungs into your blood.",
    },
    {
      name: "Upright and Supine Vital Capacity",
      description:
        "Compares your breathing while sitting and lying down. It helps evaluate suspected weakness of the diaphragm.",
    },
  ];

  const asthmaTests = [
    {
      name: "Bronchodilator Response Testing",
      description:
        "Compares your breathing before and after an inhaled bronchodilator medication. It shows how well your airways respond to this type of inhaler.",
    },
    {
      name: "Exercise Bronchoprovocation",
      description:
        "Checks whether your airways tighten during physical exertion. It helps diagnose exercise-induced asthma (exercise-induced bronchoconstriction).",
    },
    {
      name: "Peak Expiratory Flow Measurement",
      description:
        "A quick test that tracks changes in how forcefully you can breathe out. It is often used to monitor asthma, including at home.",
    },
  ];

  const muscleTests = [
    {
      name: "Respiratory Muscle Strength (MIP/MEP)",
      description:
        "Measures the strength of the muscles that help you breathe in and out.",
    },
  ];

  const faqs = [
    {
      question: "How long does a PFT take?",
      answer:
        "A basic spirometry test takes about 10 to 15 minutes. However, a complete pulmonary function test (which includes lung volumes and gas exchange) typically takes between 45 to 60 minutes.",
    },
    {
      question: "What happens during a lung function test?",
      answer:
        "You breathe into a mouthpiece while wearing a nose clip and follow coaching from our team: normal breaths, deep breaths, and fast, forceful exhales. Our staff guides you through each step.",
    },
    {
      question: "Can spirometry detect asthma?",
      answer:
        "Spirometry is a key test for asthma. It can show narrowed airways and how severe they are, and whether they open up after a bronchodilator. Your doctor also considers your symptoms, medical history, and sometimes other tests, because spirometry can be normal between asthma flare-ups.",
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
            <span className="text-accent">Pulmonary Function Testing</span>
          </div>

          <div className="max-w-3xl">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Our Services
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Pulmonary Function Testing
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
              Accurate lung testing to guide your care.
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
            Pulmonary function tests measure how well your lungs work. If you
            have shortness of breath, a chronic cough, or symptoms of asthma,
            these tests help your doctor find the cause and plan your treatment.
            At Inland Empire Lung & Sleep Institute in Redlands, CA, our
            pulmonary team performs the tests below.{" "}
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

      {/* Which Breathing Test Do I Need? */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Diagnostic Guide
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Which Breathing Test Do I Need?
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
                If you have severe trouble breathing, call 911 or go to the
                nearest emergency room.
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

      {/* What is a PFT? */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              What is a Pulmonary Function Test (PFT)?
            </h2>
            <p className="text-primary/70 leading-relaxed mb-8">
              A Pulmonary Function Test (PFT) is a group of non-invasive
              breathing tests that measure how well your lungs are working.
              Complete pulmonary function tests evaluate three main areas:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wind className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-primary mb-2">Airflow</h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  How much air you can inhale and exhale.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gauge className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-primary mb-2">Lung Capacity</h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  How much total air your lungs can hold.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-primary mb-2">Gas Exchange</h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  How well oxygen passes into your bloodstream.
                </p>
              </div>
            </div>
          </div>

          {/* How is a PFT done? */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              How is a pulmonary function test done?
            </h2>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <p className="text-primary/70 leading-relaxed">
                During a standard PFT, you sit in a chair and breathe into a
                mouthpiece connected to a machine called a spirometer. A soft
                nose clip makes sure all air goes through your mouth. A
                respiratory therapist coaches you to take deep breaths and blow
                out as hard and fast as you can. For some tests, such as body
                plethysmography, you may sit in a clear booth, similar to a
                phone booth, so the team can measure pressure in your lungs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Test Menu */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Breathing & Lung Capacity */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-[#3D4749] text-white p-6">
                <h3 className="text-xl font-bold mb-1">
                  Basic Breathing & Lung Capacity
                </h3>
                <p className="text-white/60 text-sm">
                  Core tests for airflow and lung volume
                </p>
              </div>
              <div className="p-6 space-y-5">
                {basicTests.map((test, i) => (
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

            {/* Asthma Diagnostics + Respiratory Muscle */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-accent text-white p-6">
                  <h3 className="text-xl font-bold mb-1">
                    Asthma Diagnostics & Airway Evaluation
                  </h3>
                  <p className="text-white/80 text-sm">
                    Specialized testing for asthma and airway reactivity
                  </p>
                </div>
                <div className="p-6 space-y-5">
                  {asthmaTests.map((test, i) => (
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

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-[#2D3537] text-white p-6">
                  <h3 className="text-xl font-bold mb-1">
                    Respiratory Muscle Testing
                  </h3>
                  <p className="text-white/60 text-sm">
                    Evaluating breathing muscle strength
                  </p>
                </div>
                <div className="p-6 space-y-5">
                  {muscleTests.map((test, i) => (
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
            Ready to Get Started?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Our pulmonary team is here to provide accurate lung testing to guide
            your care. Schedule your evaluation today.
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
              Dr. Aalok Shah, MD | Board-Certified Pulmonologist
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

