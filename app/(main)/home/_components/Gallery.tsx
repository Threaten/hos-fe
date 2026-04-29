"use client";

import React, { useState } from "react";
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
      <section className="w-full px-8 md:px-14 pb-8 bg-background">
        <div
          className="w-full grid grid-cols-3"
          style={{ gap: "3px" }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[200px] md:h-[280px]"
              style={{ backgroundColor: "var(--color-parchment)" }}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-8 md:px-14 pb-8 bg-background">
      {/* Optional description text */}
      {galleryText && (
        <p
          className="text-sm font-light leading-[1.9] mb-10"
          style={{ color: "var(--color-sand)", maxWidth: "52ch" }}
        >
          {galleryText}
        </p>
      )}

      {/* Gallery Grid — no rounded corners, tight 3px gaps */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: "3px" }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(index)}
            className="relative h-[280px] md:h-[360px] overflow-hidden group cursor-pointer"
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
