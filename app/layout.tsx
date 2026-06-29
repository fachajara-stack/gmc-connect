import type { Metadata } from "next";
import { Geist, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GMC Connect",
  description: "Marketplace B2B d'export de fruits tropicaux",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} ${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
