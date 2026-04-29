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
      className="px-8 md:px-14 bg-background mt-0 mb-10"
      aria-labelledby="cta-heading"
    >
      {/* Full-width separator */}
      <div
        className="w-full mb-10"
        style={{
          height: "1px",
          backgroundColor: "var(--color-sand)",
          opacity: 0.25,
        }}
      />
      <div className="max-w-2xl mx-auto text-center">
        {/* Label */}
        <p
          className="text-xs tracking-[0.35em] uppercase mb-4"
          style={{ color: "var(--color-sand)" }}
        >
          Make it memorable
        </p>

        <h2
          id="cta-heading"
          className="font-bold leading-tight mb-4"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
          }}
        >
          {ctaTitle}
        </h2>

        {/* Thin warm rule — centered */}
        <div
          className="mb-5 h-px w-12 mx-auto"
          style={{ backgroundColor: "var(--color-sand)" }}
        />

        <p
          className="text-sm font-light leading-relaxed mb-8"
          style={{ color: "var(--color-sand)" }}
        >
          {ctaText}
        </p>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* Primary: filled earth brown */}
          <Link
            href="/reservation"
            className="inline-flex items-center px-7 py-3.5 text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-300 button-ripple"
            style={{
              backgroundColor: "var(--color-earth)",
              color: "var(--background)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-earth-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-earth)")
            }
            aria-label={`Make a reservation at ${tenantName}`}
          >
            Reserve a Table
          </Link>

          {/* Secondary: text link */}
          <Link
            href="/menu"
            className="text-xs tracking-[0.18em] uppercase font-light transition-opacity duration-300 hover:opacity-50"
            style={{
              color: "var(--foreground)",
              textDecoration: "underline",
              textUnderlineOffset: "5px",
              textDecorationColor: "var(--color-sand)",
            }}
            aria-label={`View ${tenantName}'s menu`}
          >
            Explore Menu →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
