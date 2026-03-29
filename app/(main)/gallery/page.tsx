"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CTA from "../components/CTA";
import ImageLightbox from "../components/ImageLightbox";
import { fetchGallery, type GalleryItem, API_URL } from "@/api/queries";

const Gallery = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedSet, setLoadedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadGallery = async () => {
      const data = await fetchGallery();
      setImages(data);
      setLoading(false);
    };

    loadGallery();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-auto p-8 flex items-center justify-center">
        <p className="text-gray-600">Loading gallery...</p>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-auto p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Gallery</h1>

        {images.length === 0 ? (
          <p className="text-center text-gray-600">No images in gallery yet.</p>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(index)}
                className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                {!loadedSet.has(item.id) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
                )}
                {item.image && (
                  <img
                    src={`${API_URL}${item.image.url}`}
                    alt={item.caption || item.image.alt || "Gallery image"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onLoad={() => setLoadedSet((prev) => new Set(prev).add(item.id))}
                  />
                )}
                {/* Branch Tag - Always Visible */}
                {item.branch && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded shadow-lg">
                      {item.branch.name.toLowerCase()}
                    </span>
                  </div>
                )}
                {/* Caption Overlay - Visible on Hover */}
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      {currentImage && currentImage.image && (
        <ImageLightbox
          isOpen={lightboxOpen}
          imageSrc={`${API_URL}${currentImage.image.url}`}
          imageAlt={
            currentImage.caption || currentImage.image.alt || "Gallery image"
          }
          caption={currentImage.caption}
          branch={currentImage.branch?.name.toLowerCase()}
          onClose={() => setLightboxOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          currentIndex={currentImageIndex}
          totalImages={images.length}
        />
      )}
      <CTA />
    </div>
  );
};

export default Gallery;
