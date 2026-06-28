"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Tenant } from "@/api/queries";
import { API_URL } from "@/app/utils/constants";

interface GalleryImage {
  src: string;
  alt: string;
  branch: string;
  caption: string;
}

interface GalleryProps {
  images?: GalleryImage[];
  galleryText?: string;
  tenant?: Tenant | null;
}

const Gallery = ({ images = [], galleryText, tenant }: GalleryProps) => {
  const mainColor = tenant?.mainColor || "var(--color-main)";
  const title = tenant?.galleryTitle || "Gallery";
  const text =
    galleryText ||
    "Tucked away in a quiet corner of the city, House of Senses is where meals unfold slowly and conversations linger a little longer. What began as a small dining space has grown into a gathering place for friends, families, first dates, and familiar faces returning time and again. We believe good food is only part of the experience — the rest lives in the atmosphere, the people around the table, and the moments shared between courses.";
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any = null;
    let mounted = true;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted || !sectionRef.current) return;

      ctx = gsap.context(() => {
        const trigger = {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        };

        if (headingRef.current)
          gsap.from(headingRef.current, {
            opacity: 0,
            y: 40,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: trigger,
          });
        if (imgRef.current)
          gsap.from(imgRef.current, {
            opacity: 0,
            scale: 0.96,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.15,
            scrollTrigger: trigger,
          });
        if (textRef.current)
          gsap.from(textRef.current, {
            opacity: 0,
            y: 24,
            duration: 1,
            ease: "power3.out",
            delay: 0.3,
            scrollTrigger: trigger,
          });
        if (btnRef.current)
          gsap.from(btnRef.current, {
            opacity: 0,
            y: 16,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.45,
            scrollTrigger: trigger,
          });
      }, sectionRef);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, []);

  const homeGalleryImageSrc = tenant?.homeGalleryImage?.url
    ? `${API_URL}${tenant.homeGalleryImage.url}`
    : tenant?.homeGalleryImage?.filename
      ? `${API_URL}/api/media/file/${tenant.homeGalleryImage.filename}`
      : "";
  const featuredImage = homeGalleryImageSrc
    ? {
        src: homeGalleryImageSrc,
        alt: tenant?.homeGalleryImage?.alt || title,
      }
    : images[0];

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center py-20 px-8 md:px-14"
      style={{ backgroundColor: mainColor }}
    >
      {/* Large serif heading */}
      <h2
        ref={headingRef}
        className="text-center leading-[1.1] mb-14"
        style={{
          fontSize: "clamp(2.4rem, 6vw, 4rem)",
          color: "#fff",
          fontFamily: '"Minion Pro", "Minion", Georgia, serif',
          maxWidth: "14ch",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>

      {/* Single centered image */}
      {featuredImage && (
        <div
          ref={imgRef}
          className="relative overflow-hidden mb-14"
          style={{ width: "clamp(260px, 32vw, 420px)", aspectRatio: "3/4" }}
        >
          <Image
            src={featuredImage.src}
            alt={featuredImage.alt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80vw, 32vw"
          />
        </div>
      )}
      <div className="flex flex-col items-center h-full w-3/4">
        {/* Body text */}
        <p
          ref={textRef}
          className="text-center text-[18px] leading-[1.85] mb-10 w-full "
          style={{ color: "rgba(255,255,255,0.85)", maxWidth: "75%" }}
        >
          {text}
        </p>

        {/* About us button */}
        <div ref={btnRef}>
          <Link
            href="/about"
            className="inline-flex items-center px-10 py-3 text-[11px] tracking-[0.28em] uppercase font-medium transition-opacity duration-300 hover:opacity-70"
            style={{
              border: "1px solid rgba(255,255,255,0.55)",
              color: "#fff",
            }}
          >
            About us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
