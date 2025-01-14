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
import BannerPrincipal02 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02";
import Destacados01 from "@/components/PIXELUP/Destacados/Destacado01";
import Colecciones from "@/components/conMantenedor/colecciones";
import Colecciones01 from "@/components/PIXELUP/Colecciones/Colecciones01/cdgColecciones01";
import BannerPrincipal03 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal03/BannerPrincipal03";
import BannerPrincipal01 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02";
import BannerPrincipal02Mobile from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02Mobile/BannerPrincipal02Mobile";
import ProductCard01 from "@/components/PIXELUP/ProductCards/ProductCards01/ProductCard01";
import ProductCard02 from "@/components/PIXELUP/ProductCards/ProductCards02/ProductCard02";
import ProductCard03 from "@/components/PIXELUP/ProductCards/ProductCards03/ProductCard03";
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const revalidate = 60; // Revalida cada 60 segundos

export const dynamic = "force-dynamic"; // O 'force-static' si quieres comportamiento estático


import { 
  Bars3Icon, 
  PhotoIcon, 
  BuildingStorefrontIcon,
  Square3Stack3DIcon,
  ShoppingBagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default async function Componentes() {
  return (
    <div className=" mx-auto py-24 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8  lg:max-w-[1000px] mx-auto">
        {/* Primera fila */}
        <Link href="/componentes-pixelup/menu" className="group relative overflow-hidden rounded-xl border-2 border-gray-200 aspect-square flex items-center justify-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="flex flex-col items-center gap-4">
            <Bars3Icon className="w-10 h-10 text-gray-700 group-hover:text-gray-900" />
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              Menú
            </h2>
          </div>
        </Link>

        <Link href="/componentes-pixelup/banners" className="group relative overflow-hidden rounded-xl border-2 border-gray-200 aspect-square flex items-center justify-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="flex flex-col items-center gap-4">
            <PhotoIcon className="w-10 h-10 text-gray-700 group-hover:text-gray-900" />
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              Banners
            </h2>
          </div>
        </Link>

        <Link href="/componentes-pixelup/marcas" className="group relative overflow-hidden rounded-xl border-2 border-gray-200 aspect-square flex items-center justify-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="flex flex-col items-center gap-4">
            <BuildingStorefrontIcon className="w-10 h-10 text-gray-700 group-hover:text-gray-900" />
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              Marcas
            </h2>
          </div>
        </Link>

        {/* Segunda fila */}
        <Link href="/componentes-pixelup/categorias" className="group relative overflow-hidden rounded-xl border-2 border-gray-200 aspect-square flex items-center justify-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="flex flex-col items-center gap-4">
            <Square3Stack3DIcon className="w-10 h-10 text-gray-700 group-hover:text-gray-900" />
            <h2 className="text-center text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              Categorías / Colecciones
            </h2>
          </div>
        </Link>

        <Link href="/componentes-pixelup/productos" className="group relative overflow-hidden rounded-xl border-2 border-gray-200 aspect-square flex items-center justify-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="flex flex-col items-center gap-4">
            <ShoppingBagIcon className="w-10 h-10 text-gray-700 group-hover:text-gray-900" />
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              Productos
            </h2>
          </div>
        </Link>

        <Link href="/componentes-pixelup/footer" className="group relative overflow-hidden rounded-xl border-2 border-gray-200 aspect-square flex items-center justify-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="flex flex-col items-center gap-4">
            <DocumentTextIcon className="w-10 h-10 text-gray-700 group-hover:text-gray-900" />
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              Footer
            </h2>
          </div>
        </Link>
      </div>
    </div>
  );
}















