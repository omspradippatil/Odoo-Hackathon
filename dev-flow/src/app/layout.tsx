import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F5EF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1020" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevents iOS zoom on inputs to feel app-like
};

export const metadata: Metadata = {
  title: "Aakalan360 | The smarter way to make a deal",
  description: "Aakalan360 is an intelligent deal, procurement and sales operations platform. Insights • Connections • Opportunities — For a Smarter Tomorrow.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/brand/aakalan-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aakalan360",
  },
};

import { DemoShortcut } from "@/components/demo/DemoShortcut";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <DemoShortcut />
      </body>
    </html>
  );
}
