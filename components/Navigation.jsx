  "use client";

  import logo from "../public/logo.png";
  import { useState, useEffect } from "react";
  import Link from "next/link";
  import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
  import Image from "next/image";

  export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <nav className={`sticky top-0 z-50 transition-all duration-300 bg-transparant`}>
        <div className="max-w-7xl mx-auto px-4 flex gap-18 justify-between items-center">
          {/* Logo */}
          <div
            className={`${isScrolled ? "bg-gray-100 backdrop-blur-xl border border-white/30 shadow-xl rounded-b-full" : ""}`}
          >
            <Link href={"/"}>
              <div>
                <Image
                  src={logo}
                  alt="IE Lung Logo"
                  width={80}
                  height={50}
                  className="object-contain md:w-[10vw]"
                  placeholder="blur"
                  priority={true}
                />

                {/* {isLoading && (
                  <div className="absolute inset-0 z-10 bg-gray-200 animate-pulse rounded-md" />
                )}

                <Image
                  src={logo}
                  alt="IE Lung Logo"
                  width={80}
                  height={50}
                  priority
                  onLoad={() => setIsLoading(false)}
                  className={`object-contain transition-opacity duration-500 md:w-[10vw] ${
                    isLoading ? "opacity-0" : "opacity-100"
                    }`} 
                />*/}
              </div>
            </Link>
          </div>

          {/* links */}
          <div
            className={`hidden lg:flex items-center gap-4 sticky  z-50 mx-auto w-fit px-10 py-4 rounded-full transition-all duration-500 ${isScrolled ? "bg-gray-100 border border-white/30 shadow-xl" : "bg-white/10 backdrop-blur-md border border-white/20"}`}
          >
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
              <div className="absolute left-0 z-10 mt-2 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2 border border-gray-100">
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

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <button className="bg-[#3D4749] text-white flex items-center gap-2 px-6 py-2.5 rounded-lg group hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 text-sm font-medium tracking-tight">
                SCHEDULE APPOINTMENT
                <ArrowRight className="w-4 group-hover:translate-x-1 transition-all duration-300" />
              </button>
            </div>
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
                className="w-full mt-4 bg-[#3D4749] text-white px-4 py-3 rounded-lg hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                SCHEDULE APPOINTMENT
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  }
