"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { notFound, useParams } from "next/navigation";
import Hero from "../../../(main)/home/_components/Hero";
import ShortAbout from "../../../(main)/home/_components/ShortAbout";
import FeaturedMenu from "../../../(main)/home/_components/FeaturedMenu";
import Gallery from "../../../(main)/home/_components/Gallery";
import CTA from "../../../(main)/components/CTA";
import NewMenuModal from "../../../(main)/components/NewMenuModal";
import AboutPage from "../../../(main)/about/page";
import GalleryPage from "../../../(main)/gallery/page";
import ContactForm from "../../../(main)/contact/_components/ContactForm";
import ReservationForm from "../../../(main)/reservation/_components/ReservationForm";
import TenantFlipbookWrapper from "../../../(main)/menu/_components/TenantFlipbookWrapper";
import Link from "next/link";
import {
  fetchTenantBySlug,
  fetchGallery,
  API_URL,
  type Tenant,
  type GalleryItem,
} from "@/api/queries";

function preloadImages(urls: string[]): Promise<void> {
  if (urls.length === 0) return Promise.resolve();
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        }),
    ),
  ).then(() => undefined);
}

export default function TenantPage() {
  const params = useParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenantNotFound, setTenantNotFound] = useState(false);
  const [showNewMenuModal, setShowNewMenuModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const tenantLoadedRef = useRef(false);
  const galleryLoadedRef = useRef(false);
  const tenantDataRef = useRef<Tenant | null>(null);
  const galleryDataRef = useRef<GalleryItem[]>([]);
  const loadingStartedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tenantSlug = Array.isArray(params?.tenant)
    ? params.tenant[0]
    : params?.tenant;
  const slug = Array.isArray(params?.slug)
    ? params.slug
    : params?.slug
      ? [params.slug]
      : [];
  const pathname = slug?.join("/") || "";

  console.log("🔧 Tenant Page Debug:", {
    params,
    tenantSlug,
    slug,
    pathname,
  });

  const tryFinishLoading = async () => {
    if (!tenantLoadedRef.current || !galleryLoadedRef.current) return;
    if (loadingStartedRef.current) return;
    loadingStartedRef.current = true;

    const t = tenantDataRef.current;
    const g = galleryDataRef.current;

    const imageUrls: string[] = [
      ...(t?.heroImagesList?.flatMap((item) =>
        item.image?.url ? [`${API_URL}${item.image.url}`] : [],
      ) ?? []),
      ...(t?.shortAboutCollages?.flatMap((item) =>
        item.image?.url ? [`${API_URL}${item.image.url}`] : [],
      ) ?? []),
      ...g.flatMap((item) =>
        item.image?.url ? [`${API_URL}${item.image.url}`] : [],
      ),
    ];

    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 8000));
    await Promise.race([preloadImages(imageUrls), timeout]);
    setIsPageLoading(false);
  };

  useEffect(() => {
    console.log("🔄 useEffect triggered - tenantSlug:", tenantSlug);
    if (tenantSlug) {
      fetchTenantBySlug(tenantSlug)
        .then((data) => {
          console.log("📦 Tenant data fetched:", data);
          if (data) {
            setTenant(data);
            tenantDataRef.current = data;

            // Show modal if tenant has new menu items
            if (data.newMenu && data.newMenu.length > 0) {
              const seenMenuKey = `seen-menu-${data.id}`;
              const hasSeenMenu = localStorage.getItem(seenMenuKey);

              // TEMPORARY: Always show modal for testing - remove the localStorage check
              setShowNewMenuModal(true);
            }
          } else {
            setTenantNotFound(true);
            galleryLoadedRef.current = true; // nothing to load
          }
          tenantLoadedRef.current = true;
          tryFinishLoading();
        })
        .catch(() => {
          setTenantNotFound(true);
          galleryLoadedRef.current = true;
          tenantLoadedRef.current = true;
          tryFinishLoading();
        });
    } else {
      console.warn("⚠️ No tenantSlug provided");
      setTenantNotFound(true);
      galleryLoadedRef.current = true;
      tenantLoadedRef.current = true;
      tryFinishLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantSlug]);

  // Fetch gallery images — only after tenant is known
  useEffect(() => {
    if (!tenant?.id) return;
    const loadGallery = async () => {
      const images = await fetchGallery(tenant.id);
      const sliced = images.slice(0, 6);
      setGalleryImages(sliced);
      galleryDataRef.current = sliced;
      galleryLoadedRef.current = true;
      tryFinishLoading();
    };
    loadGallery().catch(() => {
      galleryLoadedRef.current = true;
      tryFinishLoading();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant?.id]);

  const handleCloseModal = () => {
    setShowNewMenuModal(false);
    if (tenant?.id) {
      localStorage.setItem(`seen-menu-${tenant.id}`, "true");
    }
  };

  if (!isPageLoading && (tenantNotFound || !tenant)) {
    notFound();
  }

  // Transform gallery items to match Gallery component's expected format
  const transformedImages = galleryImages.map((item) => ({
    src: item.image?.filename
      ? `${API_URL}/api/media/file/${item.image.filename}`
      : item.image?.url
        ? `${API_URL}${item.image.url}`
        : "",
    alt: item.caption || item.image?.alt || "Gallery image",
    branch: item.branch?.name || "",
    caption: item.caption || "",
  }));

  // Route to appropriate page based on slug
  const renderContent = () => {
    if (!tenant) return null;
    switch (pathname) {
    case "":
    case "home":
      return (
        <div className="">
          <Hero tenant={tenant} />
          <ShortAbout tenant={tenant} />
          <h4 className="w-full border-t-2 border-b-2 font-extrabold text-3xl h-16 mt-12 border-[rgb(124,118,89)]/40 text-center items-center justify-center flex animate-slide-in-up">
            Featured Gallery
          </h4>
          <Gallery images={transformedImages} />
          <div className="w-full border-t-2 border-b-2 h-20 mt-12 mb-12 border-[rgb(124,118,89)]/40 text-center items-center justify-center flex">
            <Link
              href="/gallery"
              className="px-12 py-3 hover:border-b-2 hover:border-[rgb(124,118,89)]/40 text-center justify-center items-center flex text-gray-900 transition-all duration-300 text-lg tracking-wider font-semibold hover:scale-105"
            >
              See all Gallery
            </Link>
          </div>
          <CTA />

          {/* New Menu Modal — only after all images have loaded */}
          {!isPageLoading && (
            <NewMenuModal
              images={tenant?.newMenu || []}
              isOpen={showNewMenuModal}
              onClose={handleCloseModal}
              tenantName={tenant?.name}
            />
          )}
        </div>
      );

    case "about":
      return <AboutPage />;

    case "menu":
      if (!tenant.menu?.url) {
        return (
          <div className="w-full min-h-screen flex flex-col items-center justify-center px-4">
            <h2 className="text-3xl font-bold text-black mb-4">
              Menu Not Available
            </h2>
            <p className="text-gray-600">
              This restaurant hasn&apos;t uploaded their menu yet.
            </p>
          </div>
        );
      }
      // Use the filename directly instead of the url field
      const menuUrl = tenant.menu.filename
        ? `${API_URL}/api/media/file/${tenant.menu.filename}`
        : `${API_URL}${tenant.menu.url}`;

      return (
        <div>
          <TenantFlipbookWrapper menuUrl={menuUrl} tenantName={tenant.name} />
          <CTA />
        </div>
      );

    case "gallery":
      return <GalleryPage />;

    case "contact":
      return <ContactForm currentTenant={tenant.domain} />;

    case "reservation":
      return <ReservationForm currentTenant={tenant.domain} />;

    default:
      notFound();
    }
  };

  return (
    <>
      {/* Full-page loading overlay — portal to body escapes PageTransition's opacity wrapper */}
      {mounted && isPageLoading &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[rgb(247,242,234)]">
            <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 rounded-full border-2 border-[rgb(124,118,89)]/30 border-t-[rgb(124,118,89)] animate-spin" />
              <p className="text-sm tracking-widest uppercase text-[rgb(124,118,89)] font-light">
                Loading
              </p>
            </div>
          </div>,
          document.body,
        )}
      {renderContent()}
    </>
  );
}
