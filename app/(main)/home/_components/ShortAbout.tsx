import React from "react";
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

  return (
    <section className="w-full bg-background py-16 px-8 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6 items-start max-w-7xl mx-auto">
        {/* Image 01 — Left tall */}
        <div className="flex flex-col gap-2">
          <div className="relative w-full aspect-[3/4]">
            {getImageSrc(0) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getImageSrc(0)!}
                alt=""
                className="w-full h-full object-cover absolute inset-0"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <div className="flex justify-between items-start text-xs tracking-widest text-gray-500 uppercase pt-1">
            <span className="leading-relaxed max-w-[80%]">
              {tenant?.name || ""}
            </span>
            <span>01</span>
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
                    <img
                      src={getImageSrc(idx)!}
                      alt=""
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex justify-between items-start text-xs tracking-widest text-gray-500 uppercase pt-1">
                  <span>{idx === 1 ? "AMBIANCE" : "CUISINE"}</span>
                  <span>0{idx + 1}</span>
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
              <img
                src={getImageSrc(3)!}
                alt=""
                className="w-full h-full object-cover absolute inset-0"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <div className="flex justify-between items-start text-xs tracking-widest text-gray-500 uppercase pt-1">
            <span className="leading-relaxed max-w-[80%]">
              {tenant?.address || ""}
            </span>
            <span>04</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShortAbout;
