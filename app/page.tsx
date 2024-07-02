import ProductList01 from "@/components/Products/ProductList01";
import Testimonial01 from "@/components/Testimonials/Testimonial01";
import Stats01 from "@/components/Stats/Stats01";
import HomeForm from "@/components/ContactForm/Home";
import Collection01 from "@/components/Collections/Collection01";
import Header from "@/components/Header/Header";
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";
import BannerPrincipal from "@/components/conMantenedor/BannerPrincipal";
import Footer03 from "@/components/PIXELUP/Footer03/Footer03";
import Navbar01 from "@/components/PIXELUP/Navbar01/Navbar01";
import BannerSinFoto from "@/components/PIXELUP/BannerSinFoto/BannerSinFoto";
import Categoria05 from "@/components/PIXELUP/Categorias/Categoria05/Categoria05";
import Frase01 from "@/components/PIXELUP/Frases/Frase01/Frase01";
import Carrusel01 from "@/components/PIXELUP/Carrusel01/Carrusel01";
import Frase02 from "@/components/PIXELUP/Frases/Frase02/Frase02";
import Hero02 from "@/components/PIXELUP/Hero02/Hero02";
import Footer01 from "@/components/PIXELUP/Footer01/Footer01";
import Navbar02 from "@/components/PIXELUP/Navbar02/Navbar02";
import Navbar03 from "@/components/PIXELUP/Navbar/Navbar03/Navbar03";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIXELUP.cl | SEO Rdy",
  description: "Pixelup | SEO Rdy",
  openGraph: {
    title: "PIXELUP.cl | SEO Rdy1",
    description: "Pixelup | SEO Rdy1",
    url: "https://www.pixelup.cl",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/img/pixelup.png`,
        width: 500,
        height: 500,
        alt: "Pixelup Image",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <MarqueeTOP />
      {/* <Header /> */}
      {/* <Navbar01 /> */}
      <Navbar02 />
      {/* <Navbar03 /> */}
      <BannerPrincipal />
      <BannerSinFoto />
      <Categoria05 />
      <Frase01 />
      <Carrusel01 />
      <Hero02 />
      <Frase02 />
      <Footer01 />
    </>
  );
}
