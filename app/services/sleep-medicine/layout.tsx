import { ReactNode } from "react";

export const metadata = {
  title: "Sleep Medicine Clinic in Redlands, CA | IE Lung",
  description:
    "Looking for a sleep doctor near you? The specialists at IE Lung in Redlands, CA treat sleep apnea, insomnia, and narcolepsy, offering expert CPAP therapy.",
  alternates: {
    canonical: "https://ielung.com/services/sleep-medicine",
  },
  openGraph: {
    title: "Sleep Medicine Clinic in Redlands, CA | IE Lung",
    description:
      "Looking for a sleep doctor near you? The specialists at IE Lung in Redlands, CA treat sleep apnea, insomnia, and narcolepsy, offering expert CPAP therapy.",
    url: "https://ielung.com/services/sleep-medicine",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function SleepMedicineLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
