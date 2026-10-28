import { ReactNode } from "react";

export const metadata = {
  title: "Advanced Bronchoscopy & Interventional Pulmonology in Redlands, CA",
  description:
    "Need a lung nodule specialist or lung biopsy near you? Interventional pulmonologists at IE Lung offer robotic bronchoscopy, EBUS, and thoracentesis.",
};

export default function AdvancedBronchoscopyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

