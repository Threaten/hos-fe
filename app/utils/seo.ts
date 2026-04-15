import type { Metadata } from 'next'

const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL || 'https://admin.houseofsenses.vn'
    : process.env.NEXT_PUBLIC_API_URL || 'http://admin.houseofsenses.vn'

const BASE_DOMAIN = 'houseofsenses.vn'

// Cache tenant configs within the render cycle (module-level cache resets on redeploy)
const tenantConfigCache = new Map<string, TenantConfig | null>()

export interface TenantConfig {
  name: string
  slug: string
  domain?: string
  description?: string
  logoUrl?: string
}

/**
 * Get the canonical base URL for a tenant.
 * Development: http://{slug}.localhost:3001
 * Production:  https://{slug}.houseofsenses.vn
 */
export function getTenantBaseUrl(tenantConfig: TenantConfig | null): string {
  const slug = tenantConfig?.domain || tenantConfig?.slug
  if (!slug) return `https://${BASE_DOMAIN}`

  if (process.env.NODE_ENV === 'development') {
    return `http://${slug}.localhost:3001`
  }
  return `https://${slug}.${BASE_DOMAIN}`
}

/**
 * Fetch and cache tenant config server-side via Payload REST API.
 * Uses `domain` field as the slug identifier.
 */
export async function fetchTenantConfigForSEO(
  tenantSlug: string,
): Promise<TenantConfig | null> {
  if (tenantConfigCache.has(tenantSlug)) {
    return tenantConfigCache.get(tenantSlug) ?? null
  }

  try {
    const url = `${API_URL}/api/tenants?where[domain][equals]=${encodeURIComponent(tenantSlug)}&depth=1&limit=1`
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      tenantConfigCache.set(tenantSlug, null)
      return null
    }

    const data = await response.json()
    const tenant = data?.docs?.[0]

    if (tenant) {
      const config: TenantConfig = {
        name: tenant.name || 'House of Senses',
        slug: tenant.domain || tenantSlug,
        domain: tenant.domain,
        description: tenant.heroDescription || undefined,
        logoUrl: tenant.logo?.url ? `${API_URL}${tenant.logo.url}` : undefined,
      }
      tenantConfigCache.set(tenantSlug, config)
      return config
    }
  } catch (error) {
    console.warn(`[fetchTenantConfigForSEO] Error fetching tenant "${tenantSlug}":`, error)
  }

  tenantConfigCache.set(tenantSlug, null)
  return null
}

/**
 * Page-level overrides passed to generateTenantMetadata.
 */
export interface PageSEOOptions {
  /** Page title — will be combined as "{title} | {tenantName}" */
  title?: string
  /** Page description — overrides tenant description */
  description?: string
  /** Absolute URL of the OG image */
  ogImageUrl?: string
  /** Page path relative to tenant root (e.g. "about", "gallery") */
  path?: string
  /** Open Graph type — default "website" */
  type?: 'website' | 'article'
  /** Exclude from search engine indexing */
  noIndex?: boolean
}

/**
 * Human-readable labels for well-known route segments.
 */
const PAGE_LABELS: Record<string, string> = {
  about: 'About',
  gallery: 'Gallery',
  menu: 'Menu',
  contact: 'Contact',
  reservation: 'Reservation',
}

/**
 * Generate Next.js Metadata for a tenant page.
 *
 * @param tenantSlug - The subdomain / domain field value for the tenant
 * @param page       - Optional page-level overrides
 */
export async function generateTenantMetadata(
  tenantSlug: string,
  page?: PageSEOOptions,
): Promise<Metadata> {
  const tenantConfig = await fetchTenantConfigForSEO(tenantSlug)
  const baseUrl = getTenantBaseUrl(tenantConfig)
  const siteName = tenantConfig?.name || 'House of Senses'

  // Resolve page path label
  const pathLabel = page?.path ? PAGE_LABELS[page.path] || page.path : undefined

  // Build title
  const rawTitle = page?.title || pathLabel
  const title = rawTitle ? `${rawTitle} | ${siteName}` : siteName

  // Build description
  const description =
    page?.description ||
    tenantConfig?.description ||
    `Experience exceptional fine dining at ${siteName}.`

  // Build canonical URL
  const canonicalUrl = page?.path ? `${baseUrl}/${page.path}` : baseUrl

  // Build OG image — prefer explicit override, then tenant logo, then default
  const ogImageUrl =
    page?.ogImageUrl ||
    tenantConfig?.logoUrl ||
    `${baseUrl}/og-default.jpg`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      locale: 'en_US',
      type: page?.type || 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !page?.noIndex,
      follow: !page?.noIndex,
      googleBot: {
        index: !page?.noIndex,
        follow: !page?.noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
