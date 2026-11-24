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

export default function AsthmaPage() {
  const matcherItems = [
    {
      symptom: "Wheezing, chest tightness, or coughing (especially at night)",
      label: "If you have:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "An asthma evaluation and breathing tests (Spirometry).",
      icon: Wind,
    },
    {
      symptom: "Trouble breathing only when you exercise",
      label: "If you have:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "Testing for exercise-induced asthma.",
      icon: HeartPulse,
    },
    {
      symptom: "An inhaler, but you still wake up with breathing problems",
      label: "If you have:",
      actionLabel: "Your doctor may recommend:",
      evaluation: "A treatment review to adjust your daily medicine.",
      icon: Activity,
    },
  ];

  const symptoms = [
    "Wheezing (a whistling sound when you breathe)",
    "Frequent coughing, especially at night or early in the morning",
    "Chest tightness or pain",
    "Shortness of breath",
  ];

  const types = [
    {
      name: "Allergic Asthma",
      desc: "Triggered by allergens like dust mites, pet dander, or pollen.",
    },
    {
      name: "Exercise-Induced Asthma (Bronchoconstriction)",
      desc: "Triggered by physical activity, especially in cold or dry air.",
    },
    {
      name: "Severe Asthma",
      desc: "Asthma that does not respond to standard inhalers and requires advanced care.",
    },
  ];

  const triggers = [
    "Air pollution, smoke, and strong odors",
    "Allergens (mold, pollen, dust)",
    "Respiratory infections (like the common cold)",
    "Weather changes or cold air",
    "Stress and strong emotions",
  ];

  const treatments = [
    {
      name: "Quick-Relief Inhalers",
      desc: "Open your airways fast during an asthma attack to relieve acute distress.",
    },
    {
      name: "Daily Controller Medicines",
      desc: "Lower the swelling in your lungs to prevent attacks from happening in the first place.",
    },
    {
      name: "Biologic Therapies",
      desc: "Advanced targeted injections or infusions for severe asthma that is hard to control.",
    },
    {
      name: "Trigger Management",
      desc: "Identifying and systematically avoiding the specific environmental exposures that set off your asthma.",
    },
  ];

  const diagnosticTests = [
    {
      name: "Spirometry",
      desc: "Measures how much air you can blow out, and how fast your lungs can move air.",
    },
    {
      name: "FeNO Testing",
      desc: "Checks your exhaled breath for nitric oxide, a key marker of allergy-related airway swelling.",
    },
    {
      name: "Methacholine Challenge",
      desc: "Helps identify hidden or borderline asthma when standard resting breathing tests appear normal.",
    },
  ];

  const faqs = [
    {
      question: "How is asthma diagnosed?",
      answer:
        "Asthma is diagnosed using a combination of your medical history, a physical exam, and breathing tests (like spirometry). Your doctor will look to see if your airways are narrowed and if they open up after using an inhaler.",
    },
    {
      question: "What triggers asthma?",
      answer:
        "Asthma triggers vary from person to person. The most common triggers include respiratory infections, cold air, exercise, smoke, and allergens like pollen, dust mites, or pet dander.",
    },
    {
      question: "Can asthma go away?",
      answer:
        "While childhood asthma sometimes improves or disappears during adulthood, adult-onset asthma generally does not go away. However, with the right daily controller medications, you can live completely symptom-free.",
    },
    {
      question: "Is asthma genetic?",
      answer:
        "Yes, genetics play a significant role. If you have a parent with asthma, you are more likely to develop it. It is also closely linked to a family history of allergies or eczema.",
    },
  ];

  return (
    <main className="bg-white text-slate-800">
      <Navigation />

      <ServiceHero
        category="Pulmonary Care"
        title="Asthma Care"
        subtitle="Expert asthma care to help you breathe easier."
        intro="Asthma is a long-term disease that makes it hard to breathe. While there is no cure, the right care can completely control your symptoms so you can live a full, active life. If you are looking for an asthma clinic or asthma specialists near me, the board-certified pulmonologists at the Inland Empire Lung & Sleep Institute (IE Lung) are here to help. We provide advanced lung testing and build a treatment plan around you."
        breadcrumbs={[
          { label: "Pulmonary Care", href: "/services/pulmonary-care" },
          { label: "Asthma" },
        ]}
      />

      {/* What Is Asthma */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
                Condition Overview
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5">
                What Is Asthma?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                Asthma is a chronic (long-term) lung condition. It makes the airways in your lungs swollen and narrow, which restricts airflow. According to the Centers for Disease Control and Prevention (CDC), millions of Americans live with asthma, and it can start at any age.
              </p>
              <h3 className="text-lg font-bold text-primary mt-6 mb-3">
                What Happens in Asthma?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                When you have asthma, the inner walls of your airways are constantly irritated and swollen. When you come into contact with a trigger—like cold air, smoke, or pollen—the muscles around your airways tighten. The airways get narrow and produce extra, thick mucus. Air then has a very hard time moving in and out of your lungs, causing an &ldquo;asthma attack.&rdquo;
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-4">
                Common Asthma Symptoms
              </h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Symptoms can be mild or severe, and they often come and go:
              </p>
              <div className="space-y-3">
                {symptoms.map((symptom, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-slate-800 text-sm sm:text-base font-medium">
                      {symptom}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Symptom Matcher */}
      <SymptomMatcher
        title="When Should You See an Asthma Doctor?"
        subtitle="Your doctor decides which test is right for you. These examples show what each test helps evaluate:"
        items={matcherItems}
      />

      {/* Types and Triggers */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Types */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                Common Types of Asthma
              </h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Asthma is not a one-size-fits-all disease. A specialist for asthma will identify exactly which type you have so you get the right medication:
              </p>
              <div className="space-y-4">
                {types.map((type, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200/80">
                    <p className="font-bold text-primary text-sm mb-1">{type.name}</p>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{type.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Triggers */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-3">
                What Triggers Asthma?
              </h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Everyone&apos;s asthma triggers are different. According to the National Heart, Lung, and Blood Institute (NHLBI), common triggers include:
              </p>
              <div className="space-y-3">
                {triggers.map((trigger, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    <span className="text-slate-800 text-sm font-medium">{trigger}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments & Diagnostics */}
      <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
              Personalized Management
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              How Can Asthma Be Treated?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Asthma can&apos;t be cured, but an experienced asthma doctor can help you completely control it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {treatments.map((treatment, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="font-bold text-primary text-base mb-2">{treatment.name}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{treatment.desc}</p>
              </div>
            ))}
          </div>

          {/* Testing near you */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3 text-center">
              Asthma Testing in Redlands
            </h3>
            <p className="text-slate-600 text-sm sm:text-base text-center max-w-2xl mx-auto mb-8 leading-relaxed">
              To get the best treatment, you need the right diagnosis. We offer advanced asthma testing right at our clinic:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {diagnosticTests.map((test, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h4 className="font-bold text-primary text-base mb-2">{test.name}</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{test.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/services/pulmonary-function-testing"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-colors"
              >
                <span>Learn more about Pulmonary Function Testing (PFTs)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Allergist vs Pulmonologist & First Visit */}
      <section className="py-16 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4 text-center">
              Which Doctor Treats Asthma?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-center max-w-2xl mx-auto mb-8">
              If you are searching for doctors for asthma, you will usually see two types: a pulmonologist (lung doctor) or an allergist/immunologist (allergy doctor).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-primary text-base mb-2">See an Allergist if:</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Allergies (pollen, pets, dust) cause almost all of your asthma symptoms and you need allergy shots or testing.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-primary text-base mb-2">See a Pulmonologist if:</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your asthma is severe, if you have other lung problems like COPD, or if you need advanced breathing tests to check your lung capacity.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-primary mb-3">
              What to Expect at Your First Visit
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              Your first appointment starts with a conversation. Your physician will review your symptoms, medical history, and current medications to build a plan that fits your life.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-2">
              <strong className="text-slate-800">What to bring:</strong> Please bring your ID, insurance card, a list of your current medications (including your inhalers), and any past breathing test results.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong className="text-slate-800">Insurance:</strong> We accept a wide variety of local and national insurance plans. Please call our office to verify your specific coverage.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqAccordion
        title="Frequently Asked Questions About Asthma"
        faqs={faqs}
      />

      {/* Clinic NAP Card with resolved verified phone/hours */}
      <ClinicLocationCard
        title="Inland Empire Lung & Sleep Institute"
        subtitle="Serving Redlands, San Bernardino, Riverside, and Beaumont."
        phone="909-938-1152"
        hours="Monday – Friday, 8:00 AM - 5:00 PM"
      />

      {/* Medical Reviewer */}
      <MedicalReviewer
        reviewer="Dr. Aalok Shah, MD"
        credentials="Board-Certified Pulmonologist"
        lastUpdated="October 2026"
        sources={[
          { name: "CDC: Asthma Data and Information" },
          { name: "NHLBI: What is Asthma?" },
        ]}
      />

      <ServiceCtaBanner
        title="Take Control of Your Asthma Today"
        subtitle="Request a personalized asthma evaluation with our board-certified pulmonologists in Redlands, CA."
      />

      <Footer />
    </main>
  );
}
