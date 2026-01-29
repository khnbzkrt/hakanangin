import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cesiha.com"),
  title: {
    default: "Cesiha - Türkiye'nin Doğal Güzellikleri",
    template: "%s | Cesiha",
  },
  description: "Türkiye'nin eşsiz doğal güzellikleri, tarihi mekanları ve kültürel zenginlikleri hakkında yazılar. Gezilecek yerler, seyahat rehberleri ve keşfedilmemiş rotalar.",
  keywords: ["Türkiye", "gezi", "seyahat", "doğa", "tarih", "kültür", "turizm", "gezilecek yerler"],
  authors: [{ name: "Cesiha" }],
  creator: "Cesiha",
  publisher: "Cesiha",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Cesiha",
    title: "Cesiha - Türkiye'nin Doğal Güzellikleri",
    description: "Türkiye'nin eşsiz doğal güzellikleri, tarihi mekanları ve kültürel zenginlikleri hakkında yazılar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cesiha - Türkiye'nin Doğal Güzellikleri",
    description: "Türkiye'nin eşsiz doğal güzellikleri, tarihi mekanları ve kültürel zenginlikleri hakkında yazılar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}

