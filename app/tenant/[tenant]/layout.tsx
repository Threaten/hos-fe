import type { Metadata } from "next";
import { Arimo, IBM_Plex_Mono } from "next/font/google";
import "../../globals.css";
import Topbar from "../../(main)/components/Topbar";
import Navbar from "../../(main)/components/Navbar";
import Breadcrumbs from "../../(main)/components/Breadcrumbs";
import Footer from "../../(main)/components/Footer";
import PageTransition from "../../(main)/components/PageTransition";
import { TenantProvider } from "../../contexts/TenantContext";

const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal", "italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["200"],
});

export const metadata: Metadata = {
  title: "houseofsenses.vn",
  description: "Experience exceptional fine dining at houseofsenses.vn",
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
