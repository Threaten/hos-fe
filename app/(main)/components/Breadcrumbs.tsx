"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const Breadcrumbs = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter((path) => path);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    let currentPath = "";
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-3 px-6 md:px-12 border-b"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "color-mix(in srgb, var(--color-tan) 25%, transparent)",
      }}
    >
      <ol className="flex items-center gap-0">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={breadcrumb.href} className="flex items-center">
              {index > 0 && (
                <span
                  className="mx-2.5 text-[7px]"
                  style={{ color: "var(--color-gold)", opacity: 0.6 }}
                  aria-hidden="true"
                >
                  ◇
                </span>
              )}
              {isLast ? (
                <span
                  className="text-[9px] tracking-[0.22em] uppercase font-medium"
                  style={{ color: "var(--foreground)" }}
                  aria-current="page"
                >
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="text-[9px] tracking-[0.22em] uppercase transition-opacity duration-200 hover:opacity-50 focus:outline-none"
                  style={{ color: "var(--color-sand)" }}
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
