"use client";

import React, { Suspense } from "react";
import { HomeConfig } from "@/app/utils/homeConfig";
import Banner from "@/components/PIXELUP/Skeleton/Banner";
import dynamic from "next/dynamic";

// Importaciones dinámicas con { ssr: false } para componentes client
const MarqueeTOP = dynamic(
  () => import("@/components/conMantenedor/MarqueeTOP"),
  { ssr: false }
);
const BannerPrincipal01 = dynamic(
  () =>
    import(
      "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01"
    ),
  { ssr: false }
);
const Destacados01 = dynamic(
  () => import("@/components/PIXELUP/Destacados/Destacado01"),
  { ssr: false }
);
const Hero01 = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero01/Hero01"),
  { ssr: false }
);
const Hero02 = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero02/Hero02"),
  { ssr: false }
);
const Hero03 = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero03/Hero03"),
  { ssr: false }
);
const Hero04 = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero04/Hero04"),
  { ssr: false }
);
const Parallax = dynamic(
  () => import("@/components/PIXELUP/Parallax/Parallax"),
  { ssr: false }
);
const Colecciones02 = dynamic(
  () => import("@/components/PIXELUP/Colecciones/Colecciones02/Colecciones02"),
  { ssr: false }
);
const Categoria02 = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria02/Categoria02"),
  { ssr: false }
);
const Ubicacion = dynamic(
  () => import("@/components/PIXELUP/Ubicacion/Ubicacion"),
  { ssr: false }
);
const FeedInstagram = dynamic(
  () => import("@/components/PIXELUP/FeedInstagram/FeedInstagram"),
  { ssr: false }
);
const SinFoto01 = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto01/SinFoto01"),
  { ssr: false }
);
const Frase01 = dynamic(
  () => import("@/components/PIXELUP/Frases/Frase01/Frase01"),
  { ssr: false }
);
const Frase02 = dynamic(
  () => import("@/components/PIXELUP/Frases/Frase02/Frase02"),
  { ssr: false }
);
const FeedRRSS = dynamic(
  () => import("@/components/PIXELUP/FeedRRSS/FeedRRSS"),
  { ssr: false }
);
const LogosCarrusel = dynamic(
  () => import("@/components/PIXELUP/Marcas/LogosCarrusel/LogosCarrusel"),
  { ssr: false }
);
const LogosFijos = dynamic(
  () => import("@/components/PIXELUP/Marcas/LogosFijos/LogosFijos"),
  { ssr: false }
);
  const LogosDinamicos = dynamic(
  () => import("@/components/PIXELUP/Marcas/LogosDinamicos/LogosDinamicos"),
  { ssr: false }
);

// Mapeo de componentes
const componentMap: { [key: string]: React.ComponentType<any> } = {
  marqueeTOP: MarqueeTOP,
  bannerPrincipal01: BannerPrincipal01,
  destacadosCat: Destacados01,
  hero01: Hero01,
  hero02: Hero02,
  hero03: Hero03,
  hero04: Hero04,
  parallax: Parallax,
  colecciones02: Colecciones02,
  categoria02: Categoria02,
  ubicacion: Ubicacion,
  feedinstagram: FeedInstagram,
  sinFoto01: SinFoto01,
  frase01: Frase01,
  frase02: Frase02,
  feedRRSS: FeedRRSS,
  logoscarrusel: LogosCarrusel,
  logosfijos: LogosFijos,
  logosdinamicos: LogosDinamicos,
};

interface ClientHomeComponentsProps {
  config: HomeConfig;
}

export default function ClientHomeComponents({
  config,
}: ClientHomeComponentsProps) {
  const renderComponent = (componentId: string) => {
    const Component = componentMap[componentId];

    if (!Component) {
      console.warn(`Componente no encontrado: ${componentId}`);
      return null;
    }

    // Props específicas para algunos componentes
    const getComponentProps = (id: string) => {
      switch (id) {
        case "destacadosCat":
          return { text: "Destacados" };
        default:
          return {};
      }
    };

    return (
      <Suspense
        key={componentId}
        fallback={<Banner />}
      >
        <Component {...getComponentProps(componentId)} />
      </Suspense>
    );
  };

  // Renderizar componentes en el orden especificado
  return (
    <>
      {config.order.map((componentId) => {
        if (config.visibleComponents.includes(componentId)) {
          return renderComponent(componentId);
        }
        return null;
      })}
    </>
  );
}
