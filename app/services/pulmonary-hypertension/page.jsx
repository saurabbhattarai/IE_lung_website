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
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Pill,
  Droplets,
  Wind,
} from "lucide-react";

export default function PulmonaryHypertensionPage() {
  const matcherItems = [
    {
      symptom:
        "Shortness of breath during routine activities, swelling in your ankles, and dizziness...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "An Echocardiogram to check your heart structure.",
      icon: HeartPulse,
    },
    {
      symptom:
        "Your doctor suspects high pressure in your lungs based on an ultrasound...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A Right-Heart Catheterization to measure exact pressures.",
      icon: Activity,
    },
    {
      symptom:
        "Shortness of breath that started after you had a blood clot in your leg or lung...",
      label: "If you experience:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A V/Q Scan to check for chronic blood clots.",
      icon: Stethoscope,
    },
  ];

  const treatments = [
    {
      title: "Targeted PAH Medications",
      desc: "Advanced oral, inhaled, or IV medications that help open narrowed blood vessels in the lungs.",
      icon: Pill,
    },
    {
      title: "Blood Thinners for Pulmonary Hypertension",
      desc: "Medications (anticoagulants) to help prevent blood clots from forming in the lungs.",
      icon: HeartPulse,
    },
    {
      title: "Diuretics (Water Pills)",
      desc: "Medications that help remove extra fluid from your body, reducing swelling in your legs and lowering the workload on your heart.",
      icon: Droplets,
    },
    {
      title: "Supplemental Oxygen Therapy",
      desc: "To help increase oxygen levels in your blood, especially during sleep or physical exercise.",
      icon: Wind,
    },
  ];

  const faqs = [
    {
      question: "What type of doctor treats pulmonary hypertension?",
      answer:
        "Pulmonary hypertension is typically treated by a pulmonologist (a lung specialist) or a cardiologist (a heart specialist) who has specific, advanced training in pulmonary vascular disease. At IE Lung, our specialists have led nationally recognized pulmonary hypertension programs.",
    },
    {
      question:
        "What is Chronic Thromboembolic Pulmonary Hypertension (CTEPH)?",
      answer:
        "CTEPH is a specific type of pulmonary hypertension caused by old blood clots in the lungs that never fully dissolved. These clots leave behind scar tissue that blocks blood flow. It is one of the only types of pulmonary hypertension that can potentially be treated with surgery.",
    },
    {
      question: "Where can I find a pulmonary hypertension specialist near me?",
      answer:
        "The Inland Empire Lung & Sleep Institute is located at 245 Terracina Boulevard in Redlands, CA. We provide specialized PAH care for patients across the Inland Empire, including San Bernardino, Riverside, and Beaumont.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Pulmonary Vascular Care"
        title="Pulmonary Hypertension"
        subtitle="Nationally recognized expertise for complex heart and lung conditions."
        intro="Pulmonary hypertension (PH) is a complex condition that requires highly specialized care. If you are experiencing unexplained shortness of breath, chest pressure, or fatigue, you need an expert who understands the intricate connection between your heart and lungs. At the Inland Empire Lung & Sleep Institute (IE Lung) in Redlands, CA, our board-certified pulmonologists are recognized leaders in the diagnosis and management of pulmonary vascular disease."
        breadcrumbs={[
          { label: "Pulmonary Care", href: "/services/pulmonary-care" },
          { label: "Pulmonary Hypertension" },
        ]}
      />

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="When Should You See a Pulmonary Hypertension Doctor?"
        subtitle="Because pulmonary hypertension symptoms are often similar to other lung diseases, getting the right test is critical. Your doctor decides which test is right for you. These examples show what each test helps evaluate:"
        items={matcherItems}
      />

      {/* What is PH & PAH */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                What is Pulmonary Hypertension?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                Pulmonary Hypertension (PH) is a type of high blood pressure that specifically affects the arteries in your lungs and the right side of your heart.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                In a healthy body, blood flows easily through the lungs to pick up oxygen. When a patient has PH, the blood vessels in the lungs become narrowed, blocked, or destroyed. This makes it much harder for blood to flow through, causing blood pressure inside the lungs to rise and forcing the heart to work much harder.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                What is PAH (Pulmonary Arterial Hypertension)?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                PAH is a specific, rare type of pulmonary hypertension. It occurs when the walls of the pulmonary arteries become thick and stiff, narrowing the space for blood to flow.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                If you are looking for a PAH specialist, our team has the advanced training required to manage this specific condition with targeted medical therapies that improve heart efficiency and physical stamina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How is PH Treated */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Targeted Therapeutics
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              How is Pulmonary Hypertension Treated?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              While pulmonary hypertension cannot be cured, finding the right pulmonary hypertension doctors early can help manage your symptoms, lower the stress on your heart, and improve your daily quality of life. Because every patient is different, our specialists offer personalized treatments:
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

          {/* Diagnostic Bridge to Right-Heart Cath / Vascular Testing */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm max-w-4xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Advanced Pulmonary Vascular Testing at IE Lung
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-6">
              Proper treatment requires exact measurements. Our clinic offers complete pulmonary vascular and cardiac evaluations, including Echocardiograms and Right-Heart Catheterizations—the definitive gold-standard test used to diagnose pulmonary hypertension.
            </p>
            <Link
              href="/services/pulmonary-vascular-diseases"
              className="inline-flex items-center gap-2 bg-[#3D4749] hover:bg-accent text-white font-semibold px-8 py-3.5 rounded-full text-sm sm:text-base transition-colors group"
            >
              <span>Explore Right-Heart Catheterization & Vascular Testing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Pulmonary Hypertension"
        faqs={faqs}
      />

      {/* Clinic NAP Card */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Specialized PAH care for patients across San Bernardino, Riverside, and Beaumont."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer with COE Accreditation Note */}
      <MedicalReviewer
        reviewer="Dr. Paresh C. Giri, MD"
        credentials="Board-Certified in Pulmonary & Critical Care Medicine"
        specialtyNote="Dr. Giri has established nationally recognized pulmonary hypertension programs and sits on the national committee that reviews accreditation for Pulmonary Hypertension Centers of Excellence."
        lastUpdated="November 2026"
        sources={[
          { name: "American Heart Association: Pulmonary Hypertension" },
          { name: "American Lung Association: PAH" },
        ]}
      />

      <ServiceCtaBanner
        title="Need a Specialist for Pulmonary Hypertension?"
        subtitle="Our nationally recognized pulmonary hypertension experts provide comprehensive diagnostics and advanced medical therapies in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
