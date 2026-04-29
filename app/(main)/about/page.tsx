"use client";

import React from "react";
import SkeletonImage from "@/app/components/SkeletonImage";
import CTA from "../components/CTA";
import RichTextRenderer from "../../components/RichTextRenderer";
import { useTenant } from "@/app/contexts/TenantContext";
import { API_URL } from "@/api/queries";

export default function AboutPage() {
  const { tenant } = useTenant();

  const tenantName = tenant ? tenant.name.toLowerCase() : "houseofsenses.vn";
  const aboutTitle = tenant?.aboutTitle || `about ${tenantName}`;
  const aboutSubtitle =
    tenant?.aboutSubtitle || "A Journey of Culinary Excellence";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — editorial, text anchored bottom-left */}
      <section
        className="relative overflow-hidden"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="absolute inset-0">
          <SkeletonImage
            src={
              tenant?.aboutusHero?.url
                ? `${API_URL}${tenant.aboutusHero.url}`
                : "/media/IMG_0050.JPG"
            }
            alt="Restaurant interior"
            fill
            className="object-cover"
          />
          {/* Warm gradient — heavier at the base where text lives */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(23,23,23,0.72) 0%, rgba(23,23,23,0.18) 55%, rgba(23,23,23,0) 100%)",
            }}
          />
        </div>

        {/* Text block — bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-8 md:px-12 pb-12 md:pb-16">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/55 mb-5">
            — our story
          </p>
          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[0.9] tracking-tight text-white mb-5 max-w-xl">
            {aboutTitle}
          </h1>
          <p className="text-sm md:text-base font-light text-white/70 max-w-md leading-relaxed">
            {aboutSubtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-8 md:px-12">
        {tenant?.aboutus ? (
          <div className="max-w-3xl">
            <RichTextRenderer
              data={tenant.aboutus}
              className="text-base leading-relaxed"
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_1fr] gap-16 items-start max-w-6xl">
            <div className="md:pt-6">
              <p className="text-[10px] tracking-[0.35em] uppercase text-[rgb(124,118,89)] mb-6">
                — the beginning
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-900 leading-tight">
                Our Story
              </h2>
              <p className="text-base text-gray-600 mb-5 leading-relaxed">
                {tenantName} was born from a passion for creating unforgettable
                dining experiences — a place where food and atmosphere conspire
                to make every visit feel like coming home.
              </p>
              <p className="text-base text-gray-600 mb-5 leading-relaxed">
                Every dish we serve tells a story, combining the warmth of
                traditional techniques with the curiosity of contemporary
                flavors.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                We believe that great food brings people together. That is the
                only philosophy that has ever guided us.
              </p>
            </div>
            <div className="relative h-[520px] md:h-[640px]">
              <SkeletonImage
                src="/media/IMG_0050.JPG"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </section>

      <CTA />
    </div>
  );
}
