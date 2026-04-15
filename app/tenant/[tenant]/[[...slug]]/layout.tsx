import type { Metadata } from 'next'
import { generateTenantMetadata } from '@/app/utils/seo'

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

export default function SlugLayout({ children }: SlugLayoutProps) {
  return <>{children}</>
}
