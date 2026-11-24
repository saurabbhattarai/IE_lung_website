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
  HeartPulse,
  Activity,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Microscope,
} from "lucide-react";

export default function PulmonaryCarePage() {
  const matcherItems = [
    {
      symptom:
        "A chronic cough, wheezing, and a tight chest that comes and goes...",
      label: "If you experience:",
      actionLabel: "Your doctor may evaluate you for:",
      evaluation: "Asthma or COPD",
      icon: Wind,
    },
    {
      symptom:
        "Severe shortness of breath, unexplained fainting, or swelling in your legs...",
      label: "If you experience:",
      actionLabel: "Your doctor may evaluate you for:",
      evaluation: "Pulmonary Hypertension",
      icon: HeartPulse,
    },
    {
      symptom:
        "A progressive, dry cough and shortness of breath that slowly gets worse over months...",
      label: "If you experience:",
      actionLabel: "Your doctor may evaluate you for:",
      evaluation: "Interstitial Lung Disease (ILD) or Pulmonary Fibrosis",
      icon: Activity,
    },
    {
      symptom:
        "You were told you have a 'spot' or nodule on a recent chest X-ray or CT scan...",
      label: "If you experience:",
      actionLabel: "Your doctor may evaluate you for:",
      evaluation: "Lung Nodules or Lung Cancer",
      icon: Search,
    },
  ];

  const warningSigns = [
    "A cough that lasts longer than eight weeks (chronic cough).",
    "Shortness of breath during simple, everyday activities.",
    "Difficulty breathing that forces you to sleep propped up on pillows.",
    "Coughing up blood or colored mucus.",
    "Unexplained weight loss accompanied by breathing issues.",
    "A history of heavy smoking and a need for lung cancer screening.",
  ];

  const conditionCards = [
    {
      title: "Asthma & COPD Management",
      description:
        "Asthma and Chronic Obstructive Pulmonary Disease (COPD) are common obstructive lung diseases that make it difficult to empty air out of your lungs. Our specialists provide comprehensive lung function testing (PFTs) and personalized inhaler and medication plans to help keep your airways open and prevent flare-ups.",
      links: [
        { label: "Explore Asthma Care", href: "/services/asthma" },
        { label: "Explore COPD & Emphysema", href: "/services/copd" },
      ],
      icon: Wind,
    },
    {
      title: "Pulmonary Hypertension Care",
      description:
        "Pulmonary Hypertension (PAH) is a complex condition involving high blood pressure in the lungs and the right side of the heart. IE Lung is home to nationally recognized PAH specialists who provide advanced cardiovascular diagnostics and highly targeted therapies that standard clinics often cannot provide.",
      links: [
        {
          label: "Learn About Pulmonary Hypertension",
          href: "/services/pulmonary-hypertension",
        },
      ],
      icon: HeartPulse,
    },
    {
      title: "Interstitial Lung Disease (ILD) & Pulmonary Fibrosis",
      description:
        "ILD refers to a group of disorders that cause progressive scarring (fibrosis) of the lung tissue, making it hard for oxygen to enter the bloodstream. We utilize high-resolution imaging and specialized lung tests to manage these restrictive lung diseases.",
      links: [
        {
          label: "Learn About ILD Care",
          href: "/services/interstitial-lung-disease",
        },
      ],
      icon: Activity,
    },
    {
      title: "Lung Cancer & Lung Nodules",
      description:
        "If your doctor finds an abnormal spot on a chest scan, fast and accurate evaluation is critical. Our interventional pulmonologists use minimally invasive technology, such as robotic bronchoscopy and endobronchial ultrasound (EBUS), to safely biopsy lung nodules and assist in lung cancer staging.",
      links: [
        {
          label: "Learn About Lung Nodule Evaluation",
          href: "/services/lung-nodules-lung-cancer",
        },
      ],
      icon: Search,
    },
  ];

  const faqs = [
    {
      question: "What does a pulmonologist do?",
      answer:
        "A pulmonologist is a medical doctor who specializes in the respiratory system. They diagnose and treat diseases of the lungs, airways, and respiratory muscles, ranging from asthma and COPD to lung cancer and pulmonary hypertension.",
    },
    {
      question: "What is the difference between Asthma and COPD?",
      answer:
        "While both conditions cause shortness of breath and wheezing, asthma is typically characterized by reversible airway inflammation that often begins in childhood or is triggered by allergies. COPD (which includes emphysema and chronic bronchitis) is a progressive disease, usually caused by long-term exposure to irritants like cigarette smoke, and is largely irreversible.",
    },
    {
      question: "Do pulmonologists perform surgery?",
      answer:
        "General pulmonologists do not perform open chest surgery (that is done by a thoracic surgeon). However, our interventional pulmonologists do perform advanced, minimally invasive procedures—such as bronchoscopies and lung biopsies—from the inside of your airways without making external surgical incisions.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      {/* Hero */}
      <ServiceHero
        category="Comprehensive Care"
        title="Pulmonary & Respiratory Care"
        subtitle="Expert, board-certified specialists for all your lung health needs."
        intro={[
          "Breathing should be effortless. When it isn't, everyday activities like walking, working, or playing with your children can feel overwhelming. If you are living with a chronic cough, chest tightness, or unexplained shortness of breath, our team is here to help.",
          "At the Inland Empire Lung & Sleep Institute in Redlands, CA, our board-certified pulmonologists specialize in diagnosing and managing complex respiratory diseases. Whether you need a customized asthma action plan, management for severe COPD, or advanced care for pulmonary hypertension, our lung doctors provide science-driven, patient-centered care to help you breathe easier.",
        ]}
        breadcrumbs={[{ label: "Pulmonary Care" }]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="Do I Have a Lung Condition?"
        subtitle="Your doctor can determine the exact cause of your breathing problems. Match your symptoms below to see which respiratory condition you may be experiencing:"
        items={matcherItems}
      />

      {/* Signs You Need to See a Pulmonologist */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Clinical Indications
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Signs You Need to See a Pulmonologist
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Many respiratory issues are initially treated by a primary care physician. However, you should consider booking a consultation with a specialized lung doctor if you experience:
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

      {/* Specialized Conditions Section */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Specialized Care
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Conditions We Treat
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Explore our comprehensive clinical programs designed to diagnose, stabilize, and manage chronic respiratory illnesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                      {card.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                    {card.links.map((link, lIndex) => (
                      <Link
                        key={lIndex}
                        href={link.href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-primary transition-colors"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnostic Bridge Button */}
          <div className="mt-14 text-center">
            <Link
              href="/services/pulmonary-function-testing"
              className="inline-flex items-center gap-2 bg-[#3D4749] hover:bg-accent text-white font-semibold px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all text-sm sm:text-base group"
            >
              <span>Learn About Our Pulmonary Diagnostics & Testing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Pulmonary Care"
        faqs={faqs}
      />

      {/* Clinic NAP Card */}
      <ClinicLocationCard />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Paresh C. Giri, MD"
        credentials="Board-Certified Pulmonologist & Critical Care Specialist"
        lastUpdated="October 2026"
      />

      {/* CTA Banner */}
      <ServiceCtaBanner
        title="Ready to Breathe Easier?"
        subtitle="Our board-certified pulmonologists are accepting new patients in Redlands, CA. Schedule your evaluation today."
      />

      <Footer />
    </main>
  );
}
