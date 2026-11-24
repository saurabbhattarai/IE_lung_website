import { ReactNode } from "react";

export const metadata = {
  title: "ILD & Pulmonary Fibrosis Specialist in Redlands, CA | IE Lung",
  description:
    "Looking for an interstitial lung disease specialist near you? IE Lung in Redlands, CA provides expert diagnostics and treatment for ILD and pulmonary fibrosis.",
  alternates: {
    canonical: "https://ielung.com/services/interstitial-lung-disease",
  },
  openGraph: {
    title: "ILD & Pulmonary Fibrosis Specialist in Redlands, CA | IE Lung",
    description:
      "Looking for an interstitial lung disease specialist near you? IE Lung in Redlands, CA provides expert diagnostics and treatment for ILD and pulmonary fibrosis.",
    url: "https://ielung.com/services/interstitial-lung-disease",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function InterstitialLungDiseaseLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
