import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./background.css";

// Odstraním FlowerScrollEffect a jeho použití

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wloom - Vaše vize. Váš web. Váš rozkvět.",
  description: "Moderní webové stránky a aplikace na míru pro váš business.",
  icons: {
    icon: '/flower.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="background-pattern" />
        {/* Dekorativní květ vpravo dole, reagující na scroll */}
        {children}
      </body>
    </html>
  );
}
