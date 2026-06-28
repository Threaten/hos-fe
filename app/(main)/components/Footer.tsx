"use client";

import React, { useState, useEffect } from "react";
import { fetchTenants, type Tenant } from "@/api/queries";
import { getTenantUrl } from "@/app/utils/domain";
import { useTenant } from "@/app/contexts/TenantContext";

// Footer brand color tokens (deep earth, dark)
const FOOTER_BG = "oklch(31% 0.058 85)";
const FOOTER_BORDER = "color-mix(in srgb, #000 18%, transparent)";
const FOOTER_TEXT = "#000000";
const FOOTER_MUTED = "#000000";
const FOOTER_GOLD = "#000000";

const SocialIcon = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="transition-opacity duration-200 hover:opacity-50"
    style={{ color: FOOTER_MUTED }}
    aria-label={label}
  >
    {children}
  </a>
);

const TenantDisplayName = ({ name }: { name: string }) => (
  <>
    {name.split(/(_+)/).map((part, index) => (
      <span
        key={`${part}-${index}`}
        className={part.startsWith("_") ? "tracking-normal" : undefined}
      >
        {part}
      </span>
    ))}
  </>
);

const Footer: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [expanded, setExpanded] = useState(false);
  const { tenant: currentTenant } = useTenant();

  useEffect(() => {
    fetchTenants().then(setTenants);
  }, []);

  return (
    <footer className="w-full flex flex-col">
      {/* Top separator */}
      <div
        className="h-px w-full shrink-0"
        style={{
          background: `linear-gradient(to right, transparent, var(--color-main), transparent)`,
          opacity: 1,
        }}
      />

      {/* ── Two-column main body ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 px-8 md:px-14 pt-12 pb-10 gap-12">
        {/* LEFT: House of Senses brand mark */}
        <div className="flex h-full items-center justify-center md:justify-start">
          <h2
            className="w-full font-normal leading-[0.7]"
            style={{
              fontSize: "clamp(3.75rem, 8.5vw, 8.5rem)",
              letterSpacing: "-0.055em",
              color: FOOTER_TEXT,
              fontFamily:
                'Didot, "Bodoni 72", "Bodoni MT", "Times New Roman", serif',
              fontWeight: 400,
            }}
          >
            <span className="block">House</span>
            <span className="block whitespace-nowrap pl-[clamp(2.25rem,8vw,8rem)]">
              of Senses
            </span>
          </h2>
        </div>

        {/* RIGHT: Our Locations accordion */}
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-3 focus:outline-none group w-fit"
            aria-expanded={expanded}
          >
            <span
              className="text-[12px] tracking-[0.42em] uppercase"
              style={{ color: FOOTER_MUTED }}
            >
              Our Locations
            </span>
            <div
              className="text-[16px] h-10 w-2  justify-center leading-none inline-flex items-center  transition-transform duration-300"
              style={{
                color: FOOTER_MUTED,
                transform: expanded ? "rotate(180deg)" : "none",
              }}
            >
              ▾
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-8">
              {tenants.map((tenant) => {
                const tenantUrl = getTenantUrl(tenant.domain);
                return (
                  <div key={tenant.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>●</span>
                      <a
                        href={tenantUrl}
                        className="text-[15px] tracking-[0.18em] uppercase font-semibold transition-opacity duration-200 hover:opacity-50"
                        style={{ color: FOOTER_TEXT }}
                      >
                        <TenantDisplayName name={tenant.name} />
                      </a>
                      {currentTenant?.id === tenant.id && (
                        <span
                          className="text-[11px] tracking-[0.28em]"
                          style={{ color: "var(--color-main)" }}
                        >
                          ← here
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {tenant.address && (
                        <p
                          className="text-[14px] leading-relaxed"
                          style={{ color: FOOTER_MUTED }}
                        >
                          {tenant.address}
                        </p>
                      )}
                      {tenant.phone && (
                        <p
                          className="text-[14px]"
                          style={{ color: FOOTER_MUTED }}
                        >
                          T: {tenant.phone}
                        </p>
                      )}
                      {tenant.email && (
                        <p
                          className="text-[14px]"
                          style={{ color: FOOTER_MUTED }}
                        >
                          {tenant.email}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 mt-3">
                      {tenant.mainColor}
                      {tenant.facebook && (
                        <SocialIcon
                          href={tenant.facebook}
                          label={`${tenant.name} on Facebook`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </SocialIcon>
                      )}
                      {tenant.instagram && (
                        <SocialIcon
                          href={tenant.instagram}
                          label={`${tenant.name} on Instagram`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </SocialIcon>
                      )}
                      {tenant.tiktok && (
                        <SocialIcon
                          href={tenant.tiktok}
                          label={`${tenant.name} on TikTok`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                          </svg>
                        </SocialIcon>
                      )}
                      {tenant.youtube && (
                        <SocialIcon
                          href={tenant.youtube}
                          label={`${tenant.name} on YouTube`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </SocialIcon>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="h-px mx-8 md:mx-14"
        style={{ backgroundColor: FOOTER_BORDER }}
      />
      <div className="flex items-center justify-between px-8 md:px-14 py-5">
        <p
          className="text-[12px] tracking-[0.32em] uppercase"
          style={{ color: FOOTER_MUTED }}
        >
          &copy; {new Date().getFullYear()} houseofsenses.vn
        </p>
        <p
          className="text-[12px] tracking-[0.28em] uppercase"
          style={{ color: FOOTER_MUTED }}
        >
          All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
