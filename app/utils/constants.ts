/**
 * Shared constants usable in both server and client components.
 * Do not import browser-only code here.
 */
export const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL ?? "https://admin.houseofsenses.vn"
    : process.env.NEXT_PUBLIC_API_URL ?? "http://admin.houseofsenses.vn";
