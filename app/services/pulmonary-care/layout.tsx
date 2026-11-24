import { ReactNode } from "react";

export const metadata = {
  title: "Pulmonologist & Respiratory Care in Redlands, CA | IE Lung",
  description:
    "Looking for a lung doctor near you? The board-certified pulmonologists at IE Lung in Redlands treat asthma, COPD, pulmonary hypertension, and lung cancer.",
  alternates: {
    canonical: "https://ielung.com/services/pulmonary-care",
  },
  openGraph: {
    title: "Pulmonologist & Respiratory Care in Redlands, CA | IE Lung",
    description:
      "Looking for a lung doctor near you? The board-certified pulmonologists at IE Lung in Redlands treat asthma, COPD, pulmonary hypertension, and lung cancer.",
    url: "https://ielung.com/services/pulmonary-care",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function PulmonaryCareLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
