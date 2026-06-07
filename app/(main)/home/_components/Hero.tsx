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
  const title = tenant?.heroTitle || tenant?.name || "House of Senses";
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
      if (parallaxRef.current) parallaxRef.current.style.willChange = "transform";

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

  // Duplicate enough times so the strip always overflows the viewport
  const copies = images.length > 0 ? Math.max(Math.ceil(10 / count) * 2, 4) : 0;
  const marqueeImages =
    images.length > 0
      ? Array.from({ length: copies }, (_, r) =>
          images.map((item, i) => ({ ...item, _key: `${r}-${i}` })),
        ).flat()
      : [];

  // scroll duration scales with image count so speed feels consistent
  const scrollDuration = `${count * 7}s`;

  return (
    <section ref={sectionRef} className="w-full flex flex-col" style={{ height: "100svh" }}>
      {/* ── Auto-scrolling image marquee ── */}
      <div
        className="w-full overflow-hidden"
        style={{ height: "clamp(280px, 52vh, 520px)" }}
      >
        {/* Parallax wrapper */}
        <div
          ref={parallaxRef}
          className="h-full"
        >
          {marqueeImages.length > 0 ? (
            <div
              className="h-full flex animate-marquee"
              style={{
                width: "max-content",
                gap: "3px",
                animationDuration: scrollDuration,
              }}
            >
              {marqueeImages.map((item, idx) => {
                const origIdx = idx % images.length;
                return (
                  <div
                    key={item._key}
                    className="relative h-full shrink-0 overflow-hidden"
                    style={{ width: "clamp(180px, 22vw, 290px)" }}
                  >
                    <Image
                      src={`${API_URL}${item.image!.url}`}
                      alt={item.image?.filename || ""}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 180px, 22vw"
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

      {/* ── Marquee text ticker ── */}
      <div
        className="w-full overflow-hidden"
        style={{
          borderTop: "1px solid var(--color-tan)",
          borderBottom: "1px solid var(--color-tan)",
        }}
      >
        <div className="py-2.5 flex animate-marquee whitespace-nowrap">
          {[0, 1].map((r) => (
            <div key={r} className="flex shrink-0 items-center gap-7 pr-7">
              {[
                "Reserve a Table",
                "Fine Dining",
                "Explore the Menu",
                "Crafted Cuisine",
                "House of Senses",
                "Experience the Moment",
              ].map((word, i) => (
                <React.Fragment key={i}>
                  <span
                    className="text-[9px] tracking-[0.38em] uppercase"
                    style={{ color: "var(--foreground)", opacity: 0.82 }}
                  >
                    {word}
                  </span>
                  <span
                    className="text-[7px]"
                    style={{ color: "var(--foreground)", opacity: 0.25 }}
                  >
                    ◇
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Content row: centered on mobile, side-by-side on desktop ── */}
      <div
        ref={contentRef}
        className="w-full flex-1 px-8 md:px-14 py-8 md:py-0 flex flex-col items-center justify-center md:flex-row-reverse md:items-center md:justify-between md:gap-16"
      >
        {/* Large display title — top on mobile, right column on desktop */}
        <div className="text-center md:text-right mb-3 md:mb-0">
          <h1
            className="font-bold leading-[0.88] opacity-0 animate-reveal-up"
            style={{
              fontSize: "clamp(3rem, 14vw, 11rem)",
              letterSpacing: "-0.035em",
              color: "var(--foreground)",
              animationDelay: "0.06s",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Left — subtitle + description + CTAs */}
        <div className="flex flex-col items-center md:items-start gap-4 md:max-w-xs">
          <div
            className="flex items-center gap-3 opacity-0 animate-reveal-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div
              className="h-px w-6 shrink-0"
              style={{ backgroundColor: "var(--foreground)", opacity: 0.3 }}
            />
            <p
              className="text-[10px] tracking-[0.38em] uppercase"
              style={{ color: "var(--foreground)", opacity: 0.88 }}
            >
              {subtitle}
            </p>
          </div>

          <p
            className="text-sm font-light leading-[1.8] text-center md:text-left opacity-0 animate-reveal-up"
            style={{
              color: "var(--foreground)",
              opacity: 0.9,
              animationDelay: "0.22s",
            }}
          >
            {description}
          </p>

          <div
            className="flex flex-col items-center md:items-start gap-3 pt-1 opacity-0 animate-reveal-up"
            style={{ animationDelay: "0.36s" }}
          >
            <Link
              href="/reservation"
              className="inline-flex items-center px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase font-medium transition-colors duration-300 button-ripple"
              style={{
                backgroundColor: "var(--color-earth)",
                color: "var(--color-cream)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--color-earth-dark)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-earth)")
              }
            >
              Reserve a Table
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.22em] uppercase font-light transition-opacity duration-300 hover:opacity-40"
              style={{
                color: "var(--foreground)",
                textDecoration: "underline",
                textUnderlineOffset: "5px",
                textDecorationColor: "var(--color-sand)",
              }}
            >
              Explore Menu →
            </Link>
          </div>
        </div>
      </div>

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
