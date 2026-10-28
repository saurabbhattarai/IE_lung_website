"use client";

import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  HeartPulse,
  Activity,
  Scan,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function PulmonaryVascularDiseases() {
  const decisionCards = [
    {
      symptom:
        "Severe shortness of breath, unexplained fainting, and your doctor suspects Pulmonary Hypertension",
      test: "Right-Heart Catheterization",
      icon: HeartPulse,
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-500",
    },
    {
      symptom:
        "Sudden chest pain or shortness of breath, and your doctor suspects a blood clot in the lung (Pulmonary Embolism)",
      test: "CT Pulmonary Angiography",
      icon: Scan,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-500",
    },
    {
      symptom: "An irregular heartbeat or unexplained palpitations",
      test: "Electrocardiogram (ECG / EKG)",
      icon: Activity,
      color: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-500",
    },
  ];

  const invasiveTests = [
    {
      name: "Right-Heart Catheterization",
      description:
        "Measures pulmonary pressures, cardiac output, and pulmonary vascular resistance to evaluate conditions like pulmonary hypertension.",
    },
    {
      name: "Acute Vasoreactivity Testing",
      description:
        "A specialized test performed during a right-heart catheterization. It checks how your pulmonary blood vessels respond to certain medications, which helps your doctor select the right treatment for Pulmonary Arterial Hypertension (PAH).",
    },
  ];

  const nonInvasiveTests = [
    {
      name: "Electrocardiogram (ECG or EKG) Interpretation",
      description:
        "Evaluates your cardiac rhythm and checks for electrical abnormalities in your heart that could affect your breathing.",
    },
    {
      name: "CT Pulmonary Angiography Interpretation",
      description:
        "Evaluates the pulmonary arteries to check for thromboembolic disease (blood clots).",
    },
  ];

  const faqs = [
    {
      question: "How serious is a right heart catheterization?",
      answer:
        "While a right heart catheterization is an invasive procedure, it is a common test performed by experienced pulmonary cardiologists and interventional pulmonologists. You will be awake during the test but given mild medication to help you relax and ensure your comfort.",
    },
    {
      question:
        "Why do I need to see a pulmonary hypertension specialist?",
      answer:
        "Pulmonary Hypertension (PAH) is a complex condition where high blood pressure affects the arteries in your lungs and the right side of your heart. It requires highly specialized care, advanced diagnostic interpretation, and targeted treatments that standard clinics often do not provide.",
    },
    {
      question: "Where can I get an EKG near me?",
      answer:
        "IE Lung offers expert Electrocardiogram (ECG/EKG) interpretation in Redlands, CA. Our heart and lung doctors review your electrical cardiac rhythm to ensure your heart is functioning properly alongside your respiratory system.",
    },
  ];

  return (
    <main className="bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3D4749] via-[#2D3537] to-[#1D2527] text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/#services" className="hover:text-accent transition-colors">
              Services
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">Pulmonary Vascular Diseases</span>
          </div>

          <div className="max-w-3xl">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Our Services
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Pulmonary Vascular & Cardiac Evaluation
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
              Advanced diagnostics for pulmonary hypertension and cardiopulmonary health.
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
            Pulmonary vascular and cardiac tests evaluate the complex connection
            between your heart and lungs. If you have severe shortness of breath,
            irregular heartbeats, or a suspected blood clot, these specialized
            tests help your doctor find the underlying cause. At the Inland Empire
            Lung & Sleep Institute, our pulmonary hypertension specialists provide
            the testing required to guide your care. Unlike a standard Redlands
            advanced imaging center, our clinic pairs state-of-the-art scans with
            direct interpretation by specialized pulmonary cardiologists.{" "}
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

      {/* Which Test Do I Need? */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Diagnostic Guide
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Which Heart & Lung Test Do I Need?
            </h2>
            <p className="text-primary/60 max-w-2xl mx-auto">
              Your doctor decides which test is right for you. These examples show
              what each diagnostic test helps evaluate.
            </p>
          </div>

          {/* Emergency Warning */}
          <div className="max-w-3xl mx-auto mb-12 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm leading-relaxed">
              <strong>If you have sudden chest pain, severe shortness of breath,
              or a medical emergency, call 911 or go to the nearest emergency room
              immediately.</strong>
            </p>
          </div>

          {/* Decision Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {decisionCards.map((card, i) => (
              <div
                key={i}
                className={`rounded-2xl border-2 p-6 ${card.color} transition-all hover:shadow-lg`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-5 shadow-sm`}
                >
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <p className="text-sm text-primary/60 font-medium mb-2 uppercase tracking-wider">
                  If you experience:
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

      {/* Detailed Test Descriptions */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Right Heart Catheterization */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              What is a Right Heart Catheterization?
            </h2>
            <p className="text-primary/70 leading-relaxed mb-6">
              A Right Heart Catheterization is a diagnostic procedure used to help
              diagnose and measure the severity of pulmonary hypertension (high
              blood pressure in the lungs).
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <HeartPulse className="w-4 h-4 text-accent" />
                  </div>
                  How it works
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  A specially trained doctor guides a thin, flexible tube
                  (catheter) through a vein in your neck, arm, or groin, passing
                  it into the right side of your heart and the pulmonary artery.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-accent" />
                  </div>
                  What it measures
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  It measures the blood pressure inside your heart and lungs,
                  checks your cardiac output, and measures pulmonary vascular
                  resistance to show how hard your heart is working to pump blood.
                </p>
              </div>
            </div>
          </div>

          {/* CT Pulmonary Angiography */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              What is a CT Pulmonary Angiography?
            </h2>
            <p className="text-primary/70 leading-relaxed mb-6">
              A CT Pulmonary Angiography (CTPA) is a specific type of medical
              imaging test used to look for pulmonary embolisms (blood clots in
              the arteries of your lungs).
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Scan className="w-4 h-4 text-accent" />
                  </div>
                  How it works
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  A specialized dye (contrast material) is injected into your
                  bloodstream. As the dye flows through your blood vessels, a CT
                  scanner takes highly detailed X-ray images of your chest.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  What it shows
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  The dye highlights your pulmonary arteries on the scan, allowing
                  the doctor to see if a blood clot is blocking the flow of blood
                  to your lungs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Test Menu */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Invasive */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-[#3D4749] text-white p-6">
                <h3 className="text-xl font-bold mb-1">
                  Invasive Pulmonary Vascular Diagnostics
                </h3>
                <p className="text-white/60 text-sm">
                  Catheter-based procedures for precise measurement
                </p>
              </div>
              <div className="p-6 space-y-5">
                {invasiveTests.map((test, i) => (
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

            {/* Non-Invasive */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-accent text-white p-6">
                <h3 className="text-xl font-bold mb-1">
                  Non-Invasive Cardiac & Vascular Imaging
                </h3>
                <p className="text-white/80 text-sm">
                  Advanced imaging without catheterization
                </p>
              </div>
              <div className="p-6 space-y-5">
                {nonInvasiveTests.map((test, i) => (
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
            Ready to Get Started?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Our pulmonary hypertension specialists are here to provide the
            advanced diagnostics you need. Schedule your evaluation today.
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
              <strong className="text-primary/70">Medically Reviewed by:</strong>{" "}
              Dr. Paresh C. Giri, MD | Board-Certified Pulmonologist & Director
              of Pulmonary Hypertension Care.
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

