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
  Microscope,
  Search,
  Activity,
  Droplets,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export default function AdvancedBronchoscopyPage() {
  const matcherItems = [
    {
      symptom:
        "A suspicious spot or 'peripheral lung nodule' deep in the lung",
      label: "If your CT scan shows:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "Robotic Bronchoscopy or a Lung Biopsy",
      icon: Search,
    },
    {
      symptom: "Enlarged lymph nodes in the center of your chest",
      label: "If your scan shows:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "An EBUS Procedure (Endobronchial Ultrasound)",
      icon: Microscope,
    },
    {
      symptom:
        "Unexplained fluid building up around your lungs (pleural effusion)",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "Ultrasound-Guided Thoracentesis",
      icon: Droplets,
    },
    {
      symptom: "Suspected deep airway infections or severe inflammation",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A Flexible Bronchoscopy with Lavage",
      icon: Activity,
    },
  ];

  const minimallyInvasive = [
    {
      name: "Robotic Bronchoscopy",
      desc: "Uses advanced robotic navigation to help our specialists reach narrow, peripheral airways safely and biopsy suspicious outer lung nodules.",
    },
    {
      name: "Endobronchial Ultrasound (EBUS)",
      desc: "Uses an ultrasound-equipped scope to visualize beyond airway walls and perform needle sampling of mediastinal and hilar lymph nodes without open chest surgery.",
    },
    {
      name: "Flexible Bronchoscopy (with Lavage or Biopsy)",
      desc: "Examines the inside of the airways using a flexible camera. The doctor can wash the area to collect diagnostic fluid (lavage) or take tissue samples.",
    },
  ];

  const biopsyPleural = [
    {
      name: "Bronchoscopy-Guided Lung Biopsy",
      desc: "Collects precise tissue samples of targeted lung lesions from inside the natural airways, usually avoiding external surgical incisions.",
    },
    {
      name: "Ultrasound-Guided Thoracentesis",
      desc: "Uses bedside ultrasound imaging to guide the safe removal of excess pleural fluid, providing rapid relief for shortness of breath and fluid analysis.",
    },
  ];

  const faqs = [
    {
      question: "What does an interventional pulmonologist do?",
      answer:
        "An interventional pulmonologist is a lung specialist with advanced training in minimally invasive airway and pleural procedures. They use specialized tools to diagnose and treat lung nodules, enlarged lymph nodes, and complex airway disorders, often avoiding traditional open chest surgery.",
    },
    {
      question: "Is an EBUS procedure painful?",
      answer:
        "No. Patients are typically given deep sedation or general anesthesia during an EBUS procedure. You will be asleep and comfortable, and you will not feel the biopsy needle or the ultrasound probe.",
    },
    {
      question: "What is a lung nodule specialist?",
      answer:
        "A lung nodule specialist is typically an interventional pulmonologist who focuses on quickly and accurately evaluating 'spots' on the lungs found during CT scans or X-rays. They use advanced biopsies to determine if the nodules are benign (non-cancerous) or malignant.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Interventional Pulmonology"
        title="Advanced Bronchoscopy"
        subtitle="Advanced, minimally invasive diagnostics for lung nodules and airway conditions."
        intro="When facing an abnormal chest X-ray or a complex lung condition, an accurate diagnosis is key. At the Inland Empire Lung & Sleep Institute in Redlands, CA, our interventional pulmonologists use advanced, minimally invasive technology—including robotic bronchoscopy and endobronchial ultrasound (EBUS)—to help evaluate lung nodules, diagnose respiratory conditions, and treat fluid around the lungs without the need for traditional open surgery."
        breadcrumbs={[
          { label: "Diagnostics", href: "/#services" },
          { label: "Advanced Bronchoscopy" },
        ]}
      />

      {/* Symptom / Referral Matcher */}
      <SymptomMatcher
        title="Why Did My Doctor Refer Me Here?"
        subtitle="Your doctor decides which procedure is right for you based on your unique medical history. These examples show what each advanced procedure helps evaluate:"
        items={matcherItems}
      />

      {/* Deep-Dive: EBUS & Biopsy */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                What is an EBUS Procedure?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                An EBUS (Endobronchial Ultrasound) is a minimally invasive outpatient procedure used to help diagnose lung conditions, such as infections, inflammation, and lung cancer.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>How it works:</strong> A pulmonologist inserts a flexible tube equipped with a tiny ultrasound probe down your windpipe.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>What it does:</strong> Allows the doctor to see beyond the airway walls to evaluate and safely sample lymph nodes in the chest center.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>The benefit:</strong> Detailed diagnostic information preventing invasive open surgery.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                How is a Lung Biopsy Done via Bronchoscopy?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                During a bronchoscopy-guided lung biopsy, a specialist uses a lighted tube with a camera to navigate through your natural airways.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Once the target lesion or nodule is located—often assisted by robotic navigation or ultrasound—the doctor passes tiny tools through the tube to collect tissue samples for laboratory pathology testing, avoiding external surgical scars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Procedure Modalities */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Minimally Invasive Technology
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Advanced Interventional Procedures
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bronchoscopy */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-6 pb-3 border-b border-slate-100">
                  Minimally Invasive Bronchoscopy
                </h3>
                <div className="space-y-6">
                  {minimallyInvasive.map((p, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-primary text-base mb-1.5">{p.name}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pleural */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-6 pb-3 border-b border-slate-100">
                  Lung Biopsy & Pleural Procedures
                </h3>
                <div className="space-y-6">
                  {biopsyPleural.map((p, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-primary text-base mb-1.5">{p.name}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-8">
                <Link
                  href="/services/lung-nodules-lung-cancer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-colors"
                >
                  <span>Learn about our clinical care for Lung Nodules & Lung Cancer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Bronchoscopy"
        faqs={faqs}
      />

      {/* Clinic Location Card */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Advanced interventional pulmonary suites in Redlands, CA."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Dual Reviewers */}
      <MedicalReviewer
        reviewer="Dr. Tarik Ngab, MD & Dr. Sahib Grewal, MD"
        credentials="Board-Certified Pulmonologists & Interventional Specialists"
        lastUpdated="October 2026"
      />

      <ServiceCtaBanner
        title="Need a Precise Diagnostic Biopsy?"
        subtitle="Our interventional pulmonologists provide advanced, minimally invasive airway diagnostics in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
