import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FontAwesomeScript from "./FontAwesomeScript";
import Footer from "@/UI/footer/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.tsx
export const metadata = {
  title: "MK Exports - Algeria - Quality Products Worldwide",
  description: "Official website of MK Exports Algeria. Explore our high-quality products and services.",
  keywords: [
    "MK Exports",
    "exports",
    "products",
    "international trade",
    "Algerian products",
    "global shipping"
  ],
  metadataBase: new URL("https://mk-exports.vercel.app"),
  openGraph: {
    title: "MK Exports - Quality Products Worldwide",
    description: "Official website of MK Exports.",
    url: "https://mk-exports.vercel.app",
    siteName: "MK Exports",
    images: [
      {
        url: "/mk.png", // or full URL: "https://mk-exports.vercel.app/preview.jpg"
        width: 1200,
        height: 630,
        alt: "MK Exports Algeria - Quality Products"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MK Exports",
    description: "Official website of MK Exports.",
    images: ["/mk_exports_copy-removebg-preview.png"], // same image for Twitter
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/mk.png" />
        <title>MK Exports - Quality Products Worldwide</title>
        <meta name="description" content="Official website of MK Exports. Explore our high-quality products and services." />
        <meta name="keywords" content="MK Exports, exports, products, international trade" />
        <meta property="og:title" content="MK Exports - Quality Products Worldwide" />
        <meta property="og:description" content="Official website of MK Exports." />
        <meta property="og:url" content="https://mk-exports.vercel.app" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{margin:0}}>
  
              <main style={{margin:"0"}}>{children}</main>
        <Footer />
        <FontAwesomeScript />
      </body>
    </html>
  );
}
