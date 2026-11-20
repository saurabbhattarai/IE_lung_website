/**
 * Formats an article publication date consistently using UTC / date-only components.
 * Prevents 1-day shifts across US timezones (e.g. Pacific Time vs UTC).
 * 
 * Example:
 *   formatArticleDate("2026-10-28T12:00:00.000Z") => "October 28, 2026"
 */

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function formatArticleDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) {
    return "";
  }

  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(d.getTime())) {
    return "";
  }

  const month = MONTH_NAMES[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();

  return `${month} ${day}, ${year}`;
}
