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

export const metadata: Metadata = {
  title: {
    default: "House of Senses",
    template: "%s | House of Senses",
  },
  description:
    "Experience exceptional fine dining at House of Senses — multiple locations across Vietnam.",
  openGraph: {
    siteName: "House of Senses",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
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
      </head>
      <body className={`${arimo.variable} ${ibmPlexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
