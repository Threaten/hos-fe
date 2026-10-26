import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservation",
  description:
    "Reserve a table at House of Senses. Choose a branch, date, time, and party size online.",
  alternates: { canonical: "https://houseofsenses.vn/reservation" },
  openGraph: {
    title: "Reservation | House of Senses",
    description:
      "Reserve a table at House of Senses. Choose a branch, date, time, and party size online.",
    url: "https://houseofsenses.vn/reservation",
    images: [
      { url: "/media/IMG_0050.JPG", width: 1200, height: 630, alt: "Reserve a Table — House of Senses" },
    ],
  },
};

export default function ReservationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
