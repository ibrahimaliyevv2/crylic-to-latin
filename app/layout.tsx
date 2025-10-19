import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kirildən Latına",
  description:
    "Azərbaycan dilində olan mətnlərin kiril əlifbasından latın əlifbasına çevrilməsi",
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
