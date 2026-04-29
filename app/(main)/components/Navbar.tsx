"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTenant } from "@/app/contexts/TenantContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { tenant } = useTenant();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav aria-label="Site navigation" className="flex justify-center items-center h-14 left-0 right-0 z-40 transition-all duration-300 bg-background/95 backdrop-blur-sm text-gray-900 border-b border-[rgb(124,118,89)]/20">
        <div className="w-full px-10 py-4">
          <div className="flex items-center justify-between">
            {/* Hamburger Menu Button - Left */}
            <button
              onClick={toggleMenu}
              className="flex flex-col gap-1.5 w-6 h-6 justify-center items-center hover:opacity-70 transition-opacity relative focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <span
                className={`block h-0.5 w-6 transition-all duration-300 bg-gray-900 absolute ${
                  isMenuOpen ? "rotate-45" : "top-0"
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 transition-all duration-300 bg-gray-900 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 transition-all duration-300 bg-gray-900 absolute ${
                  isMenuOpen ? "-rotate-45" : "bottom-0"
                }`}
              ></span>
            </button>

            {/* Logo - Center */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link
                href="/"
                className="block text-sm font-semibold text-gray-900 hover:text-gray-600 transition-all duration-300 hover:scale-105 tracking-wide focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
                aria-label={tenant ? `${tenant.name} Home` : "House of Senses Home"}
              >
                <span className="text-xl lg:text-2xl font-semibold tracking-wider block">
                  {tenant ? tenant.name.toLowerCase() : "houseofsenses.vn"}
                </span>
              </Link>
            </div>

            {/* Reservation Button - Right */}
            <Link
              href="/reservation"
              className="px-4 py-1.5 text-xs md:px-6 md:py-2 md:text-sm tracking-wide transition-all border-2 border-gray-900 hover:bg-gray-900 hover:text-white hover:shadow-lg hover:scale-105 duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded button-ripple"
              aria-label="Make a reservation"
            >
              RESERVE
            </Link>
          </div>
        </div>
      </nav>

      {/* Overlay Menu */}
      <div
        className={`fixed left-5 top-26 z-60 transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? "opacity-100 visible translate-x-0"
            : "opacity-0 invisible pointer-events-none -translate-x-4"
        }`}
      >
        <div className="bg-[rgb(226,232,216)]/95 backdrop-blur-md shadow-2xl px-14 py-10 relative border border-gray-300 min-w-[280px] rounded-sm">
          {/* Close Button */}

          {/* Menu Links */}
          <nav aria-label="Main navigation menu" className="space-y-6 pr-14">
            <Link
              href="/"
              className={`block text-base font-semibold transition-all duration-300 tracking-wide hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1 ${
                pathname === "/"
                  ? "text-gray-900 border-l-2 border-gray-900 pl-3"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={toggleMenu}
            >
              HOME
            </Link>
            <Link
              href="/about"
              className={`block text-base font-semibold transition-all duration-300 tracking-wide hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1 ${
                pathname === "/about"
                  ? "text-gray-900 border-l-2 border-gray-900 pl-3"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={toggleMenu}
            >
              ABOUT
            </Link>
            <Link
              href="/menu"
              className={`block text-base font-semibold transition-all duration-300 tracking-wide hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1 ${
                pathname === "/menu"
                  ? "text-gray-900 border-l-2 border-gray-900 pl-3"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={toggleMenu}
            >
              MENU
            </Link>
            <Link
              href="/gallery"
              className={`block text-base font-semibold transition-all duration-300 tracking-wide hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1 ${
                pathname === "/gallery"
                  ? "text-gray-900 border-l-2 border-gray-900 pl-3"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={toggleMenu}
            >
              GALLERY
            </Link>
            <Link
              href="/contact"
              className={`block text-base font-semibold transition-all duration-300 tracking-wide hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1 ${
                pathname === "/contact"
                  ? "text-gray-900 border-l-2 border-gray-900 pl-3"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={toggleMenu}
            >
              CONTACT
            </Link>
            <Link
              href="/reservation"
              className={`block text-base font-semibold transition-all duration-300 tracking-wide hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1 ${
                pathname === "/reservation"
                  ? "text-gray-900 border-l-2 border-gray-900 pl-3"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={toggleMenu}
            >
              RESERVATION
            </Link>

            {/* Social Icons */}
            <div className="flex gap-5 pt-5 border-t border-gray-400">
              {tenant?.facebook && (
                <a
                  href={tenant.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
                  aria-label={`Visit ${tenant.name} on Facebook`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {tenant?.instagram && (
                <a
                  href={tenant.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
                  aria-label={`Visit ${tenant.name} on Instagram`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {tenant?.tiktok && (
                <a
                  href={tenant.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
                  aria-label={`Visit ${tenant.name} on TikTok`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
              )}
              {tenant?.youtube && (
                <a
                  href={tenant.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
                  aria-label={`Visit ${tenant.name} on YouTube`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
