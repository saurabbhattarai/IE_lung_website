import { ReactNode } from "react";

export const metadata = {
  title: "Narcolepsy Doctor & Hypersomnia Specialist in Redlands, CA | IE Lung",
  description:
    "Looking for a narcolepsy doctor near you? IE Lung in Redlands, CA provides expert testing and treatment for narcolepsy and idiopathic hypersomnia. Book today.",
  alternates: {
    canonical: "https://ielung.com/services/narcolepsy-hypersomnia",
  },
  openGraph: {
    title:
      "Narcolepsy Doctor & Hypersomnia Specialist in Redlands, CA | IE Lung",
    description:
      "Looking for a narcolepsy doctor near you? IE Lung in Redlands, CA provides expert testing and treatment for narcolepsy and idiopathic hypersomnia. Book today.",
    url: "https://ielung.com/services/narcolepsy-hypersomnia",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function NarcolepsyHypersomniaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
