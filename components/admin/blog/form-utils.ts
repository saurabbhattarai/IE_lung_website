export interface FormSnapshotInput {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  content: unknown;
  coverImage?: string | null;
  coverImagePublicId?: string | null;
  showDoctorsSection: boolean;
  doctorSpecialtyOverrides?: Record<string, string> | null;
  faqs?: Array<{ question: string; answer: string }> | null;
}

/**
 * Serializes form fields into a normalized canonical JSON string to compare dirty baseline.
 */
export function serializeFormSnapshot(data: FormSnapshotInput): string {
  const cleanFaqs = Array.isArray(data.faqs)
    ? data.faqs
        .filter(
          (f) =>
            f &&
            (f.question?.trim().length > 0 || f.answer?.trim().length > 0)
        )
        .map((f) => ({
          question: (f.question || "").trim(),
          answer: (f.answer || "").trim(),
        }))
    : [];

  const cleanOverrides: Record<string, string> = {};
  if (
    data.doctorSpecialtyOverrides &&
    typeof data.doctorSpecialtyOverrides === "object"
  ) {
    Object.entries(data.doctorSpecialtyOverrides).forEach(([k, v]) => {
      if (typeof v === "string" && v.trim().length > 0) {
        cleanOverrides[k] = v.trim();
      }
    });
  }

  return JSON.stringify({
    title: (data.title || "").trim(),
    slug: (data.slug || "").trim(),
    excerpt: (data.excerpt || "").trim(),
    author: (data.author || "").trim(),
    content: data.content || null,
    coverImage: data.coverImage || null,
    coverImagePublicId: data.coverImagePublicId || null,
    showDoctorsSection: Boolean(data.showDoctorsSection),
    doctorSpecialtyOverrides: cleanOverrides,
    faqs: cleanFaqs,
  });
}

/**
 * Checks whether the current form state deviates from the saved baseline snapshot.
 */
export function isFormSnapshotDirty(
  baselineSnapshot: string,
  currentData: FormSnapshotInput
): boolean {
  return baselineSnapshot !== serializeFormSnapshot(currentData);
}

export interface NavigationInterceptOptions {
  isDirty: boolean;
  targetHref: string;
  currentLocationHref: string;
  targetAttr?: string | null;
  hasDownloadAttr?: boolean;
  isModifiedClick?: boolean;
}

/**
 * Pure evaluation function for deciding whether an internal/external link navigation should be intercepted.
 */
export function shouldInterceptNavigation({
  isDirty,
  targetHref,
  currentLocationHref,
  targetAttr,
  hasDownloadAttr,
  isModifiedClick,
}: NavigationInterceptOptions): boolean {
  if (!isDirty) return false;
  if (isModifiedClick) return false;
  if (hasDownloadAttr) return false;
  if (targetAttr && targetAttr !== "_self") return false;
  if (!targetHref || targetHref.startsWith("javascript:")) return false;

  try {
    const targetUrl = new URL(targetHref, currentLocationHref);
    const currentUrl = new URL(currentLocationHref);

    if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
      return false;
    }

    // Ignore exact same page and query, or purely hash/anchor jumps
    if (
      targetUrl.origin === currentUrl.origin &&
      targetUrl.pathname === currentUrl.pathname &&
      targetUrl.search === currentUrl.search
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
