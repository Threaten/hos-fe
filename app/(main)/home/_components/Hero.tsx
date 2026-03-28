import React from "react";
import Link from "next/link";
import { Tenant, API_URL } from "@/api/queries";

interface HeroProps {
  tenant?: Tenant | null;
}

const Hero: React.FC<HeroProps> = ({ tenant }) => {
  const title = tenant?.heroTitle || tenant?.name || "houseofsenses.vn";
  const subtitle = tenant?.heroSubtitle || "Exceptional Dining Experience";
  const description =
    tenant?.heroDescription ||
    "Discover the perfect blend of contemporary cuisine and elegant atmosphere.";

  const images =
    tenant?.heroImagesList?.filter((item) => item.image?.url) ?? [];
  const marqueeImages = [...images, ...images];

  return (
    <section
      className="w-full flex flex-col overflow-hidden bg-background"
      style={{ height: "calc(100vh - 116px)" }}
    >
      {/* Image Marquee Strip */}
      <div className="flex-1 overflow-hidden min-h-0">
        {marqueeImages.length > 0 ? (
          <div className="flex h-full gap-2 w-max animate-[marquee_40s_linear_infinite]">
            {marqueeImages.map((item, idx) => (
              <div
                key={idx}
                className="relative h-full w-64 md:w-80 flex-shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${API_URL}${item.image!.url}`}
                  alt={item.image?.filename || ""}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* Text Content */}
      <div className="flex-shrink-0 flex items-end justify-between gap-6 px-8 py-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-wide leading-none">
            {title}
          </h1>
          <p className="text-base md:text-lg mt-3 font-light tracking-wide text-gray-600">
            {subtitle}
          </p>
          <p className="text-sm mt-2 text-gray-500 max-w-md leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 items-end">
          <Link
            href="/menu"
            className="px-6 py-2.5 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-widest whitespace-nowrap"
          >
            EXPLORE MENU
          </Link>
          <Link
            href="/reservation"
            className="px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-700 transition-colors text-sm tracking-widest whitespace-nowrap"
          >
            MAKE RESERVATION
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
