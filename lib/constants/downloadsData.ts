export interface Newsletter {
  id: string;
  issueNumber: number;
  title: string;
  subtitle: string;
  edition: string;
  date: string;
  fileUrl: string;
  fileSize: string;
  pageCount?: string;
  description: string;
  topics: string[];
  featured?: boolean;
}

export interface DownloadableResource {
  id: string;
  title: string;
  category: "Forms" | "Guides" | "Brochures";
  fileUrl: string;
  fileSize: string;
  description: string;
}

export const newsletters: Newsletter[] = [
  {
    id: "issue-1-nov-2026",
    issueNumber: 1,
    title: "IE Lung Newsletter — Issue 1",
    subtitle: "Breathing is Life: The Science of Breathing & Respiratory Wellness",
    edition: "November 2026",
    date: "November 5, 2026",
    fileUrl: "/news-letter/IE_Lung_November_2026_Newsletter-Issue 1-11-5-2026.pdf",
    fileSize: "680 KB",
    pageCount: "4 Pages",
    description:
      "The inaugural edition of the Inland Empire Lung & Sleep Institute newsletter. Features physician-led guidance on recognizing respiratory symptoms, understanding pulmonary diagnostics, managing exertion-related breathlessness, preparing for specialist visits, and lung rehabilitation exercises.",
    topics: [
      "When to seek urgent medical care for respiratory symptoms",
      "How your lungs are tested: PFTs, spirometry, and diagnostic imaging",
      "What if you get breathless while walking or exercising?",
      "How to prepare for your first pulmonary or sleep clinic visit",
      "Breathing techniques & physical exercises to improve lung capacity",
    ],
    featured: true,
  },
];

export const clinicalForms: DownloadableResource[] = [
  {
    id: "provider-referral-form",
    title: "Physician & Provider Referral Form",
    category: "Forms",
    fileUrl: "/referral-form.pdf",
    fileSize: "30 KB",
    description:
      "Official consultation and diagnostic referral form for healthcare providers referring patients to the Inland Empire Lung & Sleep Institute in Redlands, CA.",
  },
];

