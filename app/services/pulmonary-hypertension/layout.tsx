import { ReactNode } from "react";

export const metadata = {
  title: "Pulmonary Hypertension Specialist in Redlands, CA | IE Lung",
  description:
    "Looking for a pulmonary hypertension specialist near you? IE Lung in Redlands, CA offers expert PAH diagnosis, treatment, and long-term care. Book an appointment.",
  alternates: {
    canonical: "https://ielung.com/services/pulmonary-hypertension",
  },
  openGraph: {
    title: "Pulmonary Hypertension Specialist in Redlands, CA | IE Lung",
    description:
      "Looking for a pulmonary hypertension specialist near you? IE Lung in Redlands, CA offers expert PAH diagnosis, treatment, and long-term care. Book an appointment.",
    url: "https://ielung.com/services/pulmonary-hypertension",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function PulmonaryHypertensionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
