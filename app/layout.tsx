import type { Metadata } from "next";
import { Inter, Roboto_Mono, Kalam, Oswald, Lato } from "next/font/google";
import "./globals.css";
import { APIContextProvider } from "@/app/Context/ProductTypeContext";
import toast, { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-kalam",
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lato",
});
const oswald = Oswald({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-oswald",
});
export const metadata: Metadata = {
  title: "PixelUP - PRO",
  description: "buff your bussiness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E7NY2W59JZ"
        />

        <Script id="google-analytics">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', ${"${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}"});
  `}
        </Script>
      </head>
      <APIContextProvider SiteId={SiteId}>
        <Analytics />

        <body
          className={` ${robotoMono.variable} ${kalam.variable} ${oswald.variable} ${lato.variable} `}
        >
          <Providers>
            <Toaster />
            <div className="min-h-screen ">{children}</div>
          </Providers>
        </body>
      </APIContextProvider>
    </html>
  );
}
