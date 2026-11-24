import { ReactNode } from "react";

export const metadata = {
  title: "COPD Doctor & Emphysema Specialist in Redlands, CA | IE Lung",
  description:
    "Looking for a COPD doctor near you? IE Lung in Redlands, CA provides expert care, testing, and treatment for COPD, emphysema, and chronic bronchitis.",
  alternates: {
    canonical: "https://ielung.com/services/copd",
  },
  openGraph: {
    title: "COPD Doctor & Emphysema Specialist in Redlands, CA | IE Lung",
    description:
      "Looking for a COPD doctor near you? IE Lung in Redlands, CA provides expert care, testing, and treatment for COPD, emphysema, and chronic bronchitis.",
    url: "https://ielung.com/services/copd",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function CopdLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
