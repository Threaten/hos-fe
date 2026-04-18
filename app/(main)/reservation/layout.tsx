import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservation",
  description:
    "Reserve your table at House of Senses. Book online for an unforgettable fine dining experience at any of our Vietnam locations.",
  alternates: { canonical: "https://houseofsenses.vn/reservation" },
  openGraph: {
    title: "Reservation | House of Senses",
    description:
      "Reserve your table at House of Senses. Book online for an unforgettable fine dining experience.",
    url: "https://houseofsenses.vn/reservation",
    images: [
      { url: "/media/IMG_0050.JPG", width: 1200, height: 630, alt: "Reserve a Table — House of Senses" },
    ],
  },
};

export default function ReservationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
