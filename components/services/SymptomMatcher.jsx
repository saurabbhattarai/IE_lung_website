import { Stethoscope, CheckCircle2, ArrowRight } from "lucide-react";
import EmergencyCallout from "./EmergencyCallout";

export default function SymptomMatcher({
  title = "Do I Have a Lung Condition?",
  subtitle = "Your doctor can determine the exact cause of your breathing problems. Match your symptoms below to see which respiratory condition you may be experiencing:",
  emergencyMessage,
  items = [],
  actionLabel = "Your doctor may evaluate you for:",
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 md:py-20 px-4 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <p className="text-accent font-semibold uppercase tracking-widest text-xs md:text-sm mb-3">
            Symptom Evaluation Guide
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {emergencyMessage && <EmergencyCallout message={emergencyMessage} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {items.map((item, index) => {
            const IconComponent = item.icon || Stethoscope;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-accent/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {item.label || "If you experience:"}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed mb-4">
                    {item.experience || item.symptom}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-2 bg-slate-50/80 -mx-6 -mb-6 p-4 rounded-b-2xl">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-1">
                    {item.actionLabel || actionLabel}
                  </span>
                  <p className="text-primary font-bold text-sm sm:text-[15px]">
                    {item.evaluation || item.recommendation || item.test}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
