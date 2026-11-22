import "server-only";
import { revalidatePath } from "next/cache";

let revalidationHook: ((path: string) => void) | null = null;

/**
 * Sets a hook to verify cache revalidation in unit tests.
 */
export function setRevalidationHookForTesting(hook: ((path: string) => void) | null) {
  revalidationHook = hook;
}

/**
 * Safely revalidates the public blog cache across on-demand Next.js ISR.
 * Catches errors in test/mock environments where Next.js static store is inactive.
 * When a slug is provided, both /blog and /blog/[slug] are revalidated.
 */
export function revalidateBlogCache(slug?: string) {
  if (revalidationHook) {
    revalidationHook("/blog");
    if (slug) {
      revalidationHook(`/blog/${slug}`);
    }
  }
  try {
    revalidatePath("/blog");
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
  } catch {
    // In unit test or non-Next.js environments, static generation store is not initialized
  }
}
