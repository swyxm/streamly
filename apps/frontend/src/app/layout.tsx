import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streamly - Live Streaming Platform",
  description: "A full-featured live streaming platform built with Next.js and modern web technologies.",
  keywords: ["live streaming", "twitch clone", "gaming", "esports", "live video", "streamly"],
  authors: [{ name: "Swayam Parekh", url: "https://swym.dev" }],
  creator: "Swayam Parekh",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Streamly",
    title: "Streamly - Live Streaming Platform",
    description: "A full-featured live streaming platform built with Next.js and modern web technologies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Streamly - Live Streaming Platform",
    description: "A full-featured live streaming platform built with Next.js and modern web technologies.",
    creator: "@swyxm",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#9147ff" },
    { media: "(prefers-color-scheme: dark)", color: "#772ce8" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { AppLayout } from '@/components/layout/AppLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/*
          <ThemeProvider>
          </ThemeProvider>
      */}
      {children}
    </AuthProvider>
  );
}
