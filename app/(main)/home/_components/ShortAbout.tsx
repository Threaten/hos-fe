"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Tenant } from "@/api/queries";
import { API_URL } from "@/app/utils/constants";

interface ShortAboutProps {
  tenant?: Tenant | null;
}

const MARQUEE_WORDS = [
  "Our Story",
  "Fine Dining",
  "Crafted with Care",
  "House of Senses",
  "Artisan Flavours",
  "Since the Beginning",
];

const ShortAbout: React.FC<ShortAboutProps> = ({ tenant }) => {
  const title =
    tenant?.shortAboutTitle || "Crafting Culinary Excellence with Passion";
  const text =
    tenant?.shortAboutText ||
    "At House of Senses, we believe dining is an art form. Each dish is thoughtfully prepared with the finest ingredients, blending traditional techniques with innovative flavors.";

  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const colLeftRef = useRef<HTMLDivElement>(null);
  const colCenterRef = useRef<HTMLDivElement>(null);
  const colRightRef = useRef<HTMLDivElement>(null);
  const marqueeStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any = null;
    let mounted = true;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted || !sectionRef.current) return;

      const commonTrigger = {
        trigger: sectionRef.current,
        start: "top 78%",
        once: true,
      };

      ctx = gsap.context(() => {
        // Section marker line draws in
        if (markerRef.current && lineRef.current) {
          gsap.set(markerRef.current, { opacity: 0 });
          gsap.set(lineRef.current, {
            scaleX: 0,
            transformOrigin: "left center",
          });
          const tl = gsap.timeline({ scrollTrigger: { ...commonTrigger } });
          tl.to(markerRef.current, { opacity: 1, duration: 0.5 }).to(
            lineRef.current,
            { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
            "-=0.2",
          );
        }

        // Left column — slides in from left with clip-path curtain
        if (colLeftRef.current) {
          gsap.set(colLeftRef.current, { x: -80, opacity: 0 });
          const img = colLeftRef.current.querySelector(".about-img-wrap");
          if (img) gsap.set(img, { clipPath: "inset(0 0 100% 0)" });

          const tl = gsap.timeline({
            scrollTrigger: { ...commonTrigger, start: "top 82%" },
          });
          tl.to(colLeftRef.current, {
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
          });
          if (img)
            tl.to(
              img,
              {
                clipPath: "inset(0 0 0% 0)",
                duration: 1.3,
                ease: "power4.out",
              },
              "-=0.8",
            );
        }

        // Center column — words cascade up, then images stagger
        if (colCenterRef.current) {
          gsap.set(colCenterRef.current, { opacity: 0, y: 60 });
          gsap.to(colCenterRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { ...commonTrigger, start: "top 80%" },
          });

          // Center bottom images stagger
          const imgs =
            colCenterRef.current.querySelectorAll(".about-bottom-img");
          if (imgs.length) {
            gsap.set(imgs, {
              y: 40,
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
            });
            gsap.to(imgs, {
              y: 0,
              opacity: 1,
              clipPath: "inset(0 0 0% 0)",
              duration: 1.1,
              ease: "power3.out",
              stagger: 0.14,
              scrollTrigger: { ...commonTrigger, start: "top 72%" },
            });
          }
        }

        // Right column — slides in from right with clip-path curtain
        if (colRightRef.current) {
          gsap.set(colRightRef.current, { x: 80, opacity: 0 });
          const img = colRightRef.current.querySelector(".about-img-wrap");
          if (img) gsap.set(img, { clipPath: "inset(0 0 100% 0)" });

          const tl = gsap.timeline({
            scrollTrigger: { ...commonTrigger, start: "top 80%" },
          });
          tl.to(colRightRef.current, {
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
          });
          if (img)
            tl.to(
              img,
              {
                clipPath: "inset(0 0 0% 0)",
                duration: 1.3,
                ease: "power4.out",
              },
              "-=0.8",
            );
        }

        // Marquee strip fades in last
        if (marqueeStripRef.current) {
          gsap.set(marqueeStripRef.current, { opacity: 0, y: 20 });
          gsap.to(marqueeStripRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { ...commonTrigger, start: "top 60%" },
          });
        }
      }, sectionRef);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const images =
    tenant?.shortAboutCollages
      ?.filter((item) => item.image?.url)
      .map((item) => item.image!.url) ?? [];

  const getImageSrc = (idx: number) =>
    images[idx] ? `${API_URL}${images[idx]}` : null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-background py-12 px-8 md:px-14 overflow-hidden"
    >
      {/* ── Ghost decorative "01" watermark ── */}
      <span
        className="absolute -top-4 right-4 md:right-10 font-bold leading-none select-none pointer-events-none"
        aria-hidden="true"
        style={{
          fontSize: "clamp(8rem, 24vw, 22rem)",
          letterSpacing: "-0.06em",
          color: "var(--color-parchment)",
          fontFamily: "var(--font-arimo)",
          zIndex: 0,
        }}
      >
        01
      </span>

      {/* ── Section marker ── */}
      <div
        ref={markerRef}
        className="relative z-10 flex items-center gap-4 mb-16"
      >
        <span
          className="text-[10px] tracking-[0.38em] uppercase"
          style={{ color: "var(--color-sand)", opacity: 0.9 }}
        >
          01
        </span>
        <div
          ref={lineRef}
          className="h-px flex-1"
          style={{ backgroundColor: "var(--color-sand)", opacity: 0.25 }}
        />
        <span
          className="text-[10px] tracking-[0.38em] uppercase"
          style={{ color: "var(--color-sand)", opacity: 0.9 }}
        >
          Story
        </span>
      </div>

      {/* ── Three-column image + text grid ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8 items-start max-w-7xl mx-auto">
        {/* Image 01 — Left tall, offset down */}
        <div ref={colLeftRef} className="flex flex-col gap-2 md:pt-20">
          <div className="about-img-wrap relative w-full aspect-3/4 overflow-hidden group">
            {getImageSrc(0) ? (
              <>
                <Image
                  src={getImageSrc(0)!}
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                {/* Warm earth tint on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.18] transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: "var(--color-earth)" }}
                />
              </>
            ) : (
              <div
                className="w-full h-full"
                style={{ backgroundColor: "var(--color-parchment)" }}
              />
            )}
          </div>
          <span
            className="text-[9px] tracking-[0.3em] uppercase mt-2"
            style={{ color: "var(--color-sand)", opacity: 0.92 }}
          >
            01
          </span>
        </div>

        {/* Center — text block + two bottom images */}
        <div ref={colCenterRef} className="flex flex-col gap-12">
          <div className="pt-2">
            {/* Overline */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="h-px w-6 shrink-0"
                style={{ backgroundColor: "var(--color-sand)" }}
              />
              <p
                className="text-[10px] tracking-[0.38em] uppercase"
                style={{ color: "var(--color-sand)" }}
              >
                Our Story
              </p>
            </div>

            <h2
              className="font-bold leading-[1.02] mb-7"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                letterSpacing: "-0.025em",
                color: "var(--foreground)",
              }}
            >
              {title}
            </h2>

            <p
              className="text-sm font-light leading-[1.9] mb-9"
              style={{ color: "var(--foreground)", opacity: 0.88, maxWidth: "34ch" }}
            >
              {text}
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase font-light transition-opacity duration-300 hover:opacity-40"
              style={{
                color: "var(--foreground)",
                textDecoration: "underline",
                textUnderlineOffset: "6px",
                textDecorationColor: "var(--color-sand)",
              }}
            >
              Read about us →
            </Link>
          </div>

          {/* Images 02 + 03 — side by side, offset up */}
          <div className="grid grid-cols-2 gap-3 md:-mt-4">
            {[1, 2].map((idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="about-bottom-img relative w-full aspect-4/3 overflow-hidden group">
                  {getImageSrc(idx) ? (
                    <>
                      <Image
                        src={getImageSrc(idx)!}
                        alt=""
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-[0.18] transition-opacity duration-500 pointer-events-none"
                        style={{ backgroundColor: "var(--color-earth)" }}
                      />
                    </>
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: "var(--color-parchment)" }}
                    />
                  )}
                </div>
                <span
                  className="text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: "var(--color-sand)", opacity: 0.92 }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Image 04 — Right tall, offset slightly */}
        <div ref={colRightRef} className="flex flex-col gap-2 md:pt-8">
          <div className="about-img-wrap relative w-full aspect-3/4 overflow-hidden group">
            {getImageSrc(3) ? (
              <>
                <Image
                  src={getImageSrc(3)!}
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.18] transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: "var(--color-earth)" }}
                />
              </>
            ) : (
              <div
                className="w-full h-full"
                style={{ backgroundColor: "var(--color-parchment)" }}
              />
            )}
          </div>
          <span
            className="text-[9px] tracking-[0.3em] uppercase mt-2"
            style={{ color: "var(--color-sand)", opacity: 0.92 }}
          >
            04
          </span>
        </div>
      </div>

      {/* ── Bottom marquee strip ── */}
      <div
        ref={marqueeStripRef}
        className="relative z-10 mt-10 overflow-hidden border-t border-b"
        style={{
          borderColor: "color-mix(in srgb, var(--color-sand) 25%, transparent)",
        }}
      >
        <div className="flex animate-marquee whitespace-nowrap items-center py-3">
          {[0, 1].map((r) => (
            <div key={r} className="flex shrink-0 items-center gap-8 pr-8">
              {MARQUEE_WORDS.map((word, i) => (
                <React.Fragment key={i}>
                  <span
                    className="text-[10px] tracking-[0.36em] uppercase"
                    style={{ color: "var(--color-sand)" }}
                  >
                    {word}
                  </span>
                  <span
                    className="text-[8px]"
                    style={{ color: "var(--color-tan)" }}
                  >
                    ◇
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShortAbout;
