import { notFound } from "next/navigation";
import Hero from "../../../(main)/home/_components/Hero";
import ShortAbout from "../../../(main)/home/_components/ShortAbout";
import CTA from "../../../(main)/components/CTA";
import TenantHomeInteractive from "./TenantHomeInteractive";
import AboutPage from "../../../(main)/about/page";
import GalleryPage from "../../../(main)/gallery/page";
import ContactForm from "../../../(main)/contact/_components/ContactForm";
import ReservationForm from "../../../(main)/reservation/_components/ReservationForm";
import TenantFlipbookWrapper from "../../../(main)/menu/_components/TenantFlipbookWrapper";
import Link from "next/link";
import { API_URL } from "@/app/utils/constants";
import type { Tenant, GalleryItem } from "@/api/queries";

interface PageProps {
  params: Promise<{ tenant: string; slug?: string[] }>;
}

async function fetchTenantServer(slug: string): Promise<Tenant | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/tenants?where[domain][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.docs?.[0] ?? null;
  } catch {
    return null;
  }
}

async function fetchGalleryServer(tenantId: string): Promise<GalleryItem[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/gallery?where[branch][equals]=${encodeURIComponent(tenantId)}&depth=1&limit=6`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.docs ?? [];
  } catch {
    return [];
  }
}

export default async function TenantPage({ params }: PageProps) {
  const { tenant: tenantSlug, slug = [] } = await params;
  const pathname = slug.join("/");

  const tenant = await fetchTenantServer(tenantSlug);
  if (!tenant) notFound();

  switch (pathname) {
    case "":
    case "home": {
      const galleryItems = await fetchGalleryServer(tenant.id);
      const transformedImages = galleryItems.map((item: GalleryItem) => ({
        src: item.image?.filename
          ? `${API_URL}/api/media/file/${item.image.filename}`
          : item.image?.url
            ? `${API_URL}${item.image.url}`
            : "",
        alt: item.caption || item.image?.alt || "Gallery image",
        branch: item.branch?.name || "",
        caption: item.caption || "",
      }));
      return (
        <div>
          <Hero tenant={tenant} />
          <ShortAbout tenant={tenant} />
          {/* ── Gallery section header ── */}
          <div className="px-8 md:px-14 pt-0 pb-4">
            <div className="flex items-center gap-4 mb-3 mt-3 ">
              <span
                className="text-[10px] tracking-[0.38em] uppercase"
                style={{ color: "var(--color-sand)", opacity: 0.95 }}
              >
                03
              </span>
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "var(--color-sand)", opacity: 0.25 }}
              />
              <span
                className="text-[10px] tracking-[0.38em] uppercase"
                style={{ color: "var(--color-sand)", opacity: 0.95 }}
              >
                Gallery
              </span>
            </div>
          </div>
          <TenantHomeInteractive
            transformedImages={transformedImages}
            newMenu={tenant.newMenu ?? []}
            tenantName={tenant.name}
            galleryText={tenant.galleryText}
          />
          {/* ── See all link ── */}
          <div className="px-8 md:px-14 pt-4 pb-8">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase font-light transition-opacity duration-300 hover:opacity-40"
              style={{
                color: "var(--foreground)",
                textDecoration: "underline",
                textUnderlineOffset: "6px",
                textDecorationColor: "var(--color-sand)",
              }}
            >
              View full gallery →
            </Link>
          </div>
          <CTA />
        </div>
      );
    }

    case "about":
      return <AboutPage />;

    case "menu": {
      if (!tenant.menu?.url) {
        return (
          <div className="w-full min-h-screen flex flex-col items-center justify-center px-4">
            <h2 className="text-3xl font-bold text-black mb-4">
              Menu Not Available
            </h2>
            <p className="text-foreground/85">
              This restaurant hasn&apos;t uploaded their menu yet.
            </p>
          </div>
        );
      }
      const menuUrl = tenant.menu.filename
        ? `${API_URL}/api/media/file/${tenant.menu.filename}`
        : `${API_URL}${tenant.menu.url}`;
      return (
        <div>
          <TenantFlipbookWrapper menuUrl={menuUrl} tenantName={tenant.name} />
          <CTA />
        </div>
      );
    }

    case "gallery":
      return <GalleryPage />;

    case "contact":
      return <ContactForm currentTenant={tenant.domain} />;

    case "reservation":
      return <ReservationForm currentTenant={tenant.domain} />;

    default:
      notFound();
  }
}
