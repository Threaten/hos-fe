/**
 * Utility functions for handling domain and tenant URL construction
 */

/**
 * Get the base domain from the current hostname
 * Works in both development (localhost) and production
 *
 * Examples:
 * - localhost:3001 → localhost:3001
 * - red-bistro.houseofsenses.vn → houseofsenses.vn
 * - houseofsenses.vn → houseofsenses.vn
 *
 * @returns The base domain string
 */
export function getBaseDomain(): string {
  if (typeof window === "undefined") {
    return "houseofsenses.vn"; // Default for SSR
  }

  const hostname = window.location.hostname;

  // Development: localhost
  if (hostname.includes("localhost")) {
    return `localhost:${window.location.port || "3001"}`;
  }

  // Production: Extract base domain (last 2 parts)
  const parts = hostname.split(".");
  if (parts.length >= 2) {
    return parts.slice(-2).join(".");
  }

  return hostname;
}

/**
 * Construct a tenant URL for the given slug
 * Preserves protocol (http/https) and handles both dev and production
 *
 * @param slug - The tenant slug (e.g., "red-bistro")
 * @returns Complete URL (e.g., "http://red-bistro.houseofsenses.vn")
 */
export function getTenantUrl(slug: string): string {
  if (typeof window === "undefined") {
    return `https://${slug}.houseofsenses.vn`; // Default for SSR
  }

  const protocol = window.location.protocol;
  const baseDomain = getBaseDomain();

  return `${protocol}//${slug}.${baseDomain}`;
}

/**
 * Get the current subdomain (tenant slug) from the hostname
 *
 * Examples:
 * - red-bistro.houseofsenses.vn → "red-bistro"
 * - houseofsenses.vn → null
 * - localhost:3001 → null
 *
 * @returns The subdomain string or null if no subdomain
 */
export function getCurrentSubdomain(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const hostname = window.location.hostname;

  // No subdomain for localhost
  if (hostname.includes("localhost")) {
    return null;
  }

  const parts = hostname.split(".");

  // If we have more than 2 parts (subdomain.domain.tld), return the subdomain
  if (parts.length > 2) {
    return parts[0];
  }

  return null;
}

/**
 * Check if we're on the main domain (not a subdomain)
 *
 * @returns true if on main domain, false if on subdomain
 */
export function isMainDomain(): boolean {
  return getCurrentSubdomain() === null;
}
