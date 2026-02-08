'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react'
import Image from 'next/image'
import { LineMdTwitterXAlt } from './ui/twitterlogo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#3D4749] text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            {/* <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="font-bold text-lg">IE</span>
              </div>
              <div>
                <p className="font-bold text-sm">IE LUNG</p>
                <p className="text-xs text-gray-300">Sleep Institute</p>
              </div>
            </div> */}

            <Image src="/logo_white.png" alt="IE Lung Logo" width={150} height={150} />
            <p className="text-gray-300 text-sm leading-relaxed">
              Providing comprehensive respiratory and sleep care with science-driven treatment and patient-centered compassion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#home" className="text-gray-300 hover:text-accent transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-300 hover:text-accent transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-300 hover:text-accent transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#providers" className="text-gray-300 hover:text-accent transition">
                  Our Providers
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-accent transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#services" className="text-gray-300 hover:text-accent transition">
                  Pulmonary Care
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-300 hover:text-accent transition">
                  Sleep Medicine
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-300 hover:text-accent transition">
                  Diagnostic Testing
                </Link>
              </li>
              <li>
                <Link href="#facility" className="text-gray-300 hover:text-accent transition">
                  Facility Tour
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-accent transition">
                  Schedule Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div className="text-sm text-gray-300">
                  <p>12047 4th Street</p>
                  <p>Yucaipa, CA 92399</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:+18402580972" className="text-gray-300 hover:text-accent transition text-sm">
                  +1 (840) 258-0972
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:info@ielung.com" className="text-gray-300 hover:text-accent transition text-sm">
                  info@ielung.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 py-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-300 text-sm">
            © {currentYear} Inland Empire Lung & Sleep Institute. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-accent/20 hover:bg-accent rounded-full flex items-center justify-center transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-accent/20 hover:bg-accent rounded-full flex items-center justify-center transition">
              {/* <Twitter className="w-5 h-5" /> */}
              <LineMdTwitterXAlt className="w-5 h-5" />
              
            </a>
            <a href="#" className="w-10 h-10 bg-accent/20 hover:bg-accent rounded-full flex items-center justify-center transition">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Legal */}
          <div className="flex gap-6 text-gray-300 text-sm">
            <Link href="#" className="hover:text-accent transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-accent transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
