import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "houseofsenses.vn",
  description: "Experience exceptional dining at houseofsenses.vn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
