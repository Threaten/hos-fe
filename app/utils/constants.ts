/**
 * Shared constants usable in both server and client components.
 * Do not import browser-only code here.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://admin.houseofsenses.vn";
