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
  Clock,
  Moon,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Brain,
  Pill,
  Activity,
} from "lucide-react";

export default function InsomniaPage() {
  const matcherItems = [
    {
      symptom:
        "Difficulty falling asleep or staying asleep for at least three nights a week, lasting for three months or more...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation:
        "A clinical evaluation for chronic insomnia and an overnight sleep log.",
      icon: Clock,
    },
    {
      symptom:
        "Waking up frequently in the middle of the night gasping for air, or waking up with a racing heart...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "An In-Lab Sleep Study to rule out Obstructive Sleep Apnea.",
      icon: Moon,
    },
    {
      symptom:
        "An overwhelming urge to move your legs when you try to fall asleep...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "An evaluation for Restless Legs Syndrome (RLS).",
      icon: Sparkles,
    },
  ];

  const causes = [
    "Chronic stress, anxiety, or depression",
    "Poor sleep habits and irregular schedules",
    "Other hidden sleep disorders (such as sleep apnea)",
    "Certain medications or medical conditions (like asthma or heart disease)",
  ];

  const treatments = [
    {
      title: "CBT for Sleep Disorders (CBT-I)",
      desc: "Cognitive Behavioral Therapy for Insomnia is a highly effective, structured program. It helps you identify and replace thoughts and behaviors that cause or worsen sleep problems.",
      icon: Brain,
    },
    {
      title: "Sleep Hygiene Optimization",
      desc: "Guided, practical changes to your daily routine, light exposure, and bedroom environment to promote natural, sustained sleep.",
      icon: Clock,
    },
    {
      title: "Medication Management",
      desc: "When clinically appropriate, carefully managed prescription sleep aids used in combination with behavioral therapies rather than indefinite reliance.",
      icon: Pill,
    },
    {
      title: "Sleep Disorder Testing",
      desc: "If your doctor suspects your insomnia is triggered by nocturnal breathing pauses, they may order a home sleep test or in-lab polysomnography.",
      icon: Activity,
    },
  ];

  const faqs = [
    {
      question: "What is a sleep dr called?",
      answer:
        "A doctor who specializes in sleep is called a Sleep Medicine Specialist or a Pulmonologist. These physicians have advanced, board-certified medical training specifically focused on the science of sleep, sleep disorders, and circadian rhythms.",
    },
    {
      question: "Can you treat insomnia?",
      answer:
        "While there is no instant 'cure,' chronic insomnia can be highly effectively managed and treated. Using therapies like CBT-I and sleep hygiene optimization, specialists can help train your brain and body to achieve restful, consistent sleep again.",
    },
    {
      question: "Where can I find an insomnia treatment near me?",
      answer:
        "The Inland Empire Lung & Sleep Institute offers specialized insomnia evaluations at our clinic located at 245 Terracina Boulevard in Redlands, CA. Our sleep disorder doctors treat patients from across the Inland Empire, including San Bernardino, Riverside, and Beaumont.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Sleep Medicine"
        title="Insomnia Treatment"
        subtitle="Medical expertise to help you restore your rest."
        intro="Occasional sleeplessness is normal, but when you spend week after week staring at the ceiling, it impacts every part of your physical and mental health. Chronic insomnia is a complex medical condition that often requires more than over-the-counter sleep aids. If you are looking for an insomnia clinic near me, the board-certified sleeping disorders specialists at the Inland Empire Lung & Sleep Institute (IE Lung) provide comprehensive evaluations to find the root cause of your sleep loss and create a personalized treatment plan."
        breadcrumbs={[
          { label: "Sleep Medicine", href: "/services/sleep-medicine" },
          { label: "Insomnia" },
        ]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="When Should You See a Sleeplessness Doctor?"
        subtitle="Your doctor decides which evaluation is right for you. These examples show what your next steps may look like if you cannot sleep:"
        emergencyMessage="If you are experiencing severe mental distress, hallucinations from lack of sleep, or a medical emergency, call 911 immediately."
        items={matcherItems}
      />

      {/* Acute vs Chronic Insomnia & Causes */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Diagnostic Classifications
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              What is Severe Insomnia?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Insomnia is a common sleep disorder that makes it hard to fall asleep, hard to stay asleep, or causes you to wake up too early. Doctors classify insomnia into two main categories:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-primary text-lg mb-2">Acute Insomnia</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Short-term sleep loss that lasts for a few days or weeks, usually caused by a specific stressor (like a new job, illness, or a difficult life event).
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-primary text-lg mb-2">Severe / Chronic Insomnia</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Long-term sleep loss that occurs three or more nights a week and lasts for more than three months. Because this takes a heavy toll on your body, it requires an insomnia specialist to properly manage.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-4">Common Causes of Insomnia</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Insomnia is often a symptom of another underlying psychological, behavioral, or medical issue:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {causes.map((cause, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-slate-800 text-sm font-medium">{cause}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How is Insomnia Treated */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Root-Cause Therapies
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              How is Insomnia Treated?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Treating insomnia requires a personalized approach. Rather than simply relying on long-term medications, a sleep doctor focuses on treating the root cause of your sleep loss. Depending on your medical history, your treatment plan may include:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

          <div className="text-center">
            <Link
              href="/services/sleep-studies-diagnostics"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-colors"
            >
              <span>Learn how overnight sleep testing can identify hidden sleep disorders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Insomnia"
        faqs={faqs}
      />

      {/* Clinic NAP Card */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Comprehensive insomnia evaluations in Redlands, CA."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Roger Seheult, MD"
        credentials="Board-Certified in Sleep Medicine, Pulmonology, Critical Care & Internal Medicine"
        lastUpdated="November 2026"
        sources={[
          { name: "National Heart, Lung, and Blood Institute: Insomnia" },
          { name: "Centers for Disease Control and Prevention: Sleep and Sleep Disorders" },
        ]}
      />

      <ServiceCtaBanner
        title="Ready to Sleep Through the Night?"
        subtitle="Schedule an evaluation with our board-certified sleep medicine physicians in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
