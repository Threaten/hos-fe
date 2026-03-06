import type { Metadata } from "next";
import { Arimo, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Breadcrumbs from "./components/Breadcrumbs";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import { TenantProvider } from "../contexts/TenantContext";

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
  title: "ELEMENTA",
  description: "Experience exceptional fine dining at ELEMENTA",
};

export default function MainLayout({
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
