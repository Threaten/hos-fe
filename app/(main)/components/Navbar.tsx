"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTenant } from "@/app/contexts/TenantContext";
import { fetchHomeInformation, type HomeInformation } from "@/api/queries";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/menu", label: "MENU" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/contact", label: "CONTACT" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [homeInfo, setHomeInfo] = useState<HomeInformation | null>(null);
  const pathname = usePathname();
  const { tenant } = useTenant();

  useEffect(() => {
    fetchHomeInformation().then((data) => {
      if (data) setHomeInfo(data);
    });
  }, []);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <>
      {/* ── Main Navbar ── */}
      <nav
        aria-label="Site navigation"
        className="z-40 h-14 bg-background/95 backdrop-blur-sm border-b border-[rgb(124,118,89)]/20"
      >
        <div className="w-full h-full px-6 md:px-10 flex items-center justify-between">
          {/* Brand — two-line left block */}
          <Link
            href="/"
            className="flex flex-col leading-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
            aria-label={tenant ? `${tenant.name} Home` : "House of Senses Home"}
          >
            <span className="text-sm md:text-base font-semibold tracking-widest text-gray-900 uppercase">
              {tenant ? tenant.name : "House of Senses"}
            </span>
            <span className="text-[9px] tracking-[0.22em] uppercase text-gray-400 mt-px">
              {homeInfo?.name ?? (tenant?.address ? tenant.address.split(",")[0] : "Fine Dining")}
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-[11px] tracking-[0.22em] uppercase transition-opacity duration-200 hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 rounded ${
                  pathname === href ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: RESERVE + mobile burger */}
          <div className="flex items-center gap-5">
            <Link
              href="/reservation"
              className="hidden md:block text-[11px] tracking-[0.22em] uppercase font-semibold text-gray-900 underline underline-offset-4 decoration-[rgb(124,118,89)] hover:opacity-50 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
              aria-label="Make a reservation"
            >
              RESERVE
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex flex-col gap-[5px] w-5 justify-center items-center focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <span
                className={`block h-px w-5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile slide-down menu ── */}
      <div
        className={`md:hidden fixed left-0 right-0 top-[104px] z-40 transition-all duration-400 ease-in-out ${
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="bg-background/98 backdrop-blur-md border-b border-[rgb(124,118,89)]/20 px-8 py-8 shadow-md">
          <nav
            aria-label="Main navigation menu"
            className="flex flex-col gap-5"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs tracking-[0.22em] uppercase transition-opacity duration-200 py-1 focus:outline-none ${
                  pathname === href
                    ? "text-gray-900 border-l-2 border-gray-900 pl-3"
                    : "text-gray-500 hover:text-gray-900 pl-0"
                }`}
                onClick={toggleMenu}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/reservation"
              className="mt-3 text-xs tracking-[0.22em] uppercase font-semibold text-gray-900 underline underline-offset-4 decoration-[rgb(124,118,89)] hover:opacity-50 transition-opacity duration-200"
              onClick={toggleMenu}
            >
              RESERVE
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
