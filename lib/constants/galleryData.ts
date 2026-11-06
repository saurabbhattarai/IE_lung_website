export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: string;
  aspect?: "portrait" | "landscape";
  alt: string;
}

export const openingDayImages: GalleryItem[] = [
  {
    id: "opening-1",
    src: "/images/opening-images/Frame 2147224866.png",
    title: "Opening Day Celebration",
    category: "Opening Day",
    aspect: "landscape",
    alt: "Inland Empire Lung & Sleep Institute Opening Day Celebration in Redlands, CA",
  },
  {
    id: "opening-2",
    src: "/images/opening-images/Frame 2147224864.png",
    title: "Physician & Care Team",
    category: "Opening Day",
    aspect: "landscape",
    alt: "IE Lung medical leadership and specialists on Opening Day",
  },
  {
    id: "opening-3",
    src: "/images/opening-images/Frame 2147224865.png",
    title: "Clinical Consultation & Welcome",
    category: "Opening Day",
    aspect: "landscape",
    alt: "Welcoming patients and guests to our modern Redlands clinic",
  },
  {
    id: "opening-4",
    src: "/images/opening-images/Frame 2147224862.png",
    title: "Clinic Facility & Reception",
    category: "Opening Day",
    aspect: "portrait",
    alt: "Modern clinic entrance and reception space at 245 Terracina Blvd",
  },
  {
    id: "opening-5",
    src: "/images/opening-images/Frame 2147224863.png",
    title: "Specialists Gathering",
    category: "Opening Day",
    aspect: "portrait",
    alt: "Pulmonary, sleep, and critical care specialists gathering on opening day",
  },
  {
    id: "opening-6",
    src: "/images/opening-images/Frame 2147224867.png",
    title: "Celebrating With Community",
    category: "Opening Day",
    aspect: "portrait",
    alt: "Community members and medical team celebrating the clinic opening",
  },
  {
    id: "opening-7",
    src: "/images/opening-images/Frame 2147224868.png",
    title: "State-of-the-Art Diagnostic Center",
    category: "Opening Day",
    aspect: "landscape",
    alt: "Advanced diagnostic spaces and community members on opening day",
  },
];

