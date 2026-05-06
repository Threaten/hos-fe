"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ImageLightbox from "../../components/ImageLightbox";

interface GalleryImage {
  src: string;
  alt: string;
  branch: string;
  caption: string;
}

interface GalleryProps {
  images?: GalleryImage[];
  galleryText?: string;
}

const Gallery = ({ images = [], galleryText }: GalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (images.length === 0) return;
    let ctx: any = null;
    let mounted = true;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted) return;

      ctx = gsap.context(() => {
        // Gallery text slides up
        if (textRef.current) {
          gsap.from(textRef.current, {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Grid items: clip-path curtain rise + stagger
        if (gridRef.current) {
          const items = gridRef.current.querySelectorAll(".gallery-item");
          if (items.length) {
            gsap.fromTo(
              items,
              { clipPath: "inset(100% 0 0 0)", opacity: 0 },
              {
                clipPath: "inset(0% 0 0% 0)",
                opacity: 1,
                duration: 1.3,
                ease: "power4.out",
                stagger: { each: 0.09, from: "start" },
                scrollTrigger: {
                  trigger: gridRef.current,
                  start: "top 88%",
                  once: true,
                },
              },
            );
          }
        }
      }, sectionRef);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex];

  if (images.length === 0) {
    return (
      <section className="w-full px-8 md:px-14 pb-12 bg-background">
        <div className="w-full grid grid-cols-3" style={{ gap: "3px" }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-50 md:h-70"
              style={{ backgroundColor: "var(--color-parchment)" }}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="w-full px-8 md:px-14 pb-12 bg-background"
    >
      {/* Optional description text */}
      {galleryText && (
        <p
          ref={textRef}
          className="text-sm font-light leading-[1.9] mb-10"
          style={{ color: "var(--foreground)", opacity: 0.88, maxWidth: "52ch" }}
        >
          {galleryText}
        </p>
      )}

      {/* Gallery Grid — clip-path stagger on scroll */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: "3px" }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(index)}
            className="gallery-item relative h-70 md:h-90 overflow-hidden group cursor-pointer"
          >
            {!loadedSet.has(index) && (
              <div
                className="absolute inset-0 z-10 animate-shimmer"
                style={{ backgroundColor: "var(--color-tan)" }}
              />
            )}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.05]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 3}
              loading={index < 3 ? undefined : "lazy"}
              onLoad={() => setLoadedSet((prev) => new Set(prev).add(index))}
            />
            {/* Subtle dark overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-500" />
            {/* Index number — faint top-left */}
            <span className="absolute top-3 left-3 text-[9px] tracking-[0.3em] text-white/40 tabular-nums select-none">
              {String(index + 1).padStart(2, "0")}
            </span>
            {/* Caption bottom gradient — appears on hover */}
            {image.caption && (
              <div className="absolute inset-x-0 bottom-0 px-4 py-5 bg-linear-to-t from-black/70 to-transparent translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white text-xs tracking-[0.12em] font-light">
                  {image.caption}
                </p>
                {image.branch && (
                  <p className="text-white/50 text-[9px] tracking-[0.28em] uppercase mt-1">
                    {image.branch}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Lightbox */}
      {currentImage && (
        <ImageLightbox
          isOpen={lightboxOpen}
          imageSrc={currentImage.src}
          imageAlt={currentImage.alt}
          caption={currentImage.caption}
          branch={currentImage.branch}
          onClose={() => setLightboxOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          currentIndex={currentImageIndex}
          totalImages={images.length}
        />
      )}
    </section>
  );
};

export default Gallery;
