import { ReactNode } from "react";

export const metadata = {
  title: "Lung Nodule Specialist & Cancer Care in Redlands, CA | IE Lung",
  description:
    "Looking for a lung nodule specialist or lung cancer doctor? IE Lung in Redlands, CA offers expert pulmonary nodule evaluation and biopsies. Book a visit.",
  alternates: {
    canonical: "https://ielung.com/services/lung-nodules-lung-cancer",
  },
  openGraph: {
    title: "Lung Nodule Specialist & Cancer Care in Redlands, CA | IE Lung",
    description:
      "Looking for a lung nodule specialist or lung cancer doctor? IE Lung in Redlands, CA offers expert pulmonary nodule evaluation and biopsies. Book a visit.",
    url: "https://ielung.com/services/lung-nodules-lung-cancer",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function LungNodulesCancerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
