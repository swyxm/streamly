import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "Twitch Clone - Live Streaming Platform",
  description: "A full-featured live streaming platform built with Next.js and modern web technologies.",
  keywords: ["live streaming", "twitch clone", "gaming", "esports", "live video"],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  creator: "Your Name",
  publisher: "Your Company",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Twitch Clone",
    title: "Twitch Clone - Live Streaming Platform",
    description: "A full-featured live streaming platform built with Next.js and modern web technologies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitch Clone - Live Streaming Platform",
    description: "A full-featured live streaming platform built with Next.js and modern web technologies.",
    creator: "@yourtwitter",
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
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </Providers>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}

// Providers component to wrap the app with necessary context providers
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Add your providers here */}
      {/* Example: 
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      */}
      {children}
    </>
  );
}
