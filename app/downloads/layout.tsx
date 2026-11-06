import { ReactNode } from "react";

export const metadata = {
  title: "Downloads & Patient Resources | IE Lung - Redlands, CA",
  description:
    "Download the latest IE Lung newsletters, provider referral forms, and pulmonary health guides from Inland Empire Lung & Sleep Institute in Redlands, CA.",
  alternates: {
    canonical: "https://ielung.com/downloads",
  },
};

export default function DownloadsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

