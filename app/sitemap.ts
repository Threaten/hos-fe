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
      tenantUrls = (json?.docs ?? []).map((t: { domain: string }) => ({
        url: `https://${t.domain}.houseofsenses.vn`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));
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
