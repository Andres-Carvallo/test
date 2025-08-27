/* eslint-disable @next/next/no-img-element */
// app/page.js
import axios from "axios";
import { Suspense } from "react";

import Categoria02 from "@/components/PIXELUP/Categorias/Categoria02/Categoria02";
import Frase01 from "@/components/PIXELUP/Frases/Frase01/Frase01";
import Frase02 from "@/components/PIXELUP/Frases/Frase02/Frase02";
import BannerPrincipal02 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02";
import Destacados01 from "@/components/PIXELUP/Destacados/Destacado01";
import {
  DynamicNavbar,
  DynamicFooter,
} from "@/app/components/LayoutComponents";
import DiscountModal from "@/components/PIXELUP/Modal/DiscountModal";
import SinFoto01 from "@/components/PIXELUP/SinFoto/SinFoto01/SinFoto01";
import BannerPrincipal01 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01";
import Banner from "@/components/PIXELUP/Skeleton/Banner";
import Destacados from "@/components/PIXELUP/Skeleton/Destacados";
import Parallax from "@/components/PIXELUP/Parallax/Parallax";
import Colecciones02 from "@/components/PIXELUP/Colecciones/Colecciones02/Colecciones02";
import WhatsAppButton from "@/components/Core/WhatsAppButton/WhatsAppButton";
import FeedInstagram from "@/components/PIXELUP/FeedInstagram/FeedInstagram";
import Ubicacion from "@/components/PIXELUP/Ubicacion/Ubicacion";
import Hero01 from "@/components/PIXELUP/Hero/Hero01/Hero01";
import Hero02 from "@/components/PIXELUP/Hero/Hero02/Hero02";
import Hero03 from "@/components/PIXELUP/Hero/Hero03/Hero03";
import Hero04 from "@/components/PIXELUP/Hero/Hero04/Hero04";
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";
import FeedRRSS from "@/components/PIXELUP/FeedRRSS/FeedRRSS";
import {
  fetchHomeConfig,
  getDefaultHomeConfig,
  HomeConfig,
} from "@/app/utils/homeConfig";
import DynamicHomeComponents from "@/app/components/DynamicHomeComponents";
import { COMPONENT_IDS } from "@/app/config/componentEnums";
import { getBaseUrl, getBaseUrlWithLogs, getRobustBaseUrl } from "@/app/utils/urlUtils";

export const revalidate = 60; // Revalida cada 60 segundos

export const dynamic = "force-dynamic"; // O 'force-static' si quieres comportamiento estático

async function fetchBannerData() {
  const bannerId = COMPONENT_IDS.SEO_BANNER();
  
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
    );
    return response.data.banner;
  } catch (error) {
    console.error(`❌ [fetchBannerData] Error al obtener banner:`, error);
    throw error;
  }
}

async function getSeoDescription() {
  const defaultDescription = "Una nueva plataforma para emprendedores y Pymes!";
  
  try {
    const bannerImage = await fetchBannerData();
    
    if (bannerImage.images[0].landingText) {
      const cleanText = bannerImage.images[0].landingText.replace(/<[^>]*>/g, '').trim();
      const title = bannerImage.images[0].title || '';
      const text = cleanText.length > 100 ? cleanText.substring(0, 100) + '...' : cleanText;
      return `${title} - ${text}`.substring(0, 160);
    }
    
    return defaultDescription;
  } catch (error) {
    return defaultDescription;
  }
}

export const metadata = async () => {
  // Obtener la URL actual del request
  const headersList = await import('next/headers').then(m => m.headers());
  const host = headersList.get('host') || 'dev-ecommerce.pixelup.cl';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  

  
  const defaultSeoData = {
    title: process.env.NEXT_PUBLIC_NOMBRE_TIENDA,
    description: "Una nueva plataforma para emprendedores y Pymes!",
    ogImage: "http://pixelup.cl/img/avatardefault.jpg",
    keywords: "pixelup, pixelup.cl, pixelup.cl, pixelup.cl, pixelup.cl",
  };

  try {
    const bannerImage = await fetchBannerData();
    
    // Crear una descripción más atractiva y específica
    let seoDescription = defaultSeoData.description;
    
    if (bannerImage.images[0].landingText) {
      // Limpiar HTML y crear una descripción más específica
      const cleanText = bannerImage.images[0].landingText.replace(/<[^>]*>/g, '').trim();
      
      // Crear una descripción que incluya el título y el texto
      const title = bannerImage.images[0].title || '';
      const text = cleanText.length > 100 ? cleanText.substring(0, 100) + '...' : cleanText;
      
      seoDescription = `${title} - ${text}`.substring(0, 160);
    }
    
    
    
          const seoMetadata = {
        title: bannerImage.images[0].title || defaultSeoData.title,
        description: seoDescription,
        keywords: bannerImage.images[0].buttonText || defaultSeoData.keywords,
       robots: {
         index: true,
         follow: true,
         googleBot: {
           index: true,
           follow: true,
           'max-video-preview': -1,
           'max-image-preview': 'large',
           'max-snippet': -1,
         },
       },
                       openGraph: {
            title: bannerImage.images[0].title || defaultSeoData.title,
            description: seoDescription,
            type: 'website',
            url: baseUrl,
            siteName: process.env.NEXT_PUBLIC_NOMBRE_TIENDA,
          images: [
            {
              url: bannerImage.images[0].mainImage?.url || defaultSeoData.ogImage,
              width: 1200,
              height: 630,
              alt: bannerImage.images[0].title || defaultSeoData.title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: bannerImage.images[0].title || defaultSeoData.title,
          description: seoDescription,
          images: [bannerImage.images[0].mainImage?.url || defaultSeoData.ogImage],
        },
                alternates: {
           canonical: baseUrl,
         },
     };
     
     
     return seoMetadata;
   } catch (error) {
    console.error("Error fetching banner data:", error);
    // Obtener la URL actual del request para el fallback
    const headersList = await import('next/headers').then(m => m.headers());
    const host = headersList.get('host') || 'dev-ecommerce.pixelup.cl';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    return {
      title: defaultSeoData.title,
      description: defaultSeoData.description,
      keywords: defaultSeoData.keywords,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
             openGraph: {
         title: defaultSeoData.title,
         description: defaultSeoData.description,
         type: 'website',
         url: baseUrl,
         siteName: process.env.NEXT_PUBLIC_NOMBRE_TIENDA,
         images: [
           {
             url: defaultSeoData.ogImage,
             width: 1200,
             height: 630,
             alt: defaultSeoData.title,
           },
         ],
       },
       twitter: {
         card: 'summary_large_image',
         title: defaultSeoData.title,
         description: defaultSeoData.description,
         images: [defaultSeoData.ogImage],
       },
       alternates: {
         canonical: baseUrl,
       },
    };
  }
};

export default async function Page() {
  try {
    const seoDescription = await getSeoDescription();

    // Cargar configuración del home
    let homeConfig = await fetchHomeConfig();
    if (!homeConfig) {
      homeConfig = getDefaultHomeConfig();
    }

    return (
      <>
        {/* Párrafo SEO visible para Google - debe coincidir con la meta description */}
        <div className="sr-only">
          <p>{seoDescription}</p>
        </div>
        
        <DynamicNavbar />
        <DynamicHomeComponents config={homeConfig} />
        <DynamicFooter />
        <WhatsAppButton />
      </>
    );
  } catch (error) {
    console.error("Error en Page:", error);
    return <div>Ha ocurrido un error al cargar la página</div>;
  }
}
