"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import SkeletonImage from "@/app/components/SkeletonImage";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "@/api/queries";

interface NewMenuImage {
  src?: {
    url: string;
    filename: string;
  };
  id?: string;
}

interface NewMenuModalProps {
  images: NewMenuImage[];
  isOpen: boolean;
  onClose: () => void;
  tenantName?: string;
}

export default function NewMenuModal({
  images,
  isOpen,
  onClose,
  tenantName,
}: NewMenuModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrevious, onClose]);

  if (!isOpen) {
    return null;
  }

  if (images.length === 0) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      key={isOpen ? "open" : "closed"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-2xl overflow-hidden animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Menu</h2>
            {tenantName && (
              <p className="text-sm text-gray-600 mt-1">
                Check out our latest menu at {tenantName.toLowerCase()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Image Container */}
          <div className="relative w-full h-[50vh] md:h-[60vh] bg-gray-100 flex items-center justify-center">
            {images[currentIndex]?.src?.url && (
              <SkeletonImage
                src={`${API_URL}${images[currentIndex].src.url}`}
                alt={`Menu page ${currentIndex + 1}`}
                fill
                quality={90}
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
              />
            )}
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>
            </>
          )}

        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id || index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentIndex === index
                      ? "border-blue-500 scale-105"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {image.src?.url && (
                    <SkeletonImage
                      src={`${API_URL}${image.src.url}`}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      quality={60}
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {images.length > 1 && (
          <div className="flex justify-center py-2 bg-gray-50">
            <span className="text-gray-700 text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t text-center">
          <p className="text-sm text-gray-600">
            Use arrow keys to navigate • Press ESC to close
          </p>
        </div>
      </div>
    </div>
  );
}
