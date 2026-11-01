import { ReactNode } from "react";

export const metadata = {
  title: "CPET & High Altitude Testing in Redlands, CA | IE Lung",
  description:
    "Experience shortness of breath during exercise or travel? IE Lung offers cardiopulmonary exercise testing (CPET), 6-minute walk tests, and HAST in Redlands, CA.",
  alternates: {
    canonical: "https://ielung.com/services/exercise-oxygen-high-altitude-testing",
  },
};

export default function ExerciseOxygenAltitudeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

