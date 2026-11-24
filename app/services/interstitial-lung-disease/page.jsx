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
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Pill,
  Wind,
  HeartPulse,
} from "lucide-react";

export default function InterstitialLungDiseasePage() {
  const matcherItems = [
    {
      symptom:
        "A chronic, dry, hacking cough and shortness of breath during light activity...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation:
        "A complete Pulmonary Function Test (PFT) to measure your lung capacity.",
      icon: Activity,
    },
    {
      symptom:
        "Your doctor hears a 'crackling' sound in your lungs through a stethoscope...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A High-Resolution Chest CT Scan to look for lung scarring.",
      icon: Stethoscope,
    },
    {
      symptom: "Fatigue and low blood oxygen levels (hypoxia)...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation:
        "A 6-Minute Walk Test and an evaluation for supplemental oxygen.",
      icon: Wind,
    },
  ];

  const symptoms = [
    "A persistent, dry cough",
    "Shortness of breath (especially during exercise or walking)",
    "Extreme tiredness and fatigue",
    "Clubbing (widening and rounding of the tips of the fingers or toes)",
  ];

  const treatments = [
    {
      title: "Anti-fibrotic Medications",
      desc: "Specialized drugs that can help slow down the rate of progressive lung scarring in certain types of pulmonary fibrosis.",
    },
    {
      title: "Corticosteroids & Immunomodulators",
      desc: "Medications used to reduce active inflammation in the interstitial lung tissue.",
    },
    {
      title: "Supplemental Oxygen Therapy",
      desc: "Using home oxygen to help you breathe easier, sleep better, and protect your heart from pulmonary strain.",
    },
    {
      title: "Pulmonary Rehabilitation",
      desc: "A structured program of supervised exercise, education, and breathing techniques to improve your physical stamina.",
    },
  ];

  const faqs = [
    {
      question: "What causes interstitial lung disease?",
      answer:
        "In many cases, the exact cause is never found (idiopathic). However, known causes of ILD include long-term exposure to hazardous materials (like asbestos, silica dust, or bird droppings), certain autoimmune diseases (like Rheumatoid Arthritis or Scleroderma), and the side effects of certain medications or radiation therapy.",
    },
    {
      question: "What does a pulmonary doctor do for ILD?",
      answer:
        "A pulmonologist specializes in the respiratory system. For patients with ILD, pulmonary doctors monitor your lung capacity over time, prescribe specialized medications to slow the scarring, coordinate your oxygen needs, and manage any sudden flare-ups of your symptoms.",
    },
    {
      question: "Are you accepting new patients for ILD management?",
      answer:
        "Yes. If you are searching for interstitial lung disease specialists near me, IE Lung is accepting new patients. We work closely with primary care doctors and rheumatologists across the Inland Empire to ensure you get comprehensive care.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Restrictive Lung Care"
        title="Interstitial Lung Disease (ILD) & Pulmonary Fibrosis"
        subtitle="Specialized respiratory care to help manage chronic lung scarring."
        intro="Interstitial lung disease (ILD) is a complex group of disorders that cause scarring and inflammation in the lungs. Because this lung damage cannot be reversed, finding a specialized lung disease doctor near you is critical to managing your symptoms and slowing the progression of the disease. The board-certified pulmonologists at the Inland Empire Lung & Sleep Institute (IE Lung) provide precise diagnostic testing and personalized care for patients across Redlands, CA."
        breadcrumbs={[
          { label: "Pulmonary Care", href: "/services/pulmonary-care" },
          { label: "Interstitial Lung Disease" },
        ]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="When to See a Pulmonologist for ILD"
        subtitle="Your doctor decides which test is right for you. These examples show what each diagnostic step helps evaluate:"
        items={matcherItems}
      />

      {/* What is ILD & Differences */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Disease Background
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              What is Interstitial Lung Disease?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              Interstitial lung disease (ILD) is a broad medical term used to describe over 200 different ILD lung diseases. These conditions all affect the interstitium—the thin network of tissue that surrounds and supports the tiny air sacs in your lungs.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              When a person has ILD, this tissue becomes inflamed and scarred, making it stiff and preventing oxygen from easily passing into the bloodstream.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                Interstitial Lung Disease vs Pulmonary Fibrosis
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                Patients are often confused about the difference between these two terms:
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>ILD</strong> is the &ldquo;umbrella term&rdquo; for the entire group of diseases.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>Pulmonary fibrosis</strong> refers to the actual scarring process itself. Many types of ILD eventually result in pulmonary fibrosis. One of the most common types is Idiopathic Pulmonary Fibrosis (IPF).</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                Symptoms of ILD Lung Disease
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                The lung damage caused by ILD happens gradually over months or years. Common symptoms include:
              </p>
              <div className="space-y-2.5">
                {symptoms.map((symptom, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-slate-800 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Section */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Management Strategies
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Treatment for Interstitial Lung Disease
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              While the scarring from pulmonary fibrosis cannot be undone, an experienced pulmonologist can help you manage the disease, relieve your symptoms, and improve your daily quality of life. After careful diagnostic imaging and breathing tests, your care plan may include:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {treatments.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="font-bold text-primary text-base mb-2">{item.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/services/pulmonary-function-testing"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-colors"
            >
              <span>Learn about Diffusing Capacity (DLCO) and Lung Volume testing for ILD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About ILD"
        faqs={faqs}
      />

      {/* Clinic NAP Card */}
      <ClinicLocationCard
        title="Find an ILD & Pulmonary Fibrosis Clinic"
        subtitle="Accepting new patients across Redlands, San Bernardino, Riverside, and Beaumont."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Aalok Shah, MD"
        credentials="Board-Certified in Pulmonary & Critical Care Medicine"
        lastUpdated="November 2026"
        sources={[
          { name: "American Lung Association: Interstitial Lung Disease" },
          { name: "National Heart, Lung, and Blood Institute: Pulmonary Fibrosis" },
        ]}
      />

      <ServiceCtaBanner
        title="Need an Interstitial Lung Disease Specialist?"
        subtitle="Our board-certified pulmonologists provide precise diagnostics, specialized anti-fibrotic therapies, and comprehensive oxygen management."
      />

      <Footer />
    </main>
  );
}
