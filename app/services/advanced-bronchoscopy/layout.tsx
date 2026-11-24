import { ReactNode } from "react";

export const metadata = {
  title: "Advanced Bronchoscopy & Interventional Pulmonology in Redlands, CA",
  description:
    "Need a lung nodule specialist or lung biopsy near you? Interventional pulmonologists at IE Lung offer robotic bronchoscopy, EBUS, and thoracentesis.",
  alternates: {
    canonical: "https://ielung.com/services/advanced-bronchoscopy",
  },
  openGraph: {
    title: "Advanced Bronchoscopy & Interventional Pulmonology in Redlands, CA",
    description:
      "Need a lung nodule specialist or lung biopsy near you? Interventional pulmonologists at IE Lung offer robotic bronchoscopy, EBUS, and thoracentesis.",
    url: "https://ielung.com/services/advanced-bronchoscopy",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function AdvancedBronchoscopyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
