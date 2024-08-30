// app/page.js
import { useEffect, useState } from "react";
import axios from "axios";
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
import Navbar04 from "@/components/PIXELUP/Navbar/Navbar04/Navbar04";
import Hero01 from "@/components/PIXELUP/Hero/Hero01/Hero01";
import BannerPrincipal02 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02";
import Destacados01 from "@/components/PIXELUP/Destacados/Destacado01";
import Colecciones from "@/components/conMantenedor/colecciones";
import Colecciones01 from "@/components/PIXELUP/Colecciones/Colecciones01/cdgColecciones01";
import BannerPrincipal03 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal03/BannerPrincipal03";

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
  const seoData = await metadata();
  return (
    <>
      <head>
        <title>{seoData.title}</title>
        <meta
          name="description"
          content={seoData.description}
        />

        <link
          rel="canonical"
          href={canonicalUrl}
        />

        {/* Open Graph tags */}
        <meta
          name="keywords"
          content={seoData.keywords}
        />
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
      </head>

      <MarqueeTOP />
      <Navbar04 />
      <BannerPrincipal03 />
      <Hero01 />
      <Destacados01 />

      <Colecciones01
        id="1c0c6de9-65c9-4472-8eaa-7fc879abbd7d"
        coleccion="Promociones"
        text="Descubre nuestros packs exclusivos en conjunto con La Casa Borracha, para una experiencia completa. Además de promociones especiales."
      />
      <Colecciones01
        id="89ac8783-f388-4b6e-8c99-fe95002c8d1b"
        coleccion="Nuestras Tablas"
        text="Encuentra nuestra selección de tablas en sus diferentes tamaños. (S: 4-5 personas, M: 7-8 personas, L: 10-11 perosnas)"
      />
      <Colecciones01
        id="bfa4fc11-ff0b-4d39-96f3-178bcf12d26a"
        coleccion="CHEF BOX"
        text="Encuentras las tablas que más te gustan en nuestro formato CHEF BOX! Recomendados para 2 personas!"
      />
      <Colecciones01
        id="89ac8783-f388-4b6e-8c99-fe95002c8d1b"
        coleccion="Acompañamientos"
        text="Completa tu experiencia con alguno de nuestros exquisitos dips, salsas o añade a tu tabla productos como nuestra exquisita Provoleta oliva merkén"
      />

      {/*      <BannerSinFoto />
      <Categoria05 />
      <Frase01 />
      <Carrusel />
      <Hero02 />
      <Frase02 /> */}
      <Footer02 />
    </>
  );
}
