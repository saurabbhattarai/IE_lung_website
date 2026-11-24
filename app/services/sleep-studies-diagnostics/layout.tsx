import { ReactNode } from "react";

export const metadata = {
  title: "Sleep Study & Sleep Clinic in Redlands, CA | IE Lung",
  description:
    "Looking for a home sleep apnea test or an in-lab sleep study? IE Lung in Redlands, CA offers polysomnography, CPAP titration, and oximetry. Request an appointment.",
  alternates: {
    canonical: "https://ielung.com/services/sleep-studies-diagnostics",
  },
  openGraph: {
    title: "Sleep Study & Sleep Clinic in Redlands, CA | IE Lung",
    description:
      "Looking for a home sleep apnea test or an in-lab sleep study? IE Lung in Redlands, CA offers polysomnography, CPAP titration, and oximetry. Request an appointment.",
    url: "https://ielung.com/services/sleep-studies-diagnostics",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function SleepStudiesDiagnosticsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
