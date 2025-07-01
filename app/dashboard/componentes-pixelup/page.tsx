"use client";

import React, { useState } from "react";
import Link from 'next/link';
import ComponentPreview from './ComponentPreview';

// Importar componentes reales de banners
import BannerPrincipal01 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01";
import BannerPrincipal02 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02";
import Parallax from "@/components/PIXELUP/Parallax/Parallax";
import Parallax01 from "@/components/PIXELUP/Parallax01/Parallax01";

// Importar componentes reales de hero/contenido
import Hero01 from "@/components/PIXELUP/Hero/Hero01/Hero01";
import Hero02 from "@/components/PIXELUP/Hero/Hero02/Hero02";
import Hero03 from "@/components/PIXELUP/Hero/Hero03/Hero03";
import Hero04 from "@/components/PIXELUP/Hero/Hero04/Hero04";
import Hero05 from "@/components/PIXELUP/Hero/Hero05/Hero05";
import Hero06 from "@/components/PIXELUP/Hero/Hero06/Hero06";
import Hero07 from "@/components/PIXELUP/Hero/Hero07/Hero07";
import Hero08 from "@/components/PIXELUP/Hero/Hero08/Hero08";
import Hero09 from "@/components/PIXELUP/Hero/Hero09/Hero09";
import Galeria01 from "@/components/PIXELUP/Galeria/Galeria01/Galeria01";
import Galeria02 from "@/components/PIXELUP/Galeria/Galeria02/Galeria02";
import Servicios01 from "@/components/PIXELUP/Servicios/Servicios01/Servicios01";
import Servicios02 from "@/components/PIXELUP/Servicios/Servicios02/Servicios02";
import Servicios03 from "@/components/PIXELUP/Servicios/Servicios03/Servicios03";
import Servicios04 from "@/components/PIXELUP/Servicios/Servicios04/Servicios04";
import SinFoto01 from "@/components/PIXELUP/SinFoto/SinFoto01/SinFoto01";
import SinFoto02 from "@/components/PIXELUP/SinFoto/SinFoto02/SinFoto02";
import SinFoto03 from "@/components/PIXELUP/SinFoto/SinFoto03/SinFoto03";
import SinFoto04 from "@/components/PIXELUP/SinFoto/SinFoto04/SinFoto04";
import SinFoto05 from "@/components/PIXELUP/SinFoto/SinFoto05/SinFoto05";
import SinFoto06 from "@/components/PIXELUP/SinFoto/SinFoto06/SinFoto06";
import SinFoto07 from "@/components/PIXELUP/SinFoto/SinFoto07/SinFoto07";
import Materiales from "@/components/PIXELUP/SinFoto/Materiales/Materiales";
import Ubicacion from "@/components/PIXELUP/Ubicacion/Ubicacion";
import Ubicacion02 from "@/components/PIXELUP/Ubicacion/Ubicacion02/Ubicacion02";
import Nosotros01 from "@/components/PIXELUP/Nosotros/Nosotros01/Nosotros01";

// Importar componentes reales de productos
import ProductCard01 from "@/components/PIXELUP/ProductCards/ProductCards01/ProductCard01";
import ProductCard02 from "@/components/PIXELUP/ProductCards/ProductCards02/ProductCard02";
import ProductCard03 from "@/components/PIXELUP/ProductCards/ProductCards03/ProductCard03";
import ProductCard04 from '@/components/PIXELUP/ProductCards/ProductCards04/ProductCards04';
import ProductCard05 from '@/components/PIXELUP/ProductCards/ProductCards05/ProductCards05';
import Destacados01 from "@/components/PIXELUP/Destacados/Destacado01";
import Destacados02 from '@/components/PIXELUP/Destacados/Destacados02/Destacado02';
import Destacados03 from '@/components/PIXELUP/Destacados/Destacados03/Destacado03';
import DestacadosCat from '@/components/PIXELUP/Destacados/DestacadosCat/DestacadosCat';

// Importar componentes reales de marcas
import LogosCarrusel from "@/components/PIXELUP/Marcas/LogosCarrusel/LogosCarrusel";
import LogosDinamicos from "@/components/PIXELUP/Marcas/LogosDinamicos/LogosDinamicos";
import LogosFijos from "@/components/PIXELUP/Marcas/LogosFijos/LogosFijos";

// Importar componentes reales de social
import FeedInstagram from "@/components/PIXELUP/FeedInstagram/FeedInstagram";
import Testimonios01 from "@/components/PIXELUP/Testimonios/Testimonios01/Testimonios01";
import Testimonios02 from "@/components/PIXELUP/Testimonios/Testimonios02/Testimonios02";
import Testimonios03 from "@/components/PIXELUP/Testimonios/Testimonios03/Testimonios03";
import Testimonios04 from "@/components/PIXELUP/Testimonios/Testimonios04/Testimonios04";

// Importar componentes reales de categorías/colecciones
import Categoria01 from "@/components/PIXELUP/Categorias/Categoria01/Categoria01";
import Categoria02 from "@/components/PIXELUP/Categorias/Categoria02/Categoria02";
import Categoria03 from "@/components/PIXELUP/Categorias/Categoria03/Categoria03";
import Categoria04 from "@/components/PIXELUP/Categorias/Categoria04/Categoria04";
import Categoria05 from "@/components/PIXELUP/Categorias/Categoria05/Categoria05";
import Categoria06 from "@/components/PIXELUP/Categorias/Categoria06/Categoria06";
import Categoria07 from "@/components/PIXELUP/Categorias/Categoria07/Categoria07";
import Colecciones01 from "@/components/PIXELUP/Colecciones/Colecciones01/Colecciones01";
import Colecciones02 from "@/components/PIXELUP/Colecciones/Colecciones02/Colecciones02";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const revalidate = 60;
export const dynamic = "force-dynamic";

// Interfaz para los componentes
interface ComponentItem {
  id: string;
  name: string;
  description: string;
  preview: string;
  component: React.ComponentType<any>;
  usePreview: boolean;
  thumbnail?: string;
}

// Componente wrapper para mostrar ProductCards dentro de Destacados01
const ProductCardWrapper = ({ ProductCardComponent, text }: { ProductCardComponent: React.ComponentType<any>, text: string }) => {
  return (
    <Destacados01 
      text={text}
      ProductCardComponent={ProductCardComponent}
    />
  );
};

// Definir las categorías y sus componentes reales
const categories = [
  {
    id: "banners",
    name: "Banners",
    description: "Componentes de banners y sliders",
    icon:   <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>,
    color: "from-green-500 to-teal-500",
    components: [
      {
        id: "banner-01",
        name: "Banner Principal 01",
        description: "Banner principal con diseño moderno y responsive",
        preview: "🎨 Banner con imagen de fondo y texto superpuesto",
        component: BannerPrincipal01,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/4ade80/ffffff?text=Banner+01"
      },
      {
        id: "banner-02", 
        name: "Banner Principal 02",
        description: "Banner alternativo con diferentes estilos",
        preview: "📱 Banner con diseño alternativo y elementos interactivos",
        component: BannerPrincipal02,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/22d3ee/ffffff?text=Banner+02"
      },
      {
        id: "parallax-01",
        name: "Parallax 01",
        description: "Efecto parallax con movimiento de fondo",
        preview: "🌊 Efecto parallax con movimiento suave",
        component: Parallax,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/06b6d4/ffffff?text=Parallax+01"
      },
      {
        id: "parallax-02",
        name: "Parallax 02",
        description: "Segunda variante del efecto parallax",
        preview: "✨ Parallax con diferentes velocidades y elementos",
        component: Parallax01,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/0891b2/ffffff?text=Parallax+02"
      }
    ]
  },
  {
    id: "contenido",
    name: "Contenido",
    description: "Componentes de contenido y hero sections",
    icon:      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
  </svg>,
    color: "from-violet-500 to-fuchsia-500",
    components: [
      {
        id: "hero-01",
        name: "Hero 01",
        description: "Sección hero principal con imagen de fondo",
        preview: "🌟 Hero con imagen de fondo y texto superpuesto",
        component: Hero01,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/a855f7/ffffff?text=Hero+01"
      },
      {
        id: "hero-02",
        name: "Hero 02",
        description: "Hero alternativo con diseño diferente",
        preview: "💫 Hero con elementos gráficos y animaciones",
        component: Hero02,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/9333ea/ffffff?text=Hero+02"
      },
      {
        id: "hero-03",
        name: "Hero 03",
        description: "Hero con carrusel de imágenes",
        preview: "🔄 Hero con carrusel automático de imágenes",
        component: Hero03,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/7c3aed/ffffff?text=Hero+03"
      },
      {
        id: "hero-04",
        name: "Hero 04",
        description: "Hero con video de fondo",
        preview: "🎥 Hero con video de fondo y overlay",
        component: Hero04,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/6d28d9/ffffff?text=Hero+04"
      },
      {
        id: "hero-05",
        name: "Hero 05",
        description: "Hero con formulario integrado",
        preview: "📝 Hero con formulario de contacto integrado",
        component: Hero05,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/5b21b6/ffffff?text=Hero+05"
      },
      {
        id: "hero-06",
        name: "Hero 06",
        description: "Hero con estadísticas",
        preview: "📊 Hero con métricas y estadísticas",
        component: Hero06,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/4c1d95/ffffff?text=Hero+06"
      },
      {
        id: "hero-07",
        name: "Hero 07",
        description: "Hero con testimonios",
        preview: "💬 Hero con testimonios de clientes",
        component: Hero07,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/581c87/ffffff?text=Hero+07"
      },
      {
        id: "hero-08",
        name: "Hero 08",
        description: "Hero con botones de acción",
        preview: "🎯 Hero con múltiples call-to-action",
        component: Hero08,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/701a75/ffffff?text=Hero+08"
      },
      {
        id: "hero-09",
        name: "Hero 09",
        description: "Hero con parallax",
        preview: "🌊 Hero con efecto parallax",
        component: Hero09,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/86198f/ffffff?text=Hero+09"
      },
      {
        id: "galeria-01",
        name: "Galería 01",
        description: "Galería de imágenes con grid",
        preview: "🖼️ Galería con grid de imágenes",
        component: Galeria01,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/be185d/ffffff?text=Galeria+01"
      },
      {
        id: "galeria-02",
        name: "Galería 02",
        description: "Galería alternativa con slider",
        preview: "🎠 Galería con slider de imágenes",
        component: Galeria02,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/e11d48/ffffff?text=Galeria+02"
      },
      {
        id: "servicios-01",
        name: "Servicios 01",
        description: "Sección de servicios básica",
        preview: "🔧 Servicios con iconos y descripciones",
        component: Servicios01,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/f43f5e/ffffff?text=Servicios+01"
      },
      {
        id: "servicios-02",
        name: "Servicios 02",
        description: "Servicios con diseño alternativo",
        preview: "⚙️ Servicios con layout diferente",
        component: Servicios02,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/ec4899/ffffff?text=Servicios+02"
      },
      {
        id: "servicios-03",
        name: "Servicios 03",
        description: "Servicios con cards",
        preview: "💳 Servicios en formato de cards",
        component: Servicios03,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/db2777/ffffff?text=Servicios+03"
      },
      {
        id: "servicios-04",
        name: "Servicios 04",
        description: "Servicios con grid avanzado",
        preview: "📐 Servicios con grid avanzado",
        component: Servicios04,
        usePreview: true,
        thumbnail: "https://via.placeholder.com/300x200/be185d/ffffff?text=Servicios+04"
      }
    ]
  },
  {
    id: "productos",
    name: "Productos",
    description: "Componentes para mostrar productos",
    icon:       
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>,
    color: "from-indigo-500 to-purple-500",
    components: [
      {
        id: "product-card-01",
        name: "Product Card 01",
        description: "Cards de productos básicas",
        preview: "🛒 Cards simples de productos",
        component: () => <ProductCardWrapper ProductCardComponent={ProductCard01} text="Productos Destacados - Card 01" />,
        usePreview: true
      },
      {
        id: "product-card-02",
        name: "Product Card 02",
        description: "Cards con información adicional",
        preview: "📊 Cards con precios y descuentos",
        component: () => <ProductCardWrapper ProductCardComponent={ProductCard02} text="Productos Destacados - Card 02" />,
        usePreview: true
      },
      {
        id: "product-card-03",
        name: "Product Card 03",
        description: "Cards con hover effects",
        preview: "✨ Cards con efectos al pasar el mouse",
        component: () => <ProductCardWrapper ProductCardComponent={ProductCard03} text="Productos Destacados - Card 03" />,
        usePreview: true
      },
      {
        id: "product-card-04",
        name: "Product Card 04",
        description: "Cards con quick view",
        preview: "👁️ Cards con vista rápida",
        component: () => <ProductCardWrapper ProductCardComponent={ProductCard04} text="Productos Destacados - Card 04" />,
        usePreview: true
      },
      {
        id: "product-card-05",
        name: "Product Card 05",
        description: "Cards con wishlist",
        preview: "❤️ Cards con botón de favoritos",
        component: () => <ProductCardWrapper ProductCardComponent={ProductCard05} text="Productos Destacados - Card 05" />,
        usePreview: true
      },
      {
        id: "destacados-01",
        name: "Destacados 01",
        description: "Productos destacados básicos",
        preview: "⭐ Productos en destaque",
        component: Destacados01,
        usePreview: true
      },
      {
        id: "destacados-02",
        name: "Destacados 02",
        description: "Destacados con slider",
        preview: "🎠 Destacados con slider automático",
        component: Destacados02,
        usePreview: true
      },
      {
        id: "destacados-03",
        name: "Destacados 03",
        description: "Destacados con grid",
        preview: "📐 Destacados en formato grid",
        component: Destacados03,
        usePreview: true
      },
      {
        id: "destacados-cat",
        name: "Destacados por Categoría",
        description: "Productos destacados por categoría",
        preview: "📂 Destacados organizados por categorías",
        component: DestacadosCat,
        usePreview: true
      }
    ]
  },
  {
    id: "marcas",
    name: "Marcas",
    description: "Componentes para mostrar marcas y logos",
    icon:         <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="size-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
    />
  </svg>,
    color: "from-red-500 to-pink-500",
    components: [
      {
        id: "logos-carrusel",
        name: "Logos Carrusel",
        description: "Carrusel de logos de marcas",
        preview: "🎠 Carrusel automático de logos",
        component: LogosCarrusel,
        usePreview: true
      },
      {
        id: "logos-dinamicos",
        name: "Logos Dinámicos",
        description: "Logos con animaciones dinámicas",
        preview: "✨ Logos con efectos animados",
        component: LogosDinamicos,
        usePreview: true
      },
      {
        id: "logos-fijos",
        name: "Logos Fijos",
        description: "Grid estático de logos",
        preview: "📐 Grid fijo de logos de marcas",
        component: LogosFijos,
        usePreview: true
      }
    ]
  },
  {
    id: "social",
    name: "Social",
    description: "Componentes de redes sociales y feeds",
    icon:       <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>,
    color: "from-pink-500 to-rose-500",
    components: [
      {
        id: "feed-instagram",
        name: "Feed Instagram",
        description: "Feed de Instagram integrado",
        preview: "📸 Feed de Instagram en tiempo real",
        component: FeedInstagram,
        usePreview: true
      },
      {
        id: "testimonios-01",
        name: "Testimonios 01",
        description: "Testimonios básicos de clientes",
        preview: "💬 Testimonios con diseño simple",
        component: Testimonios01,
        usePreview: true
      },
      {
        id: "testimonios-02",
        name: "Testimonios 02",
        description: "Testimonios con cards",
        preview: "🃏 Testimonios en formato de cards",
        component: Testimonios02,
        usePreview: true
      },
      {
        id: "testimonios-03",
        name: "Testimonios 03",
        description: "Testimonios con slider",
        preview: "🎠 Testimonios con slider automático",
        component: Testimonios03,
        usePreview: true
      },
      {
        id: "testimonios-04",
        name: "Testimonios 04",
        description: "Testimonios con grid",
        preview: "📐 Testimonios en formato grid",
        component: Testimonios04,
        usePreview: true
      }
    ]
  },
  {
    id: "categorias",
    name: "Categorías / Colecciones",
    description: "Componentes para mostrar categorías y colecciones",
    icon:       <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.89l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
  </svg>,
    color: "from-yellow-500 to-orange-500",
    components: [
      {
        id: "categoria-01",
        name: "Categoría 01",
        description: "Grid de categorías básico",
        preview: "📱 Grid simple de categorías",
        component: Categoria01,
        usePreview: true
      },
      {
        id: "categoria-02",
        name: "Categoría 02",
        description: "Categorías con hover effects",
        preview: "✨ Categorías con efectos interactivos",
        component: Categoria02,
        usePreview: true
      },
      {
        id: "categoria-03",
        name: "Categoría 03",
        description: "Categorías con slider",
        preview: "🎠 Categorías con slider automático",
        component: Categoria03,
        usePreview: true
      },
      {
        id: "categoria-04",
        name: "Categoría 04",
        description: "Categorías con cards",
        preview: "🃏 Categorías en formato de cards",
        component: Categoria04,
        usePreview: true
      },
      {
        id: "categoria-05",
        name: "Categoría 05",
        description: "Categorías con grid avanzado",
        preview: "📐 Grid avanzado de categorías",
        component: Categoria05,
        usePreview: true
      },
      {
        id: "categoria-06",
        name: "Categoría 06",
        description: "Categorías con lista",
        preview: "📋 Lista vertical de categorías",
        component: Categoria06,
        usePreview: true
      },
      {
        id: "categoria-07",
        name: "Categoría 07",
        description: "Categorías con masonry",
        preview: "🧱 Layout masonry para categorías",
        component: Categoria07,
        usePreview: true
      },
      {
        id: "colecciones-01",
        name: "Colecciones 01",
        description: "Grid de colecciones básico",
        preview: "📦 Grid simple de colecciones",
        component: Colecciones01,
        usePreview: true
      },
      {
        id: "colecciones-02",
        name: "Colecciones 02",
        description: "Colecciones con slider",
        preview: "🎠 Colecciones con slider automático",
        component: Colecciones02,
        usePreview: true
      }
    ]
  }
];

export default function Componentes() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showPreview, setShowPreview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);

  const filteredCategories = selectedCategory === "Todos" 
    ? categories 
    : categories.filter(cat => cat.id === selectedCategory);

  const allComponents = categories.reduce((acc, cat) => {
    return acc + cat.components.length;
  }, 0);

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  const handlePreviewClick = (component: any) => {
    setSelectedComponent(component);
    setIsModalOpen(true);
    
    // Encontrar el índice del componente en la categoría actual
    if (currentCategory) {
      const index = currentCategory.components.findIndex(comp => comp.id === component.id);
      setCurrentComponentIndex(index);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComponent(null);
    setCurrentComponentIndex(0);
  };

  const navigateToComponent = (direction: 'prev' | 'next') => {
    if (!currentCategory) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentComponentIndex > 0 ? currentComponentIndex - 1 : currentCategory.components.length - 1;
    } else {
      newIndex = currentComponentIndex < currentCategory.components.length - 1 ? currentComponentIndex + 1 : 0;
    }
    
    setCurrentComponentIndex(newIndex);
    setSelectedComponent(currentCategory.components[newIndex]);
  };

  // Navegación con teclado
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigateToComponent('prev');
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateToComponent('next');
          break;
        case 'Escape':
          event.preventDefault();
          closeModal();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentComponentIndex, currentCategory]);

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <div className="bg-white  shadow-sm border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 ">
                Catálogo de Componentes PIXELUP
              </h1>
              <p className="mt-2 text-gray-600 ">
                {selectedCategory === "Todos" 
                  ? "Explora todos los componentes disponibles que tenemos para ti"
                  : `Explorando componentes de ${currentCategory?.name}`
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100  rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-white    text-gray-900   shadow-sm"
                      : "text-gray-600  hover:text-gray-900 "
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-white    text-gray-900   shadow-sm"
                      : "text-gray-600  hover:text-gray-900 "
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filtros */}
          <div className="lg:col-span-1"> 
            <div className="bg-white  rounded-lg shadow-sm border border-gray-200 ">
              <div className="p-4 border-b border-gray-200 ">
                <h3 className="text-sm font-semibold text-gray-900  mb-3">
                  Categorías
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("Todos");
                      setSelectedComponent(null);
                      setShowPreview(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center space-x-2 ${
                      selectedCategory === "Todos"
                        ? "bg-primary/20  text-primary/80 "
                        : "text-gray-600  hover:bg-gray-100 "
                    }`}
                  >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
</svg>


                    <span>Todos ({allComponents})</span>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedComponent(null);
                        setShowPreview(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center space-x-2 ${
                        selectedCategory === category.id
                          ? "bg-primary/20 text-primary/80"
                          : "text-gray-600  hover:bg-gray-100 "
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {category.icon}
                      </div>
                      <span>{category.name} ({category.components.length})</span>
                    </button>
                  ))}
                </div>
              </div>

            
{/*  */}
            </div>
          </div>

          {/* Área principal */}
          <div className="lg:col-span-3">
            {selectedCategory === "Todos" ? (
              // Vista de categorías
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedComponent(null);
                        setShowPreview(false);
                      }}
                      className="group relative overflow-hidden rounded-xl border-2 border-gray-200  h-48 flex items-center justify-center bg-white  shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      <div className="flex flex-col items-center gap-3 p-4 text-center">
                        <div className="text-3xl">{category.icon}</div>
                        <h2 className="text-lg font-bold text-gray-700  group-hover:text-gray-900  transition-colors duration-300">
                          {category.name}
                        </h2>
{/*                         <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                          {category.description}
                        </p> */}
                        <div className="text-xs text-gray-400  bg-gray-100  px-2 py-1 rounded-full">
                          {category.components.length} componentes
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedComponent(null);
                        setShowPreview(false);
                      }}
                      className="group block w-full bg-white  rounded-lg border border-gray-200  p-6 hover:shadow-lg transition-all duration-300 text-left"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
                          {category.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900  group-hover:text-primary  transition-colors">
                            {category.name}
                          </h3>
{/*                           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {category.description}
                          </p> */}
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20  text-primary ">
                              {category.components.length} componentes
                            </span>
                            <span className="text-xs text-gray-400 ">
                              Ver componentes →
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )
            ) : (
              // Vista de componentes de la categoría seleccionada
              <div className="space-y-6">
                {/* Lista de componentes de la categoría con viewMode */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentCategory?.components.map((component) => (
                      <div
                        key={component.id}
                        className="group block bg-white rounded-lg border border-gray-200  p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Fondo decorativo con gradiente sutil */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="flex flex-col space-y-4 relative z-10">
                          {/* Información del componente */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                {component.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                                  {component.name}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">
                                  ID: {component.id}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Botón de vista previa */}
                          <button
                            onClick={() => handlePreviewClick(component)}
                            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Ver Componente</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentCategory?.components.map((component) => (
                                            <div
                        key={component.id}
                        className="group block w-full bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Fondo decorativo con gradiente sutil */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="flex items-center justify-between relative z-10">
                          {/* Información del componente */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md">
                                {component.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                                  {component.name}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">
                                  ID: {component.id}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Botón de vista previa */}
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => handlePreviewClick(component)}
                              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>Ver Componente</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer con mensaje de contacto */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">¿Necesitas un componente personalizado?</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Si no encuentras el componente que necesitas en nuestro catálogo, podemos crear uno específico para ti.
              </p>
              <a 
                href="mailto:soporte@pixelup.cl" 
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contactar a soporte@pixelup.cl</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para vista completa del componente */}
      {isModalOpen && selectedComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Fondo oscuro */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Contenido del modal */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-[95%] max-h-[90vh] overflow-hidden">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                {/* Botón flecha izquierda */}
                <button
                  onClick={() => navigateToComponent('prev')}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
                  title="Componente anterior"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Información del componente */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedComponent.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentCategory?.name} • ID: {selectedComponent.id}
                  </p>
                </div>
                
                {/* Botón flecha derecha */}
                <button
                  onClick={() => navigateToComponent('next')}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
                  title="Siguiente componente"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Indicador de posición */}
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500 font-medium">
                  {currentComponentIndex + 1} de {currentCategory?.components.length}
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Contenido del modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                 
                  <selectedComponent.component />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}















