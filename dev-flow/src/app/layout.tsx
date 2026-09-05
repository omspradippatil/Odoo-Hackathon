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
  title: "DEV FLOW | The smarter way to make a deal",
  description: "DEV FLOW is an intelligent deal, procurement and sales operations platform. Source, compare, negotiate, approve and fulfil every deal from one intelligent workspace.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DEV FLOW",
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
