import type { Metadata } from "next";
import { Arimo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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

const BASE_URL = "https://houseofsenses.vn";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "House of Senses",
    template: "%s | House of Senses",
  },
  description:
    "Experience exceptional fine dining at House of Senses — multiple restaurant locations across Vietnam. Discover our story, menu, gallery, and book a table online.",
  keywords: [
    "House of Senses",
    "fine dining Vietnam",
    "restaurant Ho Chi Minh City",
    "Vietnamese cuisine",
    "luxury restaurant",
    "dinner reservation Vietnam",
    "Red Bistro",
    "Blue Bistro",
  ],
  authors: [{ name: "House of Senses", url: BASE_URL }],
  creator: "House of Senses",
  publisher: "House of Senses",
  icons: {
    icon: "/favicon.ico",
    apple: "/media/Asset 1.png",
  },
  openGraph: {
    siteName: "House of Senses",
    locale: "vi_VN",
    alternateLocale: "en_US",
    type: "website",
    url: BASE_URL,
    title: "House of Senses — Fine Dining in Vietnam",
    description:
      "Experience exceptional fine dining at House of Senses — multiple restaurant locations across Vietnam.",
    images: [
      {
        url: "/media/IMG_0050.JPG",
        width: 1200,
        height: 630,
        alt: "House of Senses Restaurant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@houseofsenses",
    title: "House of Senses — Fine Dining in Vietnam",
    description:
      "Experience exceptional fine dining at House of Senses — multiple restaurant locations across Vietnam.",
    images: ["/media/IMG_0050.JPG"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    "geo.region": "VN",
    "geo.placename": "Vietnam",
    "og:country-name": "Vietnam",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "House of Senses",
  url: BASE_URL,
  logo: `${BASE_URL}/media/Asset 1.png`,
  description:
    "Experience exceptional fine dining at House of Senses — multiple restaurant locations across Vietnam.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "VN",
  },
  sameAs: [
    "https://www.facebook.com/houseofsenses",
    "https://www.instagram.com/houseofsenses",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://admin.houseofsenses.vn" />
        <link rel="dns-prefetch" href="https://admin.houseofsenses.vn" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className={`${arimo.variable} ${ibmPlexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
