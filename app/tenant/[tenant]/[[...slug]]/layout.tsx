import type { Metadata } from 'next'
import { generateTenantMetadata, fetchTenantConfigForSEO, getTenantBaseUrl, buildTenantJsonLd } from '@/app/utils/seo'
import { JsonLd } from '@/app/components/JsonLd'
import { API_URL } from '@/app/utils/constants'

interface SlugLayoutProps {
  children: React.ReactNode
  params: Promise<{ tenant: string; slug?: string[] }>
}

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

// Same request as the page's tenant fetch, so Next dedupes it
async function fetchTenantMainColor(slug: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/tenants?where[domain][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return null
    const json = await res.json()
    const color: unknown = json?.docs?.[0]?.mainColor
    return typeof color === 'string' && HEX_COLOR.test(color.trim()) ? color.trim() : null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string; slug?: string[] }>
}): Promise<Metadata> {
  const { tenant, slug } = await params
  const currentPage = slug?.[0]

  return generateTenantMetadata(tenant, currentPage ? { path: currentPage } : undefined)
}

export default async function SlugLayout({ children, params }: SlugLayoutProps) {
  const { tenant: tenantSlug } = await params
  const [tenantConfig, mainColor] = await Promise.all([
    fetchTenantConfigForSEO(tenantSlug),
    fetchTenantMainColor(tenantSlug),
  ])
  const baseUrl = getTenantBaseUrl(tenantConfig)
  const jsonLd = buildTenantJsonLd(tenantConfig, baseUrl)

  return (
    <>
      {/* Brand color from the backend, applied on the server so there is no flash of the default */}
      {mainColor && <style>{`:root { --color-main: ${mainColor}; }`}</style>}
      <JsonLd data={jsonLd} />
      {children}
    </>
  )
}
