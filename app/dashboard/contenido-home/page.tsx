"use client";
import React, { useEffect, useState, useRef } from "react";
import Hero01BO from "@/components/PIXELUP/Hero/Hero01/Hero01BO";
import Hero02BO from "@/components/PIXELUP/Hero/Hero02/Hero02BO";
import BannerPrincipal02BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02";
import BannerPrincipal01BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01BO";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/BackOffice/MarqueeBO";
import Categoria02BO from "@/components/PIXELUP/Categorias/Categoria02/CategoriaBO02";
import FeedInstagramBO from "@/components/PIXELUP/FeedInstagram/FeedInstagramBO";
import SinFoto01BO from "@/components/PIXELUP/SinFoto/SinFoto01/SinFoto01BO";
import SinFoto02BO from "@/components/PIXELUP/SinFoto/SinFoto02/SinFoto02BO";
import Hero03BO from "@/components/PIXELUP/Hero/Hero03/Hero03BO";
import Hero04BO from "@/components/PIXELUP/Hero/Hero04/Hero04BO";
import Categoria05BO from "@/components/PIXELUP/Categorias/Categoria05/CategoriaBO05";
import Colecciones02BO from "@/components/PIXELUP/Colecciones/Colecciones02/Colecciones02BO";
import UbicacionBO from "@/components/PIXELUP/Ubicacion/UbicacionBO";
import Hero05BO from "@/components/PIXELUP/Hero/Hero05/Hero05BO";
import SinFoto03BO from "@/components/PIXELUP/SinFoto/SinFoto03/SinFoto03BO";
import Categoria01BO from "@/components/PIXELUP/Categorias/Categoria01/CategoriaBO01";
import Categoria03BO from "@/components/PIXELUP/Categorias/Categoria03/CategoriaBO03";
import Categoria04BO from "@/components/PIXELUP/Categorias/Categoria04/CategoriaBO04";
import Categoria06BO from "@/components/PIXELUP/Categorias/Categoria06/CategoriaBO06";
import Categoria07BO from "@/components/PIXELUP/Categorias/Categoria07/CategoriaBO07";
export default function BannerHome() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId]
      };
      
      // Si la sección se está abriendo, hacemos scroll hacia ella
      if (newState[sectionId] && sectionRefs.current[sectionId]) {
        setTimeout(() => {
          sectionRefs.current[sectionId]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100); // Pequeño retraso para asegurar que la animación de apertura haya comenzado
      }
      
      return newState;
    });
  };

  return (
    <section className="gap-4 flex flex-col py-10 mx-4">
      <title>Content block - Home</title>
      {[
        { id: "marqueeTOP", title: "Marquee", component: <MarqueeTOP /> },
        { id: "bannerPrincipal01", title: "Banner", component: <BannerPrincipal01BO /> },
        { id: "bannerPrincipal02", title: "Banner Doble", component: <BannerPrincipal02BO /> },
        { id: "hero01", title: "Hero 01", component: <Hero01BO /> },
        { id: "hero02", title: "About Me", component: <Hero02BO /> },
        { id: "hero03", title: "Nuestros Servicios", component: <Hero03BO /> },
        { id: "hero04", title: "Conóceme", component: <Hero04BO /> },
        { id: "hero05", title: "Propuesta de valor", component: <Hero05BO /> },
        { id: "sinFoto01", title: "About me sin foto", component: <SinFoto01BO /> },
        { id: "sinFoto02", title: "Sin Foto 02 ARREGLAR", component: <SinFoto02BO /> },
        { id: "sinFoto03", title: "4 Cajas", component: <SinFoto03BO /> },
        { id: "colecciones02", title: "Colecciones", component: <Colecciones02BO /> },
        { id: "categoria01", title: "Categoría 01", component: <Categoria01BO /> },
        { id: "categoria02", title: "Categorías 02 (3 imagenes)", component: <Categoria02BO /> },
        { id: "categoria03", title: "Categorías 03 (3 imagenes)", component: <Categoria03BO  /> },
        { id: "categoria04", title: "Categorías 04 (3 imagenes)", component: <Categoria04BO /> },
        { id: "categoria05", title: "Categorías 05 (4 imagenes)", component: <Categoria05BO /> },
        { id: "categoria06", title: "Categorías 06 (4 imagenes)", component: <Categoria06BO /> },	
        { id: "categoria07", title: "Categorías 07 (5 imagenes)", component: <Categoria07BO /> },
        { id: "ubicacion", title: "Ubicación", component: <UbicacionBO /> },
        { id: "feedInstagram", title: "Feed Instagram", component: <FeedInstagramBO /> },

/*          { id: "parallax", title: "Parallax", component: <ParallaxBO /> },
        { id: "bannerPrincipal04", title: "Barra Superior", component: <BannerPrincipal04BO /> },
        { id: "cardsPage", title: "Hero 03", component: <CardsPage /> },
        { id: "hero03", title: "Hero 03", component: <Hero03BO /> },
        { id: "hero04", title: "Hero 04", component: <Hero04BO /> },
        { id: "hero01", title: "Hero 01", component: <Hero01BO /> },
        { id: "hero02", title: "Hero 02", component: <Hero02BO /> },
        { id: "sinFoto01", title: "Sin Foto 01", component: <SinFoto01BO /> },
        { id: "sinFoto02", title: "Sin Foto 02", component: <SinFoto02BO /> },
        { id: "feedInstagram", title: "Feed Instagram", component: <FeedInstagramBO /> },
        { id: "testimonios", title: "Testimonios", component: <TestimoniosBO /> },
        { id: "categoria02", title: "Barra Superior", component: <Categoria02BO /> },
        { id: "logosCarrusel", title: "Barra Superior", component: <LogosCarruselBO /> },
        { id: "bannerMobile", title: "Banner Mobile", component: <BannerPrincipal02BOMobile /> },
        { id: "sobreMi", title: "Sobre Mí", component: <Hero02BO /> },
        { id: "frases", title: "Frases", component: <FrasesBO /> },  */
      ].map(section => (
        <div
          key={section.id}
          ref={el => sectionRefs.current[section.id] = el}
          className="rounded-sm border w-full border-stroke bg-white shadow-default dark:border-black dark:bg-black"
          style={{ borderRadius: "var(--radius)" }}
        >
          <div 
            className="text-sm flex gap-2 font-medium border-b p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleSection(section.id)}
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2">
                <div>{section.title}</div>
{/*                 <div>/ Home</div>
 */}              </div>
              {openSections[section.id] ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              )}
            </div>
          </div>
          <div className={`transition-all duration-300 overflow-hidden ${openSections[section.id] ? 'py-6 px-8' : 'h-0 py-0 px-8'}`}>
            {section.component}
          </div>
        </div>
      ))}
    </section>
  );
}
