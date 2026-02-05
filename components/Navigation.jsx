"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md border-b border-secondary"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-32 h-16">
              <Image
                src="/logo.png"
                alt="IE Lung Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              href="#home"
              className="text-primary hover:text-accent transition-colors text-sm font-medium tracking-wide"
            >
              HOME
            </Link>
            <Link
              href="#about"
              className="text-primary hover:text-accent transition-colors text-sm font-medium tracking-wide"
            >
              ABOUT
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="text-primary hover:text-accent transition-colors text-sm font-medium flex items-center gap-1 py-2 tracking-wide">
                SERVICES
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2 border border-gray-100">
                <div className="py-2">
                  <Link
                    href="#services-pulmonary"
                    className="block px-5 py-3 text-sm text-primary hover:bg-secondary hover:text-accent transition-colors"
                  >
                    Pulmonary Care
                  </Link>
                  <Link
                    href="#services-sleep"
                    className="block px-5 py-3 text-sm text-primary hover:bg-secondary hover:text-accent transition-colors border-t border-gray-100"
                  >
                    Sleep Disorders
                  </Link>
                  <Link
                    href="#services-diagnostic"
                    className="block px-5 py-3 text-sm text-primary hover:bg-secondary hover:text-accent transition-colors border-t border-gray-100"
                  >
                    Diagnostic Testing
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="#facility"
              className="text-primary hover:text-accent transition-colors text-sm font-medium tracking-wide"
            >
              FACILITY TOUR
            </Link>
            <Link
              href="#providers"
              className="text-primary hover:text-accent transition-colors text-sm font-medium tracking-wide"
            >
              PROVIDERS
            </Link>
            <Link
              href="#testimonials"
              className="text-primary hover:text-accent transition-colors text-sm font-medium tracking-wide"
            >
              TESTIMONIALS
            </Link>
            <Link
              href="#contact"
              className="text-primary hover:text-accent transition-colors text-sm font-medium tracking-wide"
            >
              CONTACT
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 text-sm font-medium tracking-wide">
              SCHEDULE APPOINTMENT
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-secondary bg-white">
            <div className="space-y-1">
              <Link
                href="#home"
                className="block py-3 px-4 text-primary hover:bg-secondary hover:text-accent rounded-lg transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                HOME
              </Link>
              <Link
                href="#about"
                className="block py-3 px-4 text-primary hover:bg-secondary hover:text-accent rounded-lg transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                ABOUT
              </Link>

              {/* Services Accordion */}
              <div>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="w-full flex items-center justify-between py-3 px-4 text-primary hover:bg-secondary hover:text-accent rounded-lg transition-colors text-sm font-medium"
                >
                  SERVICES
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      servicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {servicesOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link
                      href="#services-pulmonary"
                      className="block py-2 px-4 text-primary hover:text-accent text-sm rounded-lg hover:bg-secondary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Pulmonary Care
                    </Link>
                    <Link
                      href="#services-sleep"
                      className="block py-2 px-4 text-primary hover:text-accent text-sm rounded-lg hover:bg-secondary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Sleep Disorders
                    </Link>
                    <Link
                      href="#services-diagnostic"
                      className="block py-2 px-4 text-primary hover:text-accent text-sm rounded-lg hover:bg-secondary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Diagnostic Testing
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="#facility"
                className="block py-3 px-4 text-primary hover:bg-secondary hover:text-accent rounded-lg transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                FACILITY TOUR
              </Link>
              <Link
                href="#providers"
                className="block py-3 px-4 text-primary hover:bg-secondary hover:text-accent rounded-lg transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                PROVIDERS
              </Link>
              <Link
                href="#testimonials"
                className="block py-3 px-4 text-primary hover:bg-secondary hover:text-accent rounded-lg transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                TESTIMONIALS
              </Link>
              <Link
                href="#contact"
                className="block py-3 px-4 text-primary hover:bg-secondary hover:text-accent rounded-lg transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                CONTACT
              </Link>

              <button
                className="w-full mt-4 bg-primary text-white px-4 py-3 rounded-lg hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                SCHEDULE APPOINTMENT
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}