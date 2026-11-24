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
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function SleepMedicinePage() {
  const matcherItems = [
    {
      symptom:
        "Loud snoring, waking up gasping for air, or your partner says you stop breathing at night...",
      label: "If you experience:",
      actionLabel: "Your doctor may evaluate you for:",
      evaluation: "Obstructive Sleep Apnea (OSA)",
      icon: Moon,
    },
    {
      symptom:
        "Trouble falling asleep, waking up frequently during the night, or waking up too early...",
      label: "If you experience:",
      actionLabel: "Your doctor may evaluate you for:",
      evaluation: "Insomnia",
      icon: Clock,
    },
    {
      symptom:
        "Severe, uncontrollable daytime sleepiness or sudden muscle weakness when you laugh or are surprised...",
      label: "If you experience:",
      actionLabel: "Your doctor may evaluate you for:",
      evaluation: "Narcolepsy",
      icon: Zap,
    },
    {
      symptom:
        "An irresistible urge to move your legs while lying in bed, often with a crawling sensation...",
      label: "If you experience:",
      actionLabel: "Your doctor may evaluate you for:",
      evaluation: "Restless Legs Syndrome (RLS)",
      icon: Sparkles,
    },
  ];

  const warningSigns = [
    "Chronic morning headaches or a dry mouth upon waking.",
    "'Brain fog,' difficulty concentrating, or memory issues during the day.",
    "Unexplained high blood pressure (which is strongly linked to untreated sleep apnea).",
    "Taking more than 30 minutes to fall asleep night after night.",
    "Waking up feeling unrefreshed, even after 7 to 8 hours of sleep.",
  ];

  const conditionCards = [
    {
      title: "Obstructive Sleep Apnea (OSA) & CPAP Therapy",
      description:
        "Sleep apnea occurs when the muscles in the back of your throat relax too much, causing your airway to collapse and temporarily stop your breathing. Our sleep doctors specialize in comprehensive sleep apnea care, including diagnostic sleep studies, CPAP (Continuous Positive Airway Pressure) therapy management, and evaluating alternative breathing devices.",
      link: {
        label: "Learn About Sleep Apnea & CPAP Care",
        href: "/services/obstructive-sleep-apnea",
      },
      icon: Moon,
    },
    {
      title: "Insomnia Management",
      description:
        "Insomnia is one of the most common sleep disorders, making it difficult to fall asleep, stay asleep, or get high-quality rest. Rather than just relying on sleeping pills, our sleep specialists work with you to identify underlying medical causes, evaluate your sleep hygiene, and develop targeted sleep disorder therapies.",
      link: {
        label: "Learn About Insomnia Treatment",
        href: "/services/insomnia",
      },
      icon: Clock,
    },
    {
      title: "Narcolepsy & Hypersomnia",
      description:
        "Narcolepsy is a complex neurological sleep disease that affects the brain's ability to control sleep-wake cycles, leading to extreme, sudden daytime sleepiness. Our clinic offers specialized daytime testing (such as the MSLT) and advanced medical management for narcolepsy patients.",
      link: {
        label: "Learn About Narcolepsy & Hypersomnia",
        href: "/services/narcolepsy-hypersomnia",
      },
      icon: Zap,
    },
  ];

  const faqs = [
    {
      question: "What kind of doctor deals with sleep apnea?",
      answer:
        "To treat sleep apnea, you should see a board-certified Sleep Medicine Specialist. These specialists are often pulmonologists or neurologists who have completed additional, highly advanced medical fellowship training specifically in sleep disorders.",
    },
    {
      question: "How do you cure sleep apnea?",
      answer:
        "While obstructive sleep apnea is typically a chronic condition, there are highly effective sleep apnea treatments available. The most common and effective treatment is CPAP therapy. Other treatments include weight management, oral appliances (specialized mouthguards), or FDA-approved hypoglossal nerve stimulator implants.",
    },
    {
      question: "What is a CPAP machine?",
      answer:
        "CPAP stands for Continuous Positive Airway Pressure. It is a specialized medical device used to treat sleep apnea. It delivers a gentle, steady stream of air through a mask while you sleep, which keeps your airway open and prevents dangerous breathing pauses.",
    },
    {
      question: "Are there different types of sleep disorders?",
      answer:
        "Yes, there are over 80 different types of sleep disorders. The most common categories include breathing-related sleep disorders (like sleep apnea), insomnias (trouble sleeping), hypersomnias (excessive sleepiness like narcolepsy), and circadian rhythm disorders (issues with your internal body clock).",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      {/* Hero */}
      <ServiceHero
        category="Sleep Health & Rest"
        title="Sleep Medicine & Disorders Clinic"
        subtitle="Expert, board-certified care for sleep apnea, insomnia, and narcolepsy."
        intro={[
          "Quality sleep is not a luxury; it is a vital medical necessity that protects your heart, brain, and immune system. If you are struggling with chronic exhaustion, loud snoring, or sleepless nights, it can impact every aspect of your life—from your work performance to your family relationships.",
          "At the Inland Empire Lung & Sleep Institute in Redlands, CA, our board-certified sleep medicine doctors specialize in diagnosing and managing a wide range of common sleep disorders. Because our sleep doctors are also trained pulmonologists, we deeply understand the complex relationship between your airway, your lungs, and your sleep quality. From advanced CPAP therapy to narcolepsy management, we are here to help you restore your rest and your health.",
        ]}
        breadcrumbs={[{ label: "Sleep Medicine" }]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="Do I Have a Sleep Disorder?"
        subtitle="Your doctor can determine the exact cause of your sleep problems. Match your symptoms below to see which common sleep condition you may be experiencing:"
        emergencyMessage="If you fall asleep uncontrollably while driving or operating machinery, seek medical help immediately."
        items={matcherItems}
      />

      {/* Signs You Need to See a Sleep Doctor */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Clinical Signs
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Signs You Need to See a Sleep Doctor
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Many patients live with untreated sleep diseases for years, assuming that feeling tired is just a normal part of aging or a busy lifestyle. You should consider booking a consultation with a sleep specialist doctor if you experience:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {warningSigns.map((sign, index) => (
              <div
                key={index}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80"
              >
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-slate-800 font-medium">
                  {sign}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions We Treat */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Comprehensive Care
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Sleep Disorders We Treat
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              From chronic snoring to daytime exhaustion, our sleep center provides precise clinical evaluations and evidence-based therapies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {conditionCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {card.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href={card.link.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-primary transition-colors"
                    >
                      <span>{card.link.label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnostic Bridge Button */}
          <div className="mt-14 text-center">
            <Link
              href="/services/sleep-studies-diagnostics"
              className="inline-flex items-center gap-2 bg-[#3D4749] hover:bg-accent text-white font-semibold px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all text-sm sm:text-base group"
            >
              <span>Learn About Our Sleep Diagnostics & Testing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Sleep Medicine"
        faqs={faqs}
      />

      {/* Clinic NAP Card */}
      <ClinicLocationCard />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Roger Seheult, MD"
        credentials="Board-Certified in Sleep Medicine & Pulmonology"
        lastUpdated="October 2026"
      />

      {/* CTA Banner */}
      <ServiceCtaBanner
        title="Ready to Restore Your Rest?"
        subtitle="Schedule a comprehensive sleep consultation with our board-certified sleep physicians in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
