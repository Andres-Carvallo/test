"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { globalConfig } from "@/app/config/GlobalConfig";
import { 
  PIXELUPComponents, 
  getPIXELUPComponentId,
  getPIXELUPComponentDefaultData,
  isBannerComponent 
} from "@/config/componentEnums";
import { usePIXELUPComponent } from "@/hooks/useComponentEnums";

interface BannerImage {
  mainImage: any;
  mobileImage?: any;
  url: string;
  title: string;
  landingText: string;
  buttonLink: string;
  buttonText: string;
  mainImageLink: string;
}

interface ButtonTextData {
  price: string;
  value: string;
  show: boolean;
}

interface DisplayConfig {
  text: string;
  showText: boolean;
  showPrice: boolean;
  showValue: boolean;
  showButton1: boolean;
  showButton2: boolean;
  button1Text: string;
  button2Text: string;
  button1Link: string;
  button2Link: string;
  contentAlignment: "left" | "center" | "right";
  fullBannerLink: boolean;
  fullBannerLinkUrl: string;
  baseTypography: string;
  titleTypography: string;
}

interface BannerData {
  images: BannerImage[];
}

const BannerPrincipal01: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "left"
  );

  // Usar el hook del sistema de enums
  const componentData = usePIXELUPComponent(PIXELUPComponents.BANNER_PRINCIPAL_01);
  
  // Obtener los aspectos de las imágenes desde la configuración global
  const desktopAspect = globalConfig.bannerPrincipalAspects.desktop;
  const mobileAspect = globalConfig.bannerPrincipalAspects.mobile;
  const tabletAspect = globalConfig.bannerPrincipalAspects.tablet;

  // Agregar constantes para valores por defecto
  const DEFAULT_TITLE = "Banner";
  const DEFAULT_BUTTON_LINK = "#";

  // Detectar el tipo de dispositivo con debounce para mejor rendimiento
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 850);
      setIsTablet(width > 850 && width <= 1560);
    };

    // Función con debounce para evitar múltiples actualizaciones
    let timeoutId: NodeJS.Timeout;
    const debouncedCheckDevice = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDeviceType, 100);
    };

    // Verificar inmediatamente al cargar
    checkDeviceType();

    // Agregar listener con debounce
    window.addEventListener("resize", debouncedCheckDevice);

    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedCheckDevice);
      clearTimeout(timeoutId);
    };
  }, []);

  // Precargar imágenes
  useEffect(() => {
    if (bannerData?.images) {
      bannerData.images.forEach((image) => {
        if (image.mainImage?.url) {
          const img = new Image();
          img.src = image.mainImage.url;
        }
      });
    }
  }, [bannerData]);

  const fetchBannerHome = async () => {
    try {
      setLoading(true);
      
      // Usar el ID del sistema de enums en lugar de la variable de entorno
      const bannerId = componentData.id;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      
      // Si no hay datos del banner, usar los datos por defecto del enum
      if (!response.data.banner || !response.data.banner.images || response.data.banner.images.length === 0) {
        console.log("No se encontraron datos del banner, usando datos por defecto del enum");
        
        // Crear un banner por defecto usando los datos del enum
        const defaultBannerData: BannerData = {
          images: [{
            mainImage: {
              url: componentData.defaultData.mainImageLink,
              width: 1920,
              height: 600
            },
            title: componentData.defaultData.title,
            landingText: componentData.defaultData.landingText,
            buttonLink: componentData.defaultData.buttonLink,
            buttonText: componentData.defaultData.buttonText,
            mainImageLink: componentData.defaultData.mainImageLink
          }]
        };
        
        setBannerData(defaultBannerData);
      } else {
        setBannerData(response.data.banner);
      }
    } catch (error) {
      console.error("Error al obtener los datos del banner:", error);
      
      // En caso de error, usar los datos por defecto del enum
      console.log("Usando datos por defecto del enum debido al error");
      const defaultBannerData: BannerData = {
        images: [{
          mainImage: {
            url: componentData.defaultData.mainImageLink,
            width: 1920,
            height: 600
          },
          title: componentData.defaultData.title,
          landingText: componentData.defaultData.landingText,
          buttonLink: componentData.defaultData.buttonLink,
          buttonText: componentData.defaultData.buttonText,
          mainImageLink: componentData.defaultData.mainImageLink
        }]
      };
      
      setBannerData(defaultBannerData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerHome();
  }, [componentData.id]); // Dependencia del ID del componente

  useEffect(() => {
    if (bannerData && bannerData.images.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % bannerData.images.length;
          return nextIndex;
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [bannerData, isPaused]);

  const handlePrev = () => {
    if (!bannerData) return;
    const prevIndex =
      (currentIndex - 1 + bannerData.images.length) % bannerData.images.length;
    setCurrentIndex(prevIndex);
  };

  const handleNext = () => {
    if (!bannerData) return;
    const nextIndex = (currentIndex + 1) % bannerData.images.length;
    setCurrentIndex(nextIndex);
  };

  const handleAlignmentChange = (alignment: "left" | "center" | "right") => {
    setTextAlign(alignment);
  };

  const parseButtonTextData = (buttonText: string): ButtonTextData => {
    try {
      const parsed = JSON.parse(buttonText);
      return {
        price: parsed.price || "",
        value: parsed.value || "",
        show: parsed.show ?? true,
      };
    } catch {
      return { price: buttonText, value: "", show: true };
    }
  };

  const parseDisplayConfig = (landingText: string): DisplayConfig => {
    try {
      if (typeof landingText === "string") {
        let parsed = JSON.parse(landingText);

        if (typeof parsed.text === "string" && parsed.text.startsWith("{")) {
          const nestedParsed = JSON.parse(parsed.text);
          parsed = {
            ...parsed,
            text: nestedParsed.text || "",
          };
        }

        return {
          text: parsed.text || "",
          showText: parsed.showText ?? false,
          showPrice: parsed.showPrice ?? false,
          showValue: parsed.showValue ?? false,
          showButton1: parsed.showButton1 ?? false,
          showButton2: parsed.showButton2 ?? false,
          button1Text: parsed.button1Text || "Botón 1",
          button2Text: parsed.button2Text || "Botón 2",
          button1Link: parsed.button1Link || "#",
          button2Link: parsed.button2Link || "#",
          contentAlignment: parsed.contentAlignment || "left",
          fullBannerLink: parsed.fullBannerLink ?? false,
          fullBannerLinkUrl: parsed.fullBannerLinkUrl || "#",
          baseTypography: parsed.baseTypography || "montserrat",
          titleTypography: parsed.titleTypography || "montserrat",
        };
      }
      return {
        text: landingText,
        showText: false,
        showPrice: false,
        showValue: false,
        showButton1: false,
        showButton2: false,
        button1Text: "Botón 1",
        button2Text: "Botón 2",
        button1Link: "#",
        button2Link: "#",
        contentAlignment: "left",
        fullBannerLink: false,
        fullBannerLinkUrl: "#",
        baseTypography: "montserrat",
        titleTypography: "montserrat",
      };
    } catch {
      return {
        text: landingText,
        showText: false,
        showPrice: false,
        showValue: false,
        showButton1: false,
        showButton2: false,
        button1Text: "Botón 1",
        button2Text: "Botón 2",
        button1Link: "#",
        button2Link: "#",
        contentAlignment: "left",
        fullBannerLink: false,
        fullBannerLinkUrl: "#",
        baseTypography: "montserrat",
        titleTypography: "montserrat",
      };
    }
  };

  if (loading) {
    return (
      <div className="relative w-full bg-gray-200 animate-pulse">
        <div
          className="w-full"
          style={{
            aspectRatio: isMobile
              ? mobileAspect
              : isTablet
              ? tabletAspect
              : desktopAspect,
          }}
        />
      </div>
    );
  }

  if (!bannerData || !bannerData.images || bannerData.images.length === 0) {
    return (
      <div className="relative w-full bg-gray-200">
        <div
          className="w-full flex items-center justify-center text-gray-500"
          style={{
            aspectRatio: isMobile
              ? mobileAspect
              : isTablet
              ? tabletAspect
              : desktopAspect,
          }}
        >
          <p>No hay datos de banner disponibles</p>
        </div>
      </div>
    );
  }

  const currentImage = bannerData.images[currentIndex];
  const buttonTextData = parseButtonTextData(currentImage.buttonText);
  const displayConfig = parseDisplayConfig(currentImage.landingText);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Banner Principal */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: isMobile
            ? mobileAspect
            : isTablet
            ? tabletAspect
            : desktopAspect,
        }}
      >
        {/* Imagen de fondo */}
        <img
          src={currentImage.mainImage?.url || currentImage.mainImageLink}
          alt={currentImage.title || DEFAULT_TITLE}
          className="w-full h-full object-cover"
          onLoad={() => setLoading(false)}
        />

        {/* Overlay de contenido */}
        <div className="absolute inset-0 bg-black bg-opacity-30" />

        {/* Contenido del banner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {currentImage.title || DEFAULT_TITLE}
            </h1>
            <p className="text-lg md:text-xl mb-6">
              {displayConfig.text || currentImage.landingText}
            </p>
            <Link
              href={currentImage.buttonLink || DEFAULT_BUTTON_LINK}
              className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {currentImage.buttonText || "Ver más"}
            </Link>
          </div>
        </div>

        {/* Controles de navegación */}
        {bannerData.images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {bannerData.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-white"
                      : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Información de debug (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm max-w-xs">
          <p><strong>Componente:</strong> {PIXELUPComponents.BANNER_PRINCIPAL_01}</p>
          <p><strong>ID:</strong> {componentData.id}</p>
          <p><strong>Tipo:</strong> {componentData.type}</p>
          <p><strong>Total imágenes:</strong> {bannerData.images.length}</p>
        </div>
      )}
    </div>
  );
};

export default BannerPrincipal01;
