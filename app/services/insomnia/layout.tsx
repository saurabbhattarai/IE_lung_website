import { ReactNode } from "react";

export const metadata = {
  title: "Insomnia Treatment | Sleep Disorder Doctors in Redlands",
  description:
    "Searching for an insomnia clinic near you? IE Lung in Redlands, CA provides expert severe insomnia treatment and CBT for sleep disorders. Book today.",
  alternates: {
    canonical: "https://ielung.com/services/insomnia",
  },
  openGraph: {
    title: "Insomnia Treatment | Sleep Disorder Doctors in Redlands",
    description:
      "Searching for an insomnia clinic near you? IE Lung in Redlands, CA provides expert severe insomnia treatment and CBT for sleep disorders. Book today.",
    url: "https://ielung.com/services/insomnia",
    siteName: "Inland Empire Lung & Sleep Institute",
    locale: "en_US",
    type: "website",
  },
};

export default function InsomniaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
