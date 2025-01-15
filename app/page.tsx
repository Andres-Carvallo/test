/* eslint-disable @next/next/no-img-element */
// app/page.js
import axios from "axios";

import HomeForm from "@/components/Core/ContactForm/Home";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/Marquee";
import BannerPrincipal from "@/components/conMantenedor/BannerPrincipal";
import Footer01 from "@/components/PIXELUP/Footer/Footer01/Footer01";
import Categoria02 from "@/components/PIXELUP/Categorias/Categoria02/Categoria02";
import Frase01 from "@/components/PIXELUP/Frases/Frase01/Frase01";
import Carrusel from "@/components/PIXELUP/Carrusel/Carrusel";
import Frase02 from "@/components/PIXELUP/Frases/Frase02/Frase02";
import Navbar02 from "@/components/PIXELUP/Navbar/Navbar02/Navbar02";
import BannerPrincipal02 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02";
import Destacados01 from "@/components/PIXELUP/Destacados/Destacado01";
import Colecciones from "@/components/conMantenedor/colecciones";
import Colecciones01 from "@/components/PIXELUP/Colecciones/Colecciones01/cdgColecciones01";
import BannerPrincipal03 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal03/BannerPrincipal03";
import BannerPrincipal01 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02";
import BannerPrincipal02Mobile from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02Mobile/BannerPrincipal02Mobile";
import { globalConfig, getActiveFooter, getActiveNavbar } from "./config/GlobalConfig";
import DiscountModal from '@/components/PIXELUP/Modal/DiscountModal'
import Hero02 from "@/components/PIXELUP/Hero/Hero02/Hero02";
import SinFoto01 from "@/components/PIXELUP/SinFoto/SinFoto01/SinFoto01";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const revalidate = 60; // Revalida cada 60 segundos

export const dynamic = "force-dynamic"; // O 'force-static' si quieres comportamiento estático

async function fetchBannerData() {
  const bannerId = process.env.NEXT_PUBLIC_SEO_ID_BANNER;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
  );
  return response.data.banner;
}

export const metadata = async () => {
  const defaultSeoData = {
    title: "PixelUP Title",
    description: "Una nueva plataforma para emprendedores y Pymes!",
    ogImage: "http://pixelup.cl/img/avatardefault.jpg",
    keywords: "pixelup, pixelup.cl, pixelup.cl, pixelup.cl, pixelup.cl",
  };

  try {
    const bannerImage = await fetchBannerData();
    return {
      title: bannerImage.images[0].title,
      description: bannerImage.images[0].landingText,
      ogImage: bannerImage.images[0].mainImage.url,
      keywords: bannerImage.images[0].buttonText,
      openGraph: {
        title: bannerImage.images[0].title,
        description: bannerImage.images[0].landingText,
        images: [
          {
            url: bannerImage.images[0].mainImage.url,
            width: 800,
            height: 600,
            alt: bannerImage.images[0].title,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching banner data:", error);
    return {
      title: defaultSeoData.title,
      description: defaultSeoData.description,
      openGraph: {
        title: defaultSeoData.title,
        description: defaultSeoData.description,
        images: [
          {
            url: defaultSeoData.ogImage,
            width: 800,
            height: 600,
            alt: defaultSeoData.title,
          },
        ],
      },
    };
  }
};

export default async function Page() {
  try {
    const seoData = await metadata();
    const ActiveFooter = getActiveFooter();
    const ActiveNavbar = getActiveNavbar();

    return (
      <>
        <ActiveNavbar />
        <BannerResponsive />
        <SinFoto01 />
        <Categoria02 />
        <Frase01 />
        <Destacados01 text="Destacados" />
        <Hero02 />
        <Frase02 />
        <ActiveFooter/>
        <DiscountModal />
        <a
          href={`https://wa.me/56978334123`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-6 bottom-[30px] z-50 bg-green-500 rounded-full p-3 hover:bg-green-600 transition-colors animate-pulse-whatsapp"
          style={{ zIndex: 999 }}
        >
          <img
            src="/whatsapp.svg"
            alt="WhatsApp"
            className="w-8 h-8 hover:scale-110 transition-transform duration-200"
          />
        </a>
      </>
    );
  } catch (error) {
    console.error("Error en Page:", error);
    return <div>Ha ocurrido un error al cargar la página</div>;
  }
}

const BannerResponsive = () => (
  <>
    <div className="block lg:hidden">
      <BannerPrincipal02Mobile />
    </div>
    <div className="hidden lg:block">
      <BannerPrincipal02 />
    </div>
  </>
);
