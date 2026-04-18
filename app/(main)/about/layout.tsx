import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the story behind House of Senses — our philosophy, our chefs, and the passion for exceptional fine dining at every one of our locations across Vietnam.",
  alternates: { canonical: "https://houseofsenses.vn/about" },
  openGraph: {
    title: "About | House of Senses",
    description:
      "Learn the story behind House of Senses — our philosophy, our chefs, and the passion for exceptional fine dining.",
    url: "https://houseofsenses.vn/about",
    images: [
      { url: "/media/IMG_0050.JPG", width: 1200, height: 630, alt: "House of Senses — Our Story" },
    ],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
