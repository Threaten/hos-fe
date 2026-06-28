"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Tenant } from "@/api/queries";
import { API_URL } from "@/app/utils/constants";

interface HeroProps {
  tenant?: Tenant | null;
}

const Hero: React.FC<HeroProps> = ({ tenant }) => {
  const title = tenant?.name || tenant?.heroTitle || "House of Senses";
  const mainColor = tenant?.mainColor || "var(--color-main)";
  const subtitle = tenant?.heroSubtitle || "Fine Dining Experience";
  const description =
    tenant?.heroDescription ||
    "Discover the perfect blend of contemporary cuisine and elegant atmosphere.";

  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip heavy GSAP animations on mobile — reduces main-thread work and forced reflows
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let ctx: ReturnType<(typeof import("gsap"))["gsap"]["context"]> | null =
      null;
    let mounted = true;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted || !sectionRef.current) return;

      // Set willChange only when GSAP is about to animate
      if (parallaxRef.current)
        parallaxRef.current.style.willChange = "transform";

      ctx = gsap.context(() => {
        // Scrub-parallax: image strip drifts upward at 20% scroll speed
        if (parallaxRef.current) {
          gsap.to(parallaxRef.current, {
            yPercent: 22,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.4,
            },
          });
        }

        // Hero content drifts + fades out as user scrolls away
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            opacity: 0.12,
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "55% top",
              end: "bottom top",
              scrub: 1.6,
            },
          });
        }

        // Scroll indicator vanishes
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, {
            opacity: 0,
            y: -12,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "6% top",
              end: "22% top",
              scrub: 1,
            },
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
    tenant?.heroImagesList?.filter((item) => item.image?.url) ?? [];
  const count = Math.max(images.length, 1);

  // Always exactly 2 copies: first half animates out, second half is identical
  // so translateX(-50%) always lands perfectly at the loop boundary
  const copies = images.length > 0 ? 2 : 0;
  const marqueeImages =
    images.length > 0
      ? Array.from({ length: copies }, (_, r) =>
          images.map((item, i) => ({ ...item, _key: `${r}-${i}` })),
        ).flat()
      : [];

  // duration based on image count so speed feels consistent
  const scrollDuration = `${count * 6}s`;

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col h-full"
      style={{ height: "100svh" }}
    >
      <div
        ref={contentRef}
        className="w-full flex-1 px-8 md:px-14  md:py-0 flex flex-col items-center justify-center"
      >
        {/* Large display title — top on mobile, right column on desktop */}
        <div className="w-full text-center md:mb-0">
          <h1
            className="mx-auto max-w-[min(92vw,1600px)] text-center font-extralight leading-[0.88] opacity-0 animate-reveal-up [overflow-wrap:anywhere]"
            style={{
              fontSize: "clamp(4.5rem, 17vw, 18rem)",
              letterSpacing: "-0.025em",
              color: mainColor,
              fontFamily: "Minion Pro",
              animationDelay: "0.06s",
            }}
          >
            {title}
          </h1>
        </div>
      </div>
      {/* ── Auto-scrolling image marquee ── */}
      <div
        className="w-full overflow-hidden"
        style={{ height: "clamp(280px, 52vh, 520px)" }}
      >
        {/* Parallax wrapper */}
        <div ref={parallaxRef} className="h-full">
          {marqueeImages.length > 0 ? (
            <div
              className="h-full flex animate-marquee"
              style={{
                width: "max-content",
                gap: "10px",
                animationDuration: scrollDuration,
              }}
            >
              {marqueeImages.map((item, idx) => {
                const origIdx = idx % images.length;
                return (
                  <div
                    key={item._key}
                    className="relative h-full shrink-0 overflow-hidden"
                    style={{ width: "calc(50vw - 10px)" }}
                  >
                    <Image
                      src={`${API_URL}${item.image!.url}`}
                      alt={item.image?.filename || ""}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="50vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none bg-linear-to-t from-black/20 to-transparent" />
                    <span className="absolute bottom-3 right-3 text-[10px] tracking-[0.2em] text-white/40 font-light tabular-nums select-none">
                      {String(origIdx + 1).padStart(2, "0")}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="w-full h-full"
              style={{ backgroundColor: "var(--color-parchment)" }}
            />
          )}
        </div>
      </div>

      {/* ── Content row: centered on mobile, side-by-side on desktop ── */}

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndicatorRef}
        className="flex flex-col items-center justify-center py-4"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        <div
          className="relative overflow-hidden"
          style={{
            width: "1px",
            height: "36px",
            backgroundColor:
              "color-mix(in srgb, var(--color-sand) 20%, transparent)",
          }}
        >
          <div className="animate-scroll-line" />
        </div>
        <span
          className="text-[7px] tracking-[0.42em] uppercase mt-2"
          style={{ color: "var(--color-parchment)", opacity: 0.85 }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
};

export default Hero;
