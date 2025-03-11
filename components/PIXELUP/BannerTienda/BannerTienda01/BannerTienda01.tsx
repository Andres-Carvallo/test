"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";

const BannerPrincipal = () => {
  const [bannerData, setBannerData] = useState<any | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para almacenar la configuración extraída del JSON
  const [config, setConfig] = useState({
    showTitle: true,
    showLandingText: true,
    showButton: true,
    textAlignment: "center",
    textContent: "",
  });

  // Estilos para la sombra del texto
  const shadowTextStyle = {
    textShadow: "0px 0px 8px rgba(0, 0, 0, 0.8)",
  };

  const fetchBannerHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = `${process.env.NEXT_PUBLIC_BANNER_TIENDA_ID}`;
      const bannerImageId = `${process.env.NEXT_PUBLIC_BANNER_TIENDA_IMGID}`;

      // Usar fetch en lugar de axios con cache: 'no-store' y next: { revalidate: 0 }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, "respuesta de la API");

      // Verificar que la respuesta tenga la estructura esperada
      if (!data.banner || !data.banner.images || !data.banner.images.length) {
        throw new Error("La estructura de datos del banner no es válida");
      }

      const bannerImage = data.banner;
      const bannerImageData = bannerImage.images[0]; // Acceder a la primera imagen del array

      setBannerData(bannerImage);

      // Intentar extraer la configuración del JSON en landingText del banner base
      let extractedConfig = {
        showTitle: true,
        showLandingText: true,
        showButton: true,
        textAlignment: "center",
        textContent: bannerImageData.landingText || "", // El contenido del texto está en la imagen
      };

      try {
        // Verificar si landingText del banner base contiene un JSON válido
        if (
          bannerImage.landingText &&
          bannerImage.landingText.trim().startsWith("{")
        ) {
          const parsedConfig = JSON.parse(bannerImage.landingText);
          if (parsedConfig && typeof parsedConfig === "object") {
            // Mantener el contenido del texto de la imagen
            extractedConfig = {
              ...extractedConfig,
              ...parsedConfig,
              textContent:
                bannerImageData.landingText || parsedConfig.textContent || "",
            };
          }
        } else {
          // Si no es un JSON, usamos el texto de la imagen como contenido
          extractedConfig.textContent = bannerImageData.landingText || "";
        }
      } catch (error) {
        console.error("Error al parsear la configuración JSON:", error);
        // Si hay un error al parsear, usamos el texto de la imagen como contenido
        extractedConfig.textContent = bannerImageData.landingText || "";
      }

      // Actualizar el estado de configuración
      setConfig(extractedConfig);
    } catch (error) {
      console.error("Error al obtener los datos del banner:", error);
      // Manejar el error según sea necesario
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  useEffect(() => {
    fetchBannerHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Debería ejecutarse solo en el montaje inicial

  return (
    <section
      id="banner"
      className="w-full z-10"
    >
      {loading ? (
        <section
          id="banner"
          className="w-full z-10 animate-pulse"
        >
          <div className="relative font-[sans-serif] before:absolute before:w-full before:h-full before:inset-0 before:bg-gray-300 before:opacity-50 before:z-10">
            <div className="absolute inset-0 w-full h-full bg-gray-200"></div>
            <div className="min-h-[200px] relative z-10 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </section>
      ) : (
        bannerData && (
          <>
            {/* Versión de escritorio */}
            <div className="hidden relative lg:flex items-start justify-center w-full overflow-hidden">
              <img
                src={bannerData.images[0].mainImage.url}
                alt="Banner Image"
                className="w-full h-auto object-contain transition-opacity duration-1000 ease-in-out"
              />

              {/* Contenido superpuesto */}
              <div
                className={`absolute inset-0 flex flex-col justify-center p-6 max-w-6xl mx-auto w-full`}
              >
                <div className={`w-full text-${config.textAlignment}`}>
                  {config.showTitle && bannerData.images[0].title && (
                    <h2
                      className="text-3xl md:text-4xl font-bold text-white mb-4"
                      style={shadowTextStyle}
                    >
                      {bannerData.images[0].title}
                    </h2>
                  )}

                  {config.showLandingText && config.textContent && (
                    <div
                      className="text-lg md:text-xl text-white mb-6"
                      style={shadowTextStyle}
                      dangerouslySetInnerHTML={{ __html: config.textContent }}
                    />
                  )}

                  {config.showButton && bannerData.images[0].buttonText && (
                    <div className={`text-${config.textAlignment}`}>
                      <a
                        href={bannerData.images[0].buttonLink || "#"}
                        className="inline-block bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                      >
                        {bannerData.images[0].buttonText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Versión móvil y tablet */}
            <div className="lg:hidden relative flex items-start justify-center w-full overflow-hidden">
              <img
                src={
                  bannerData.images[0].mobileImage?.url ||
                  bannerData.images[0].mainImage.url
                }
                alt="Banner Image Mobile"
                className="w-full h-auto object-contain transition-opacity duration-1000 ease-in-out"
              />

              {/* Contenido superpuesto para móvil */}
              <div
                className={`absolute inset-0 flex flex-col justify-center p-4 w-full`}
              >
                <div className={`w-full text-${config.textAlignment}`}>
                  {config.showTitle && bannerData.images[0].title && (
                    <h2
                      className="text-2xl font-bold text-white mb-2"
                      style={shadowTextStyle}
                    >
                      {bannerData.images[0].title}
                    </h2>
                  )}

                  {config.showLandingText && config.textContent && (
                    <div
                      className="text-sm text-white mb-4"
                      style={shadowTextStyle}
                      dangerouslySetInnerHTML={{ __html: config.textContent }}
                    />
                  )}

                  {config.showButton && bannerData.images[0].buttonText && (
                    <div className={`text-${config.textAlignment}`}>
                      <a
                        href={bannerData.images[0].buttonLink || "#"}
                        className="inline-block bg-white text-primary px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-100 transition-colors"
                      >
                        {bannerData.images[0].buttonText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )
      )}
    </section>
  );
};

export default BannerPrincipal;
