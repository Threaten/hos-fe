"use client";
import { useState, useRef, useEffect } from "react";
import { fetchTenants, type Tenant } from "@/api/queries";
import { getTenantUrl } from "@/app/utils/domain";
import { useTenant } from "@/app/contexts/TenantContext";

export default function Topbar() {
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const { tenant: currentTenant } = useTenant();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTenants().then(setTenants);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest("button[aria-expanded]") &&
        !target.closest("[data-mobile-menu]") &&
        !dropdownRef.current?.contains(target as Node)
      ) {
        setOpenCard(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notification = currentTenant?.topbarNotification;
  const hasNotification = notification?.enabled && notification?.message;

  return (
    <div className="w-full" style={{ backgroundColor: "var(--background)" }}>
      {/* Notification banner */}
      {hasNotification && (
        <div
          className="w-full flex items-center justify-center py-2 px-4"
          style={{
            backgroundColor: "var(--color-earth)",
            borderBottom:
              "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
          }}
        >
          <span
            className="text-[9px] tracking-[0.38em] uppercase text-center"
            style={{ color: "var(--color-cream)" }}
          >
            {notification.message}
          </span>
        </div>
      )}

      {/* Branch switcher */}
      <div
        className="w-full h-9 border-b"
        style={{
          borderColor: "color-mix(in srgb, var(--color-tan) 25%, transparent)",
        }}
      >
        <div className="w-full h-full px-6 flex items-center">
          {/* Desktop */}
          <div className="hidden md:block w-full relative">
            <button
              onClick={() => setOpenCard(openCard ? null : "branches")}
              className="flex items-center justify-center gap-2.5 mx-auto transition-opacity duration-200 hover:opacity-50 focus:outline-none"
              aria-expanded={openCard === "branches"}
            >
              <span
                className="text-[8px] tracking-[0.35em] uppercase"
                style={{ color: "var(--foreground)", opacity: 0.78 }}
              >
                Our Locations
              </span>
              <span
                className="text-[8px] tracking-[0.28em] uppercase font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                {tenants.map((t) => t.name.toLowerCase()).join("  ·  ")}
              </span>
              <span
                className={`text-[7px] transition-transform duration-300`}
                style={{
                  color: "var(--foreground)",
                  opacity: 0.78,
                  transform:
                    openCard === "branches" ? "rotate(180deg)" : "none",
                }}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            {/* Desktop Dropdown */}
            {openCard === "branches" && (
              <div
                ref={dropdownRef}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 min-w-140"
                style={{
                  backgroundColor: "var(--background)",
                  border:
                    "1px solid color-mix(in srgb, var(--color-tan) 40%, transparent)",
                  borderTop: "none",
                  boxShadow:
                    "0 8px 32px color-mix(in srgb, var(--color-earth) 8%, transparent)",
                }}
              >
                <div className="grid grid-cols-2 gap-0">
                  {tenants.map((tenant, idx) => (
                    <div
                      key={tenant.id}
                      onClick={() => {
                        window.location.href = getTenantUrl(tenant.domain);
                      }}
                      className="p-5 cursor-pointer transition-colors duration-200 group"
                      style={{
                        borderRight:
                          idx % 2 === 0
                            ? "1px solid color-mix(in srgb, var(--color-tan) 30%, transparent)"
                            : "none",
                        borderBottom:
                          idx < tenants.length - 2
                            ? "1px solid color-mix(in srgb, var(--color-tan) 30%, transparent)"
                            : "none",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "color-mix(in srgb, var(--color-parchment) 80%, transparent)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "transparent";
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <p
                          className="text-[10px] tracking-[0.22em] uppercase font-semibold"
                          style={{
                            color: "var(--foreground)",
                            fontFamily: "var(--font-arimo)",
                          }}
                        >
                          {tenant.name.toLowerCase()}
                        </p>
                        {currentTenant?.id === tenant.id && (
                          <span
                            className="text-[7px] tracking-[0.28em] uppercase"
                            style={{ color: "var(--color-gold)" }}
                          >
                            ← here
                          </span>
                        )}
                      </div>
                      {tenant.address && (
                        <p
                          className="text-[9px] leading-relaxed"
                          style={{ color: "var(--color-sand)" }}
                        >
                          {tenant.address}
                        </p>
                      )}
                      {tenant.phone && (
                        <p
                          className="text-[9px] mt-0.5"
                          style={{ color: "var(--color-sand)" }}
                        >
                          {tenant.phone}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div
            className="md:hidden w-full"
            data-mobile-menu
            ref={mobileMenuRef}
          >
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between focus:outline-none"
              aria-expanded={mobileMenuOpen}
            >
              <span
                className="text-[8px] tracking-[0.35em] uppercase"
                style={{ color: "var(--foreground)", opacity: 0.78 }}
              >
                Our Locations
              </span>
              <span
                className="text-[7px] transition-transform duration-300"
                style={{
                  color: "var(--foreground)",
                  opacity: 0.78,
                  transform: mobileMenuOpen ? "rotate(180deg)" : "none",
                }}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            <div
              className={`absolute left-0 right-0 top-full z-50 transition-all duration-300 ${
                mobileMenuOpen
                  ? "opacity-100 visible"
                  : "opacity-0 invisible pointer-events-none"
              }`}
              style={{
                backgroundColor: "var(--background)",
                borderBottom:
                  "1px solid color-mix(in srgb, var(--color-tan) 30%, transparent)",
                boxShadow:
                  "0 8px 24px color-mix(in srgb, var(--color-earth) 6%, transparent)",
              }}
            >
              <div className="px-6 py-4 space-y-4">
                {tenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    onClick={() => {
                      window.location.href = getTenantUrl(tenant.domain);
                    }}
                    className="cursor-pointer py-2 border-b last:border-b-0"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--color-tan) 25%, transparent)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <p
                        className="text-[10px] tracking-[0.22em] uppercase font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {tenant.name.toLowerCase()}
                      </p>
                      {currentTenant?.id === tenant.id && (
                        <span
                          className="text-[7px] tracking-[0.28em]"
                          style={{ color: "var(--color-gold)" }}
                        >
                          ← here
                        </span>
                      )}
                    </div>
                    {tenant.address && (
                      <p
                        className="text-[9px] mt-0.5"
                        style={{ color: "var(--color-sand)" }}
                      >
                        {tenant.address}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
