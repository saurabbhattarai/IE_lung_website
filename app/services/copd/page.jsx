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
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
} from "lucide-react";

export default function CopdPage() {
  const matcherItems = [
    {
      symptom: "A lasting, daily cough that brings up mucus (phlegm)...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "An evaluation for chronic bronchitis and a lung function test.",
      icon: Wind,
    },
    {
      symptom: "Shortness of breath that gets worse during physical activity…",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A complete Pulmonary Function Test (PFT) and chest imaging.",
      icon: Activity,
    },
    {
      symptom: "Fatigue and low oxygen levels during the day or night…",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A 6-minute walk test and a home oxygen evaluation.",
      icon: HeartPulse,
    },
  ];

  const treatments = [
    {
      title: "Bronchodilator Inhalers",
      desc: "Medications that help relax the muscles around your airways to make breathing easier and improve airflow.",
    },
    {
      title: "Inhaled Steroids",
      desc: "Medications to reduce airway inflammation and prevent severe flare-ups (exacerbations).",
    },
    {
      title: "Supplemental Oxygen Therapy",
      desc: "If your blood oxygen levels are low, oxygen therapy can help protect your heart, brain, and vital organs.",
    },
    {
      title: "Pulmonary Rehabilitation",
      desc: "A specialized program that combines exercise training, education, and breathing techniques to improve your daily stamina.",
    },
  ];

  const faqs = [
    {
      question: "What is the difference between COPD and emphysema?",
      answer:
        "COPD is a broad, umbrella term for progressive lung diseases that restrict airflow. Emphysema is one specific type of disease that falls under the COPD umbrella. Therefore, if you have emphysema, you have COPD.",
    },
    {
      question: "Which is worse: COPD or emphysema?",
      answer:
        "Because emphysema is a form of COPD, one is not necessarily worse than the other. The severity of your condition depends on how much lung damage has occurred and your current lung capacity, which is why seeing a COPD specialist for testing is so important.",
    },
    {
      question: "Can you reverse COPD and emphysema?",
      answer:
        "No, you cannot reverse COPD or emphysema. The physical damage to your lungs and air sacs is permanent. However, finding the best COPD doctors near you and starting treatment early can help manage symptoms, slow the disease from getting worse, and improve your daily quality of life.",
    },
    {
      question: "Can a pulmonologist help with COPD?",
      answer:
        "Yes. A pulmonologist is a medical doctor who specializes in the respiratory system. They are the most qualified specialists to diagnose COPD, prescribe advanced inhaler therapies, and order home oxygen equipment.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Pulmonary Care"
        title="COPD & Emphysema Care"
        subtitle="Expert respiratory care to help you manage your breathing."
        intro="Chronic Obstructive Pulmonary Disease (COPD) makes breathing difficult over time. While lung damage cannot be cured, finding the right COPD specialist can help you control your symptoms, reduce flare-ups, and stay active. If you are searching for experienced pulmonary doctors near me, the board-certified pulmonologists at the Inland Empire Lung & Sleep Institute (IE Lung) are here to provide clear answers and a personalized treatment plan."
        breadcrumbs={[
          { label: "Pulmonary Care", href: "/services/pulmonary-care" },
          { label: "COPD" },
        ]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="When to See a Pulmonologist for COPD?"
        subtitle="Your doctor can help determine if your breathing problems are caused by COPD or another lung condition. Match your symptoms below to see what evaluation you may need:"
        items={matcherItems}
      />

      {/* Understanding COPD */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Disease Anatomy
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              Understanding COPD, Emphysema, and Chronic Bronchitis
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              COPD is an &ldquo;umbrella term.&rdquo; It refers to a group of lung diseases that block airflow and make it hard to breathe. The two most common conditions that make up COPD are Emphysema and Chronic Bronchitis. Many patients have a mix of both.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                What is Emphysema?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Emphysema damages the tiny air sacs (alveoli) at the very bottom of your lungs. Over time, the inner walls of these air sacs weaken and break, creating larger air spaces instead of many small ones. This traps old air in your lungs and makes it hard for fresh oxygen to enter your bloodstream.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                What is Chronic Bronchitis?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Chronic bronchitis causes constant inflammation in the lining of your bronchial tubes (the airways that carry air to and from your lungs). This ongoing irritation produces thick mucus, which leads to a daily, heavy cough and narrows your airways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Treat COPD */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Evidence-Based Therapy
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              How to Treat Chronic Bronchitis & Emphysema (COPD)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              To properly manage COPD, you need an accurate diagnosis. At IE Lung, our specialists use advanced pulmonary function testing (PFTs) and chest imaging to measure your airflow and see the exact condition of your lungs. Once diagnosed, your COPD doctor will build a care plan that may include:
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

          {/* Diagnostic Cross-Link */}
          <div className="text-center">
            <Link
              href="/services/pulmonary-function-testing"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-colors"
            >
              <span>Explore complete Pulmonary Function Testing (PFTs) for COPD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About COPD"
        faqs={faqs}
      />

      {/* Clinic NAP Card */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Serving San Bernardino, Riverside, Beaumont, and Redlands."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Paresh C. Giri, MD"
        credentials="Board-Certified in Pulmonary & Critical Care Medicine"
        lastUpdated="November 2026"
        sources={[
          {
            name: "CDC: Basics About COPD",
            url: "https://www.cdc.gov/copd/about/index.html",
          },
          {
            name: "American Lung Association: COPD",
            url: "https://www.lung.org/lung-health-diseases/lung-disease-lookup/copd",
          },
        ]}
      />

      <ServiceCtaBanner
        title="Looking for an Experienced COPD Doctor?"
        subtitle="Our board-certified pulmonologists provide comprehensive testing and personalized management plans in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
