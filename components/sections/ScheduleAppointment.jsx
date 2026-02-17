"use client";

import {
  Calendar,
  Clock,
  User,
  Phone,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

export default function ScheduleAppointment() {
  const [appointmentData, setAppointmentData] = useState({
    patientName: "",
    phone: "",
    reason: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setAppointmentData({
        patientName: "",
        phone: "",
        reason: "",
        preferredDate: "",
        preferredTime: "",
      });
      setSubmitted(false);
    }, 5000);
  };

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

        <div className="relative group">
          <div className="relative bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-14 shadow-2xl shadow-slate-200/40 overflow-hidden">
            {submitted ? (
              <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-bold text-[#3D4749] mb-4">
                  Request Received!
                </h3>
                <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
                  Our patient coordinator will contact you at{" "}
                  <span className="font-bold text-accent">
                    {appointmentData.phone || "your number"}
                  </span>{" "}
                  within 24 business hours to finalize the schedule.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-3 rounded-xl font-bold transition-all"
                >
                  New Booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Personal Details */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Patient Name
                    </label>
                    <div className="relative group/input">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-accent transition-colors" />
                      <input
                        type="text"
                        name="patientName"
                        value={appointmentData.patientName}
                        onChange={handleChange}
                        required
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/50 border focus:border-accent/10 focus:bg-white focus:ring-4 focus:ring-accent/5 transition-all text-[#3D4749] font-medium"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Contact Phone
                    </label>
                    <div className="relative group/input">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-accent transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={appointmentData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/50 border focus:border-accent/10 focus:bg-white focus:ring-4 focus:ring-accent/5 transition-all text-[#3D4749] font-medium"
                        placeholder="(000) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Reason */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Reason for Consultation
                  </label>
                  <div className="relative">
                    <select
                      name="reason"
                      value={appointmentData.reason}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none px-6 py-4 rounded-2xl bg-slate-50/50 border focus:border-accent/10 focus:bg-white focus:ring-4 focus:ring-accent/5 transition-all text-[#3D4749] font-medium cursor-pointer"
                    >
                      <option value="">Choose a specialized service...</option>
                      <option value="pulmonary-checkup">
                        Pulmonary Evaluation
                      </option>
                      <option value="sleep-study">
                        Sleep Disorder Consultation
                      </option>
                      <option value="breathing-issues">
                        Asthma / COPD Management
                      </option>
                      <option value="follow-up">Follow-up Visit</option>
                      <option value="other">General Respiratory Inquiry</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  </div>
                </div>

                {/* Step 3: Schedule */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Preferred Date
                    </label>
                    <div className="relative group/input">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-accent transition-colors" />
                      <input
                        type="date"
                        name="preferredDate"
                        value={appointmentData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/50 border focus:border-accent/10 focus:bg-white focus:ring-4 focus:ring-accent/5 transition-all text-[#3D4749] font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Preferred Time
                    </label>
                    <div className="relative group/input">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-accent transition-colors" />
                      <select
                        name="preferredTime"
                        value={appointmentData.preferredTime}
                        onChange={handleChange}
                        required
                        className="w-full pl-14 pr-12 py-4 rounded-2xl bg-slate-50/50 border focus:border-accent/10 focus:bg-white focus:ring-4 focus:ring-accent/5 appearance-none transition-all text-[#3D4749] font-medium cursor-pointer"
                      >
                        <option value="">Select Time Slot...</option>
                        <optgroup label="Morning">
                          <option value="8:00 AM">8:00 AM - 10:00 AM</option>
                          <option value="10:00 AM">10:00 AM - 12:00 PM</option>
                        </optgroup>
                        <optgroup label="Afternoon">
                          <option value="2:00 PM">2:00 PM - 4:00 PM</option>
                          <option value="4:00 PM">4:00 PM - 5:00 PM</option>
                        </optgroup>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Final Actions */}
                <div className="pt-6 flex flex-col md:flex-row gap-4 items-center">
                  <button
                    type="submit"
                    className="w-full md:flex-[2] bg-[#3D4749] hover:bg-accent text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                  >
                    CONFIRM APPOINTMENT
                  </button>
                  <a
                    href="tel:+18402580972"
                    className="w-full md:flex-1 text-center border-2 border-slate-100 hover:border-accent hover:text-accent text-slate-400 px-6 py-5 rounded-[1.25rem] font-bold transition-all duration-300"
                  >
                    CALL US INSTEAD
                  </a>
                </div>

                <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-tighter">
                  We will contact you to confirm your appointment time.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Support Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
                { label: "Patient Satisfaction", val: "4.9/5" },
                { label: "Board Certified", val: "Expert" },
                { label: "Response Time", val: "< 24hr" },
                { label: "Clinic Location", val: "Yucaipa" }
            ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 text-center shadow-sm">
                    <p className="text-xl font-extrabold text-[#3D4749]">{stat.val}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{stat.label}</p>
                </div>
            ))}
        </div>*/}
      </div>
    </section>
  );
}
