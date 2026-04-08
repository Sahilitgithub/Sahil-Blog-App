import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for root layout
export const metadata: Metadata = {
  title: "Sahil-it",
  description: "Created the website by Sahil-it in Bangladesh",
  generator: "Next.js",
  referrer: 'origin-when-cross-origin',
  keywords: ['Sahil-it Blog Website', 'Made the website by bangladeshi person'],
  authors: [{name: "Md Sahil-it"}],
  creator: "Md Sahil Talukder",
  publisher: 'Md Sahil Talukder',
  openGraph: {
    url: `${process.env.BASE_URL}`, // Can use the base URL for consistency
    siteName: "Sahil-It Blog Platform in bangladesh",
    images: [
      {
        url: `${process.env.BASE_URL}`,
        width: 1200,
        height: 630,
      },
      // Add more images as needed...
    ], // URL to the image representing the content
    type: "website", // Type of the content
  },
  metadataBase: new URL(`${process.env.BASE_URL}`),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "bn-BD": "/bn-BD",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Online shop Bds",
    description: "Sahil-It Blog Platform in bangladesh",
    creator: "Md Sahil Talukder",
    images: {
      url: `${process.env.BASE_URL}`,
      alt: "Sahil-It Blog Platform in bangladesh",
    },
  },
};

// Application Root Layout Funciton
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Toaster position="top-right" />
          {children}

      </body>
    </html>
    </ClerkProvider>
  );
}
