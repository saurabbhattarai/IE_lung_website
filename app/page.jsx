'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import Providers from '@/components/sections/Providers'
import FacilityTour from '@/components/sections/FacilityTour'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import ScheduleAppointment from '@/components/sections/ScheduleAppointment'
import Footer from '@/components/Footer'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  return (
    <main className="bg-background text-foreground">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Providers />
      <FacilityTour />
      <Testimonials />
      <Contact />
      <ScheduleAppointment />
      <Footer />
    </main>
  )
}
