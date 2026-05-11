import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import BackToTop from "@/components/BackToTop";
import "./globals.css";
import Script from "next/script";

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
      <meta
        name="google-site-verification"
        content="znVWUmrqFacnlDsbMNaejDd0RlGrpjeYTMtWboYmhDA"
      />
      <body className="font-sans antialiased bg-background text-foreground">
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4KYPP4V2C8"
        ></Script>
        <Script>
          {` window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4KYPP4V2C8');`}
        </Script>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
