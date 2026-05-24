import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "@/components/shared/SessionProvider";
import QueryProvider from "@/components/shared/QueryProvider";
import AuthSync from "@/components/shared/AuthSync";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://pcbanao.khanalankit.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PC Banao — AI-Powered PC Builder & Compatibility Checker",
    template: "%s | PC Banao",
  },
  description:
    "PC Banao is a free AI-powered PC builder. Pick your CPU, GPU, RAM, and more — get instant compatibility checks, live wattage tracking, and build the perfect custom PC.",
  keywords: [
    "pc banao",
    "pc banao builder",
    "pc builder india",
    "custom pc builder",
    "ai pc builder",
    "pc compatibility checker",
    "pc parts picker india",
    "build custom pc online",
    "gaming pc builder",
    "pc banao.vercel.app",
  ],
  authors: [{ name: "PC Banao" }],
  creator: "PC Banao",
  publisher: "PC Banao",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "PC Banao",
    title: "PC Banao — AI-Powered PC Builder & Compatibility Checker",
    description:
      "Build your perfect custom PC online. AI-driven compatibility, live wattage tracking, and a curated part catalog — free on PC Banao.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PC Banao — Build Your Perfect Custom PC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PC Banao — AI-Powered PC Builder",
    description:
      "Free AI-powered PC builder with instant compatibility checks. Build, save, and share your custom PC — PC Banao.",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <SessionProvider>
            <AuthSync />
            {children}
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
