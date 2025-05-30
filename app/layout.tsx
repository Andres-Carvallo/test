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
import PopVisual from "@/components/Core/Popup/Popupvisual";
import { useRouter, usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { LogoProvider, useLogo } from "@/context/LogoContext";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
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

const DynamicFavicon = () => {
  const { logo } = useLogo();

  useEffect(() => {
    if (logo?.mainImage?.url) {
      // Crear un elemento link para el favicon
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link') as HTMLLinkElement;
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = logo.mainImage.url;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [logo]);

  return null;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [siteStatus, setSiteStatus] = useState<string | null>(null);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSiteStatus = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const siteResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/sites/${id}`
        );
        setSiteStatus(siteResponse.data.site.statusCode);

        if (!pathname.startsWith("/admin") && !pathname.startsWith("/dashboard")) {
          const adminToken = getCookie("AdminTokenAuth");
          let userEmail = null;
          
          if (adminToken) {
            try {
              const decodedToken = jwtDecode(adminToken.toString());
              const userId = decodedToken.sub;
              const userResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/users/${userId}?siteId=${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${adminToken}`,
                  },
                }
              );
              userEmail = userResponse.data.user.email;
            } catch (error) {
              console.error("Error al obtener el email del usuario:", error);
            }
          }

          if (userEmail !== "hola.pixelup@gmail.com" && siteResponse.data.site.statusCode !== "SUBSCRIPTION_ACTIVE") {
            router.push("/subscription-pending");
          }
        }
      } catch (error) {
        console.error("Error al verificar estado del sitio:", error);
      }
    };

    const checkMaintenanceMode = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const contentBlockId = process.env.NEXT_PUBLIC_MANTENIMIENTO_CONTENTBLOCK;
        const maintenanceResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${id}`
        );

        const maintenanceConfig = JSON.parse(
          maintenanceResponse.data.contentBlock.contentText
        );
        setIsMaintenanceMode(maintenanceConfig.enabled || false);

        if (maintenanceConfig.enabled && !pathname.startsWith("/admin") && !pathname.startsWith("/dashboard")) {
          router.push("/mantenimiento");
        }
      } catch (error) {
        console.error("Error al verificar modo mantenimiento:", error);
      }
    };

    const checkPopupStatus = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const popupContentBlockId = process.env.NEXT_PUBLIC_POPUP_CONTENTBLOCK;
        if (popupContentBlockId) {
          const popupResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${popupContentBlockId}?siteId=${id}`
          );
          const popupConfig = JSON.parse(popupResponse.data.contentBlock.contentText || '{"enabled": false}');
          setShowPopup(popupConfig.enabled && !pathname.startsWith("/admin") && !pathname.startsWith("/dashboard"));
        }
      } catch (error) {
        console.error("Error al verificar estado del popup:", error);
      }
    };

    const initializeChecks = async () => {
      try {
        await Promise.all([
          checkSiteStatus(),
          checkMaintenanceMode(),
          checkPopupStatus()
        ]);
      } catch (error) {
        console.error("Error en las verificaciones iniciales:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeChecks();
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
              <LogoProvider>
                <APIContextProvider SiteId={SiteId}>
                  <DynamicFavicon />
                  <Toaster />
                  <NextTopLoader showSpinner={false}/>
                  <div className="md:min-h-screen ">{children}</div>
                  {showPopup && <PopVisual />}
                </APIContextProvider>
              </LogoProvider>
            </NavbarProvider>
          </RevalidationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
