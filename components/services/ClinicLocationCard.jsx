import { MapPin, Phone, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function ClinicLocationCard({
  title = "Inland Empire Lung & Sleep Institute",
  subtitle = "Accepting new patients across Redlands, San Bernardino, Riverside, and Beaumont.",
  address = "245 Terracina Boulevard, Suite 108, Redlands, CA 92373",
  phone = "909-938-1152",
  hours = "Monday – Friday, 8:00 AM - 5:00 PM",
}) {
  return (
    <section className="py-12 px-4 bg-slate-50/80 border-t border-slate-100">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div>
            <p className="text-accent font-semibold uppercase tracking-widest text-xs mb-2">
              Our Clinic Location
            </p>
            <h3 className="text-2xl font-bold text-primary mb-2">{title}</h3>
            {subtitle && (
              <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href="/#schedule"
            className="inline-flex items-center justify-center bg-[#3D4749] hover:bg-accent text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors shrink-0 shadow-sm"
          >
            Schedule Consultation
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Address
              </p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {address}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Phone
              </p>
              <a
                href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                className="text-sm text-primary font-semibold hover:text-accent transition-colors"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Office Hours
              </p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {hours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
