"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface BannerImage {
  mainImage: any;
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
}

interface BannerData {
  images: BannerImage[];
}

const BannerPrincipal01: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "left"
  );

  // Agregar constantes para valores por defecto
  const DEFAULT_TITLE = "Banner";
  const DEFAULT_BUTTON_LINK = "#";

  const fetchBannerHome = async () => {
    try {
      setLoading(true);
      const bannerId = `${process.env.NEXT_PUBLIC_BANNERPRINCIPAL01_ID}`;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      console.log("Datos del banner recibidos:", response.data.banner);
      setBannerData(response.data.banner);
    } catch (error) {
      console.error("Error al obtener los datos del banner:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerHome();
  }, []);

  useEffect(() => {
    if (bannerData && bannerData.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % bannerData.images.length;
          return nextIndex;
        });
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [bannerData]);

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
      };
    }
  };

  const updateDisplayConfig = async (
    landingText: string,
    updates: Partial<DisplayConfig>
  ) => {
    try {
      const currentConfig = parseDisplayConfig(landingText);
      const newConfig = { ...currentConfig, ...updates };
      const bannerId = `${process.env.NEXT_PUBLIC_BANNERPRINCIPAL01_ID}`;

      // Actualizar el banner en la base de datos
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          banner: {
            images: bannerData?.images.map((image, index) =>
              index === currentIndex
                ? { ...image, landingText: JSON.stringify(newConfig) }
                : image
            ),
          },
        }
      );

      // Actualizar el estado local
      if (bannerData) {
        setBannerData({
          ...bannerData,
          images: bannerData.images.map((image, index) =>
            index === currentIndex
              ? { ...image, landingText: JSON.stringify(newConfig) }
              : image
          ),
        });
      }
    } catch (error) {
      console.error("Error al actualizar la configuración:", error);
      // Aquí podrías agregar una notificación de error para el usuario
    }
  };

  const shouldShowOverlay = (image: BannerImage): boolean => {
    const config = parseDisplayConfig(image.landingText);
    const buttonData = parseButtonTextData(image.buttonText);

    // Solo mostrar overlay si hay elementos de texto o botones activos
    return Boolean(
      image.buttonLink !== DEFAULT_BUTTON_LINK || // Epígrafe activo
        image.title !== DEFAULT_TITLE || // Título activo
        (config.showText && config.text && config.text.trim() !== "") || // Texto descriptivo activo y con contenido
        (buttonData.show &&
          ((config.showPrice && buttonData.price) ||
            (config.showValue && buttonData.value))) || // Precios/valores activos y con contenido
        (config.showButton1 && config.button1Text) || // Botón 1 activo y con texto
        (config.showButton2 && config.button2Text) // Botón 2 activo y con texto
    );
  };

  if (loading) {
    return (
      <div
        role="status"
        className="w-full animate-pulse  rtl:space-x-reverse md:flex md:items-center"
      >
        <div className="flex items-center justify-center w-full h-96 bg-gray-300 rounded dark:bg-gray-700">
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!bannerData) {
    return (
      <div className="w-full text-center p-6">No banner data available</div>
    );
  }

  const currentImage = bannerData.images[currentIndex];
  const multipleImages = bannerData.images.length > 1;

  console.log("Link del botón Ver detalles:", currentImage.mainImageLink);

  return (
    <section className="relative h-[80vh] md:h-[80vh] overflow-hidden">
      {/* Contenedor de imágenes */}
      <div className="absolute inset-0 z-0">
        {bannerData.images.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0"
          >
            <img
              src={image.mainImage.url}
              alt={image.title !== DEFAULT_TITLE ? image.title : ""}
              className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
            {shouldShowOverlay(image) && index === currentIndex && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"
                style={{ pointerEvents: "none" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Contenido del banner */}
      <div className="relative h-full z-10">
        <div className="h-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col justify-center h-full max-w-2xl items-start text-left">
            {currentImage.buttonLink !== DEFAULT_BUTTON_LINK && (
              <span className="text-[#81C4BA] text-sm uppercase tracking-widest mb-4 drop-shadow-md">
                {currentImage.buttonLink}
              </span>
            )}

            {currentImage.title !== DEFAULT_TITLE && (
              <h2 className="text-5xl md:text-7xl text-white font-light mb-6 leading-tight drop-shadow-md">
                {currentImage.title}
              </h2>
            )}

            {/* Texto descriptivo */}
            {parseDisplayConfig(currentImage.landingText).showText &&
              parseDisplayConfig(currentImage.landingText).text && (
                <p className="text-white text-lg md:text-xl mb-8 leading-relaxed drop-shadow-md">
                  {parseDisplayConfig(currentImage.landingText).text}
                </p>
              )}

            {/* Precios y valores */}
            {parseButtonTextData(currentImage.buttonText).show &&
              (parseDisplayConfig(currentImage.landingText).showPrice ||
                parseDisplayConfig(currentImage.landingText).showValue) && (
                <div className="flex items-center gap-4 mb-8">
                  {parseDisplayConfig(currentImage.landingText).showPrice && (
                    <span className="bg-white/5 backdrop-blur-sm text-white px-4 py-2 rounded text-sm drop-shadow-md">
                      {parseButtonTextData(currentImage.buttonText).price}
                    </span>
                  )}
                  {parseDisplayConfig(currentImage.landingText).showValue && (
                    <span className="bg-white/5 backdrop-blur-sm text-white px-4 py-2 rounded text-sm drop-shadow-md">
                      {parseButtonTextData(currentImage.buttonText).value}
                    </span>
                  )}
                </div>
              )}

            {/* Botones */}
            <div className="flex flex-wrap gap-4 relative z-20">
              {(() => {
                const config = parseDisplayConfig(currentImage.landingText);
                return (
                  <>
                    {config.showButton1 && config.button1Text && (
                      <Link
                        href={config.button1Link}
                        target="_blank"
                        className="bg-primary/60  text-white px-8 py-4 rounded hover:bg-primary transition-all cursor-pointer drop-shadow-md"
                      >
                        {config.button1Text}
                      </Link>
                    )}
                    {config.showButton2 && config.button2Text && (
                      <Link
                        href={config.button2Link}
                        target="_blank"
                        className="relative inline-block bg-white/5 text-white border border-white/20 px-8 py-4 rounded hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer drop-shadow-md z-20"
                      >
                        {config.button2Text}
                      </Link>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      {bannerData.images.length > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center z-30 pointer-events-none">
          <button
            onClick={handlePrev}
            className="pointer-events-auto ml-4 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto mr-4 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default BannerPrincipal01;
