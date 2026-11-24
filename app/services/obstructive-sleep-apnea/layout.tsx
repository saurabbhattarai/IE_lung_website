import { ReactNode } from "react";

export const metadata = {
  title: "Sleep Apnea Specialist in Redlands, CA | IE Lung",
  description:
    "Looking for sleep apnea treatment near you? IE Lung in Redlands, CA offers expert OSA testing, CPAP management, and specialized sleep care. Request a visit.",
  alternates: {
    canonical: "https://ielung.com/services/obstructive-sleep-apnea",
  },
  openGraph: {
    title: "Sleep Apnea Specialist in Redlands, CA | IE Lung",
    description:
      "Looking for sleep apnea treatment near you? IE Lung in Redlands, CA offers expert OSA testing, CPAP management, and specialized sleep care. Request a visit.",
    url: "https://ielung.com/services/obstructive-sleep-apnea",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function ObstructiveSleepApneaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
