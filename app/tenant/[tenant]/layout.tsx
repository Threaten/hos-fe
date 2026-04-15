import type { Metadata } from "next";
import "../../globals.css";
import Topbar from "../../(main)/components/Topbar";
import Navbar from "../../(main)/components/Navbar";
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
      <Topbar />
      <Navbar />
      <Breadcrumbs />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </TenantProvider>
  );
}
