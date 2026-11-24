import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceHero from "@/components/services/ServiceHero";
import EmergencyCallout from "@/components/services/EmergencyCallout";
import FaqAccordion from "@/components/services/FaqAccordion";
import ClinicLocationCard from "@/components/services/ClinicLocationCard";
import MedicalReviewer from "@/components/services/MedicalReviewer";
import ServiceCtaBanner from "@/components/services/ServiceCtaBanner";
import {
  Moon,
  Activity,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Heart,
  Wind,
  Zap,
} from "lucide-react";

export default function ObstructiveSleepApneaPage() {
  const warningSigns = [
    {
      title: "Loud Snoring",
      desc: "Often loud enough to wake your partner in the next room.",
    },
    {
      title: "Witnessed Pauses in Breathing",
      desc: "A partner or family member notices that you stop breathing, followed by a loud snort or gasp.",
    },
    {
      title: "Morning Symptoms",
      desc: "Waking up with a dry mouth, sore throat, or a severe morning headache.",
    },
    {
      title: "Daytime Exhaustion",
      desc: "Feeling incredibly tired during the day, struggling to concentrate, or falling asleep while sitting quietly.",
    },
    {
      title: "Nighttime Waking",
      desc: "Frequently waking up in the middle of the night to use the restroom (nocturia) or waking up with a racing heart.",
    },
  ];

  const treatments = [
    {
      title: "CPAP Therapy (Continuous Positive Airway Pressure)",
      desc: "The most common and effective treatment. A machine delivers gentle air pressure through a mask to keep your upper airway passages open while you sleep.",
    },
    {
      title: "BiPAP Therapy",
      desc: "Similar to CPAP, but delivers two different air pressures (one for breathing in, one for breathing out). Often used for more complex sleep or lung issues.",
    },
    {
      title: "Lifestyle Modifications",
      desc: "Weight management and changing your sleep position can significantly reduce mild sleep apnea symptoms and cardiovascular strain.",
    },
    {
      title: "Referrals for Oral Appliances",
      desc: "Custom-fit dental devices that hold your jaw forward to keep your airway open during sleep.",
    },
  ];

  const faqs = [
    {
      question: "What kind of doctor treats sleep apnea?",
      answer:
        "A Sleep Medicine Specialist is highly qualified to treat sleep apnea. At IE Lung, our sleep specialists are also board-certified pulmonologists (lung doctors), which means they are experts in how your airway and respiratory system function during sleep.",
    },
    {
      question: "What happens if sleep apnea is left untreated?",
      answer:
        "Untreated sleep apnea puts severe strain on your heart and cardiovascular system. Over time, the repeated drops in blood oxygen can lead to high blood pressure, heart arrhythmias (like atrial fibrillation), heart attacks, and an increased risk of stroke.",
    },
    {
      question: "Where can I find a sleep apnea specialist near me?",
      answer:
        "The Inland Empire Lung & Sleep Institute provides expert sleep apnea care at 245 Terracina Boulevard in Redlands, CA. We treat patients from across the Inland Empire, including San Bernardino, Riverside, and Beaumont.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Sleep Medicine"
        title="Obstructive Sleep Apnea (OSA)"
        subtitle="Expert care to help restore your sleep and energy."
        intro="If you wake up feeling exhausted after a full night's sleep, or if your partner constantly complains about your loud snoring, you may be suffering from Obstructive Sleep Apnea (OSA). OSA is a serious, very common sleep disorder that prevents your body from getting the oxygen and rest it needs. At the Inland Empire Lung & Sleep Institute (IE Lung), our board-certified sleep medicine specialists provide comprehensive testing and personalized treatment to help you breathe freely and sleep deeply."
        breadcrumbs={[
          { label: "Sleep Medicine", href: "/services/sleep-medicine" },
          { label: "Sleep Apnea (OSA)" },
        ]}
      />

      {/* Warning Signs */}
      <section className="py-16 md:py-20 px-4 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Common Indicators
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              When Should You See a Sleep Apnea Doctor?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Many people have sleep apnea for years without knowing it because the symptoms happen while they are asleep. Review the common warning signs below:
            </p>
          </div>

          <EmergencyCallout message="If you fall asleep uncontrollably while driving, or experience a medical emergency, call 911 or seek immediate medical help." />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {warningSigns.map((sign, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-accent/40 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3.5">
                  <Moon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-primary text-base mb-1.5">{sign.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{sign.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is OSA & Pathophysiology */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Clinical Overview
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              What is Obstructive Sleep Apnea (OSA)?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              Obstructive Sleep Apnea (OSA) is a sleep-related breathing disorder. It occurs when the muscles in the back of your throat relax too much while you are asleep.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200">
            <h3 className="text-xl font-bold text-primary mb-4">
              What happens in your body during OSA?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              When those throat muscles relax, your airway narrows or closes entirely as you breathe in:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
                <span className="text-accent font-bold text-lg mb-2 block">1. Apnea</span>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  Your breathing stops for 10 seconds or longer.
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
                <span className="text-accent font-bold text-lg mb-2 block">2. Hypoxia</span>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  The oxygen level in your blood drops significantly.
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
                <span className="text-accent font-bold text-lg mb-2 block">3. Micro-Arousal</span>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  Your brain briefly wakes you up to reopen your airway (gasp/snort).
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
                <span className="text-accent font-bold text-lg mb-2 block">4. Sleep Fragmentation</span>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  This repeats dozens of times an hour, preventing restorative deep sleep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnosis & Treatments */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Diagnostic Bridge */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm max-w-4xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              How is Sleep Apnea Diagnosed?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-6">
              Your doctor cannot diagnose sleep apnea based on symptoms alone. To get the right treatment plan, your doctor will likely recommend a formal sleep study evaluated by a board-certified sleep physician. At IE Lung, we offer both Home Sleep Apnea Testing (HSAT) and in-laboratory Polysomnography.
            </p>
            <Link
              href="/services/sleep-studies-diagnostics"
              className="inline-flex items-center gap-2 bg-[#3D4749] hover:bg-accent text-white font-semibold px-8 py-3.5 rounded-full text-sm sm:text-base transition-colors group"
            >
              <span>Explore Home & In-Lab Sleep Studies</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Treatment Options */}
          <div>
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
                Restorative Therapies
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                Sleep Apnea Treatment Options at IE Lung
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Untreated sleep apnea can increase your risk of high blood pressure, heart disease, stroke, and type 2 diabetes. While OSA cannot be cured with a simple pill, our specialists offer highly effective therapies to keep your airway open:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {treatments.map((treatment, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 font-bold text-sm">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-primary text-base mb-2">{treatment.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{treatment.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Sleep Apnea"
        faqs={faqs}
      />

      {/* Clinic NAP Card */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Expert sleep apnea testing and CPAP care in Redlands, CA."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Roger Seheult, MD"
        credentials="Quadruple Board-Certified in Sleep Medicine, Pulmonology, Critical Care & Internal Medicine"
        lastUpdated="November 2026"
        sources={[
          { name: "American Academy of Sleep Medicine: Sleep Apnea" },
          { name: "National Heart, Lung, and Blood Institute: Sleep Apnea" },
        ]}
      />

      <ServiceCtaBanner
        title="Stop Snoring & Start Resting Deeply"
        subtitle="Request a comprehensive sleep apnea consultation and sleep study in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
