import type { Metadata } from "next";
import { Inter } from "next/font/google";
// ✅ Correct relative path for src/app/[locale]/layout.tsx -> src/app/globals.css
import "../globals.css"; 
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script'; // ✅ Fixed Import

// i18n Imports
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });
const IS_PRODUCTION_READY = false;

export const metadata: Metadata = {
  title: 'OnlineCertificate.org',
  description: 'Generate verifiable certificates...',
  robots: {
    index: IS_PRODUCTION_READY,
    follow: IS_PRODUCTION_READY,
    googleBot: {
      index: IS_PRODUCTION_READY,
      follow: IS_PRODUCTION_READY,
    },
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 2. Security Check
  if (!['en', 'es'].includes(locale)) {
    notFound();
  }

  // 3. Tell next-intl this is the active locale
  setRequestLocale(locale);

  // 4. Load messages
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          
          <Navigation />
          
          <div className="flex-grow">
            {children}
          </div>

          <Footer />

        </NextIntlClientProvider>

        {/* Third Party Scripts */}
        <GoogleAnalytics gaId="G-3KV3BN7SVJ" />
        
        {/* ✅ RESTORED CHATBASE CODE */}
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
      </body>
    </html>
  );
}