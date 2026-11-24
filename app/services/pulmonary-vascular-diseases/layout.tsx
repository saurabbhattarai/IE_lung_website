import { ReactNode } from "react";

export const metadata = {
  title: "Pulmonary Hypertension & Vascular Testing in Redlands | IE Lung",
  description:
    "Need a right heart catheterization or CTPA near you? IE Lung provides expert pulmonary vascular evaluations in Redlands, CA. Request an appointment.",
  alternates: {
    canonical: "https://ielung.com/services/pulmonary-vascular-diseases",
  },
  openGraph: {
    title:
      "Pulmonary Hypertension & Vascular Testing in Redlands | IE Lung",
    description:
      "Need a right heart catheterization or CTPA near you? IE Lung provides expert pulmonary vascular evaluations in Redlands, CA. Request an appointment.",
    url: "https://ielung.com/services/pulmonary-vascular-diseases",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function PulmonaryVascularLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
