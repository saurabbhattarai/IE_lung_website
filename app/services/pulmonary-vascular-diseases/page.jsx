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
  HeartPulse,
  Activity,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Zap,
} from "lucide-react";

export default function PulmonaryVascularDiseasesPage() {
  const matcherItems = [
    {
      symptom:
        "Severe shortness of breath, unexplained fainting, and your doctor suspects Pulmonary Hypertension",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "Right-Heart Catheterization",
      icon: HeartPulse,
    },
    {
      symptom:
        "Sudden chest pain or shortness of breath, and your doctor suspects a blood clot in the lung (Pulmonary Embolism)",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "CT Pulmonary Angiography (CTPA)",
      icon: Search,
    },
  ];

  const invasiveDiagnostics = [
    {
      name: "Right-Heart Catheterization",
      desc: "Measures pulmonary artery pressures, cardiac output, and pulmonary vascular resistance to evaluate conditions like pulmonary hypertension.",
    },
    {
      name: "Acute Vasoreactivity Testing",
      desc: "A specialized test performed during a right-heart catheterization. It checks how your pulmonary blood vessels respond to certain medications, which helps your doctor select the right targeted treatment for Pulmonary Arterial Hypertension (PAH).",
    },
  ];

  const nonInvasive = [
    {
      name: "CT Pulmonary Angiography (CTPA) Interpretation",
      desc: "Evaluates the pulmonary arteries with intravenous contrast imaging to check for acute or chronic thromboembolic disease (blood clots).",
    },
  ];

  const faqs = [
    {
      question: "How serious is a right heart catheterization?",
      answer:
        "While a right heart catheterization is an invasive procedure, it is a common test performed by experienced pulmonary cardiologists and interventional pulmonologists. You will be awake during the test but given mild medication to help you relax and ensure your comfort.",
    },
    {
      question: "Why do I need to see a pulmonary hypertension specialist?",
      answer:
        "Pulmonary Hypertension (PAH) is a complex condition where high blood pressure affects the arteries in your lungs and the right side of your heart. It requires highly specialized care, advanced diagnostic interpretation, and targeted treatments that standard clinics often do not provide.",
    },
    {
      question: "Is a CT Pulmonary Angiography safe?",
      answer:
        "Yes, a CTPA is a standard and safe imaging test. It is the most effective way for pulmonologists to quickly and accurately detect dangerous blood clots in the lungs. Our team will review your medical history beforehand to ensure you can safely process the contrast dye used during the scan.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Cardiopulmonary Diagnostics"
        title="Pulmonary Vascular & Cardiac Evaluation in Redlands, CA"
        subtitle="Advanced diagnostics for pulmonary hypertension and cardiopulmonary health."
        intro="Pulmonary vascular and cardiac tests evaluate the complex connection between your heart and lungs. If you have severe shortness of breath, irregular heartbeats, or a suspected blood clot in your lungs, these specialized tests help your doctor find the underlying cause. At Inland Empire Lung & Sleep Institute, our pulmonary hypertension specialists provide the testing required to guide your care. Request an appointment to get started."
        breadcrumbs={[
          { label: "Diagnostics", href: "/#services" },
          { label: "Pulmonary Vascular & Cardiac" },
        ]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="Which Heart & Lung Test Do I Need?"
        subtitle="Your doctor decides which test is right for you. These examples show what each diagnostic test helps evaluate:"
        items={matcherItems}
      />

      {/* Deep-Dive: RHC & CTPA */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                What is a Right Heart Catheterization?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                A Right Heart Catheterization is a diagnostic procedure used to help diagnose and measure the severity of pulmonary hypertension (high blood pressure in the lungs).
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>How it works:</strong> A specially trained doctor guides a thin, flexible catheter through a vein in your neck, arm, or groin into the right side of the heart and pulmonary artery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>What it measures:</strong> Directly measures blood pressure inside the heart and lungs, cardiac output, and pulmonary vascular resistance.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                What is a CT Pulmonary Angiography?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                A CT Pulmonary Angiography (CTPA) is a specific type of medical imaging test used to look for pulmonary embolisms (blood clots in the arteries of your lungs).
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>How it works:</strong> Contrast material is injected into your bloodstream while a CT scanner takes cross-sectional chest images.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>What it shows:</strong> Highlights pulmonary arteries so the specialist can see if a clot is blocking lung blood flow.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Invasive & Non-Invasive Modalities */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Specialized Vascular Suites
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Diagnostic Testing Modalities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-6 pb-3 border-b border-slate-100">
                  Invasive Pulmonary Vascular Diagnostics
                </h3>
                <div className="space-y-6">
                  {invasiveDiagnostics.map((d, i) => (
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
                  Non-Invasive Vascular Imaging
                </h3>
                <div className="space-y-6">
                  {nonInvasive.map((d, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-primary text-base mb-1.5">{d.name}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-8">
                <Link
                  href="/services/pulmonary-hypertension"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-colors"
                >
                  <span>Learn about our clinical management for Pulmonary Hypertension (PAH)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Vascular & Cardiac Testing"
        faqs={faqs}
      />

      {/* Clinic Location Card */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Specialized pulmonary vascular diagnostics in Redlands, CA."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Paresh C. Giri, MD"
        credentials="Board-Certified Pulmonologist & Director of Pulmonary Hypertension Care"
        lastUpdated="October 2026"
      />

      <ServiceCtaBanner
        title="Need a Right-Heart Catheterization or CTPA?"
        subtitle="Our pulmonary vascular specialists provide comprehensive cardiopulmonary diagnostics in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
