"use client";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";
import HomeConfigManager from "@/app/components/HomeConfigManager";
import { HomeConfig } from "@/app/utils/homeConfig";


const GaleriaBO = dynamic(
  () => import("@/components/PIXELUP/Galeria/Galeria01/Galeria01BO"),
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
  () => import("@/components/PIXELUP/SinFoto/SinFoto05/SinFoto05BO"),
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
  () =>
    import("@/components/PIXELUP/Testimonios/Testimonios01/Testimonios01BO"),
  { ssr: false }
);
const Colecciones01BO = dynamic(
  () =>
    import("@/components/PIXELUP/Colecciones/Colecciones01/Colecciones01BO"),
  { ssr: false }
);
const Ubicacion02BO = dynamic(
  () => import("@/components/PIXELUP/Ubicacion/Ubicacion02/Ubicacion02BO"),
  { ssr: false }
);
const Hero08BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero08/Hero08BO"),
  { ssr: false }
);
const SinFoto02BO = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto02/SinFoto02BO"),
  { ssr: false }
);
const Hero09BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero09/Hero09BO"),
  { ssr: false }
);
const SinFoto04BO = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto04/SinFoto04BO"),
  { ssr: false }
);
const LogosFijosBO = dynamic(
  () => import("@/components/PIXELUP/Marcas/LogosFijos/LogosFijosBO"),
  { ssr: false }
);
const LogosDinamicosBO = dynamic(
  () => import("@/components/PIXELUP/Marcas/LogosDinamicos/LogosDinamicosBO"),
  { ssr: false }
);

const Testimonios03BO = dynamic(
  () =>
    import("@/components/PIXELUP/Testimonios/Testimonios03/Testimonios03BO"),
  { ssr: false }
);
const Galeria02BO = dynamic(
  () => import("@/components/PIXELUP/Galeria/Galeria02/Galeria02BO"),
  { ssr: false }
);
const Servicios01BO = dynamic(
  () => import("@/components/PIXELUP/Servicios/Servicios01/Servicios01BO"),
  { ssr: false }
);
const Servicios02BO = dynamic(
  () => import("@/components/PIXELUP/Servicios/Servicios02/Servicios02BO"),
  { ssr: false }
);
const Servicios03BO = dynamic(
  () => import("@/components/PIXELUP/Servicios/Servicios03/Servicios03BO"),
  { ssr: false }
);
const SinFoto06BO = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto06/SinFoto06BO"),
  { ssr: false }
);
const SinFoto07BO = dynamic(
  () => import("@/components/PIXELUP/SinFoto/SinFoto07/SinFoto07BO"),
  { ssr: false }
);
/* const NavbarbannerBO = dynamic(
  () => import("@/components/PIXELUP/Navbar/Navbarbanner/NavbarbannerBO"),
  { ssr: false }
); */
const Nosotros01BO = dynamic(
  () => import("@/components/PIXELUP/Nosotros/Nosotros01/Nosotros01BO"),
  { ssr: false }
);
const Servicios04BO = dynamic(
  () => import("@/components/PIXELUP/Servicios/Servicios04/Servicios04BO"),
  { ssr: false }
);
const Testimonios04BO = dynamic(
  () =>
    import("@/components/PIXELUP/Testimonios/Testimonios04/Testimonios04BO"),
  { ssr: false }
);
const DestacadosCatBO = dynamic(
  () => import("@/components/PIXELUP/Destacados/DestacadosCat/DestacadosCatBO"),
  { ssr: false }
);

export default function BannerHome() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Configuración de componentes disponibles con descripciones
  const availableComponents = [
    {
      id: "marqueeTOP",
      title: "Marquee",
      description: "Banner de texto deslizante en la parte superior",
      category: "Contenido",
    },
    {
      id: "bannerPrincipal01",
      title: "Banner Principal 01",
      description: "Banner principal de la página",
      category: "Banners",
    },
    {
      id: "bannerPrincipal02",
      title: "Banner Principal 02",
      description: "Banner principal de la página",
      category: "Banners",
    },
    {
      id: "parallax",
      title: "Parallax",
      description: "Parallax de la página",
      category: "Banners",
    },
    {
      id: "hero01",
      title: "Hero 01",
      description: "Hero de la página",
      category: "Contenido",
    },
    {
      id: "hero02",
      title: "Hero 02",
      description: "Hero de la página",
      category: "Contenido",
    },
    {
      id: "hero03",
      title: "Hero 03",
      description: "Hero de la página",
      category: "Contenido",
    },
    {
      id: "hero04",
      title: "Hero 04",
      description: "Hero de la página",
      category: "Contenido",
    },
    {
      id: "hero05",
      title: "Hero 05",
      description: "Hero de la página",
      category: "Contenido",
    },
    {
      id: "hero06",
      title: "Hero 06",
      description: "Hero de la página",
      category: "Contenido",
    },
    {
      id: "hero07",
      title: "Hero 07",
      description: "Hero de la página",
      category: "Contenido",
    },
    {
      id: "hero08",
      title: "Hero 08",
      description: "Hero de la página",
      category: "Contenido",
    },
    {
      id: "hero09",
      title: "Hero 09",
      description: "Hero de la página",
      category: "Contenido",
    },
    {
      id: "galeria01",
      title: "Galeria 01",
      description: "Galeria de la página",
      category: "Contenido",
    },
    {
      id: "galeria02",
      title: "Galeria 02",
      description: "Galeria de la página",
      category: "Contenido",
    },
    {
      id: "servicios01",
      title: "Servicios 01",
      description: "Servicios de la página",
      category: "Contenido",
    },
    {
      id: "servicios02",
      title: "Servicios 02",
      description: "Servicios de la página",
      category: "Contenido",
    },
    {
      id: "servicios03",
      title: "Servicios 03",
      description: "Servicios de la página",
      category: "Contenido",
    },
    {
      id: "servicios04",
      title: "Servicios 04",
      description: "Servicios de la página",
      category: "Contenido",
    },
    {
      id: "logoscarrusel",
      title: "Logos Carrusel",
      description: "Logos Carrusel de la página",
      category: "Marcas",
    },
    {
      id: "logosfijos",
      title: "Logos Fijos",
      description: "Logos Fijos de la página",
      category: "Marcas",
    },
    {
      id: "logosdinamicos",
      title: "Logos Dinámicos",
      description: "Logos Dinámicos de la página",
      category: "Marcas",
    },
    {
      id: "testimonios01",
      title: "Testimonios 01",
      description: "Testimonios de la página",
      category: "Social",
    },
    {
      id: "testimonios02",
      title: "Testimonios 02",
      description: "Testimonios de la página",
      category: "Social",
    },
    {
      id: "testimonios03",
      title: "Testimonios 03",
      description: "Testimonios de la página",
      category: "Social",
    },
    {
      id: "testimonios04",
      title: "Testimonios 04",
      description: "Testimonios de la página",
      category: "Social",
    },
    {
      id: "feedinstagram",
      title: "Feed Instagram",
      description: "Feed Instagram de la página",
      category: "Social",
    },
    {
      id: "categoria01",
      title: "Categoría 01",
      description: "Categoría de la página",
      category: "Categorías Colecciones",
    },
    {
      id: "categoria02",
      title: "Categoría 02",
      description: "Categoría de la página",
      category: "Categorías Colecciones",
    },
    {
      id: "categoria03",
      title: "Categoría 03",
      description: "Categoría de la página",
      category: "Categorías Colecciones",
    },
    {
      id: "categoria04",
      title: "Categoría 04",
      description: "Categoría de la página",
      category: "Categorías Colecciones",
    },
    {
      id: "categoria05",
      title: "Categoría 05",
      description: "Categoría de la página",
      category: "Categorías Colecciones",
    },
    {
      id: "categoria06",
      title: "Categoría 06",
      description: "Categoría de la página",
      category: "Categorías Colecciones",
    },
    {
      id: "categoria07",
      title: "Categoría 07",
      description: "Categoría de la página",
      category: "Categorías Colecciones",
    },
    {
      id: "colecciones01",
      title: "Colecciones 01",
      description: "Colecciones de la página",
      category: "Categorías Colecciones",
    },
    {
      id: "colecciones02",
      title: "Colecciones 02",
      description: "Colecciones de la página",
      category: "Categorías Colecciones",
    },
  ];

  // Cargar configuración del home
  const fetchHomeConfig = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const configId =
        process.env.NEXT_PUBLIC_HOME_CONFIG_CONTENTBLOCK ||
        "home-config-default";

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${configId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      if (response.data.code === 0 && response.data.contentBlock) {
        try {
          const config = JSON.parse(response.data.contentBlock.contentText);
          // Validar que la configuración tenga la estructura correcta
          if (config.visibleComponents && config.order) {
            setHomeConfig(config);
          } else {
            throw new Error("Configuración inválida");
          }
        } catch (error) {
          console.log("Usando configuración por defecto:", error);
          // Si no hay configuración, usar configuración por defecto
          const defaultConfig: HomeConfig = {
            visibleComponents: availableComponents
              .slice(0, 10)
              .map((comp) => comp.id),
            order: availableComponents.slice(0, 10).map((comp) => comp.id),
          };
          setHomeConfig(defaultConfig);
        }
      } else {
        // Si no hay respuesta válida, usar configuración por defecto
        const defaultConfig: HomeConfig = {
          visibleComponents: availableComponents
            .slice(0, 10)
            .map((comp) => comp.id),
          order: availableComponents.slice(0, 10).map((comp) => comp.id),
        };
        setHomeConfig(defaultConfig);
      }
    } catch (error) {
      console.error("Error al cargar configuración del home:", error);
      // Configuración por defecto
      const defaultConfig: HomeConfig = {
        visibleComponents: availableComponents
          .slice(0, 10)
          .map((comp) => comp.id),
        order: availableComponents.slice(0, 10).map((comp) => comp.id),
      };
      setHomeConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuración del home
  const saveHomeConfig = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const configId =
        process.env.NEXT_PUBLIC_HOME_CONFIG_CONTENTBLOCK ||
        "home-config-default";

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${configId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title: "Configuración del Home",
          contentText: JSON.stringify(homeConfig),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 0) {
        toast.success("Configuración guardada exitosamente");
        // Revalidar cache
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/" }),
        });
      }
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      toast.error("Error al guardar la configuración");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en la configuración
  const handleConfigChange = (newConfig: HomeConfig) => {
    setHomeConfig(newConfig);
  };

  // Restaurar configuración por defecto
  const resetHomeConfig = () => {
    const defaultConfig: HomeConfig = {
      visibleComponents: availableComponents
        .slice(0, 10)
        .map((comp) => comp.id),
      order: availableComponents.slice(0, 10).map((comp) => comp.id),
    };
    setHomeConfig(defaultConfig);
    toast.success("Configuración restaurada por defecto");
  };

  useEffect(() => {
    fetchHomeConfig();
  }, []);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId],
      };

      if (newState[sectionId] && sectionRefs.current[sectionId]) {
        setTimeout(() => {
          sectionRefs.current[sectionId]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }

      return newState;
    });
  };

  if (loading && !homeConfig) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  // Obtener componentes ordenados según la configuración
  const orderedComponents =
    homeConfig?.order
      ?.map((componentId: string) => {
        const componentInfo = availableComponents.find(
          (comp) => comp.id === componentId
        );
        if (!componentInfo) return null;

        // Mapeo de componentes a sus respectivos componentes BO
        const componentMap: { [key: string]: React.ReactNode } = {
          marqueeTOP: <MarqueeTOP />,
          bannerPrincipal01: <BannerPrincipal01BO />,
          destacadosCat: <DestacadosCatBO />,
          testimonios03: <Testimonios03BO />,
          testimonios: <Testimonios01BO />,
          testimonios04: <Testimonios04BO />,
          sinFoto04: <SinFoto04BO />,
          colecciones01: <Colecciones01BO />,
          colecciones02: <Colecciones02BO />,
          galeria01: <GaleriaBO />,
          galeria02: <Galeria02BO />,
          nosotros01: <Nosotros01BO />,
          sinFoto06: <SinFoto06BO />,
          sinFoto07: <SinFoto07BO />,
          ubicacion02: <Ubicacion02BO />,
          servicios01: <Servicios01BO />,
          servicios02: <Servicios02BO />,
          servicios03: <Servicios03BO />,
          servicios04: <Servicios04BO />,
          galeria: <GaleriaBO />,
          sinFoto: <SinFotoBO />,
          sinFoto02: <SinFoto02BO />,
          hero06: <Hero06BO />,
          materiales: <MaterialesBO />,
          logoscarrusel: <LogosCarruselBO />,
          logosfijos: <LogosFijosBO />,
          logosdinamicos: <LogosDinamicosBO />,
          hero07: <Hero07BO />,
          hero08: <Hero08BO />,
          hero09: <Hero09BO />,
          bannerPrincipal02: <BannerPrincipal02BO />,
          hero01: <Hero01BO />,
          hero02: <Hero02BO />,
          hero03: <Hero03BO />,
          hero04: <Hero04BO />,
          hero05: <Hero05BO />,
          sinFoto01: <SinFoto01BO />,
          sinFoto03: <SinFoto03BO />,
          categoria01: <Categoria01BO />,
          categoria02: <Categoria02BO />,
          categoria03: <Categoria03BO />,
          categoria04: <Categoria04BO />,
          categoria05: <Categoria05BO />,
          categoria06: <Categoria06BO />,
          categoria07: <Categoria07BO />,
          feedInstagram: <FeedInstagramBO />,
          parallax: <ParallaxBO />,
        };

        return {
          ...componentInfo,
          component: componentMap[componentId] || (
            <div>Componente no encontrado</div>
          ),
        };
      })
      .filter(Boolean) || [];

  return (
    <section className="gap-4 flex flex-col py-10 mx-4">
      <title>Content block - Home</title>
      {/* Componentes ordenados */}
      {orderedComponents.map((section: any) => (
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
      {/* Panel de configuración con drag and drop */}
      <div className="rounded-sm border w-full border-stroke bg-white shadow-default dark:border-black dark:bg-black mb-6">
        <div className="p-6">
          {homeConfig && (
            <HomeConfigManager
              availableComponents={availableComponents}
              config={homeConfig}
              onConfigChange={handleConfigChange}
              onSave={saveHomeConfig}
              onReset={resetHomeConfig}
              loading={loading}
            />
          )}
        </div>
      </div>


    </section>
  );
}
