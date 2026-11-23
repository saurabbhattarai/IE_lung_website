export interface SubscriberExportRecord {
  email: string;
  status: string;
  subscribedAt: Date | string | null;
  unsubscribedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Sanitizes a single CSV field value to prevent spreadsheet formula injection (CSV injection)
 * and properly escape standard CSV delimiter characters.
 *
 * Formula injection protection:
 * If a string begins with '=', '+', '-', '@', '\t', or '\r', OR has leading whitespace
 * followed by any of those formula characters (e.g. " =SUM(...)"), it is prefixed
 * with a single quote (') to force spreadsheet software (Excel, Calc, Sheets) to treat
 * it as raw text rather than an executable formula or command.
 *
 * Legitimate numbers:
 * If the value is a number (e.g. -42, 3.14), or a pure numeric string (e.g. "-42"),
 * it is not user-controlled formula code and is not corrupted with a quote prefix.
 *
 * CSV delimiter and quote escaping (RFC 4180):
 * If a value contains a comma (,), double quote ("), newline (\n), or carriage return (\r),
 * the field is enclosed in double quotes and internal quotes are doubled ("").
 */
export function sanitizeCsvField(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  // 1. Preserve pure numeric types without formula prefixing
  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }

  let str = String(value);

  // Check if string is a legitimate negative number (e.g. "-123" or "-123.45")
  const isPureNegativeNumber = /^-?\d+(\.\d+)?$/.test(str.trim());

  if (!isPureNegativeNumber) {
    const formulaTriggers = ["=", "+", "-", "@", "\t", "\r"];
    const trimmed = str.trimStart();

    const isFormula =
      formulaTriggers.some((prefix) => str.startsWith(prefix)) ||
      formulaTriggers.some((prefix) => trimmed.startsWith(prefix));

    if (isFormula) {
      str = `'${str}`;
    }
  }

  // 2. CSV delimiter and quote escaping (RFC 4180)
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Formats a date value consistently for CSV output (ISO 8601).
 */
export function formatCsvDate(dateValue: Date | string | null | undefined): string {
  if (!dateValue) {
    return "";
  }
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) {
      return "";
    }
    return d.toISOString();
  } catch {
    return "";
  }
}

/**
 * Generates an RFC 4180-compliant UTF-8 CSV string from subscriber records.
 * Prepends a UTF-8 BOM (\uFEFF) to ensure Microsoft Excel correctly recognizes UTF-8 encoding.
 */
export function generateSubscribersCsv(
  subscribers: SubscriberExportRecord[]
): string {
  const headers = [
    "Email",
    "Status",
    "SubscribedAt",
    "UnsubscribedAt",
    "CreatedAt",
    "UpdatedAt",
  ];

  const headerLine = headers.map(sanitizeCsvField).join(",");

  const rows = subscribers.map((sub) => {
    return [
      sanitizeCsvField(sub.email),
      sanitizeCsvField(sub.status),
      sanitizeCsvField(formatCsvDate(sub.subscribedAt)),
      sanitizeCsvField(formatCsvDate(sub.unsubscribedAt)),
      sanitizeCsvField(formatCsvDate(sub.createdAt)),
      sanitizeCsvField(formatCsvDate(sub.updatedAt)),
    ].join(",");
  });

  return "\uFEFF" + [headerLine, ...rows].join("\r\n");
}
