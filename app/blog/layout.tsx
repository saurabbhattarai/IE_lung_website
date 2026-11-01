import { ReactNode } from "react";

export const metadata = {
  title: "Blog | IE Lung - Pulmonary & Sleep Medicine",
  description:
    "Read the latest articles, clinic news, and health insights from the Inland Empire Lung & Sleep Institute in Redlands, CA.",
  alternates: {
    canonical: "https://ielung.com/blog",
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

