import { ReactNode } from "react";

export const metadata = {
  title: "Sleep Study & Sleep Clinic in Redlands, CA | IE Lung",
  description:
    "Looking for a home sleep apnea test or an in-lab sleep study? IE Lung in Redlands, CA offers polysomnography, CPAP titration, and oximetry. Request an appointment.",
};

export default function SleepStudiesDiagnosticsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

