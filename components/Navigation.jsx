"use client";

import logo from "../public/logo.png";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  // Scroll detection for backdrop transformation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Close mega menu on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Hover intent helpers with slight delay to prevent accidental closing
  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 180);
  }, []);

  const closeAll = () => {
    setServicesOpen(false);
    setIsOpen(false);
  };

  // 13 Menu Items mapped to their live destinations
  const conditionsCare = {
    pulmonary: [
      { name: "Asthma", href: "/services/asthma" },
      { name: "COPD", href: "/services/copd" },
      { name: "Pulmonary Hypertension", href: "/services/pulmonary-hypertension" },
      { name: "Lung Nodules & Lung Cancer", href: "/services/lung-nodules-lung-cancer" },
      { name: "Interstitial Lung Disease", href: "/services/interstitial-lung-disease" },
    ],
    sleep: [
      { name: "Obstructive Sleep Apnea (OSA)", href: "/services/obstructive-sleep-apnea" },
      { name: "Insomnia", href: "/services/insomnia" },
      { name: "Narcolepsy & Hypersomnia", href: "/services/narcolepsy-hypersomnia" },
    ],
  };

  const diagnosticsTesting = [
    { name: "Pulmonary Function Testing", href: "/services/pulmonary-function-testing" },
    { name: "Sleep Studies & Diagnostics", href: "/services/sleep-studies-diagnostics" },
    { name: "Advanced Bronchoscopy", href: "/services/advanced-bronchoscopy" },
    { name: "Pulmonary Vascular & Cardiac", href: "/services/pulmonary-vascular-diseases" },
    { name: "Exercise, Oxygen & Altitude", href: "/services/exercise-oxygen-high-altitude-testing" },
  ];

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-transparent pb-3 sm:pb-3.5"
          : "bg-white/80 backdrop-blur-sm pb-3 sm:pb-3.5"
      } ${isOpen ? "bg-white" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-start justify-between relative">
        {/* Logo - attached directly to the top edge with zero gap and compact padding */}
        <div
          className={`shrink-0 transition-all duration-300 px-2.5 sm:px-3 pt-1 pb-2 -mt-px ${
            isScrolled
              ? "bg-gray-100 backdrop-blur-xl border-x border-b border-white/30 shadow-xl rounded-b-full"
              : "bg-white/95 backdrop-blur-md border-x border-b border-slate-100 shadow-sm rounded-b-full"
          }`}
        >
          <Link href="/" onClick={closeAll} className="flex items-center">
            <Image
              src={logo}
              alt="IE Lung Logo"
              width={140}
              height={70}
              priority
              className="object-contain md:w-[10vw] w-28 sm:w-32 max-w-[150px] h-auto"
            />
          </Link>
        </div>

        {/* Floating Navigation Capsule */}
        <div
          className={`hidden lg:flex items-center gap-2.5 xl:gap-4 2xl:gap-5 z-50 mx-auto w-fit whitespace-nowrap px-5 xl:px-7 2xl:px-8 py-2.5 xl:py-3 mt-4 sm:mt-5 rounded-full transition-all duration-300 ${
            isScrolled
              ? "bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl"
              : "bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-md"
          }`}
        >
          <Link
            href="/#home"
            className="text-primary hover:text-accent transition-colors text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-wide whitespace-nowrap shrink-0"
          >
            HOME
          </Link>

          <Link
            href="/#about"
            className="text-primary hover:text-accent transition-colors text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-wide whitespace-nowrap shrink-0"
          >
            ABOUT US
          </Link>

          {/* Our Services Mega Menu Trigger */}
          <div
            className="relative shrink-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              aria-controls="services-mega-menu"
              className={`flex items-center gap-1 text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-wide py-1 whitespace-nowrap transition-colors ${
                servicesOpen ? "text-accent" : "text-primary hover:text-accent"
              }`}
            >
              <span className="whitespace-nowrap">OUR SERVICES</span>
              <ChevronDown
                className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-transform duration-200 ${
                  servicesOpen ? "rotate-180 text-accent" : "text-slate-400"
                }`}
              />
            </button>

            {/* Mega Menu Dropdown */}
            <div
              id="services-mega-menu"
              role="region"
              aria-label="Our Services"
              className={`absolute top-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2 w-[660px] xl:w-[700px] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 z-50 transition-all duration-200 whitespace-normal ${
                servicesOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2 pointer-events-none"
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="grid grid-cols-2 gap-10">
                {/* Left Column: Conditions & Care */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-6 select-none whitespace-nowrap">
                    Conditions & Care
                  </h3>

                  {/* Pulmonary Care */}
                  <div className="mb-6">
                    <p className="text-[15px] font-bold text-primary mb-2.5 select-none whitespace-nowrap">
                      Pulmonary Care
                    </p>
                    <div className="pl-5 space-y-2">
                      {conditionsCare.pulmonary.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAll}
                          className="block text-[13.5px] text-slate-600 hover:text-accent font-medium transition-colors py-0.5 whitespace-nowrap"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Sleep Medicine */}
                  <div>
                    <p className="text-[15px] font-bold text-primary mb-2.5 select-none whitespace-nowrap">
                      Sleep Medicine
                    </p>
                    <div className="pl-5 space-y-2">
                      {conditionsCare.sleep.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAll}
                          className="block text-[13.5px] text-slate-600 hover:text-accent font-medium transition-colors py-0.5 whitespace-nowrap"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Diagnostics & Testing */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-6 select-none whitespace-nowrap">
                    Diagnostics & Testing
                  </h3>

                  <div className="space-y-4">
                    {diagnosticsTesting.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeAll}
                        className="block text-[15px] text-primary hover:text-accent font-bold transition-colors py-0.5 whitespace-nowrap"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sub-footer overview links */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-accent">
                <div className="flex items-center gap-6">
                  <Link
                    href="/services/pulmonary-care"
                    onClick={closeAll}
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Pulmonary Care Overview →
                  </Link>
                  <Link
                    href="/services/sleep-medicine"
                    onClick={closeAll}
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Sleep Medicine Overview →
                  </Link>
                </div>
                <Link
                  href="/#services"
                  onClick={closeAll}
                  className="hover:text-primary transition-colors inline-flex items-center gap-1 text-slate-500"
                >
                  All Services Overview →
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/#providers"
            className="text-primary hover:text-accent transition-colors text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-wide whitespace-nowrap shrink-0"
          >
            PROVIDERS
          </Link>

          <Link
            href="/gallery"
            className="text-primary hover:text-accent transition-colors text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-wide whitespace-nowrap shrink-0"
          >
            GALLERY
          </Link>

          <Link
            href="/blog"
            className="text-primary hover:text-accent transition-colors text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-wide whitespace-nowrap shrink-0"
          >
            BLOG
          </Link>

          <Link
            href="/downloads"
            className="text-primary hover:text-accent transition-colors text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-wide whitespace-nowrap shrink-0"
          >
            DOWNLOADS
          </Link>

          <Link
            href="/#contact"
            className="text-primary hover:text-accent transition-colors text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-wide whitespace-nowrap shrink-0"
          >
            CONTACT
          </Link>

          {/* Appointment CTA button */}
          <Link href="/#schedule" onClick={closeAll} className="flex items-center shrink-0">
            <button className="bg-[#3D4749] hover:bg-accent text-white flex items-center gap-1.5 xl:gap-2 px-3.5 xl:px-5 py-1.5 xl:py-2 rounded-full hover:shadow-md transition-all duration-300 text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-tight whitespace-nowrap">
              <span className="whitespace-nowrap">SCHEDULE APPOINTMENT</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close main menu" : "Open main menu"}
          aria-expanded={isOpen}
          className="lg:hidden mt-3.5 sm:mt-4.5 p-2 rounded-xl text-primary hover:text-accent hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden mt-2 mx-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xl max-h-[calc(100vh-6rem)] overflow-y-auto px-4 py-6 space-y-2">
          <Link
            href="/#home"
            onClick={closeAll}
            className="block py-2.5 px-3 text-primary hover:text-accent font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            HOME
          </Link>

          <Link
            href="/#about"
            onClick={closeAll}
            className="block py-2.5 px-3 text-primary hover:text-accent font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            ABOUT US
          </Link>

          {/* Mobile Services Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileServicesOpen((prev) => !prev)}
              className="w-full flex items-center justify-between py-2.5 px-3 text-primary hover:text-accent font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span>OUR SERVICES</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileServicesOpen ? "rotate-180 text-accent" : "text-slate-400"
                }`}
              />
            </button>

            {mobileServicesOpen && (
              <div className="mt-2 pl-4 pr-2 py-3 bg-slate-50/70 rounded-xl space-y-4 text-xs">
                {/* Column 1: Conditions & Care */}
                <div>
                  <p className="font-bold text-accent uppercase tracking-wider mb-2">
                    Conditions & Care
                  </p>
                  <p className="font-semibold text-primary mb-1">Pulmonary Care</p>
                  <div className="pl-4 space-y-1.5 mb-3">
                    {conditionsCare.pulmonary.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeAll}
                        className="block py-1 text-slate-600 hover:text-accent font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <p className="font-semibold text-primary mb-1">Sleep Medicine</p>
                  <div className="pl-4 space-y-1.5">
                    {conditionsCare.sleep.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeAll}
                        className="block py-1 text-slate-600 hover:text-accent font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 2: Diagnostics & Testing */}
                <div className="pt-2 border-t border-slate-200/60">
                  <p className="font-bold text-accent uppercase tracking-wider mb-2">
                    Diagnostics & Testing
                  </p>
                  <div className="space-y-1.5">
                    {diagnosticsTesting.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeAll}
                        className="block py-1 text-primary hover:text-accent font-semibold"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Overview Links */}
                <div className="pt-2.5 border-t border-slate-200/60 flex flex-col gap-1.5 text-xs font-semibold text-accent">
                  <Link
                    href="/services/pulmonary-care"
                    onClick={closeAll}
                    className="hover:underline py-0.5"
                  >
                    Pulmonary Care Overview →
                  </Link>
                  <Link
                    href="/services/sleep-medicine"
                    onClick={closeAll}
                    className="hover:underline py-0.5"
                  >
                    Sleep Medicine Overview →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/#providers"
            onClick={closeAll}
            className="block py-2.5 px-3 text-primary hover:text-accent font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            PROVIDERS
          </Link>

          <Link
            href="/gallery"
            onClick={closeAll}
            className="block py-2.5 px-3 text-primary hover:text-accent font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            GALLERY
          </Link>

          <Link
            href="/blog"
            onClick={closeAll}
            className="block py-2.5 px-3 text-primary hover:text-accent font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            BLOG
          </Link>

          <Link
            href="/downloads"
            onClick={closeAll}
            className="block py-2.5 px-3 text-primary hover:text-accent font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            DOWNLOADS
          </Link>

          <Link
            href="/#contact"
            onClick={closeAll}
            className="block py-2.5 px-3 text-primary hover:text-accent font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            CONTACT
          </Link>

          {/* Mobile CTA */}
          <div className="pt-3">
            <Link
              href="/#schedule"
              onClick={closeAll}
              className="w-full bg-[#3D4749] hover:bg-accent text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>SCHEDULE APPOINTMENT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
