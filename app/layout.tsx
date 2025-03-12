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
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";
import GoogleAnalytics from "@/components/Core/Google/Analytics";
import { useRouter, usePathname } from "next/navigation";
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
  const [siteStatus, setSiteStatus] = useState<string | null>(null);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSiteStatus = async () => {
      try {
        // Verificar estado de suscripción
        const id = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const siteResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/sites/${id}`
        );
        setSiteStatus(siteResponse.data.site.statusCode);

        // Verificar estado de mantenimiento
        const contentBlockId =
          process.env.NEXT_PUBLIC_MANTENIMIENTO_CONTENTBLOCK;
        const maintenanceResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${id}`
        );

        const maintenanceConfig = JSON.parse(
          maintenanceResponse.data.contentBlock.contentText
        );
        setIsMaintenanceMode(maintenanceConfig.enabled || false);

        // Redireccionar según las condiciones
        if (
          !pathname.startsWith("/admin") &&
          !pathname.startsWith("/dashboard")
        ) {
          if (siteResponse.data.site.statusCode !== "SUBSCRIPTION_ACTIVE") {
            router.push("/subscription-pending");
          } else if (maintenanceConfig.enabled) {
            router.push("/mantenimiento");
          }
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    checkSiteStatus();
  }, [router, pathname]);

  return (
    <html
      lang="es"
      className="light"
    >
      <Head>
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
        <GoogleAnalytics
          GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""}
        />
        <AuthProvider>
          <RevalidationProvider>
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
