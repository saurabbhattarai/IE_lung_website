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
  Search,
  Activity,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Microscope,
  Users,
} from "lucide-react";

export default function LungNodulesCancerPage() {
  const matcherItems = [
    {
      symptom: "A very small, stable spot on your lung...",
      label: "If your CT scan shows:",
      actionLabel: "Your doctor may recommend:",
      evaluation:
        "A 'watch and wait' approach, scheduling another CT scan in a few months to check for changes.",
      icon: Search,
    },
    {
      symptom: "A growing, large, or suspicious nodule...",
      label: "If your CT scan shows:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A minimally invasive lung biopsy to test the tissue.",
      icon: Microscope,
    },
    {
      symptom:
        "You have a long history of heavy smoking but currently have no symptoms...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A Low-Dose CT Lung Cancer Screening.",
      icon: Activity,
    },
  ];

  const faqs = [
    {
      question: "Are all nodules in the lungs cancer?",
      answer:
        "No. In fact, the vast majority of lung nodules are benign (not cancer). They are frequently caused by old respiratory infections, fungal infections (like Valley Fever), or normal lung scarring.",
    },
    {
      question: "What does a lung nodule specialist do?",
      answer:
        "A lung nodule specialist is typically a pulmonologist who has advanced training in reviewing chest imaging and performing biopsies. They carefully track the size, shape, and growth rate of a nodule over time to determine if it is harmless or requires treatment.",
    },
    {
      question: "Where can I find a lung cancer doctor near me?",
      answer:
        "IE Lung provides expert pulmonary evaluations for lung nodules and lung cancer right here in Redlands, CA. If your diagnosis requires surgery or chemotherapy, our doctors will refer you to the best lung cancer specialists and oncologists in the Inland Empire to continue your treatment.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Interventional Pulmonology"
        title="Lung Nodule & Lung Cancer"
        subtitle="Careful evaluation and expert diagnostics for abnormal chest scans."
        intro="Finding out you have a 'spot' on your lung can be frightening. However, most lung spots are not cancer. Whether you need a second opinion on a recent scan or are looking for an experienced lung cancer doctor, the board-certified pulmonologists at the Inland Empire Lung & Sleep Institute (IE Lung) are here to help. We provide careful monitoring, advanced biopsies, and compassionate respiratory care in Redlands, CA."
        breadcrumbs={[
          { label: "Pulmonary Care", href: "/services/pulmonary-care" },
          { label: "Lung Nodules & Cancer" },
        ]}
      />

      {/* Symptom / Referral Matcher */}
      <SymptomMatcher
        title="Why Was I Referred to a Lung Nodule Specialist?"
        subtitle="Your doctor decides which test or procedure is right for you based on your unique scan results. These examples show what your next steps may look like:"
        emergencyMessage="If you are coughing up blood, have severe chest pain, or cannot catch your breath, call 911 or go to the nearest emergency room immediately."
        items={matcherItems}
      />

      {/* What is a Lung Nodule & Biopsy methods */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Diagnostic Clarity
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              What is a Lung Nodule?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              A lung nodule (also called a pulmonary nodule) is a small, round growth or &ldquo;spot&rdquo; in the lungs. They are usually less than 3 centimeters (about 1.2 inches) in diameter.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Most nodules in the lungs are benign (non-cancerous). They are often the result of past lung infections, scar tissue, or inflammation. It is very common for a doctor to find CT scan lung nodules by accident when you are getting a chest scan for a completely different reason, such as a heart check-up or an ER visit.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">
              How is a Lung Biopsy Done?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              If a pulmonary nodule looks suspicious, your pulmonologist may order a biopsy to test the tissue. At IE Lung, our interventional pulmonologists use advanced, minimally invasive techniques rather than open surgery:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-primary text-base mb-2">
                  Robotic Bronchoscopy
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A lighted, flexible tube is passed through your natural airways to safely reach and sample the nodule from the inside without external incisions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-primary text-base mb-2">
                  Needle Lung Biopsy
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Guided by ultrasound or CT imaging, a tiny needle is used to collect a precise tissue sample safely.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/services/advanced-bronchoscopy"
                className="inline-flex items-center gap-2 bg-[#3D4749] hover:bg-accent text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition-colors group"
              >
                <span>Learn more about our Advanced Bronchoscopy & Biopsy Procedures</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Multidisciplinary Care Team */}
      <section className="py-16 md:py-20 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Comprehensive Network
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              Your Care Team: Pulmonologists, Oncologists & Surgeons
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              If a pulmonary nodule is diagnosed as lung cancer, treating it requires a team approach. Your pulmonologist at IE Lung acts as a core part of your cancer care team. While we handle the initial diagnostics, staging, and management of your breathing symptoms, we work closely with other specialists to ensure you receive complete care. We routinely coordinate with:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-primary text-base mb-1">
                  Thoracic Surgeons
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Specialized lung cancer surgeons who perform targeted tumor resections and minimally invasive surgeries.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-primary text-base mb-1">
                  Medical & Radiation Oncologists
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Physicians providing systemic treatments like immunotherapy, targeted drug therapy, chemotherapy, or localized radiation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Lung Nodules & Cancer"
        faqs={faqs}
      />

      {/* Clinic Location Card */}
      <ClinicLocationCard
        title="Book a Lung Nodule Evaluation"
        subtitle="Providing prompt, accurate diagnostic evaluations in Redlands, CA."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Tarik Ngab, MD"
        credentials="Board-Certified Pulmonologist & Interventional Specialist"
        lastUpdated="November 2026"
        sources={[
          { name: "American Lung Association: Lung Nodules" },
          { name: "American Cancer Society: Lung Cancer" },
        ]}
      />

      <ServiceCtaBanner
        title="Need an Expert Evaluation for a Lung Spot?"
        subtitle="Our interventional pulmonologists provide fast, minimally invasive diagnostics and biopsies in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
