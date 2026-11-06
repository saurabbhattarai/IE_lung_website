import { ReactNode } from "react";

export const metadata = {
  title: "Gallery — Glimpses of Opening Day | IE Lung - Redlands, CA",
  description:
    "View photos and glimpses from the opening day of Inland Empire Lung & Sleep Institute in Redlands, CA on November 2, 2026.",
  alternates: {
    canonical: "https://ielung.com/gallery",
  },
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

