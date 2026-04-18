import type { Metadata } from 'next'
import { generateTenantMetadata, fetchTenantConfigForSEO, getTenantBaseUrl, buildTenantJsonLd } from '@/app/utils/seo'
import { JsonLd } from '@/app/components/JsonLd'

interface SlugLayoutProps {
  children: React.ReactNode
  params: Promise<{ tenant: string; slug?: string[] }>
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
  const tenantConfig = await fetchTenantConfigForSEO(tenantSlug)
  const baseUrl = getTenantBaseUrl(tenantConfig)
  const jsonLd = buildTenantJsonLd(tenantConfig, baseUrl)

  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  )
}
