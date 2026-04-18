import { MetadataRoute } from "next";
import { API_URL } from "@/app/utils/constants";

interface TenantSitemapProps {
  params: Promise<{ tenant: string }>;
}

/**
 * Per-tenant sitemap served at `[tenant].houseofsenses.vn/sitemap.xml`.
 *
 * How it works:
 * The middleware rewrites `[tenant].houseofsenses.vn/sitemap.xml`
 * to `/tenant/[tenant]/sitemap.xml` internally, so Next.js picks up
 * this file and generates the sitemap for that specific subdomain.
 */
export default async function sitemap({
  params,
}: TenantSitemapProps): Promise<MetadataRoute.Sitemap> {
  const { tenant: slug } = await params;

  // Verify the tenant exists before generating a sitemap
  let tenantExists = false;
  try {
    const res = await fetch(
      `${API_URL}/api/tenants?where[domain][equals]=${encodeURIComponent(slug)}&depth=0&limit=1`,
      { next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const json = await res.json();
      tenantExists = (json?.docs?.length ?? 0) > 0;
    }
  } catch {
    // Return empty sitemap if API is unreachable
  }

  if (!tenantExists) return [];

  const base = `https://${slug}.houseofsenses.vn`;
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/menu`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/reservation`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
