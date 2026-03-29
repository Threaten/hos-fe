"use client";

import { useState, useEffect } from "react";
import Hero from "./_components/Hero";
import ShortAbout from "./_components/ShortAbout";
import Gallery from "./_components/Gallery";
import CTA from "../components/CTA";
import NewMenuModal from "../components/NewMenuModal";
import Link from "next/link";
import {
  fetchTenantBySlug,
  fetchGallery,
  type Tenant,
  type GalleryItem,
  API_URL,
} from "@/api/queries";

export default function Home() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [showNewMenuModal, setShowNewMenuModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);

  // Detect if we're on a tenant subdomain and fetch tenant data
  useEffect(() => {
    const checkSubdomain = async () => {
      const { getCurrentSubdomain } = await import("@/app/utils/domain");
      const subdomain = getCurrentSubdomain();

      if (subdomain && subdomain !== "admin") {
        fetchTenantBySlug(subdomain)
          .then((data) => {
            if (data) {
              setTenant(data);
              // Show modal if tenant has new menu items
              if (data.newMenu && data.newMenu.length > 0) {
                // Check if user has already seen this menu (stored in localStorage)
                const seenMenuKey = `seen-menu-${data.id}`;
                const hasSeenMenu = localStorage.getItem(seenMenuKey);

                if (!hasSeenMenu) {
                  setShowNewMenuModal(true);
                }
              }
            }
          })
          .catch((err) => {
            console.error("Error fetching tenant:", err);
          });
      }
    };

    checkSubdomain();
  }, []);

  // Fetch gallery images
  useEffect(() => {
    const loadGallery = async () => {
      const images = await fetchGallery();
      // Take only first 6 images for featured section
      setGalleryImages(images.slice(0, 6));
    };
    loadGallery();
  }, []);

  const handleCloseModal = () => {
    setShowNewMenuModal(false);
    // Mark menu as seen so it doesn't show again
    if (tenant?.id) {
      localStorage.setItem(`seen-menu-${tenant.id}`, "true");
    }
  };

  // Transform gallery items to match Gallery component's expected format
  const transformedImages = galleryImages.map((item) => ({
    src: item.image?.url ? `${API_URL}${item.image.url}` : "",
    alt: item.caption || item.image?.alt || "Gallery image",
    branch: item.branch?.name || "",
    caption: item.caption || "",
  }));

  return (
    <div className="">
      {/* Preload hero images into <head> so they fetch even while the modal is visible */}
      {tenant?.heroImagesList?.filter((item) => item.image?.url).map((item, idx) => (
        <link
          key={`hero-preload-${idx}`}
          rel="preload"
          as="image"
          href={`${API_URL}${item.image!.url}`}
          // @ts-expect-error fetchpriority is a valid attribute
          fetchpriority="high"
        />
      ))}
      <Hero tenant={tenant} />
      <ShortAbout tenant={tenant} />
      <h4 className="w-full border-t-2 border-b-2 font-extrabold text-3xl h-16 mt-12 mb-12 border-[rgb(124,118,89)]/40 text-center items-center justify-center flex animate-slide-in-up">
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
        tenantName={tenant?.name || "Restaurant"}
      />
    </div>
  );
}
