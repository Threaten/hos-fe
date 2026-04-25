import { MetadataRoute } from "next";
import { API_URL } from "@/app/utils/constants";

export const revalidate = 3600; // regenerate every hour

const BASE_URL = "https://houseofsenses.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Fetch all active tenant domains
  let tenantUrls: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${API_URL}/api/tenants?depth=0&limit=100`,
      { next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const json = await res.json();
      const tenantPages = [
        { path: "",           changeFrequency: "weekly"  as const, priority: 1.0 },
        { path: "/about",     changeFrequency: "monthly" as const, priority: 0.8 },
        { path: "/menu",      changeFrequency: "weekly"  as const, priority: 0.9 },
        { path: "/gallery",   changeFrequency: "weekly"  as const, priority: 0.7 },
        { path: "/contact",   changeFrequency: "monthly" as const, priority: 0.6 },
        { path: "/reservation", changeFrequency: "monthly" as const, priority: 0.9 },
      ];
      for (const t of (json?.docs ?? []) as Array<{ domain: string }>) {
        const base = `https://${t.domain}.houseofsenses.vn`;
        for (const page of tenantPages) {
          tenantUrls.push({
            url: `${base}${page.path}`,
            lastModified: now,
            changeFrequency: page.changeFrequency,
            priority: page.priority,
          });
        }
      }
    }
  } catch {
    // fallback: empty tenant list
  }

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tenantUrls,
  ];
}
