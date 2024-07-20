// app/page.js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import ProductList01 from "@/components/Products/ProductList01";
import Testimonial01 from "@/components/Testimonials/Testimonial01";
import Stats01 from "@/components/Stats/Stats01";
import HomeForm from "@/components/ContactForm/Home";
import Collection01 from "@/components/Collections/Collection01";
import Header from "@/components/Header/Header";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/Marquee";
import BannerPrincipal from "@/components/conMantenedor/BannerPrincipal";
import Footer01 from "@/components/PIXELUP/Footer/Footer01/Footer01";
import Navbar01 from "@/components/PIXELUP/Navbar/Navbar01/Navbar01";
import BannerSinFoto from "@/components/PIXELUP/BannerSinFoto/BannerSinFoto";
import Categoria05 from "@/components/PIXELUP/Categorias/Categoria05/Categoria05";
import Frase01 from "@/components/PIXELUP/Frases/Frase01/Frase01";
import Carrusel from "@/components/PIXELUP/Carrusel/Carrusel";
import Frase02 from "@/components/PIXELUP/Frases/Frase02/Frase02";
import Hero02 from "@/components/PIXELUP/Hero/Hero02/Hero02";
import Footer02 from "@/components/PIXELUP/Footer/Footer02/Footer02";
import Footer03 from "@/components/PIXELUP/Footer/Footer03/Footer03";
import Navbar02 from "@/components/PIXELUP/Navbar/Navbar02/Navbar02";
import Colecciones01 from "@/components/PIXELUP/Colecciones/Colecciones01/Colecciones01";
import Navbar04 from "@/components/PIXELUP/Navbar/Navbar04/Navbar04";

const siteUrl = "http://pixelup.cl";
const canonicalUrl = "http://pixelup.cl/planes";

export const dynamic = "force-dynamic"; // O 'force-static' si quieres comportamiento estático
export const revalidate = 60; // Revalida cada 60 segundos

async function fetchBannerData() {
  const bannerId = "17c8ad89-3e8f-4ceb-aded-f0ed0a330696";
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
  };

  try {
    const bannerImage = await fetchBannerData();
    return {
      title: bannerImage.images[0].title,
      description: bannerImage.images[0].landingText,
      ogImage: bannerImage.images[0].mainImage.url,
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
  const seoData = await metadata();
  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta
          name="description"
          content={seoData.description}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta
          name="keywords"
          content="pixelup, pixelup.cl, pixelup.cl, pixelup.cl, pixelup.cl, pixelup.cl"
        />
        <meta
          httpEquiv="Content-Language"
          content="es"
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
        <link
          rel="canonical"
          href={canonicalUrl}
        />
        <meta
          name="robots"
          content="index, follow"
        />

        {/* Open Graph tags */}
        <meta
          property="og:title"
          content={seoData.title}
        />
        <meta
          property="og:description"
          content={seoData.description}
        />
        <meta
          property="og:image"
          content={seoData.ogImage}
        />
        <meta
          property="og:url"
          content={siteUrl}
        />
        <meta
          property="og:type"
          content="website"
        />
      </Head>

      <MarqueeTOP />
      <Navbar01 />
      <BannerPrincipal />
      <Colecciones01 />
      <BannerSinFoto />
      <Categoria05 />
      <Frase01 />
      <Carrusel />
      <Hero02 />
      <Frase02 />
      <Footer03 />
    </>
  );
}
