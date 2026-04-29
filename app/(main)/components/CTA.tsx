"use client";

import React from "react";
import Link from "next/link";
import { useTenant } from "@/app/contexts/TenantContext";

const CTA = () => {
  const { tenant } = useTenant();

  const tenantName = tenant ? tenant.name.toLowerCase() : "houseofsenses.vn";
  const ctaTitle = tenant?.ctaTitle || `Experience ${tenantName} Today`;
  const ctaText =
    tenant?.ctaText || "Join us for an unforgettable culinary journey";

  return (
    <section
      className="px-8 md:px-12 bg-background mt-16 mb-16"
      aria-labelledby="cta-heading"
    >
      {/* Thin rule */}
      <div className="border-t border-[rgb(124,118,89)]/25 mb-12" />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        {/* Left — text */}
        <div className="max-w-md">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[rgb(124,118,89)] mb-4">
            — reserve your table
          </p>
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight text-gray-900 mb-4"
          >
            {ctaTitle}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">{ctaText}</p>
        </div>

        {/* Right — actions (primary + secondary hierarchy) */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 md:items-end shrink-0">
          <Link
            href="/reservation"
            className="px-8 py-3 bg-gray-900 text-white text-sm tracking-widest hover:bg-[rgb(97,89,55)] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-300 whitespace-nowrap"
            aria-label={`Make a reservation at ${tenantName}`}
          >
            RESERVE A TABLE
          </Link>
          <Link
            href="/menu"
            className="px-8 py-3 bg-transparent border border-[rgb(124,118,89)]/50 text-gray-700 text-sm tracking-widest hover:border-gray-900 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-300 whitespace-nowrap"
            aria-label={`View ${tenantName}'s menu`}
          >
            EXPLORE MENU
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
