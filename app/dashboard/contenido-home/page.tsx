"use client";
import React, { useEffect, useState, useRef } from "react";
import Hero01BO from "@/components/PIXELUP/Hero/Hero01/Hero01BO";
import Hero02BO from "@/components/PIXELUP/Hero/Hero02/Hero02BO";
import FrasesBO from "@/components/PIXELUP/Frases/BackOffice/FrasesBO";
import BannerPrincipal02BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02BO";
import BannerPrincipal01BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01BO";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/BackOffice/MarqueeBO";
import BannerPrincipal02BOMobile from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02Mobile/BannerPrincipal02BOMobile";
import Categoria02BO from "@/components/PIXELUP/Categorias/Categoria02/CategoriaBO02";
import FeedInstagramBO from "@/components/PIXELUP/FeedInstagram/FeedInstagramBO";
import TestimoniosBO from "@/components/PIXELUP/Testimonios/Testimonios01/Testimonios01BO";
import LogosCarruselBO from "@/components/PIXELUP/Marcas/LogosCarrusel/LogosCarruselBO";
import SinFoto01BO from "@/components/PIXELUP/SinFoto/SinFoto01/SinFoto01BO";
import SinFoto02BO from "@/components/PIXELUP/SinFoto/SinFoto02/SinFoto02BO";
import Hero03BO from "@/components/PIXELUP/Hero/Hero03/Hero03BO";
import Hero04BO from "@/components/PIXELUP/Hero/Hero04/Hero04BO";
import CardsPage from "@/components/PIXELUP/SinFoto/SinFoto03/SinFoto03BO";
import BannerPrincipal04BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal04/BannerPrincipal04BO";
import ParallaxBO from "@/components/PIXELUP/Parallax/ParallaxBO";
import Categoria05BO from "@/components/PIXELUP/Categorias/Categoria05/CategoriaBO05";
import Colecciones02BO from "@/components/PIXELUP/Colecciones/Colecciones02/Colecciones02BO";
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
        { id: "marqueeTOP", title: "Barra Superior", component: <MarqueeTOP /> },
        { id: "colecciones02", title: "Colecciones 02", component: <Colecciones02BO /> },
        { id: "categoria06", title: "Categoria 06", component: <Categoria05BO /> },
         { id: "parallax", title: "Parallax", component: <ParallaxBO /> },
        { id: "bannerPrincipal01", title: "Banner", component: <BannerPrincipal01BO /> },
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
        { id: "frases", title: "Frases", component: <FrasesBO /> }, 
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
