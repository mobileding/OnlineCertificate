import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// IMPORT BOTH NAV AND FOOTER
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OnlineCertificate.org",
  description: "Free instant certificate generator",
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