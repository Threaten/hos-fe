import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lucky Wheel",
  description:
    "Spin the wheel and win an exclusive reward at House of Senses. A little surprise for our guests.",
  alternates: { canonical: "https://houseofsenses.vn/lucky-wheel" },
  openGraph: {
    title: "Lucky Wheel | House of Senses",
    description: "Spin the wheel and win an exclusive reward at House of Senses.",
    url: "https://houseofsenses.vn/lucky-wheel",
    images: [
      { url: "/media/IMG_0050.JPG", width: 1200, height: 630, alt: "Lucky Wheel — House of Senses" },
    ],
  },
};

export default function LuckyWheelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
