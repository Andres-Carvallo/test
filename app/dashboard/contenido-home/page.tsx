"use client";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";


const GaleriaBO = dynamic(
  () => import("@/components/PIXELUP/Galeria/GaleriaBO"),
  { ssr: false }
);
// Importaciones dinámicas para evitar problemas de SSR
const Hero01BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero01/Hero01BO"),
  { ssr: false }
);
const Hero02BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero02/Hero02BO"),
  { ssr: false }
);

const ParallaxBO = dynamic(
  () => import("@/components/PIXELUP/Parallax/ParallaxBO"),
  { ssr: false }
);
const BannerPrincipal02BO = dynamic(
  () =>
    import(
      "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02BO"
    ),
  { ssr: false }
);
const BannerPrincipal01BO = dynamic(
  () =>
    import(
      "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01BO"
    ),
  { ssr: false }
);
const MaterialesBO = dynamic(
  () => import("@/components/PIXELUP/SinFoto/Materiales/MaterialesBO"),
  { ssr: false }
);
const MarqueeTOP = dynamic(
  () => import("@/components/PIXELUP/Marquee/MarqueeTop/BackOffice/MarqueeBO"),
  { ssr: false }
);
const Categoria02BO = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria02/CategoriaBO02"),
  { ssr: false }
);
const FeedInstagramBO = dynamic(
  () => import("@/components/PIXELUP/FeedInstagram/FeedInstagramBO"),
  { ssr: false }
);
const SinFoto01BO = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto01/SinFoto01BO"),
  { ssr: false }
);
const SinFoto02BO = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto02/SinFoto02BO"),
  { ssr: false }
);
const Hero03BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero03/Hero03BO"),
  { ssr: false }
);
const Hero04BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero04/Hero04BO"),
  { ssr: false }
);
const Categoria05BO = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria05/CategoriaBO05"),
  { ssr: false }
);
const Colecciones02BO = dynamic(
  () =>
    import("@/components/PIXELUP/Colecciones/Colecciones02/Colecciones02BO"),
  { ssr: false }
);
const UbicacionBO = dynamic(
  () => import("@/components/PIXELUP/Ubicacion/UbicacionBO"),
  { ssr: false }
);
const Hero05BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero05/Hero05BO"),
  { ssr: false }
);
const SinFoto03BO = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto03/SinFoto03BO"),
  { ssr: false }
);
const Categoria01BO = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria01/CategoriaBO01"),
  { ssr: false }
);
const SinFotoBO = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto/SinFotoBO"),
  { ssr: false }
);
const Categoria03BO = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria03/CategoriaBO03"),
  { ssr: false }
);
const Categoria04BO = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria04/CategoriaBO04"),
  { ssr: false }
);
const Categoria06BO = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria06/CategoriaBO06"),
  { ssr: false }
);
const Categoria07BO = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria07/CategoriaBO07"),
  { ssr: false }
);
const Hero06BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero06/Hero06BO"),
  { ssr: false }
);
const Hero07BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero07/Hero07BO"),
  { ssr: false }
);
const LogosCarruselBO = dynamic(
  () => import("@/components/PIXELUP/Marcas/LogosCarrusel/LogosCarruselBO"),
  { ssr: false }
);
const Testimonios01BO = dynamic(
  () => import("@/components/PIXELUP/Testimonios/Testimonios01/Testimonios01BO"),
  { ssr: false }
);

const Testimonios03BO = dynamic(
  () => import("@/components/PIXELUP/Testimonios/Testimonios03/Testimonios03BO"),
  { ssr: false }
);
export default function BannerHome() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId],
      };

      // Si la sección se está abriendo, hacemos scroll hacia ella
      if (newState[sectionId] && sectionRefs.current[sectionId]) {
        setTimeout(() => {
          sectionRefs.current[sectionId]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
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
/*         { id: "marqueeTOP", title: "Marquee", component: <MarqueeTOP /> },
 */        {id: "bannerPrincipal01", title: "Banner", component: <BannerPrincipal01BO />},
        {id: "galeria", title: "Galería", component: <GaleriaBO/>},
        {id: "sinFoto", title: "Sin Foto", component: <SinFotoBO/>},
        {id: "hero06", title: "Hero 06", component: <Hero06BO/>},
        {id: "materiales", title: "Materiales", component: <MaterialesBO/>},
        {id: "logosCarrusel", title: "Logos Carrusel", component: <LogosCarruselBO/>},
        {id: "hero07", title: "Hero 07", component: <Hero07BO/>},
        {id: "testimonios", title: "Testimonios", component: <Testimonios01BO/>},
        {id: "testimonios03", title: "Testimonios 03", component: <Testimonios03BO/>},
/*         {
          id: "bannerPrincipal02",
          title: "Banner Doble",
          component: <BannerPrincipal02BO />,
        },
        { id: "hero01", title: "Hero 01", component: <Hero01BO /> },
        { id: "hero02", title: "About Me", component: <Hero02BO /> },
        { id: "hero03", title: "Nuestros Servicios", component: <Hero03BO /> },
        { id: "hero04", title: "Conóceme", component: <Hero04BO /> },
        { id: "hero05", title: "Propuesta de valor", component: <Hero05BO /> },
        {
          id: "sinFoto01",
          title: "About me sin foto",
          component: <SinFoto01BO />,
        },
        {
          id: "sinFoto02",
          title: "Sin Foto 02 ARREGLAR",
          component: <SinFoto02BO />,
        },
        { id: "sinFoto03", title: "4 Cajas", component: <SinFoto03BO /> },
        {
          id: "colecciones02",
          title: "Colecciones",
          component: <Colecciones02BO />,
        },
        {
          id: "categoria01",
          title: "Categoría 01",
          component: <Categoria01BO />,
        },
        {
          id: "categoria02",
          title: "Categorías 02 (3 imagenes)",
          component: <Categoria02BO />,
        },
        {
          id: "categoria03",
          title: "Categorías 03 (3 imagenes)",
          component: <Categoria03BO />,
        },
        {
          id: "categoria04",
          title: "Categorías 04 (3 imagenes)",
          component: <Categoria04BO />,
        },
        {
          id: "categoria05",
          title: "Categorías 05 (4 imagenes)",
          component: <Categoria05BO />,
        },
        {
          id: "categoria06",
          title: "Categorías 06 (4 imagenes)",
          component: <Categoria06BO />,
        },
        {
          id: "categoria07",
          title: "Categorías 07 (5 imagenes)",
          component: <Categoria07BO />,
        },
        { id: "ubicacion", title: "Ubicación", component: <UbicacionBO /> },
        {
          id: "feedInstagram",
          title: "Feed Instagram",
          component: <FeedInstagramBO />,
        },
        { id: "parallax", title: "Parallax", component: <ParallaxBO /> } */
        /* ,
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
      ].map((section) => (
        <div
          key={section.id}
          ref={(el) => (sectionRefs.current[section.id] = el)}
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
                 */}{" "}
              </div>
              {openSections[section.id] ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              )}
            </div>
          </div>
          <div
            className={`transition-all duration-300 overflow-hidden ${
              openSections[section.id] ? "py-6 px-8" : "h-0 py-0 px-8"
            }`}
          >
            {section.component}
          </div>
        </div>
      ))}
    </section>
  );
}
