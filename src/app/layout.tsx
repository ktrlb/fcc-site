import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fccgranbury.org'),
  title: "First Christian Church Granbury",
  description: "Welcome to First Christian Church Granbury - A community of faith, fellowship, and service in Granbury, Texas.",
  openGraph: {
    title: "First Christian Church Granbury",
    description: "Welcome to First Christian Church Granbury - A community of faith, fellowship, and service in Granbury, Texas.",
    url: "https://fccgranbury.org",
    siteName: "First Christian Church Granbury",
    images: [
      {
        url: "/images/fistpump.jpg",
        width: 1200,
        height: 630,
        alt: "First Christian Church Granbury - Celebrating Community",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "First Christian Church Granbury",
    description: "Welcome to First Christian Church Granbury - A community of faith, fellowship, and service in Granbury, Texas.",
    images: ["/images/fistpump.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/fdb0sna.css" />
      </head>
      <body
        className={`${geistMono.variable} antialiased font-sans`}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
