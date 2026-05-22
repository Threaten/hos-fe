import type { Metadata } from "next";
import "../../globals.css";
import Topbar from "../../(main)/components/Topbar";
import Navbar from "../../(main)/components/Navbar";
import VerticalNavbar from "../../(main)/components/VerticalNavbar";
import Breadcrumbs from "../../(main)/components/Breadcrumbs";
import Footer from "../../(main)/components/Footer";
import PageTransition from "../../(main)/components/PageTransition";
import { TenantProvider } from "../../contexts/TenantContext";

// Page-level metadata is generated dynamically by [[...slug]]/layout.tsx.
// This fallback applies only if no child segment provides metadata.
export const metadata: Metadata = {
  title: "House of Senses",
  description:
    "Experience exceptional fine dining at House of Senses — multiple locations across Vietnam.",
};

export default function TenantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TenantProvider>
      {/* Topbar — always sticky so it remains visible while window scrolls */}
      <div className="sticky top-0 z-50">
        <Topbar />
        {/* Horizontal navbar with hamburger — mobile only */}
        <div className="md:hidden">
          <Navbar />
        </div>
      </div>

      {/* Fixed vertical sidebar (desktop) — window scroll keeps GSAP ScrollTrigger working */}
      <VerticalNavbar />

      {/* Main content offset by collapsed sidebar width on desktop */}
      <main className="min-w-0 flex flex-col md:pl-16">
        <Breadcrumbs />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </main>
    </TenantProvider>
  );
}
