"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTenant } from "@/app/contexts/TenantContext";
import { fetchHomeInformation, type HomeInformation } from "@/api/queries";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  // { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [homeInfo, setHomeInfo] = useState<HomeInformation | null>(null);
  const pathname = usePathname();
  const { tenant } = useTenant();

  useEffect(() => {
    fetchHomeInformation().then((data) => {
      if (data) setHomeInfo(data);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <>
      {/* ── Main Navbar ── */}
      <nav
        aria-label="Site navigation"
        className={`z-40 h-15 transition-all duration-500 ${
          scrolled
            ? "bg-(--background)/96 backdrop-blur-md shadow-[0_1px_0_0_color-mix(in_srgb,var(--color-gold)_18%,transparent)]"
            : "bg-(--background)/95 backdrop-blur-sm border-b border-(--color-tan)/20"
        }`}
      >
        <div className="w-full h-full px-6 md:px-12 flex items-center justify-between">
          {/* Brand */}
          <div
            className="  text-center items-center h-full w-44 flex flex-col leading-none focus:outline-none group"
            aria-label={tenant ? `${tenant.name} Home` : "House of Senses Home"}
          >
            <Link
              href="/"
              className="w-full h-1/2 font-bold flex items-center justify-center text-center text-[20px] md:text-[18px] tracking-[0.32em] transition-opacity duration-300 group-hover:opacity-60"
              style={{
                color: tenant
                  ? tenant.mainColor || "var(--color-main)"
                  : "var(--color-main)",
              }}
            >
              {tenant ? (
                <TenantDisplayName name={tenant.name} />
              ) : (
                "House of Senses"
              )}
            </Link>
            <Link
              href="https://houseofsenses.vn"
              className="w-full h-1/2 flex items-center justify-center text-center text-[16px] md:text-[16px] font-bold tracking-[0.32em]  transition-opacity duration-300 group-hover:opacity-60"
              style={{
                color: tenant
                  ? tenant.mainColor || "var(--color-main)"
                  : "var(--color-main)",
                opacity: 0.82,
              }}
            >
              {homeInfo?.name ??
                (tenant?.address
                  ? tenant.address.split(",")[0]
                  : "Fine Dining")}
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative text-[15px] tracking-[0.28em] uppercase py-1 transition-opacity duration-300 hover:opacity-40 focus:outline-none"
                  style={{
                    color: "#000000",
                    opacity: isActive ? 1 : 0.92,
                  }}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute -bottom-0.5 left-0 right-0 h-px"
                      style={{
                        backgroundColor: "var(--color-main)",
                        opacity: 0.8,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: RESERVE + mobile burger */}
          <div className="flex items-center gap-5">
            <Link
              href="/reservation"
              className="hidden font-bold md:inline-flex items-center px-4 py-1.5 text-[15px] uppercase transition-all duration-300 hover:opacity-60 focus:outline-none"
              style={{
                backgroundColor: "var(--color-main)",
                border:
                  "1px solid color-mix(in srgb, var(--color-gold) 55%, transparent)",
                color: "var(--foreground)",
              }}
              aria-label="Make a reservation"
            >
              <span className="text-white">Book a Table</span>
            </Link>

            {/* Hamburger */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex flex-col gap-1.25 w-5 justify-center items-center focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <span
                className={`block h-px bg-foreground transition-all duration-300 ${isMenuOpen ? "w-5 rotate-45 translate-y-1.25" : "w-5"}`}
              />
              <span
                className={`block h-px bg-foreground transition-all duration-300 ${isMenuOpen ? "opacity-0 w-0" : "w-4"}`}
              />
              <span
                className={`block h-px bg-foreground transition-all duration-300 ${isMenuOpen ? "w-5 -rotate-45 -translate-y-1.25" : "w-5"}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile fullscreen menu ── */}
      <div
        className={`md:hidden fixed inset-0 z-200 flex flex-col transition-all duration-500 ${
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Close button */}
        <div
          className="flex items-center justify-between px-6 h-15 border-b"
          style={{
            borderColor:
              "color-mix(in srgb, var(--color-tan) 30%, transparent)",
          }}
        >
          <span
            className="text-[10px] tracking-[0.32em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.85 }}
          >
            Navigation
          </span>
          <button
            onClick={toggleMenu}
            className="w-8 h-8 flex items-center justify-center focus:outline-none"
            aria-label="Close menu"
          >
            <span className="block w-5 h-px bg-foreground rotate-45 absolute" />
            <span className="block w-5 h-px bg-foreground -rotate-45 absolute" />
          </button>
        </div>

        <nav
          aria-label="Main navigation menu"
          className="flex flex-col justify-center flex-1 px-10 gap-6"
        >
          {NAV_LINKS.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 group focus:outline-none"
              style={{ transitionDelay: `${i * 40}ms` }}
              onClick={toggleMenu}
            >
              <span
                className="text-[9px] tracking-[0.3em] tabular-nums"
                style={{ color: "var(--foreground)", opacity: 0.75 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-[clamp(1.6rem,6vw,2.8rem)] font-semibold leading-none tracking-tight transition-opacity duration-200 group-hover:opacity-40"
                style={{
                  fontFamily: "var(--font-arimo)",
                  color: "var(--foreground)",
                }}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="px-10 pb-12">
          <Link
            href="/reservation"
            className="inline-flex items-center px-7 py-3 text-[9px] tracking-[0.32em] uppercase font-medium transition-opacity duration-300 hover:opacity-60"
            style={{
              border:
                "1px solid color-mix(in srgb, var(--color-gold) 55%, transparent)",
              color: "var(--foreground)",
            }}
            onClick={toggleMenu}
          >
            Reserve a Table
          </Link>
        </div>
      </div>
    </>
  );
}
