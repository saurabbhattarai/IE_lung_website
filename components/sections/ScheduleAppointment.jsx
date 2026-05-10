"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail, // Added Mail icon
  ChevronDown,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { submitBookingForm } from "../../lib/actions/contact.action";

// Initial state for the action
const initialState = {
  success: false,
  message: "",
  errors: {},
};

export default function ScheduleAppointment() {
  const [state, formAction, isPending] = useActionState(
    submitBookingForm,
    initialState,
  );

  return (
    <section id="schedule" className="py-24 px-4 bg-slate-50/50">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-accent font-semibold uppercase tracking-widest mb-4">
            Schedule Today
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
            Book Your Appointment
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Take the first step toward better respiratory health. Select your
            preferred slot and our team will handle the rest.
          </p>
        </div>

        <div className="relative">
          <div className="relative bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-14 shadow-2xl shadow-slate-200/40 overflow-hidden">
            {state.success ? (
              <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-bold text-[#3D4749] mb-4">
                  Request Received!
                </h3>
                <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
                  {state.message}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-3 rounded-xl font-bold transition-all"
                >
                  New Booking
                </button>
              </div>
            ) : (
              <form action={formAction} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Patient Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Patient Name
                    </label>
                    <div className="relative group/input">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input
                        type="text"
                        name="patientName"
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/50 border focus:bg-white transition-all text-[#3D4749] font-medium outline-none ${
                          state.errors?.patientName
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-slate-200 focus:ring-4 focus:ring-accent/5"
                        }`}
                        placeholder="Full Name"
                      />
                    </div>
                    {state.errors?.patientName && (
                      <p className="text-red-500 text-xs font-bold ml-1 italic">
                        {state.errors.patientName[0]}
                      </p>
                    )}
                  </div>

                  {/* Email Address - NEW FIELD */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input
                        type="email"
                        name="email"
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/50 border focus:bg-white transition-all text-[#3D4749] font-medium outline-none ${
                          state.errors?.email
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-slate-200 focus:ring-4 focus:ring-accent/5"
                        }`}
                        placeholder="email@example.com"
                      />
                    </div>
                    {state.errors?.email && (
                      <p className="text-red-500 text-xs font-bold ml-1 italic">
                        {state.errors.email[0]}
                      </p>
                    )}
                  </div>

                  {/* Contact Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Contact Phone
                    </label>
                    <div className="relative group/input">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input
                        type="tel"
                        name="phone"
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/50 border focus:bg-white transition-all text-[#3D4749] font-medium outline-none ${
                          state.errors?.phone
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-slate-200 focus:ring-4 focus:ring-accent/5"
                        }`}
                        placeholder="(000) 000-0000"
                      />
                    </div>
                    {state.errors?.phone && (
                      <p className="text-red-500 text-xs font-bold ml-1 italic">
                        {state.errors.phone[0]}
                      </p>
                    )}
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Reason for Consultation
                    </label>
                    <div className="relative">
                      <select
                        name="reason"
                        className={`w-full appearance-none px-6 py-4 rounded-2xl bg-slate-50/50 border focus:bg-white transition-all text-[#3D4749] font-medium cursor-pointer outline-none ${
                          state.errors?.reason
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-slate-200 focus:ring-4 focus:ring-accent/5"
                        }`}
                      >
                        <option value="">
                          Choose a specialized service...
                        </option>
                        <option value="Pulmonary Evaluation">
                          Pulmonary Evaluation
                        </option>
                        <option value="Sleep Disorder Consultation">
                          Sleep Disorder Consultation
                        </option>
                        <option value="Asthma / COPD Management">
                          Asthma / COPD Management
                        </option>
                        <option value="Follow-up Visit">Follow-up Visit</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                    </div>
                    {state.errors?.reason && (
                      <p className="text-red-500 text-xs font-bold ml-1 italic">
                        {state.errors.reason[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Preferred Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Preferred Date
                    </label>
                    <div className="relative group/input">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input
                        type="date"
                        name="preferredDate"
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/50 border focus:bg-white transition-all text-[#3D4749] font-medium outline-none ${
                          state.errors?.preferredDate
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-slate-200 focus:ring-4 focus:ring-accent/5"
                        }`}
                      />
                    </div>
                    {state.errors?.preferredDate && (
                      <p className="text-red-500 text-xs font-bold ml-1 italic">
                        {state.errors.preferredDate[0]}
                      </p>
                    )}
                  </div>

                  {/* Preferred Time */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Preferred Time
                    </label>
                    <div className="relative group/input">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <select
                        name="preferredTime"
                        className={`w-full pl-14 pr-12 py-4 rounded-2xl bg-slate-50/50 border focus:bg-white appearance-none transition-all text-[#3D4749] font-medium cursor-pointer outline-none ${
                          state.errors?.preferredTime
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-slate-200 focus:ring-4 focus:ring-accent/5"
                        }`}
                      >
                        <option value="">Select Time Slot...</option>
                        <optgroup label="Morning">
                          <option value="8:00 AM - 10:00 AM">
                            8:00 AM - 10:00 AM
                          </option>
                          <option value="10:00 AM - 12:00 PM">
                            10:00 AM - 12:00 PM
                          </option>
                        </optgroup>
                        <optgroup label="Afternoon">
                          <option value="2:00 PM - 4:00 PM">
                            2:00 PM - 4:00 PM
                          </option>
                          <option value="4:00 PM - 5:00 PM">
                            4:00 PM - 5:00 PM
                          </option>
                        </optgroup>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                    </div>
                    {state.errors?.preferredTime && (
                      <p className="text-red-500 text-xs font-bold ml-1 italic">
                        {state.errors.preferredTime[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-6 flex flex-col md:flex-row gap-4 items-center">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full md:flex-[2] bg-[#3D4749] hover:bg-accent text-white sm:px-10 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        PROCESSING...
                      </>
                    ) : (
                      "CONFIRM APPOINTMENT"
                    )}
                  </button>
                  <a
                    href="tel:+18402580972"
                    className="w-full md:flex-1 text-center border-2 border-slate-100 hover:border-accent hover:text-accent text-slate-400 py-4 sm:py-5 rounded-[1.25rem] font-bold transition-all duration-300"
                  >
                    CALL US INSTEAD
                  </a>
                </div>

                {!state.success && state.message && (
                  <p className="text-red-500 text-center font-bold text-sm animate-pulse">
                    {state.message}
                  </p>
                )}

                <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-tighter">
                  We will contact you to confirm your appointment time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
