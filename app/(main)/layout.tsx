import type { Metadata } from "next";
import "../globals.css";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Breadcrumbs from "./components/Breadcrumbs";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import { TenantProvider } from "../contexts/TenantContext";

export const metadata: Metadata = {
  title: "houseofsenses.vn",
  description: "Experience exceptional  dining at houseofsenses.vn",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TenantProvider>
      <header className="sticky top-0 z-50">
        <Topbar />
        <Navbar />
      </header>
      <Breadcrumbs />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </TenantProvider>
  );
}
