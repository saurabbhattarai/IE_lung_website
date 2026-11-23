import { getPublicGalleryImagesService } from "@/lib/gallery/service";
import GalleryPageClient, { PublicGalleryImage } from "./GalleryPageClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let images: PublicGalleryImage[] = [];
  let hasError = false;

  try {
    const rawImages = await getPublicGalleryImagesService();
    images = rawImages.map((img) => ({
      id: img.id,
      title: img.title,
      category: img.category,
      src: img.src,
      alt: img.alt,
      aspect: img.aspect,
      sortOrder: img.sortOrder,
    }));
  } catch (err) {
    console.error("[PUBLIC GALLERY ERROR] Failed to load gallery images:", err);
    hasError = true;
  }

  return <GalleryPageClient initialImages={images} hasError={hasError} />;
}
