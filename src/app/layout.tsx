import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// IMPORT BOTH NAV AND FOOTER
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
// 1. Import the component for GA
import { GoogleAnalytics } from '@next/third-parties/google'
// 2. Import Script for Chatbase
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

// CHANGE THIS VARIABLE TO 'true' WHEN YOU ARE READY TO LAUNCH
const IS_PRODUCTION_READY = false; 

export const metadata: Metadata = {
  title: 'OnlineCertificate.org',
  description: 'Generate verifiable certificates...',
  robots: {
    // If not ready, tell Google to go away.
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

        {/* Google Analytics */}
        <GoogleAnalytics gaId="G-3KV3BN7SVJ" />        

{/* Chatbase Widget (Robust Version) */}
        <Script
          id="chatbase-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if(!window.chatbase || window.chatbase("getState") !== "initialized"){
                  window.chatbase = (...arguments) => {
                    if(!window.chatbase.q){ window.chatbase.q = [] }
                    window.chatbase.q.push(arguments)
                  };
                  window.chatbase = new Proxy(window.chatbase, {
                    get(target, prop){
                      if(prop === "q"){ return target.q }
                      return (...args) => target(prop, ...args)
                    }
                  })
                }
                const onLoad = function(){
                  const script = document.createElement("script");
                  script.src = "https://www.chatbase.co/embed.min.js";
                  script.id = "-dhWiFXeEEcrMTBcxGEbY";
                  script.domain = "www.chatbase.co";
                  document.body.appendChild(script)
                };
                if(document.readyState === "complete"){ onLoad() }
                else { window.addEventListener("load", onLoad) }
              })();
            `,
          }}
        />

        <Footer />
      </body>
    </html>
  );
}