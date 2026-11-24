import { AlertTriangle } from "lucide-react";

export default function EmergencyCallout({
  message = "If you have severe trouble breathing, sudden chest pain, or a medical emergency, call 911 or go to the nearest emergency room immediately.",
}) {
  return (
    <div className="bg-rose-50/90 border-l-4 border-rose-500 rounded-r-xl p-4 sm:p-5 mb-8 flex items-start gap-3.5 text-rose-950 shadow-sm">
      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
      <p className="text-xs sm:text-sm font-medium leading-relaxed">
        <strong className="font-semibold text-rose-900">Emergency Notice: </strong>
        {message}
      </p>
    </div>
  );
}
