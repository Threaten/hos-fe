"use client";

import React from "react";
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

  const images =
    tenant?.heroImagesList?.filter((item) => item.image?.url) ?? [];
  const count = Math.max(images.length, 1);

  // Duplicate enough times so the strip always overflows the viewport
  const copies = images.length > 0 ? Math.max(Math.ceil(10 / count) * 2, 4) : 0;
  const marqueeImages = images.length > 0
    ? Array.from({ length: copies }, (_, r) =>
        images.map((item, i) => ({ ...item, _key: `${r}-${i}` }))
      ).flat()
    : [];

  // scroll duration scales with image count so speed feels consistent
  const scrollDuration = `${count * 7}s`;

  return (
    <section className="w-full">
      {/* ── Auto-scrolling image marquee ── */}
      <div
        className="w-full overflow-hidden"
        style={{ height: "clamp(280px, 52vh, 520px)" }}
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
                    priority={idx < 4}
                    loading={idx < 4 ? undefined : "lazy"}
                    sizes="22vw"
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

      {/* ── Marquee text ticker ── */}
      <div
        className="w-full overflow-hidden"
        style={{ borderTop: "1px solid var(--color-tan)", borderBottom: "1px solid var(--color-tan)" }}
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
                    style={{ color: "var(--color-sand)" }}
                  >
                    {word}
                  </span>
                  <span className="text-[7px]" style={{ color: "var(--color-tan)" }}>
                    ◇
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Content row: left meta + right editorial title ── */}
      <div className="w-full px-8 md:px-14 py-10 md:py-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-end">

        {/* Left — subtitle + description + CTAs */}
        <div className="flex flex-col gap-5 md:max-w-xs">
          <div className="flex items-center gap-3 opacity-0 animate-reveal-up" style={{ animationDelay: "0.1s" }}>
            <div className="h-px w-6 shrink-0" style={{ backgroundColor: "var(--color-sand)" }} />
            <p className="text-[10px] tracking-[0.38em] uppercase" style={{ color: "var(--color-sand)" }}>
              {subtitle}
            </p>
          </div>

          <p
            className="text-sm font-light leading-[1.8] opacity-0 animate-reveal-up"
            style={{ color: "var(--color-sand)", animationDelay: "0.22s" }}
          >
            {description}
          </p>

          <div
            className="flex flex-col gap-3 pt-2 opacity-0 animate-reveal-up"
            style={{ animationDelay: "0.36s" }}
          >
            <Link
              href="/reservation"
              className="inline-flex items-center self-start px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase font-medium transition-colors duration-300 button-ripple"
              style={{ backgroundColor: "var(--color-earth)", color: "var(--background)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-earth-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-earth)")}
            >
              Reserve a Table
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 self-start text-[11px] tracking-[0.22em] uppercase font-light transition-opacity duration-300 hover:opacity-40"
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

        {/* Right — large display title */}
        <div className="text-right">
          <h1
            className="font-bold leading-[0.88] opacity-0 animate-reveal-up"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 11rem)",
              letterSpacing: "-0.035em",
              color: "var(--foreground)",
              animationDelay: "0.06s",
            }}
          >
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
