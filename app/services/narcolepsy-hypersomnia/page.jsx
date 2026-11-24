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
  Zap,
  Moon,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Brain,
  Pill,
  Activity,
} from "lucide-react";

export default function NarcolepsyHypersomniaPage() {
  const matcherItems = [
    {
      symptom:
        "Overwhelming daytime sleepiness and suddenly falling asleep at inappropriate times...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation:
        "A daytime sleep test called a Multiple Sleep Latency Test (MSLT).",
      icon: Zap,
    },
    {
      symptom:
        "Sudden muscle weakness or collapse when you laugh, feel angry, or get surprised (Cataplexy)...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "An evaluation for Type 1 Narcolepsy.",
      icon: Brain,
    },
    {
      symptom:
        "Sleeping 10 or more hours a night but still waking up feeling confused and exhausted...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "An evaluation for Idiopathic Hypersomnia.",
      icon: Clock,
    },
  ];

  const treatments = [
    {
      title: "Medication Management",
      desc: "Specific medications such as wakefulness-promoting stimulants for daytime alertness, or nighttime agents (like oxybates) to consolidate deep sleep and reduce cataplexy.",
      icon: Pill,
    },
    {
      title: "Scheduled Naps",
      desc: "Taking planned 15- to 20-minute naps at strategic intervals during the day can significantly curb uncontrollable sleep attacks and improve cognitive function.",
      icon: Clock,
    },
    {
      title: "Sleep Hygiene Optimization",
      desc: "Maintaining a strict consistent sleep-wake schedule, optimizing lighting, and avoiding heavy meals or caffeine before bed to support neurological circadian stability.",
      icon: Moon,
    },
  ];

  const faqs = [
    {
      question: "What kind of doctor treats narcolepsy?",
      answer:
        "A Sleep Medicine Specialist or a Neurologist is the most qualified doctor for narcolepsy. Because narcolepsy and hypersomnia are complex sleep-wake disorders, it is highly recommended to see a board-certified sleep specialist who has experience with advanced sleep testing and specialized medications.",
    },
    {
      question: "Can a sleep specialist prescribe medication?",
      answer:
        "Yes. Sleep medicine specialists are fully licensed medical doctors (MDs or DOs) who can prescribe medications. They carefully manage prescriptions for idiopathic hypersomnia treatment and narcolepsy, ensuring the medications are safe and effective for your specific symptoms.",
    },
    {
      question: "Where can I find a narcolepsy specialist near me?",
      answer:
        "The Inland Empire Lung & Sleep Institute offers expert diagnosis and management for narcolepsy and hypersomnia at our clinic in Redlands, CA. We treat patients from across the Inland Empire, including San Bernardino, Riverside, and Beaumont.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Sleep Medicine"
        title="Narcolepsy & Hypersomnia"
        subtitle="Expert care to help you manage excessive daytime sleepiness."
        intro="Feeling tired occasionally is normal, but struggling to stay awake every single day can severely impact your quality of life. Narcolepsy and idiopathic hypersomnia are complex sleep disorders that cause overwhelming daytime exhaustion, even after a full night of rest. If you are looking for a highly qualified narcolepsy doctor or hypersomnia specialist near you, the board-certified sleep medicine physicians at the Inland Empire Lung & Sleep Institute (IE Lung) in Redlands, CA, are here to provide accurate testing and personalized management plans."
        breadcrumbs={[
          { label: "Sleep Medicine", href: "/services/sleep-medicine" },
          { label: "Narcolepsy & Hypersomnia" },
        ]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="When Should You See a Doctor for Narcolepsy?"
        subtitle="Your doctor decides which evaluation is right for you. These examples show what your next steps may look like if you struggle with excessive sleepiness:"
        emergencyMessage="If you fall asleep uncontrollably while driving or operating machinery, stop immediately and seek medical help."
        items={matcherItems}
      />

      {/* What is Narcolepsy & Hypersomnia */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Neurological Overview
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              What is Narcolepsy?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Narcolepsy is a chronic neurological sleep disorder that affects the brain&apos;s ability to control sleep-wake cycles. People with narcolepsy often feel rested after waking, but then feel very sleepy throughout much of the day. There are two different types of narcolepsy:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-primary text-lg mb-2">Type 1 Narcolepsy</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Involves excessive daytime sleepiness combined with cataplexy (a sudden loss of muscle tone triggered by strong emotions like laughter or surprise). It is usually caused by low levels of a brain chemical called hypocretin.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-primary text-lg mb-2">Type 2 Narcolepsy</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Involves chronic excessive daytime sleepiness without cataplexy. Patients experience intense daytime sleep urges without emotional muscle weakness.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">What is Hypersomnia?</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-3">
                Hypersomnia is characterized by recurrent episodes of excessive daytime sleepiness or prolonged nighttime sleep. The most common primary form is Idiopathic Hypersomnia.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Idiopathic hypersomnia symptoms include struggling to wake up from sleep (sleep inertia or &ldquo;sleep drunkenness&rdquo;), sleeping for long periods (10+ hours) without feeling refreshed, and a constant need to sleep during the day. &ldquo;Idiopathic&rdquo; means the exact medical cause is unknown.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments & Diagnostics */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-16">
          <div>
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
                Treatment & Management
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                Narcolepsy & Hypersomnia Treatment Options
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Many patients search online wondering how to cure narcolepsy. Currently, there is no narcoleptic cure. However, with the right treatment, a specialist can help you successfully manage your symptoms and improve your daily alertness:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {treatments.map((treatment, i) => {
                const Icon = treatment.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-primary text-base mb-2">{treatment.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{treatment.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnostic Bridge */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm max-w-4xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              How Are These Disorders Diagnosed?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-6">
              To accurately diagnose narcolepsy and hypersomnia, your sleep specialist will order a nighttime sleep study (Polysomnography) followed immediately by a daytime nap study called a Multiple Sleep Latency Test (MSLT).
            </p>
            <Link
              href="/services/sleep-studies-diagnostics"
              className="inline-flex items-center gap-2 bg-[#3D4749] hover:bg-accent text-white font-semibold px-8 py-3.5 rounded-full text-sm sm:text-base transition-colors group"
            >
              <span>Explore Polysomnography & Multiple Sleep Latency Testing (MSLT)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Narcolepsy"
        faqs={faqs}
      />

      {/* Clinic NAP Card */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Expert narcolepsy and hypersomnia evaluations in Redlands, CA."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Luke Buxton, DO"
        credentials="Quadruple Board-Certified in Sleep Medicine, Pulmonary Disease, Critical Care & Internal Medicine"
        lastUpdated="November 2026"
        sources={[
          { name: "National Institute of Neurological Disorders and Stroke: Narcolepsy" },
          { name: "Hypersomnia Foundation: Idiopathic Hypersomnia" },
        ]}
      />

      <ServiceCtaBanner
        title="Struggling with Uncontrollable Daytime Sleepiness?"
        subtitle="Schedule an evaluation with our board-certified sleep medicine physicians in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
