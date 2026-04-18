import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore the House of Senses gallery — a visual journey through our restaurant spaces, signature dishes, and memorable dining moments.",
  alternates: { canonical: "https://houseofsenses.vn/gallery" },
  openGraph: {
    title: "Gallery | House of Senses",
    description:
      "Explore the House of Senses gallery — restaurant spaces, signature dishes, and memorable dining moments.",
    url: "https://houseofsenses.vn/gallery",
    images: [
      { url: "/media/IMG_0051.JPG", width: 1200, height: 630, alt: "House of Senses Gallery" },
    ],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
