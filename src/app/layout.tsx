import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cesiha",
  description: "Türkiye'nin doğal güzellikleri ve tarihi hakkında yazılar",
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
