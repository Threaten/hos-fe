import type { Metadata } from "next";
import { Arimo, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Breadcrumbs from "./components/Breadcrumbs";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import { TenantProvider } from "../contexts/TenantContext";
import { JsonLd } from "../components/JsonLd";
import { fetchTenants } from "@/api/queries";

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

// Propagate the root title template so child pages can set their own title.
// Avoid overriding robots/canonical here — each page sets its own.
export const metadata: Metadata = {
  title: {
    template: "%s | House of Senses",
    default: "House of Senses",
  },
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenants = await fetchTenants().catch(() => []);

  const department = tenants
    .filter((t) => t.address || t.phone || t.email)
    .map((t) => {
      const sameAs: string[] = [];
      if (t.facebook) sameAs.push(t.facebook.startsWith("http") ? t.facebook : `https://www.facebook.com/${t.facebook}`);
      if (t.instagram) sameAs.push(t.instagram.startsWith("http") ? t.instagram : `https://www.instagram.com/${t.instagram}`);
      const lat = t.location?.latitude;
      const lng = t.location?.longitude;
      return {
        "@type": "Restaurant",
        name: t.name,
        url: `https://${t.domain}.houseofsenses.vn`,
        ...(t.address ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: t.address,
            addressCountry: "VN",
          },
        } : {}),
        ...(lat != null && lng != null ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: lat,
            longitude: lng,
          },
          hasMap: `https://maps.google.com/?q=${lat},${lng}`,
        } : {}),
        ...(t.phone ? { telephone: t.phone } : {}),
        ...(t.email ? { email: t.email } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      };
    });

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "House of Senses",
    url: "https://houseofsenses.vn",
    logo: "https://houseofsenses.vn/media/Asset 1.png",
    image: "https://houseofsenses.vn/media/IMG_0050.JPG",
    description:
      "Experience exceptional fine dining at House of Senses — multiple restaurant locations across Vietnam.",
    servesCuisine: ["Vietnamese", "Contemporary", "International"],
    priceRange: "$$$",
    currenciesAccepted: "VND, USD",
    paymentAccepted: "Cash, Credit Card",
    address: {
      "@type": "PostalAddress",
      addressCountry: "VN",
    },
    ...(department.length ? { department } : {}),
  };

  // SiteNavigationElement helps Google surface branch sitelinks under the main domain result
  const siteNavSchema = tenants.length
    ? tenants
        .filter((t) => t.domain)
        .map((t) => ({
          "@context": "https://schema.org",
          "@type": "SiteNavigationElement",
          name: t.name,
          url: `https://${t.domain}.houseofsenses.vn`,
        }))
    : null;

  return (
    <TenantProvider>
      <JsonLd data={restaurantSchema} />
      {siteNavSchema && siteNavSchema.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <Topbar />
      <Navbar />
      <Breadcrumbs />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </TenantProvider>
  );
}
