"use client";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";
import AboutConfigManager from "@/app/components/AboutConfigManager";
import { AboutConfig } from "@/app/utils/aboutConfig";

// Importaciones dinámicas para evitar problemas de SSR
const About01BO = dynamic(
  () => import("@/components/PIXELUP/About/About01/BackOffice/About01BO"),
  { ssr: false }
);
const BannerAboutBO = dynamic(
  () => import("@/components/PIXELUP/BannerAbout/BannerAbout/BannerAboutBO"),
  { ssr: false }
);

// Importaciones dinámicas para componentes del Home
const GaleriaBO = dynamic(
  () => import("@/components/PIXELUP/Galeria/Galeria01/Galeria01BO"),
  { ssr: false }
);
const Hero01BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero01/Hero01BO"),
  { ssr: false }
);
const Hero02BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero02/Hero02BO"),
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
const Hero05BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero05/Hero05BO"),
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
const Hero08BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero08/Hero08BO"),
  { ssr: false }
);
const Hero09BO = dynamic(
  () => import("@/components/PIXELUP/Hero/Hero09/Hero09BO"),
  { ssr: false }
);
const ParallaxBO = dynamic(
  () => import("@/components/PIXELUP/Parallax/ParallaxBO"),
  { ssr: false }
);
const BannerPrincipal01BO = dynamic(
  () =>
    import(
      "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01BO"
    ),
  { ssr: false }
);
const BannerPrincipal02BO = dynamic(
  () =>
    import(
      "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02BO"
    ),
  { ssr: false }
);
const MarqueeTOP = dynamic(
  () => import("@/components/PIXELUP/Marquee/MarqueeTop/BackOffice/MarqueeBO"),
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
const Servicios04BO = dynamic(
  () => import("@/components/PIXELUP/Servicios/Servicios04/Servicios04BO"),
  { ssr: false }
);
const LogosCarruselBO = dynamic(
  () => import("@/components/PIXELUP/Marcas/LogosCarrusel/LogosCarruselBO"),
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
const Testimonios01BO = dynamic(
  () =>
    import("@/components/PIXELUP/Testimonios/Testimonios01/Testimonios01BO"),
  { ssr: false }
);
const Testimonios03BO = dynamic(
  () =>
    import("@/components/PIXELUP/Testimonios/Testimonios03/Testimonios03BO"),
  { ssr: false }
);
const Testimonios04BO = dynamic(
  () =>
    import("@/components/PIXELUP/Testimonios/Testimonios04/Testimonios04BO"),
  { ssr: false }
);
const FeedInstagramBO = dynamic(
  () => import("@/components/PIXELUP/FeedInstagram/FeedInstagramBO"),
  { ssr: false }
);
const Categoria01BO = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria01/CategoriaBO01"),
  { ssr: false }
);
const Categoria02BO = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria02/CategoriaBO02"),
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
const Categoria05BO = dynamic(
  () => import("@/components/PIXELUP/Categorias/Categoria05/CategoriaBO05"),
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
const Colecciones01BO = dynamic(
  () =>
    import("@/components/PIXELUP/Colecciones/Colecciones01/Colecciones01BO"),
  { ssr: false }
);
const Colecciones02BO = dynamic(
  () =>
    import("@/components/PIXELUP/Colecciones/Colecciones02/Colecciones02BO"),
  { ssr: false }
);
const DestacadosCatBO = dynamic(
  () => import("@/components/PIXELUP/Destacados/DestacadosCat/DestacadosCatBO"),
  { ssr: false }
);

export default function AboutUsPage() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [aboutConfig, setAboutConfig] = useState<AboutConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasAdvancedOrProPlan, setHasAdvancedOrProPlan] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [homeActiveComponents, setHomeActiveComponents] = useState<string[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Configuración de componentes disponibles con descripciones
  const availableComponents = [
    {
      id: "bannerAbout",
      title: "Banner About",
      description: "Banner principal de la página About Us",
      category: "Banners",
    },
    {
      id: "aboutUs",
      title: "About Us Texto",
      description: "Contenido principal de la página About Us",
      category: "Contenido",
    },
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
    {
      id: "destacadosCat",
      title: "Destacados Cat",
      description: "Destacados de categorías",
      category: "Categorías Colecciones",
    },
  ];

  // Verificar plan de suscripción
  const checkSubscriptionPlan = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/subscriptions?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Buscar suscripciones activas
      const activeSubscriptions = response.data.subscriptions.filter(
        (sub: any) => sub.statusCode === "ACTIVE" || sub.statusCode === "EXPIRED"
      );

      // Verificar si tiene plan Avanzado o PRO
      const advancedOrProSubscription = activeSubscriptions.find((sub: any) =>
        sub.name.toLowerCase().includes("avanzado") || sub.name.toLowerCase().includes("pro")
      );

      // Determinar el plan actual
      let planName = "Sin suscripción activa";
      if (activeSubscriptions.length > 0) {
        const subscription = activeSubscriptions[0]; // Tomar la primera suscripción activa
        if (subscription.name.toLowerCase().includes("pro")) {
          planName = "Plan PRO";
        } else if (subscription.name.toLowerCase().includes("avanzado")) {
          planName = "Plan Avanzado";
        } else if (subscription.name.toLowerCase().includes("inicia")) {
          planName = "Plan Inicia";
        } else {
          planName = subscription.name;
        }
      }

      setHasAdvancedOrProPlan(!!advancedOrProSubscription);
      setCurrentPlan(planName);
    } catch (error) {
      console.error("Error verificando plan de suscripción:", error);
      setHasAdvancedOrProPlan(false);
      setCurrentPlan("Error al verificar plan");
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Cargar configuración de About
  const fetchAboutConfig = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const configId =
        process.env.NEXT_PUBLIC_ABOUT_CONFIG_CONTENTBLOCK ||
        "about-config-default";

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${configId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      if (response.data.code === 0 && response.data.contentBlock) {
        try {
          const config = JSON.parse(response.data.contentBlock.contentText);
          // Validar que la configuración tenga la estructura correcta
          if (config.visibleComponents && config.order) {
            setAboutConfig(config);
          } else {
            throw new Error("Configuración inválida");
          }
        } catch (error) {
          console.log("Usando configuración por defecto:", error);
          // Si no hay configuración, usar configuración por defecto
          const defaultConfig: AboutConfig = {
            visibleComponents: availableComponents.map((comp) => comp.id),
            order: availableComponents.map((comp) => comp.id),
          };
          setAboutConfig(defaultConfig);
        }
      } else {
        // Si no hay respuesta válida, usar configuración por defecto
        const defaultConfig: AboutConfig = {
          visibleComponents: availableComponents.map((comp) => comp.id),
          order: availableComponents.map((comp) => comp.id),
        };
        setAboutConfig(defaultConfig);
      }
    } catch (error) {
      console.error("Error al cargar configuración de About:", error);
      // Configuración por defecto
      const defaultConfig: AboutConfig = {
        visibleComponents: availableComponents.map((comp) => comp.id),
        order: availableComponents.map((comp) => comp.id),
      };
      setAboutConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuración de About
  const saveAboutConfig = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const configId =
        process.env.NEXT_PUBLIC_ABOUT_CONFIG_CONTENTBLOCK ||
        "about-config-default";

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${configId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title: "Configuración de About Us",
          contentText: JSON.stringify(aboutConfig),
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
          body: JSON.stringify({ path: "/nosotros" }),
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
  const handleConfigChange = (newConfig: AboutConfig) => {
    setAboutConfig(newConfig);
  };

  // Restaurar configuración por defecto
  const resetAboutConfig = () => {
    const defaultConfig: AboutConfig = {
      visibleComponents: availableComponents.map((comp) => comp.id),
      order: availableComponents.map((comp) => comp.id),
    };
    setAboutConfig(defaultConfig);
    toast.success("Configuración restaurada por defecto");
  };

  // Obtener configuración activa de Home
  const fetchHomeActiveComponents = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const configId = process.env.NEXT_PUBLIC_HOME_CONFIG_CONTENTBLOCK || "home-config-default";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${configId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      if (response.data.code === 0 && response.data.contentBlock) {
        try {
          const config = JSON.parse(response.data.contentBlock.contentText);
          if (config.visibleComponents) {
            setHomeActiveComponents(config.visibleComponents);
          } else {
            setHomeActiveComponents([]);
          }
        } catch {
          setHomeActiveComponents([]);
        }
      } else {
        setHomeActiveComponents([]);
      }
    } catch {
      setHomeActiveComponents([]);
    }
  };

  useEffect(() => {
    fetchAboutConfig();
    checkSubscriptionPlan();
    fetchHomeActiveComponents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (loading && !aboutConfig) {
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
    aboutConfig?.order
      ?.map((componentId: string) => {
        const componentInfo = availableComponents.find(
          (comp) => comp.id === componentId
        );
        if (!componentInfo) return null;

        // Mapeo de componentes a sus respectivos componentes BO
        const componentMap: { [key: string]: React.ReactNode } = {
          bannerAbout: <BannerAboutBO />,
          aboutUs: <About01BO />,
          marqueeTOP: <MarqueeTOP />,
          bannerPrincipal01: <BannerPrincipal01BO />,
          bannerPrincipal02: <BannerPrincipal02BO />,
          parallax: <ParallaxBO />,
          hero01: <Hero01BO />,
          hero02: <Hero02BO />,
          hero03: <Hero03BO />,
          hero04: <Hero04BO />,
          hero05: <Hero05BO />,
          hero06: <Hero06BO />,
          hero07: <Hero07BO />,
          hero08: <Hero08BO />,
          hero09: <Hero09BO />,
          galeria01: <GaleriaBO />,
          galeria02: <Galeria02BO />,
          servicios01: <Servicios01BO />,
          servicios02: <Servicios02BO />,
          servicios03: <Servicios03BO />,
          servicios04: <Servicios04BO />,
          logoscarrusel: <LogosCarruselBO />,
          logosfijos: <LogosFijosBO />,
          logosdinamicos: <LogosDinamicosBO />,
          testimonios01: <Testimonios01BO />,
          testimonios03: <Testimonios03BO />,
          testimonios04: <Testimonios04BO />,
          feedinstagram: <FeedInstagramBO />,
          categoria01: <Categoria01BO />,
          categoria02: <Categoria02BO />,
          categoria03: <Categoria03BO />,
          categoria04: <Categoria04BO />,
          categoria05: <Categoria05BO />,
          categoria06: <Categoria06BO />,
          categoria07: <Categoria07BO />,
          colecciones01: <Colecciones01BO />,
          colecciones02: <Colecciones02BO />,
          destacadosCat: <DestacadosCatBO />,
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
      <title>Content block - About</title>
      
      {/* Componentes ordenados */}
      {orderedComponents.map((section: any) => {
        // Verificar si el componente está compartido con Home
        const isHomeComponent = homeActiveComponents.includes(section.id);

        return (
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
                <div className="flex gap-2 items-center">
                  <div>{section.title}</div>
                </div>
                <div className="flex gap-2 items-center">
                  {isHomeComponent && (
                    <div className="relative group">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-normal break-words z-10 min-w-[200px] max-w-[320px]">
                        Al editar este componente aquí, también se editará en la pantalla de inicio
                        <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
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
            </div>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                openSections[section.id] ? "py-6 px-8" : "h-0 py-0 px-8"
              }`}
            >
              {section.component}
            </div>
          </div>
        );
      })}

      {/* Mensaje de restricción para usuarios sin plan Avanzado o Pro */}
      {!subscriptionLoading && !hasAdvancedOrProPlan && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-sm text-red-700">
                <p>La configuración de About Us es exclusiva del Plan Avanzado y Plan Pro. Puedes actualizar tu plan en la sección <a href="/dashboard/suscripciones/estado" rel="noopener noreferrer" className="underline">Suscripción.</a></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel de configuración con drag and drop */}
      <div className={`rounded-sm border w-full border-stroke bg-white shadow-default dark:border-black dark:bg-black mb-6 ${
        !hasAdvancedOrProPlan ? 'opacity-50 pointer-events-none' : ''
      }`}>
        <div className="p-6">
          {aboutConfig && (
            <AboutConfigManager
              availableComponents={availableComponents}
              config={aboutConfig}
              onConfigChange={handleConfigChange}
              onSave={saveAboutConfig}
              onReset={resetAboutConfig}
              loading={loading}
              homeActiveComponents={homeActiveComponents}
            />
          )}
        </div>
      </div>
    </section>
  );
}
