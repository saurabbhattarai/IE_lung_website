import { getHomepageOpeningGalleryImagesService } from "@/lib/gallery/service";
import OpeningGalleryClient from "./OpeningGalleryClient";

export default async function OpeningGallery() {
  let images = [];

  try {
    const rawImages = await getHomepageOpeningGalleryImagesService();
    images = rawImages.map((img) => ({
      id: img.id,
      src: img.src,
      title: img.title,
      category: img.category,
      aspect: img.aspect,
      alt: img.alt,
      sortOrder: img.sortOrder,
    }));
  } catch (err) {
    console.error("[OPENING GALLERY HOMEPAGE ERROR] Failed to fetch homepage images:", err);
  }

  return <OpeningGalleryClient images={images} />;
}
