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
const SinFoto05 = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto05/SinFoto05"),
  { ssr: false }
);
const SinFoto08 = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto08/SinFoto08"),
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
const Categoria08 = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria08/Categoria08"),
  { ssr: false }
);
const SinFoto09 = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto09/SinFoto09"),
  { ssr: false }
);
const Testimonios05 = dynamic(
  () => import("@/components/PIXELUP/Testimonios/Testimonios05/Testimonios05"),
  { ssr: false }
);
const Ubicacion03 = dynamic(
  () => import("@/components/PIXELUP/Ubicacion/Ubicacion03/Ubicacion03"),
  { ssr: false }
);
const Categoria09 = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria09/Categoria09"),
  { ssr: false }
);
const SinFoto10 = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto10/SinFoto10"),
  { ssr: false }
);
const Hero10 = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero10/Hero10"),
  { ssr: false }
);
const SinFoto11 = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto11/SinFoto11"),
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
  categoria08: Categoria08,
  ubicacion: Ubicacion,
  ubicacion03: Ubicacion03,
  feedinstagram: FeedInstagram,
  sinFoto01: SinFoto01,
  frase01: Frase01,
  frase02: Frase02,
  feedRRSS: FeedRRSS,
  logoscarrusel: LogosCarrusel,
  logosfijos: LogosFijos,
  logosdinamicos: LogosDinamicos,
  sinFoto05: SinFoto05,
  sinFoto08: SinFoto08,
  sinFoto09: SinFoto09,
  testimonios05: Testimonios05,
  categoria09: Categoria09,
  sinFoto10: SinFoto10,
  hero10: Hero10,
  sinFoto11: SinFoto11,
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
