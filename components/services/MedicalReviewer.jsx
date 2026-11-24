import { ShieldCheck, ExternalLink } from "lucide-react";

export default function MedicalReviewer({
  reviewer = "Dr. Paresh C. Giri, MD",
  credentials = "Board-Certified Pulmonologist & Critical Care Specialist",
  specialtyNote,
  lastUpdated = "November 2026",
  sources = [],
  disclaimer = "This content is for informational purposes only and should not replace professional medical consultation.",
}) {
  return (
    <section className="py-10 px-4 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Reviewer Header */}
        <div className="flex items-start sm:items-center gap-3.5 text-sm text-primary/80">
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              <span className="text-slate-500 font-normal">Medically Reviewed by: </span>
              {reviewer}
              {credentials && <span className="text-slate-600 font-normal"> | {credentials}</span>}
            </p>
            {specialtyNote && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {specialtyNote}
              </p>
            )}
          </div>
        </div>

        {/* Source Citations */}
        {sources && sources.length > 0 && (
          <div className="pt-4 border-t border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              Medical & Clinical Sources
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {sources.map((source, index) => (
                <li key={index} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline inline-flex items-center gap-1"
                    >
                      <span>{source.name || source.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  ) : (
                    <span>{source.name || source.title || source}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timestamp & Disclaimer */}
        <div className="pt-2 text-xs text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-600">Last Updated:</strong> {lastUpdated}. {disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
