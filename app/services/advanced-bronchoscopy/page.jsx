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
  Crosshair,
  Waves,
  Microscope,
  Wind,
} from "lucide-react";

export default function AdvancedBronchoscopy() {
  const decisionCards = [
    {
      symptom:
        'A suspicious spot or "peripheral lung nodule" deep in the lung',
      label: "If your CT scan shows:",
      test: "Robotic Bronchoscopy or a Lung Biopsy",
      icon: Crosshair,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-500",
    },
    {
      symptom: "Enlarged lymph nodes in the center of your chest",
      label: "If your scan shows:",
      test: "EBUS Procedure (Endobronchial Ultrasound)",
      icon: Microscope,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-500",
    },
    {
      symptom:
        "Unexplained fluid building up around your lungs (pleural effusion)",
      label: "If you experience:",
      test: "Ultrasound-Guided Thoracentesis",
      icon: Waves,
      color: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-500",
    },
    {
      symptom: "Suspected deep airway infections or severe inflammation",
      label: "If you experience:",
      test: "Flexible Bronchoscopy with Lavage",
      icon: Wind,
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-500",
    },
  ];

  const bronchoscopyTests = [
    {
      name: "Robotic Bronchoscopy",
      description:
        "Uses advanced technology to help our specialists navigate narrow, hard-to-reach airways. It provides a highly stable platform to reach and sample peripheral (outer) lung nodules safely.",
    },
    {
      name: "Endobronchial Ultrasound (EBUS)",
      description:
        "Uses an ultrasound-equipped scope to look beyond the airway walls. It helps doctors evaluate and perform needle sampling of lymph nodes or lesions adjacent to the airways.",
    },
    {
      name: "Flexible Bronchoscopy (with Lavage or Biopsy)",
      description:
        "Examines the inside of the airways using a flexible camera. The doctor can wash the area to collect fluid (lavage) or take tissue samples to check for infection, inflammation, or cancer cells.",
    },
  ];

  const pleuralTests = [
    {
      name: "Bronchoscopy-Guided Lung Biopsy",
      description:
        "Collects samples of selected lung lesions from inside the airway, usually avoiding the need for external surgical incisions.",
    },
    {
      name: "Ultrasound-Guided Thoracentesis",
      description:
        "Uses ultrasound imaging to guide the safe removal of excess fluid around the lungs (pleural fluid). This helps find the cause of the fluid buildup and can quickly relieve shortness of breath.",
    },
  ];

  const faqs = [
    {
      question: "What does an interventional pulmonologist do?",
      answer:
        "An interventional pulmonologist is a lung specialist with advanced training in minimally invasive airway and pleural procedures. They use specialized tools to diagnose and treat lung nodules, enlarged lymph nodes, and complex airway disorders, often avoiding traditional open chest surgery.",
    },
    {
      question: "Is an EBUS procedure painful?",
      answer:
        "No. Patients are typically given deep sedation or general anesthesia during an EBUS procedure. You will be asleep and comfortable, and you will not feel the biopsy needle or the ultrasound probe.",
    },
    {
      question: "What is a lung nodule specialist?",
      answer:
        'A lung nodule specialist is typically an interventional pulmonologist who focuses on quickly and accurately evaluating "spots" on the lungs found during CT scans or X-rays. They use advanced biopsies to determine if the nodules are benign (non-cancerous) or malignant.',
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
            <Link
              href="/#services"
              className="hover:text-accent transition-colors"
            >
              Services
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">Advanced Bronchoscopy</span>
          </div>

          <div className="max-w-3xl">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Our Services
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Advanced Bronchoscopy & Interventional Pulmonology
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
              Advanced, minimally invasive diagnostics for lung nodules and
              airway conditions.
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
            When facing an abnormal chest X-ray or a complex lung condition, an
            accurate diagnosis is key. At the Inland Empire Lung & Sleep
            Institute in Redlands, CA, our interventional pulmonologists use
            advanced, minimally invasive technology—including robotic
            bronchoscopy and endobronchial ultrasound (EBUS)—to help evaluate
            lung nodules, diagnose respiratory conditions, and treat fluid
            around the lungs without the need for traditional open surgery.
          </p>
        </div>
      </section>

      {/* Why Did My Doctor Refer Me Here? */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              Diagnostic Guide
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Did My Doctor Refer Me Here?
            </h2>
            <p className="text-primary/60 max-w-2xl mx-auto">
              Your doctor decides which procedure is right for you based on your
              unique medical history. These examples show what each advanced
              procedure helps evaluate.
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

      {/* Detailed Test Descriptions */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* EBUS Procedure */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              What is an EBUS Procedure?
            </h2>
            <p className="text-primary/70 leading-relaxed mb-6">
              An EBUS (Endobronchial Ultrasound) is a minimally invasive
              outpatient procedure used to help diagnose lung conditions, such
              as infections, inflammation, and lung cancer.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Microscope className="w-4 h-4 text-accent" />
                  </div>
                  How it works
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  A pulmonologist inserts a flexible tube equipped with a tiny
                  ultrasound probe down your windpipe.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Crosshair className="w-4 h-4 text-accent" />
                  </div>
                  What it does
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  The ultrasound allows the doctor to see beyond the airway
                  walls to evaluate and safely sample (biopsy) lymph nodes
                  located in the center of the chest.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  The benefit
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  It provides highly detailed diagnostic information while often
                  preventing the need for invasive chest surgery.
                </p>
              </div>
            </div>
          </div>

          {/* Lung Biopsy via Bronchoscopy */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              How is a Lung Biopsy Done via Bronchoscopy?
            </h2>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <p className="text-primary/70 leading-relaxed">
                During a bronchoscopy-guided lung biopsy, a specialist uses a
                lighted tube with a camera to navigate through your natural
                airways. Once the target lesion or nodule is located—often
                assisted by robotic navigation or ultrasound—the doctor passes
                tiny tools through the tube to collect tissue samples. These
                samples are then sent to a laboratory for testing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Procedure Menu */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Minimally Invasive Bronchoscopy */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-[#3D4749] text-white p-6">
                <h3 className="text-xl font-bold mb-1">
                  Minimally Invasive Bronchoscopy
                </h3>
                <p className="text-white/60 text-sm">
                  Camera-guided airway procedures
                </p>
              </div>
              <div className="p-6 space-y-5">
                {bronchoscopyTests.map((test, i) => (
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

            {/* Lung Biopsy & Pleural Procedures */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-accent text-white p-6">
                <h3 className="text-xl font-bold mb-1">
                  Lung Biopsy & Pleural Procedures
                </h3>
                <p className="text-white/80 text-sm">
                  Tissue sampling & fluid management
                </p>
              </div>
              <div className="p-6 space-y-5">
                {pleuralTests.map((test, i) => (
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
            Our interventional pulmonologists are here to provide advanced,
            minimally invasive diagnostics for your lung health. Schedule your
            evaluation today.
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
              Dr. Tarik Ngab, MD & Dr. Sahib Grewal, MD | Board-Certified
              Pulmonologists & Interventional Specialists
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

