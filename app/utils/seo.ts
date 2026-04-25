import type { Metadata } from 'next'

const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL || 'https://admin.houseofsenses.vn'
    : process.env.NEXT_PUBLIC_API_URL || 'http://admin.houseofsenses.vn'

const BASE_DOMAIN = 'houseofsenses.vn'



export interface TenantConfig {
  name: string
  slug: string
  domain?: string
  description?: string
  logoUrl?: string
  address?: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  facebook?: string
  instagram?: string
  /** Manually overridden SEO title from CMS */
  metaTitle?: string
  /** Manually overridden SEO description from CMS */
  metaDescription?: string
  /** Manually overridden SEO image from CMS */
  metaImageUrl?: string
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
  try {
    const url = `${API_URL}/api/tenants?where[domain][equals]=${encodeURIComponent(tenantSlug)}&depth=1&limit=1`
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) return null

    const data = await response.json()
    const tenant = data?.docs?.[0]

    if (tenant) {
      return {
        name: tenant.name || 'House of Senses',
        slug: tenant.domain || tenantSlug,
        domain: tenant.domain,
        // heroDescription is frontend display text, not an SEO description — use meta.description only
        description: undefined,
        logoUrl: tenant.logo?.url ? `${API_URL}${tenant.logo.url}` : undefined,
        address: tenant.address || undefined,
        latitude: tenant.location?.latitude ?? undefined,
        longitude: tenant.location?.longitude ?? undefined,
        phone: tenant.phone || undefined,
        email: tenant.email || undefined,
        facebook: tenant.facebook || undefined,
        instagram: tenant.instagram || undefined,
        metaTitle: tenant.meta?.title || undefined,
        metaDescription: tenant.meta?.description || undefined,
        metaImageUrl: tenant.meta?.image?.url
          ? (tenant.meta.image.url.startsWith('http') ? tenant.meta.image.url : `${API_URL}${tenant.meta.image.url}`)
          : undefined,
      }
    }
  } catch {
    // ignore
  }

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

/** Page-specific descriptions appended when no override is provided. */
const PAGE_DESCRIPTIONS: Record<string, (siteName: string) => string> = {
  about: (n) => `Learn the story behind ${n} — our philosophy, our chefs, and the passion for exceptional fine dining.`,
  gallery: (n) => `Explore the ${n} gallery — a visual journey through our restaurant spaces and signature dishes.`,
  menu: (n) => `Discover the ${n} menu — a curated selection of contemporary Vietnamese and international cuisine.`,
  contact: (n) => `Get in touch with ${n}. Find our location, phone number, email, and send us a message.`,
  reservation: (n) => `Reserve your table at ${n}. Book online for an unforgettable fine dining experience.`,
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

  // Build title — CMS override > page path label > "Tenant | House of Senses"
  const rawTitle = page?.title || tenantConfig?.metaTitle || pathLabel
  const title = rawTitle
    ? `${rawTitle} | ${siteName}`
    : `${siteName} | House of Senses`

  // Build description — CMS meta.description > page-specific > fallback, then append address
  const pageDescFn = page?.path ? PAGE_DESCRIPTIONS[page.path] : undefined
  const baseDescription =
    page?.description ||
    tenantConfig?.metaDescription ||
    (pageDescFn ? pageDescFn(siteName) : null) ||
    `Experience exceptional fine dining at ${siteName}.`
  // Append address for location context, but only once and only from the dedicated address field
  const description = tenantConfig?.address
    ? `${baseDescription} Located at ${tenantConfig.address}.`
    : baseDescription

  // Build canonical URL
  const canonicalUrl = page?.path ? `${baseUrl}/${page.path}` : baseUrl

  // OG image — CMS meta.image > explicit override > tenant logo > default
  const ogImageUrl =
    tenantConfig?.metaImageUrl ||
    page?.ogImageUrl ||
    tenantConfig?.logoUrl ||
    `https://houseofsenses.vn/media/IMG_0050.JPG`

  const keywords = [
    siteName,
    'fine dining Vietnam',
    'restaurant',
    'bistro',
    'Vietnamese cuisine',
    'contemporary cuisine',
    'international cuisine',
    'coffee shop Vietnam',
    'cafe Ho Chi Minh City',
    'wine bar Vietnam',
    'wine dining',
    'date night restaurant Vietnam',
    'romantic restaurant Ho Chi Minh City',
    'couple dining',
    'cozy restaurant',
    'aesthetic cafe',
    'vibe restaurant',
    'upscale dining',
    'luxury dining Vietnam',
    'cocktail bar Ho Chi Minh City',
    'brunch Ho Chi Minh City',
    'dinner Ho Chi Minh City',
    'Saigon restaurant',
    'Saigon fine dining',
    'HCMC restaurant',
    'best restaurant Vietnam',
    'intimate dining',
    'special occasion restaurant',
    'anniversary dinner Vietnam',
    'foodie Vietnam',
    'House of Senses',
    'ẩm thực Sài Gòn',
    'nhà hàng ngon Sài Gòn',
    'nhà hàng lãng mạn',
    'quán cafe đẹp',
    'Xuan Hoa Ward',
    'Phuong Xuan Hoa',
    'phường Xuân Hòa',
    'Quan 3',
    'quận 3',
    'District 3 Ho Chi Minh City',
    'restaurant District 3 Saigon',
    ...(page?.path ? [PAGE_LABELS[page.path] || page.path] : []),
    ...(tenantConfig?.address ? [tenantConfig.address] : []),
  ].filter(Boolean)

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      locale: 'vi_VN',
      alternateLocale: 'en_US',
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
      site: '@houseofsenses',
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
    other: {
      'geo.region': 'VN',
      ...(tenantConfig?.address ? {
        'geo.placename': tenantConfig.address,
        'address': tenantConfig.address,
      } : {}),
      ...(tenantConfig?.latitude != null && tenantConfig?.longitude != null ? {
        'geo.position': `${tenantConfig.latitude};${tenantConfig.longitude}`,
        'ICBM': `${tenantConfig.latitude}, ${tenantConfig.longitude}`,
      } : {}),
      ...(tenantConfig?.phone ? { 'telephone': tenantConfig.phone } : {}),
      ...(tenantConfig?.email ? { 'email': tenantConfig.email } : {}),
    },
  }
}

/**
 * Build a JSON-LD Restaurant schema object for a given tenant.
 * Render it with <JsonLd data={buildTenantJsonLd(config)} /> in a server layout.
 */
export function buildTenantJsonLd(
  tenantConfig: TenantConfig | null,
  baseUrl: string,
): object {
  const name = tenantConfig?.name || 'House of Senses'
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name,
    url: baseUrl,
    ...(tenantConfig?.logoUrl ? { logo: tenantConfig.logoUrl, image: tenantConfig.logoUrl } : {
      image: 'https://houseofsenses.vn/media/IMG_0050.JPG',
    }),
    description: tenantConfig?.address
      ? `${tenantConfig?.metaDescription || `Experience exceptional fine dining at ${name}.`} Located at ${tenantConfig.address}.`
      : (tenantConfig?.metaDescription || `Experience exceptional fine dining at ${name}.`),
    servesCuisine: ['Vietnamese', 'Contemporary', 'International'],
    priceRange: '$$$',
    currenciesAccepted: 'VND, USD',
    paymentAccepted: 'Cash, Credit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: tenantConfig?.address || undefined,
      addressCountry: 'VN',
    },
    ...(tenantConfig?.latitude != null && tenantConfig?.longitude != null ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: tenantConfig.latitude,
        longitude: tenantConfig.longitude,
      },
      hasMap: `https://maps.google.com/?q=${tenantConfig.latitude},${tenantConfig.longitude}`,
    } : {}),
    ...(tenantConfig?.phone ? { telephone: tenantConfig.phone } : {}),
    ...(tenantConfig?.email ? { email: tenantConfig.email } : {}),
    ...(() => {
      const sameAs: string[] = []
      if (tenantConfig?.facebook) sameAs.push(tenantConfig.facebook.startsWith('http') ? tenantConfig.facebook : `https://www.facebook.com/${tenantConfig.facebook}`)
      if (tenantConfig?.instagram) sameAs.push(tenantConfig.instagram.startsWith('http') ? tenantConfig.instagram : `https://www.instagram.com/${tenantConfig.instagram}`)
      return sameAs.length ? { sameAs } : {}
    })(),
    parentOrganization: {
      '@type': 'Organization',
      name: 'House of Senses',
      url: 'https://houseofsenses.vn',
    },
  }
}
