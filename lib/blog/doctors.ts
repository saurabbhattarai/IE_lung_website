import { providers } from "@/lib/constants/doctorsData";

export interface ArticleDoctorView {
  id: number;
  name: string;
  specialty: string;
}

export type DoctorSpecialtyOverrides = Record<string | number, string>;

/**
 * Resolves the 7 clinic physicians using shared faculty data from doctorsData.ts,
 * applying any article-specific display specialty overrides if provided.
 *
 * Ensures:
 * 1. Physician directory is not duplicated across articles.
 * 2. Directory records are not silently altered when an article specifies custom subtitles.
 * 3. Fallback to doc.speciality when no override exists.
 */
export function getArticleDoctors(
  overrides?: DoctorSpecialtyOverrides | null
): ArticleDoctorView[] {
  return providers.map((doc) => {
    // Formulate clean name with credentials
    const formattedName = doc.credentials
      ? `${doc.name}, ${doc.credentials}`
      : doc.name;

    // Check for override by ID (number or string) or by name
    const override =
      overrides &&
      (overrides[doc.id] ||
        overrides[String(doc.id)] ||
        overrides[doc.name] ||
        overrides[formattedName]);

    return {
      id: doc.id,
      name: formattedName,
      specialty: override || doc.speciality,
    };
  });
}
