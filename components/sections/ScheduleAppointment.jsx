'use client'

import { Calendar, Clock, User, Phone } from 'lucide-react'
import { useState } from 'react'

export default function ScheduleAppointment() {
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    phone: '',
    reason: '',
    preferredDate: '',
    preferredTime: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Appointment scheduled:', appointmentData)
    setSubmitted(true)
    setTimeout(() => {
      setAppointmentData({
        patientName: '',
        phone: '',
        reason: '',
        preferredDate: '',
        preferredTime: ''
      })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">Schedule Today</p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
            Book Your Appointment
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
            Ready to take control of your respiratory and sleep health? Schedule an appointment with one of our expert providers.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-secondary p-8 md:p-12 shadow-sm">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">Thank You!</h3>
              <p className="text-foreground/70 max-w-md mx-auto mb-6">
                We{'{'}ve{"}"} received your appointment request. A member of our team will contact you within 24 hours to confirm your appointment.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-accent hover:text-accent/80 font-semibold transition"
              >
                Schedule Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                    <input
                      type="text"
                      name="patientName"
                      value={appointmentData.patientName}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-secondary bg-white text-primary placeholder-foreground/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      value={appointmentData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-secondary bg-white text-primary placeholder-foreground/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3">Reason for Visit *</label>
                <select
                  name="reason"
                  value={appointmentData.reason}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-secondary bg-white text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                >
                  <option value="">Select a reason...</option>
                  <option value="pulmonary-checkup">Pulmonary Checkup</option>
                  <option value="sleep-study">Sleep Study</option>
                  <option value="breathing-issues">Breathing Issues</option>
                  <option value="sleep-problems">Sleep Problems</option>
                  <option value="follow-up">Follow-up Visit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Preferred Date */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">Preferred Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                    <input
                      type="date"
                      name="preferredDate"
                      value={appointmentData.preferredDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-secondary bg-white text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                    />
                  </div>
                </div>

                {/* Preferred Time */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">Preferred Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                    <select
                      name="preferredTime"
                      value={appointmentData.preferredTime}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-secondary bg-white text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                    >
                      <option value="">Select a time...</option>
                      <option value="8:00 AM">8:00 AM</option>
                      <option value="8:30 AM">8:30 AM</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="9:30 AM">9:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="2:30 PM">2:30 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="3:30 PM">3:30 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="4:30 PM">4:30 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  CONFIRM APPOINTMENT
                </button>
                <button
                  type="button"
                  className="flex-1 border-2 border-primary text-primary hover:bg-accent/5 px-8 py-3 rounded-lg font-semibold transition-all"
                >
                  CALL US INSTEAD
                </button>
              </div>

              <p className="text-sm text-foreground/60 text-center">
                We will contact you to confirm your appointment time.
              </p>
            </form>
          )}
        </div>

        {/* Info Cards */}
        {/* <div className="grid sm:grid-cols-2 gap-6 mt-12">
          <div className="bg-white rounded-lg p-6 border border-secondary text-center">
            <p className="text-accent font-bold text-2xl mb-2">24 Hours</p>
            <p className="text-foreground/70">Average confirmation time</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-secondary text-center">
            <p className="text-accent font-bold text-2xl mb-2">Easy Rescheduling</p>
            <p className="text-foreground/70">Change your appointment anytime</p>
          </div>
        </div> */}
      </div>
    </section>
  )
}
