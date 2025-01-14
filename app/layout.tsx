/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Roboto_Mono,
  Kalam,
  Oswald,
  Lato,
  Montserrat,
  Poppins,
} from "next/font/google";
import "./globals.css";
import { APIContextProvider } from "@/app/Context/ProductTypeContext";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { RevalidationProvider } from "@/app/Context/RevalidationContext";
import Head from "next/head";
import { NavbarProvider } from "./Context/NavbarContext";
import { AuthProvider } from "./Context/AuthContext";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/Marquee";
const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poppins",
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
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-Montserrat",
});
const oswald = Oswald({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-oswald",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ActiveSiteCheck = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/sites/${id}`
        );
        console.log(response.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    ActiveSiteCheck();
  }, []);

  return (
    <html
      lang="es"
      className="light"
    >
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `,
          }}
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <meta
          httpEquiv="Content-Language"
          content="es"
        />
        <meta
          name="googlebot"
          content="index, follow"
        />
        <meta
          name="author"
          content="PixelUP"
        />
        <meta
          name="publisher"
          content="PixelUP"
        />
        <link
          rel="icon"
          href="/favicon.ico"
          sizes="any"
        />
        <meta
          name="robots"
          content="index, follow"
        />
        <meta
          property="og:type"
          content="website"
        />
      </Head>
      <body
        className={` ${robotoMono.variable} ${kalam.variable} ${oswald.variable} ${lato.variable} ${montserrat.variable} ${poppins.variable} `}
      >
        <AuthProvider>
          <RevalidationProvider>
           {/*  <MarqueeTOP /> */}
            <NavbarProvider>
              <APIContextProvider SiteId={SiteId}>
                <Toaster />
                <div className="md:min-h-screen ">{children}</div>
              </APIContextProvider>
            </NavbarProvider>
          </RevalidationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
