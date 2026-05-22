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
      <div className="md:h-dvh md:flex md:flex-col">
        {/* Topbar — sticky on mobile, static in the desktop flex column */}
        <div className="sticky top-0 z-50 md:static md:z-auto">
          <Topbar />
          {/* Horizontal navbar with hamburger — mobile only */}
          <div className="md:hidden">
            <Navbar />
          </div>
        </div>

        {/* Body row: vertical sidebar (overlay) + scrollable content */}
        <div className="flex flex-1 md:min-h-0 relative">
          <VerticalNavbar />
          <main className="flex-1 md:overflow-y-auto min-w-0 flex flex-col">
            <Breadcrumbs />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </main>
        </div>
      </div>
    </TenantProvider>
  );
}
