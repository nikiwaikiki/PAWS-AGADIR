import type { Metadata, Viewport } from "next";
import { Outfit, Merriweather } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "Save The Paws | Agadir - Taghazout",
  description:
    "Report animals in need, connect with local helpers, and track vaccinated dogs in the Agadir-Taghazout coastal region.",
  openGraph: {
    title: "Save The Paws",
    description: "Protecting stray dogs in Agadir & Taghazout, Morocco",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#d97740",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${merriweather.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
