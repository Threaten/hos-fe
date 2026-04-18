import type { Metadata } from "next";
import Flipbook from "./_components/Flipbook";
import CTA from "../components/CTA";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore the House of Senses menu — a curated selection of contemporary Vietnamese and international cuisine crafted for an exceptional dining experience.",
  alternates: { canonical: "https://houseofsenses.vn/menu" },
  openGraph: {
    title: "Menu | House of Senses",
    description: "Explore the House of Senses menu — contemporary Vietnamese and international cuisine.",
    url: "https://houseofsenses.vn/menu",
    images: [{ url: "/media/IMG_0050.JPG", width: 1200, height: 630, alt: "House of Senses Menu" }],
  },
};

const Menu = async ({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string }>;
}) => {
  const params = await searchParams;

  return (
    <div>
      <Flipbook initialBranch={params.branch} />
      <CTA />
    </div>
  );
};

export default Menu;
