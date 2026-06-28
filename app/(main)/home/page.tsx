"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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

export default function Home() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [showNewMenuModal, setShowNewMenuModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loadingPhase, setLoadingPhase] = useState<
    "loading" | "fading" | "done"
  >("loading");
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [galleryDividerVisible, setGalleryDividerVisible] = useState(false);
  const [ctaLinkVisible, setCtaLinkVisible] = useState(false);
  const galleryDividerRef = useRef<HTMLDivElement>(null);
  const ctaLinkRef = useRef<HTMLDivElement>(null);

  // Mount after hydration so that createPortal targets document.body safely
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Gallery divider reveal
  useEffect(() => {
    const el = galleryDividerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGalleryDividerVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // CTA link reveal
  useEffect(() => {
    const el = ctaLinkRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCtaLinkVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Safety: always dismiss the overlay within 8 s regardless of network/hero state
  useEffect(() => {
    const t = setTimeout(() => dismissOverlay(), 8000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHeroReady = () => {
    heroReadyRef.current = true;
    if (dataReadyRef.current) dismissOverlay();
  };

  const tenantLoadedRef = useRef(false);
  const galleryLoadedRef = useRef(false);
  const tenantDataRef = useRef<Tenant | null>(null);
  const galleryDataRef = useRef<GalleryItem[]>([]);
  const dataReadyRef = useRef(false);
  const heroReadyRef = useRef(false);
  const dismissedRef = useRef(false);

  const dismissOverlay = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    requestAnimationFrame(() => {
      setLoadingPhase("fading");
      setTimeout(() => setLoadingPhase("done"), 350);
    });
  };

  const tryFinishLoading = async () => {
    if (!tenantLoadedRef.current || !galleryLoadedRef.current) return;

    const t = tenantDataRef.current;
    const g = galleryDataRef.current;

    const imageUrls: string[] = [
      ...(t?.heroImagesList?.flatMap((item) =>
        item.image?.url ? [`${API_URL}${item.image.url}`] : [],
      ) ?? []),
      ...(t?.shortAboutCollages?.flatMap((item) =>
        item.image?.url ? [`${API_URL}${item.image.url}`] : [],
      ) ?? []),
      ...(t?.homeGalleryImage?.url
        ? [`${API_URL}${t.homeGalleryImage.url}`]
        : []),
      ...g.flatMap((item) =>
        item.image?.url ? [`${API_URL}${item.image.url}`] : [],
      ),
    ];

    // Always show the overlay for at least 400ms so it can't be batched away
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 400));
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 6000));
    await Promise.all([
      Promise.race([preloadImages(imageUrls), timeout]),
      minDelay,
    ]);
    // Mark data (network) as ready
    dataReadyRef.current = true;
    // If the tenant has no hero images there's nothing for Hero to signal
    const hasHeroImages = (t?.heroImagesList?.length ?? 0) > 0;
    if (!hasHeroImages) heroReadyRef.current = true;
    if (heroReadyRef.current) dismissOverlay();
  };

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
              tenantDataRef.current = data;
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
            tenantLoadedRef.current = true;
            tryFinishLoading();
          })
          .catch(() => {
            tenantLoadedRef.current = true;
            tryFinishLoading();
          });
      } else {
        tenantLoadedRef.current = true;
        tryFinishLoading();
      }
    };

    checkSubdomain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch gallery images
  useEffect(() => {
    const loadGallery = async () => {
      const images = await fetchGallery();
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
      {/* Scroll progress bar */}
      {mounted && (
        <div
          className="fixed top-0 left-0 z-10000 h-px transition-none pointer-events-none"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: "var(--color-earth)",
            opacity: 0.7,
          }}
        />
      )}
      {/* Full-page loading overlay — portal to body escapes PageTransition's opacity */}
      {mounted &&
        loadingPhase !== "done" &&
        createPortal(
          <div
            className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[rgb(247,242,234)] transition-opacity duration-300 ${loadingPhase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 rounded-full border-2 border-[rgb(124,118,89)]/30 border-t-[rgb(124,118,89)] animate-spin" />
              <p className="text-sm tracking-widest uppercase text-[rgb(124,118,89)] font-light">
                Loading
              </p>
            </div>
          </div>,
          document.body,
        )}
      {/* Preload hero images into <head> so they fetch even while the modal is visible */}
      {tenant?.heroImagesList
        ?.filter((item) => item.image?.url)
        .map((item, idx) => (
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
      <div
        ref={galleryDividerRef}
        className="w-full px-8 md:px-14 mt-12 mb-8 flex items-center gap-4 transition-[opacity,transform] duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: galleryDividerVisible ? 1 : 0,
          transform: galleryDividerVisible
            ? "translateY(0)"
            : "translateY(20px)",
        }}
      >
        <span
          className="text-[10px] tracking-[0.38em] uppercase"
          style={{ color: "var(--color-sand)", opacity: 0.95 }}
        >
          02
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
      <Gallery
        images={transformedImages}
        galleryText={tenant?.galleryText}
        tenant={tenant}
      />
      <div
        ref={ctaLinkRef}
        className="w-full border-t border-b h-16 mt-12 mb-12 flex items-center justify-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          borderColor: "color-mix(in srgb, var(--color-sand) 25%, transparent)",
          opacity: ctaLinkVisible ? 1 : 0,
          transform: ctaLinkVisible ? "translateY(0)" : "translateY(16px)",
        }}
      ></div>
      <CTA />
      {/* New Menu Modal — only shown after loading is complete */}
      {loadingPhase === "done" && (
        <NewMenuModal
          images={tenant?.newMenu || []}
          isOpen={showNewMenuModal}
          onClose={handleCloseModal}
          tenantName={tenant?.name || "Restaurant"}
        />
      )}
    </div>
  );
}
