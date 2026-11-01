import { ReactNode } from "react";
import Script from "next/script";

export const metadata = {
  title: "IE Lung Opens Nov 2 | Pulmonary Care in Redlands, CA",
  description:
    "Inland Empire Lung & Sleep Institute opens November 2, 2026 in Redlands, CA. Seven specialists for asthma, COPD, sleep apnea and more. Book now.",
  alternates: {
    canonical: "https://ielung.com/blog/ie-lung-opens-nov-2",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where is IE Lung located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IE Lung is located at 245 Terracina Boulevard, Suite 108, Redlands, CA 92373.",
      },
    },
    {
      "@type": "Question",
      name: "When does IE Lung open?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We open on November 2, 2026.",
      },
    },
    {
      "@type": "Question",
      name: "What conditions do you treat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We treat asthma, COPD, pulmonary hypertension, interstitial lung disease, obstructive sleep apnea, insomnia, and narcolepsy.",
      },
    },
    {
      "@type": "Question",
      name: "Are you accepting new patients?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We are accepting new patients starting November 2, 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Which insurance plans do you accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Please call 909 938 1152 to verify your coverage before your visit.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer sleep studies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We offer in-lab and at-home sleep studies.",
      },
    },
    {
      "@type": "Question",
      name: "How do I book an appointment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Book online or call 909 938 1152.",
      },
    },
  ],
};

export default function BlogPostLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}

