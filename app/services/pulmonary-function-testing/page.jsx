import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceHero from "@/components/services/ServiceHero";
import SymptomMatcher from "@/components/services/SymptomMatcher";
import FaqAccordion from "@/components/services/FaqAccordion";
import ClinicLocationCard from "@/components/services/ClinicLocationCard";
import MedicalReviewer from "@/components/services/MedicalReviewer";
import ServiceCtaBanner from "@/components/services/ServiceCtaBanner";
import {
  Wind,
  Activity,
  HeartPulse,
  Gauge,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export default function PulmonaryFunctionTestingPage() {
  const matcherItems = [
    {
      symptom:
        "Shortness of breath, a chronic cough, or a doctor's concern about COPD",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "Spirometry or Lung Volume Testing",
      icon: Wind,
    },
    {
      symptom: "Wheezing, coughing, or breathlessness only during exercise",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "Exercise Bronchoprovocation",
      icon: HeartPulse,
    },
    {
      symptom:
        "You use an inhaler but aren't sure it is opening your airways",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "Bronchodilator Response Testing",
      icon: Gauge,
    },
    {
      symptom: "You have asthma and want to track your breathing at home",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "Peak Expiratory Flow Measurement",
      icon: Activity,
    },
  ];

  const basicTests = [
    {
      name: "Spirometry",
      desc: "The most common breathing test. It measures how much air you can blow out, and how fast, to help identify obstructive lung diseases such as asthma and COPD.",
    },
    {
      name: "Lung Volume Testing (Body Plethysmography)",
      desc: "Measures the total amount of air your lungs can hold. It shows whether air is trapped in your lungs or whether a restrictive condition keeps them from fully expanding.",
    },
    {
      name: "Diffusing Capacity (DLCO)",
      desc: "Measures how well oxygen passes from the air sacs in your lungs into your blood.",
    },
    {
      name: "Upright and Supine Vital Capacity",
      desc: "Compares your breathing while sitting and lying down. It helps evaluate suspected weakness of the diaphragm.",
    },
  ];

  const asthmaTests = [
    {
      name: "Bronchodilator Response Testing",
      desc: "Compares your breathing before and after an inhaled bronchodilator medication. It shows how well your airways respond to this type of inhaler.",
    },
    {
      name: "Exercise Bronchoprovocation",
      desc: "Checks whether your airways tighten during physical exertion. It helps diagnose exercise-induced asthma (exercise-induced bronchoconstriction).",
    },
    {
      name: "Peak Expiratory Flow Measurement",
      desc: "A quick test that tracks changes in how forcefully you can breathe out. It is often used to monitor asthma, including at home.",
    },
  ];

  const muscleTests = [
    {
      name: "Respiratory Muscle Strength (MIP/MEP)",
      desc: "Measures the strength of the muscles that help you breathe in and out.",
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
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Diagnostic Testing"
        title="Pulmonary Function Testing"
        subtitle="Accurate lung testing to guide your care."
        intro="Pulmonary function tests measure how well your lungs work. If you have shortness of breath, a chronic cough, or symptoms of asthma, these tests help your doctor find the cause and plan your treatment. At Inland Empire Lung & Sleep Institute in Redlands, CA, our pulmonary team performs the tests below. Request an appointment to get started."
        breadcrumbs={[
          { label: "Diagnostics", href: "/#services" },
          { label: "Pulmonary Function Testing" },
        ]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="Which Breathing Test Do I Need?"
        subtitle="Your doctor decides which test is right for you. These examples show what each test helps evaluate:"
        items={matcherItems}
      />

      {/* What is PFT */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Diagnostic Overview
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              What is a Pulmonary Function Test (PFT)?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              A Pulmonary Function Test (PFT) is a group of non-invasive breathing tests that measure how well your lungs are working. Complete pulmonary function tests evaluate three main areas:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <span className="text-accent font-bold text-lg mb-2 block">Airflow</span>
                <p className="text-slate-600 text-sm leading-relaxed">
                  How much air you can inhale and exhale, and how quickly your airways move air.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <span className="text-accent font-bold text-lg mb-2 block">Lung Capacity</span>
                <p className="text-slate-600 text-sm leading-relaxed">
                  How much total air your lungs can hold during full expansion.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <span className="text-accent font-bold text-lg mb-2 block">Gas Exchange</span>
                <p className="text-slate-600 text-sm leading-relaxed">
                  How efficiently oxygen passes from your lung air sacs into your bloodstream.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                How is a Pulmonary Function Test Done?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                During a standard PFT, you sit in a chair and breathe into a mouthpiece connected to a machine called a spirometer. A soft nose clip makes sure all air goes through your mouth. A respiratory therapist coaches you to take deep breaths and blow out as hard and fast as you can. For some tests, such as body plethysmography, you may sit in a clear booth, similar to a phone booth, so the team can measure pressure changes in your lungs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Test Modalities */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Full Spectrum
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Comprehensive Pulmonary Testing Capabilities
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Our specialized lab performs full-spectrum cardiopulmonary assessments:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Breathing */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-4 pb-3 border-b border-slate-100">
                  Basic Breathing & Lung Capacity
                </h3>
                <div className="space-y-4">
                  {basicTests.map((t, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-primary text-sm mb-1">{t.name}</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Asthma Diagnostics */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-4 pb-3 border-b border-slate-100">
                  Asthma Diagnostics & Airway Evaluation
                </h3>
                <div className="space-y-4">
                  {asthmaTests.map((t, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-primary text-sm mb-1">{t.name}</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Muscle Testing */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-4 pb-3 border-b border-slate-100">
                  Respiratory Muscle Testing
                </h3>
                <div className="space-y-4">
                  {muscleTests.map((t, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-primary text-sm mb-1">{t.name}</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Evaluates respiratory muscle strength (MIP/MEP) to detect diaphragmatic weakness or neuromuscular respiratory compromise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs (Corrected - Clean 3 questions without stray sleep FAQ) */}
      <FaqAccordion
        title="Frequently Asked Questions About PFTs"
        faqs={faqs}
      />

      {/* Clinic Location Card */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Prompt pulmonary function testing in Redlands, CA."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Aalok Shah, MD"
        credentials="Board-Certified Pulmonologist"
        lastUpdated="October 2026"
      />

      <ServiceCtaBanner
        title="Need an Accurate Pulmonary Function Test?"
        subtitle="Our experienced pulmonary team guides you through every step of your breathing assessment in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
