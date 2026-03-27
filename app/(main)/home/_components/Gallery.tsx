"use client";

import React, { useState } from "react";
import ImageLightbox from "../../components/ImageLightbox";

interface GalleryImage {
  src: string;
  alt: string;
  branch: string;
  caption: string;
}

interface GalleryProps {
  images?: GalleryImage[];
}

const Gallery = ({ images = [] }: GalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

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

  return (
    <section className="w-full py-8 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          {/* <h2 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h2> */}
          <p className="text-gray-600 text-lg">
            A glimpse into our culinary world
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
              className="relative h-[300px] md:h-[400px] overflow-hidden group rounded-lg cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.src}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              {/* Branch Tag - Always Visible */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded shadow-lg lowercase">
                  {image.branch}
                </span>
              </div>
              {/* Caption - Visible on Hover */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-base font-medium">
                  {image.caption}
                </p>
              </div>
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
      </div>
    </section>
  );
};

export default Gallery;
