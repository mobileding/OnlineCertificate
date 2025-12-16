import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// IMPORT BOTH NAV AND FOOTER
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

// CHANGE THIS VARIABLE TO 'true' WHEN YOU ARE READY TO LAUNCH
const IS_PRODUCTION_READY = false; 


export const metadata: Metadata = {
  title: 'OnlineCertificate.org',
  description: 'Generate verifiable certificates...',
  robots: {
    // If not ready, tell Google to go away.
    // index: false = Don't show in search results
    // follow: false = Don't follow links on this page
    index: IS_PRODUCTION_READY,
    follow: IS_PRODUCTION_READY,
    googleBot: {
      index: IS_PRODUCTION_READY,
      follow: IS_PRODUCTION_READY,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navigation />
        
        {/* 'flex-grow' ensures the footer pushes to the bottom even on empty pages */}
        <div className="flex-grow">
          {children}
        </div>
        
        <Footer />
      </body>
    </html>
  );
}