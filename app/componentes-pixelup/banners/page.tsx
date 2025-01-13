// app/page.js

'use client';

import axios from "axios";
import HomeForm from "@/components/Core/ContactForm/Home";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/Marquee";
import BannerPrincipal from "@/components/conMantenedor/BannerPrincipal";
import Footer01 from "@/components/PIXELUP/Footer/Footer01/Footer01";
import BannerSinFoto from "@/components/PIXELUP/BannerSinFoto/BannerSinFoto";
import Frase01 from "@/components/PIXELUP/Frases/Frase01/Frase01";
import Carrusel from "@/components/PIXELUP/Carrusel/Carrusel";
import Frase02 from "@/components/PIXELUP/Frases/Frase02/Frase02";
import Hero02 from "@/components/PIXELUP/Hero/Hero02/Hero02";
import Navbar02 from "@/components/PIXELUP/Navbar/Navbar02/Navbar02";
import Hero01 from "@/components/PIXELUP/Hero/Hero01/Hero01";
import Destacados01 from "@/components/PIXELUP/Destacados/Destacado01";
import Colecciones from "@/components/conMantenedor/colecciones";
import Colecciones01 from "@/components/PIXELUP/Colecciones/Colecciones01/cdgColecciones01";
import BannerPrincipal03 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal03/BannerPrincipal03";
import ProductCard01 from "@/components/PIXELUP/ProductCards/ProductCards01/ProductCard01";
import ProductCard02 from "@/components/PIXELUP/ProductCards/ProductCards02/ProductCard02";
import ProductCard03 from "@/components/PIXELUP/ProductCards/ProductCards03/ProductCard03";
import BannerPrincipal02 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02";
import BannerPrincipal02Mobile from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02Mobile/BannerPrincipal02Mobile";
import Parallax01 from "@/components/PIXELUP/Parallax01/Parallax01";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const revalidate = 60; // Revalida cada 60 segundos

export const dynamic = "force-dynamic"; // O 'force-static' si quieres comportamiento estático



export default async function banners() {
    return (
      <>
          <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Banner 02</span>
</div>
        <BannerResponsive/>
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Banner 03</span>
</div>
        <BannerPrincipal03/>
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Parallax 01</span>
</div>
    <Parallax01/>
      </>
    );
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

