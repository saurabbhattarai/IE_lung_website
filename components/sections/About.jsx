"use client";

export default function About() {
  return (
    <section id="about" className="my-16 py-18 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {/* <div className="h-[1px] w-12 bg-accent/30"></div> */}
          <p className="text-accent font-semibold uppercase tracking-widest mb-4">
            Who We Are
          </p>
          {/* <div className="h-[1px] w-12 bg-accent/30"></div> */}
        </div>

        {/* Main Content Card */}
        <div>
          <div className="relative z-10 bg-gray-50/50 border border-gray-100 rounded-3xl p-8 md:p-16 shadow-sm">
            {/* The Statement Block */}
            <div className="space-y-8 text-lg md:text-xl text-gray-700 leading-relaxed text-left">
              <p className="font-medium text-primary text-2xl md:text-3xl leading-tight">
                At <span className="text-accent font-bold">IE Lung</span>, we
                provide comprehensive care for obstructive, restrictive, and
                pulmonary vascular lung diseases, as well as sleep disorders.
              </p>

              <div className="grid md:grid-cols-2 gap-12 pt-4">
                <p>
                  We believe that every visit brings together{" "}
                  <span className="text-primary font-semibold">
                    two experts
                  </span>
                  : our clinicians, who bring expertise in pulmonary and sleep
                  medicine, and{" "}
                  <span className="text-accent font-semibold italic">you</span>,
                  who bring insight into your lived experience, preferences, and
                  values.
                </p>
                <p>
                  Our mission is to deliver{" "}
                  <span className="border-b-2 border-accent/20">
                    science-driven care
                  </span>{" "}
                  that aligns with what matters most to you—true
                  patient-centered care.
                </p>
              </div>

              <div className="pt-8 border-t border-gray-200/60">
                <p className="text-gray-600 italic">
                  Proudly serving the Inland Empire, we are deeply committed to
                  strengthening the respiratory and sleep health of our
                  community. Our compassionate physicians and staff take the
                  time to listen, partner with you, and support you to{" "}
                  <span className="text-primary font-bold uppercase tracking-wider">
                    breathe, sleep and thrive!
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
