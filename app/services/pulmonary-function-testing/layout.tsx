import { ReactNode } from "react";

export const metadata = {
  title: "PFT & Asthma Testing in Redlands, CA | IE Lung",
  description:
    "Need a pulmonary function test near you? IE Lung in Redlands, CA offers spirometry, lung volume testing, and asthma diagnostics. Request an appointment.",
  alternates: {
    canonical: "https://ielung.com/services/pulmonary-function-testing",
  },
  openGraph: {
    title: "PFT & Asthma Testing in Redlands, CA | IE Lung",
    description:
      "Need a pulmonary function test near you? IE Lung in Redlands, CA offers spirometry, lung volume testing, and asthma diagnostics. Request an appointment.",
    url: "https://ielung.com/services/pulmonary-function-testing",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function PulmonaryFunctionTestingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
