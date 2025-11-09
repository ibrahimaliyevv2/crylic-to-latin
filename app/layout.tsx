import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cyrillic to Latin",
  description:
    "Conversion of Azerbaijani texts from the Cyrillic alphabet to the Latin alphabet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
