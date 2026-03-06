import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Something Went Wrong - ELEMENTA",
  description: "Unfortunately, an error has occurred",
};

export default function SomethingWentWrongLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // No navbar, no footer, no topbar - just the error page
  return <>{children}</>;
}
