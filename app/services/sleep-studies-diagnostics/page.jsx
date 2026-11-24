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
  Moon,
  Zap,
  Activity,
  HeartPulse,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Home,
  Building2,
} from "lucide-react";

export default function SleepStudiesDiagnosticsPage() {
  const matcherItems = [
    {
      symptom:
        "Loud snoring, waking up gasping for air, or a partner notices you stop breathing",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A Home Sleep Apnea Test (HSAT) or In-Lab Polysomnography (PSG)",
      icon: Moon,
    },
    {
      symptom:
        "Severe daytime sleepiness or falling asleep uncontrollably during the day",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A Multiple Sleep Latency Test (MSLT)",
      icon: Zap,
    },
    {
      symptom: "You use a CPAP machine but are still exhausted",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A PAP Titration Study",
      icon: Activity,
    },
    {
      symptom:
        "You use supplemental oxygen and need to check your nighttime levels",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "Overnight Pulse Oximetry",
      icon: HeartPulse,
    },
  ];

  const atHomeTests = [
    {
      name: "Home Sleep Apnea Testing (HSAT)",
      desc: "Evaluates suspected obstructive sleep apnea in selected patients. You wear a simple, comfortable monitor in your own bed that records your breathing, heart rate, and oxygen levels overnight.",
    },
    {
      name: "Overnight Pulse Oximetry",
      desc: "Measures your oxygen levels while you sleep to see if they drop. This test helps evaluate your oxygen needs, but it is not used to diagnose sleep apnea on its own.",
    },
  ];

  const inLabTests = [
    {
      name: "In-Laboratory Polysomnography (PSG)",
      desc: "An overnight assessment in our sleep clinic. It monitors your sleep cycles, brain waves, breathing, and movements to help diagnose conditions like sleep apnea, periodic limb movement disorder, and narcolepsy.",
    },
    {
      name: "PAP Titration Study",
      desc: "Helps find the effective positive airway pressure (CPAP or BiPAP) settings to keep your airway open while you sleep. Often performed as a 'split-night' study.",
    },
    {
      name: "Multiple Sleep Latency Test (MSLT)",
      desc: "A daytime test that measures how quickly you fall asleep in a quiet environment. It helps evaluate narcolepsy and other conditions that cause excessive daytime sleepiness.",
    },
    {
      name: "Maintenance of Wakefulness Test (MWT)",
      desc: "Measures your ability to stay awake under standardized, quiet conditions. Frequently used to assess daytime alertness for occupational safety and commercial drivers.",
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
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Sleep Diagnostics"
        title="Sleep Studies & Diagnostics"
        subtitle="Comprehensive testing to evaluate your sleep health."
        intro="Sleep studies monitor your body while you rest to help identify the cause of snoring, chronic fatigue, or daytime sleepiness. Serving the Inland Empire, Redlands, and surrounding communities, our board-certified sleep team offers both in-lab and at-home testing. We work closely with primary care providers and hospitals in Riverside County, CA, and San Bernardino County to help find the cause of your symptoms and guide your treatment. Request an appointment to get started."
        breadcrumbs={[
          { label: "Diagnostics", href: "/#services" },
          { label: "Sleep Studies & Diagnostics" },
        ]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="Which Sleep Test Do I Need?"
        subtitle="Your doctor decides which test is right for you. These examples show what each test helps evaluate:"
        items={matcherItems}
      />

      {/* What is Polysomnography */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Diagnostic Standards
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              What is a Sleep Study (Polysomnography)?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              A sleep study, clinically known as Polysomnography (PSG), is a non-invasive test used to diagnose sleep disorders. Whether conducted in a sleep clinic or via a home sleep test, it monitors your body functions as you rest. A complete sleep study evaluates:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <span className="text-accent font-bold text-base mb-2 block">Brain Waves (EEG)</span>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Monitors your sleep cycles (REM and non-REM) to evaluate sleep architecture.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <span className="text-accent font-bold text-base mb-2 block">Oxygen Levels</span>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Checks for drops in blood oxygen caused by airway collapse and breathing pauses.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <span className="text-accent font-bold text-base mb-2 block">Heart Rate & Breathing</span>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Identifies obstructive apneas, hypopneas, and cardiac arrhythmias during sleep.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <span className="text-accent font-bold text-base mb-2 block">Body Movement</span>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Tracks restless legs or other physical disruptions that fragment deep rest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Modalities: At-Home vs In-Lab */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Testing Options
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              At-Home & In-Lab Sleep Testing Modalities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* At-Home */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Home className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-primary">At-Home Sleep Testing</h3>
                </div>
                <div className="space-y-6">
                  {atHomeTests.map((t, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-primary text-base mb-1.5">{t.name}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* In-Lab */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-primary">In-Lab Sleep Studies & Advanced Diagnostics</h3>
                </div>
                <div className="space-y-5">
                  {inLabTests.map((t, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-primary text-sm sm:text-base mb-1">{t.name}</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{t.desc}</p>
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
        title="Frequently Asked Questions About Sleep Studies"
        faqs={faqs}
      />

      {/* Clinic Location Card */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Accredited sleep diagnostic facility in Redlands, CA."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Roger Seheult, MD"
        credentials="Board-Certified in Sleep Medicine & Pulmonology"
        lastUpdated="October 2026"
      />

      <ServiceCtaBanner
        title="Ready to Schedule Your Sleep Evaluation?"
        subtitle="Our sleep medicine team provides comprehensive in-lab and home sleep testing in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
