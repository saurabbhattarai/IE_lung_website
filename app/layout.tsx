import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "IE Lung - Pulmonary & Sleep Medicine",
  description:
    "Inland Empire Lung and Sleep Institute - Comprehensive care for lung and sleep disorders. Science-Led. Patient-Centered.",
  generator: "Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
