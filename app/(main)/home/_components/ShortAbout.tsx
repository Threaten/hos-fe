"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Tenant } from "@/api/queries";
import { API_URL } from "@/app/utils/constants";

interface ShortAboutProps {
  tenant?: Tenant | null;
}

const ShortAbout: React.FC<ShortAboutProps> = ({ tenant }) => {
  const mainColor = tenant?.mainColor || "var(--color-main)";
  const title =
    tenant?.shortAboutTitle ||
    "More than a restaurant — a space to reconnect, unwind, and stay awhile. Where thoughtful food and unhurried moments come together.";

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any = null;
    let mounted = true;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted || !sectionRef.current) return;

      ctx = gsap.context(() => {
        if (headingRef.current) {
          gsap.from(headingRef.current, {
            opacity: 0,
            y: 40,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });
        }

        if (imagesRef.current) {
          const imgs = imagesRef.current.querySelectorAll(".about-img-col");
          gsap.from(imgs, {
            opacity: 0,
            y: 30,
            clipPath: "inset(0 0 100% 0)",
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: imagesRef.current,
              start: "top 85%",
              once: true,
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
    tenant?.shortAboutCollages
      ?.filter((item) => item.image?.url)
      .slice(0, 4)
      .map((item) => item.image!.url) ?? [];

  const getImageSrc = (idx: number) =>
    images[idx] ? `${API_URL}${images[idx]}` : null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      // style={{ backgroundColor: "var(--background)" }}
    >
      {/* ── Mobile/tablet text block ── */}
      <div className="flex w-full flex-col items-center px-6 pt-14 pb-10 text-center lg:hidden">
        <div className="mb-6 flex w-full flex-col items-center justify-between text-center">
          <span
            className="text-[32px] tracking-[0.32em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            Our menu
          </span>
          <h2
            ref={headingRef}
            className="mx-auto leading-[1.05]"
            style={{
              fontSize: "clamp(2rem, 2vw, 4.5rem)",
              letterSpacing: "-0.02em",
              color: mainColor,
              fontFamily: '"Minion Pro", "Minion", Georgia, serif',
              maxWidth: "92%",
            }}
          >
            {title}
          </h2>
        </div>
        <Link
          href="/menu"
          className="inline-flex h-16 items-center justify-center gap-2 px-6 py-2.5 text-[13px] tracking-[0.22em] uppercase font-medium transition-opacity duration-300 hover:opacity-75"
          style={{
            backgroundColor: mainColor,
            color: "var(--background)",
            fontWeight: 1000,
          }}
        >
          Explore menu ↗
        </Link>
      </div>

      {/* ── Desktop text block ── */}
      <div className="hidden w-full grid-cols-8 items-end lg:grid">
        <div className="col-span-7 px-4 pt-14 pb-0">
          <div className="mb-6">
            <span
              className="text-[32px] tracking-[0.32em] uppercase"
              style={{ color: "var(--foreground)", opacity: 0.6 }}
            >
              Our menu
            </span>
            <h2
              className="leading-[1.05]"
              style={{
                fontSize: "clamp(2rem, 2vw, 4.5rem)",
                letterSpacing: "-0.02em",
                color: mainColor,
                fontFamily: '"Minion Pro", "Minion", Georgia, serif',
                maxWidth: "85%",
              }}
            >
              {title}
            </h2>
          </div>
        </div>
        <div className="flex h-full w-full items-end justify-center px-4 pb-6">
          <Link
            href="/menu"
            className="inline-flex h-16 items-center justify-center gap-2 px-5 py-2.5 text-[13px] tracking-[0.22em] uppercase font-medium transition-opacity duration-300 hover:opacity-75"
            style={{
              backgroundColor: mainColor,
              color: "var(--background)",
              fontWeight: 1000,
            }}
          >
            Explore menu ↗
          </Link>
        </div>
      </div>

      {/* Large editorial heading */}

      {/* ── 4-image strip ── */}
      <div
        ref={imagesRef}
        className="grid grid-cols-2 md:grid-cols-4 col-span-8"
        style={{ gap: "2px" }}
      >
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="about-img-col relative w-full overflow-hidden"
            style={{ aspectRatio: "3/4" }}
          >
            {getImageSrc(idx) ? (
              <Image
                src={getImageSrc(idx)!}
                alt=""
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ backgroundColor: "var(--color-parchment)" }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShortAbout;
