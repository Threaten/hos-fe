import type { Metadata } from "next";
import ContactForm from "./_components/ContactForm";
import CTA from "../components/CTA";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with House of Senses. Find our locations, phone numbers, email, and send us a message.",
  alternates: { canonical: "https://houseofsenses.vn/contact" },
  openGraph: {
    title: "Contact | House of Senses",
    description: "Get in touch with House of Senses. Find our locations, phone numbers, email, and send us a message.",
    url: "https://houseofsenses.vn/contact",
    images: [{ url: "/media/IMG_0050.JPG", width: 1200, height: 630, alt: "House of Senses" }],
  },
};

export default function ContactPage({
  searchParams,
}: {
  searchParams: { branch?: string; tenant?: string };
}) {
  return (
    <>
      <ContactForm
        initialBranch={searchParams?.branch}
        currentTenant={searchParams?.tenant}
      />
      <CTA />
    </>
  );
}
