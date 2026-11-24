import { ReactNode } from "react";

export const metadata = {
  title: "Asthma Specialist in Redlands, CA | IE Lung",
  description:
    "Looking for the best asthma specialist near you? IE Lung in Redlands, CA offers asthma testing, treatment, and personalized care. Request an appointment.",
  alternates: {
    canonical: "https://ielung.com/services/asthma",
  },
  openGraph: {
    title: "Asthma Specialist in Redlands, CA | IE Lung",
    description:
      "Looking for the best asthma specialist near you? IE Lung in Redlands, CA offers asthma testing, treatment, and personalized care. Request an appointment.",
    url: "https://ielung.com/services/asthma",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function AsthmaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
