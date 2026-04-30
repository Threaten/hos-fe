"use client";

import React, { useRef, useEffect, useState } from "react";
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

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const images =
    tenant?.shortAboutCollages
      ?.filter((item) => item.image?.url)
      .map((item) => item.image!.url) ?? [];

  const getImageSrc = (idx: number) =>
    images[idx] ? `${API_URL}${images[idx]}` : null;

  const revealCls = `transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
  }`;

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
        className={`relative z-10 flex items-center gap-4 mb-16 ${revealCls}`}
        style={{ transitionDelay: "0ms" }}
      >
        <span
          className="text-[10px] tracking-[0.38em] uppercase"
          style={{ color: "var(--color-sand)", opacity: 0.6 }}
        >
          01
        </span>
        <div
          className="h-px flex-1"
          style={{ backgroundColor: "var(--color-sand)", opacity: 0.25 }}
        />
        <span
          className="text-[10px] tracking-[0.38em] uppercase"
          style={{ color: "var(--color-sand)", opacity: 0.6 }}
        >
          Story
        </span>
      </div>

      {/* ── Three-column image + text grid ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8 items-start max-w-7xl mx-auto">
        {/* Image 01 — Left tall, offset down */}
        <div
          className={`flex flex-col gap-2 md:pt-20 ${revealCls}`}
          style={{ transitionDelay: "80ms" }}
        >
          <div className="relative w-full aspect-3/4 overflow-hidden group">
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
            style={{ color: "var(--color-sand)", opacity: 0.5 }}
          >
            01
          </span>
        </div>

        {/* Center — text block + two bottom images */}
        <div
          className={`flex flex-col gap-12 ${revealCls}`}
          style={{ transitionDelay: "180ms" }}
        >
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
              style={{ color: "var(--color-sand)", maxWidth: "34ch" }}
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
                <div className="relative w-full aspect-4/3 overflow-hidden group">
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
                  style={{ color: "var(--color-sand)", opacity: 0.5 }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Image 04 — Right tall, offset slightly */}
        <div
          className={`flex flex-col gap-2 md:pt-8 ${revealCls}`}
          style={{ transitionDelay: "280ms" }}
        >
          <div className="relative w-full aspect-3/4 overflow-hidden group">
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
            style={{ color: "var(--color-sand)", opacity: 0.5 }}
          >
            04
          </span>
        </div>
      </div>

      {/* ── Bottom marquee strip ── */}
      <div
        className={`relative z-10 mt-10 overflow-hidden border-t border-b ${revealCls}`}
        style={{ transitionDelay: "420ms", borderColor: "color-mix(in srgb, var(--color-sand) 25%, transparent)" }}
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
