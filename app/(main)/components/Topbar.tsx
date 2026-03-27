"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { fetchTenants, type Tenant } from "@/api/queries";
import { getTenantUrl } from "@/app/utils/domain";

export default function Topbar() {
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch tenants
    const loadTenants = async () => {
      const data = await fetchTenants();
      setTenants(data);
    };

    loadTenants();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Close if clicking anywhere except the dropdown button, mobile menu, or dropdown content
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

  return (
    <div className="sticky top-0 z-50 w-full h-12 bg-background/95 backdrop-blur-sm text-center items-center justify-center flex text-gray-900 border-b border-[rgb(124,118,89)]/20">
      <div className="w-full px-4 py-3">
        {/* Desktop Layout - Dropdown when content is too long */}
        <div className="hidden md:block">
          <button
            onClick={() => setOpenCard(openCard ? null : "branches")}
            className="flex items-center justify-center gap-2 text-xs tracking-widest font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1 mx-auto hover:text-gray-900 transition-all duration-300"
            aria-expanded={openCard === "branches"}
          >
            <span className="text-gray-700 whitespace-nowrap">
              Our Sisters:
            </span>
            <span className="text-gray-900 font-semibold whitespace-nowrap">
              {tenants.map((t) => t.name.toLowerCase()).join(" | ")}
            </span>
            <span
              className={`transition-transform duration-300 text-gray-700 ${
                openCard === "branches" ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {/* Desktop Dropdown Content */}
          {openCard === "branches" && (
            <div
              ref={dropdownRef}
              className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 bg-white border border-gray-200 rounded-b-lg shadow-lg min-w-[600px] z-50"
            >
              <div className="grid grid-cols-2 gap-4 p-4">
                {tenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    onClick={() => {
                      window.location.href = getTenantUrl(tenant.domain);
                    }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <h3 className="font-bold text-sm mb-2 text-gray-900 tracking-wide">
                      {tenant.name.toLowerCase()}
                    </h3>
                    <div className="space-y-1 text-left">
                      {tenant.address && (
                        <p className="text-xs text-gray-600">
                          {tenant.address}
                        </p>
                      )}
                      {tenant.phone && (
                        <p className="text-xs text-gray-600">{tenant.phone}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Layout - Dropdown */}
        <div className="md:hidden" data-mobile-menu ref={mobileMenuRef}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between text-xs tracking-widest font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1"
            aria-expanded={mobileMenuOpen}
          >
            <span className="text-gray-700">Our Branches</span>
            <span
              className={`transition-transform duration-300 ${
                mobileMenuOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {/* Mobile Dropdown Content */}
          <div
            className={`absolute left-0 right-0 top-full bg-[rgb(245,240,225)] border-b-2 border-[rgb(124,118,89)]/30 transition-all duration-300 ${
              mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <div className="px-4 py-3 space-y-3">
              {tenants.map((tenant, index) => (
                <div
                  key={tenant.id}
                  onClick={() => {
                    window.location.href = getTenantUrl(tenant.domain);
                  }}
                  className={`block hover:bg-gray-100 transition-colors rounded p-2 cursor-pointer ${
                    index < tenants.length - 1
                      ? "border-b border-gray-300 pb-3"
                      : ""
                  }`}
                >
                  <h3 className="font-bold text-sm mb-2 text-gray-900 uppercase tracking-wide">
                    {tenant.name}
                  </h3>
                  <div className="space-y-1 text-left">
                    {tenant.address && (
                      <p className="text-xs text-gray-600">{tenant.address}</p>
                    )}
                    {tenant.phone && (
                      <p className="text-xs text-gray-600">{tenant.phone}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
