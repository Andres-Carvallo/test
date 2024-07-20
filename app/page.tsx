import { useEffect } from "react";
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
const defaultImage = `${siteUrl}/img/avatardefault.jpg`; // Ruta de la imagen predeterminada

export default function Home() {
  return (
    <>
      <head>
        <title>PixelUP Title</title>

        <meta
          name="description"
          content="Una nueva plataforma para emprendedores y Pymes!"
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
          property="og:image"
          content={defaultImage}
        />
        <meta
          property="og:url"
          content={siteUrl}
        />
        <meta
          property="og:type"
          content="website"
        />
      </head>

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
