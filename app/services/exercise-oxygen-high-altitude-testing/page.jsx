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
  Activity,
  Plane,
  Wind,
  Droplet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";

export default function ExerciseOxygenHighAltitudeTestingPage() {
  const matcherItems = [
    {
      symptom:
        "Shortness of breath when you work out or push yourself physically",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "Cardiopulmonary Exercise Testing (CPET)",
      icon: Activity,
    },
    {
      symptom:
        "You are planning to fly on a plane or visit the mountains, but you have COPD",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "High-Altitude Simulation Testing (HAST)",
      icon: Plane,
    },
    {
      symptom:
        "Your doctor needs to check if you qualify for a home oxygen prescription",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation:
        "A 6-Minute Walk Test or Ambulatory Oxygen Titration",
      icon: Wind,
    },
    {
      symptom:
        "Your doctor needs to check the oxygen and carbon dioxide levels in your blood",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A Blood Gas Analysis",
      icon: Droplet,
    },
  ];

  const exerciseDiagnostics = [
    {
      name: "Cardiopulmonary Exercise Testing (CPET)",
      desc: "Evaluates exercise limitation, unexplained breathlessness, and overall cardiopulmonary fitness by monitoring gas exchange and cardiac rhythm simultaneously.",
    },
    {
      name: "Six-Minute Walk Test",
      desc: "Measures your walking distance capacity, fatigue symptoms, and continuous oxygen saturation during light exertion.",
    },
  ];

  const oxygenAltitude = [
    {
      name: "High-Altitude Simulation Testing (HAST)",
      desc: "Assesses potential oxygen needs during commercial air travel or mountain altitude exposure ('fit-to-fly' test).",
    },
    {
      name: "Ambulatory Oximetry & Oxygen Titration",
      desc: "Evaluates oxygen desaturation with daily activity to determine your exact supplemental oxygen prescription needs.",
    },
    {
      name: "Blood Gas Analysis Interpretation",
      desc: "Measures oxygen, carbon dioxide, and acid-base (pH) status to help evaluate severe respiratory failure and ventilatory efficiency.",
    },
    {
      name: "Resting Pulse Oximetry",
      desc: "A simple, non-invasive baseline measurement of resting arterial blood oxygen saturation.",
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
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Functional Exercise Testing"
        title="Exercise, Oxygen & High-Altitude Testing in Redlands, CA"
        subtitle="Specialized testing for breathlessness, exertion, and travel clearance."
        intro="If your breathing is fine at rest but you struggle during physical activity or travel, standard lung tests may not show the full picture. At the Inland Empire Lung & Sleep Institute in Redlands, CA, our pulmonary team provides specialized functional testing. From Cardiopulmonary Exercise Testing (CPET) to High-Altitude Simulation Testing (HAST), these tests help your doctor see how your heart, lungs, and muscles use oxygen under stress. Request an appointment to get started."
        breadcrumbs={[
          { label: "Diagnostics", href: "/#services" },
          { label: "Exercise & Oxygen Testing" },
        ]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="Which Functional Breathing Test Do I Need?"
        subtitle="Your doctor decides which test is right for you. These examples show what each test helps evaluate:"
        items={matcherItems}
      />

      {/* Deep-Dive: CPET & HAST */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                What is Cardiopulmonary Exercise Testing (CPET)?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                Cardiopulmonary Exercise Testing (CPET) is a specialized lung exercise test that measures your heart, lungs, and muscle function at the same time while you exercise (usually on a stationary bike or treadmill).
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>How it works:</strong> You breathe into a specialized mask that measures oxygen intake and carbon dioxide output while ECG wires monitor cardiac rhythm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>What it evaluates:</strong> Identifies the precise cause of unexplained breathlessness under exertion.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                What is High-Altitude Simulation Testing (HAST)?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                A High-Altitude Simulation Test (HAST), sometimes called a &ldquo;fit-to-fly&rdquo; test, helps check your potential need for supplemental oxygen during air travel or exposure to high mountain altitudes.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Patients breathe a specialized air mixture that mimics the lower oxygen levels found in commercial airplane cabins to ensure they can travel safely without experiencing dangerous hypoxia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Test Modalities */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Comprehensive Modalities
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Functional & Altitude Diagnostics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-6 pb-3 border-b border-slate-100">
                  Exercise & Exertion Diagnostics
                </h3>
                <div className="space-y-6">
                  {exerciseDiagnostics.map((d, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-primary text-base mb-1.5">{d.name}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-6 pb-3 border-b border-slate-100">
                  Oxygen & Altitude Testing
                </h3>
                <div className="space-y-5">
                  {oxygenAltitude.map((d, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-primary text-sm sm:text-base mb-1">{d.name}</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Functional Testing"
        faqs={faqs}
      />

      {/* Clinic Location Card */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Specialized CPET and altitude simulation laboratory in Redlands, CA."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Aalok Shah, MD"
        credentials="Board-Certified Pulmonologist & Critical Care Physician"
        lastUpdated="October 2026"
      />

      <ServiceCtaBanner
        title="Plan to Travel or Experiencing Exertional Breathlessness?"
        subtitle="Our board-certified pulmonologists provide complete CPET and altitude simulation clearance in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
