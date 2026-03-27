"use client";

import { useState, useEffect } from "react";
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

export default function TenantPage() {
  const params = useParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewMenuModal, setShowNewMenuModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);

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

  useEffect(() => {
    console.log("🔄 useEffect triggered - tenantSlug:", tenantSlug);
    if (tenantSlug) {
      fetchTenantBySlug(tenantSlug).then((data) => {
        console.log("📦 Tenant data fetched:", data);
        if (data) {
          setTenant(data);

          // Show modal if tenant has new menu items
          if (data.newMenu && data.newMenu.length > 0) {
            const seenMenuKey = `seen-menu-${data.id}`;
            const hasSeenMenu = localStorage.getItem(seenMenuKey);

            // TEMPORARY: Always show modal for testing - remove the localStorage check
            setShowNewMenuModal(true);
          }
        }
        setLoading(false);
      });
    } else {
      console.warn("⚠️ No tenantSlug provided");
      setLoading(false);
    }
  }, [tenantSlug]);

  // Fetch gallery images
  useEffect(() => {
    const loadGallery = async () => {
      const images = await fetchGallery(tenant?.id);
      // Take only first 6 images for featured section
      setGalleryImages(images.slice(0, 6));
    };
    if (tenant?.id) {
      loadGallery();
    }
  }, [tenant?.id]);

  const handleCloseModal = () => {
    setShowNewMenuModal(false);
    if (tenant?.id) {
      localStorage.setItem(`seen-menu-${tenant.id}`, "true");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!tenant) {
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
  switch (pathname) {
    case "":
    case "home":
      return (
        <div className="">
          <Hero tenant={tenant} />
          <ShortAbout tenant={tenant} />
          {/* <h4 className="w-full border-t-2 border-b-2 font-extrabold text-3xl h-16 mt-12 mb-12 border-[rgb(124,118,89)]/40 text-center items-center justify-center flex animate-slide-in-up">
            Explore our featured Menu
          </h4>
          <FeaturedMenu /> */}
          {/* <div className="w-full border-t-2 border-b-2 h-20 mt-12 mb-12 border-[rgb(124,118,89)]/40 text-center items-center justify-center flex">
            <Link
              href={`/menu`}
              className="px-12 py-3 hover:border-b-2 hover:border-[rgb(124,118,89)]/40 text-center justify-center items-center flex text-gray-900 transition-all duration-300 text-lg tracking-wider font-semibold hover:scale-105"
            >
              See all Menu
            </Link>
          </div> */}
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

          {/* New Menu Modal */}
          <NewMenuModal
            images={tenant?.newMenu || []}
            isOpen={showNewMenuModal}
            onClose={handleCloseModal}
            tenantName={tenant?.name}
          />
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
}
