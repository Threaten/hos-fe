"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Tenant, API_URL } from "@/api/queries";

interface ShortAboutProps {
  tenant?: Tenant | null;
}

const ShortAbout: React.FC<ShortAboutProps> = ({ tenant }) => {
  const title =
    tenant?.shortAboutTitle || "CRAFTING CULINARY EXCELLENCE WITH PASSION";
  const text =
    tenant?.shortAboutText ||
    "At Elementa, we believe dining is an art form. Each dish is thoughtfully prepared with the finest ingredients, blending traditional techniques with innovative flavors.";

  const images =
    tenant?.shortAboutCollages
      ?.filter((item) => item.image?.url)
      .map((item) => item.image!.url) ?? [];

  const getImageSrc = (idx: number) =>
    images[idx] ? `${API_URL}${images[idx]}` : null;

  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set());
  const markLoaded = (idx: number) =>
    setLoadedSet((prev) => new Set(prev).add(idx));

  return (
    <section className="w-full bg-background py-16 px-8 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6 items-start max-w-7xl mx-auto">
        {/* Image 01 — Left tall */}
        <div className="flex flex-col gap-2">
          <div className="relative w-full aspect-[3/4]">
            {getImageSrc(0) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <>
                {!loadedSet.has(0) && <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />}
                <img
                  src={getImageSrc(0)!}
                  alt=""
                  className="w-full h-full object-cover absolute inset-0"
                  onLoad={() => markLoaded(0)}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        </div>

        {/* Center — title/text + two bottom images */}
        <div className="flex flex-col gap-10">
          {/* Text block */}
          <div className="text-center pt-4 pb-2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-wide">
              {title}
            </h2>
            <p className="text-sm tracking-wide text-gray-600 max-w-md mx-auto leading-relaxed mb-8">
              {text}
            </p>
            <Link
              href="/about"
              className="inline-block text-xs tracking-widest border border-gray-900 px-6 py-2.5 hover:bg-gray-900 hover:text-white transition-colors uppercase"
            >
              READ ABOUT US →
            </Link>
          </div>

          {/* Images 02 + 03 — side by side */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="relative w-full aspect-[4/3]">
                  {getImageSrc(idx) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <>
                      {!loadedSet.has(idx) && <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />}
                      <img
                        src={getImageSrc(idx)!}
                        alt=""
                        className="w-full h-full object-cover absolute inset-0"
                        onLoad={() => markLoaded(idx)}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image 04 — Right tall */}
        <div className="flex flex-col gap-2">
          <div className="relative w-full aspect-[3/4]">
            {getImageSrc(3) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <>
                {!loadedSet.has(3) && <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />}
                <img
                  src={getImageSrc(3)!}
                  alt=""
                  className="w-full h-full object-cover absolute inset-0"
                  onLoad={() => markLoaded(3)}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ShortAbout;
