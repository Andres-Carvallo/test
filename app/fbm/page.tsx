"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import BannerAbout02 from "@/components/PIXELUP/BannerAbout/BannerAbout02/BannerAbout02";

function FBM() {
  const [bannerData, setBannerData] = useState<any | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBannerHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = "c058147c-ee25-4ad5-bd6c-a1efa98dfe68";
      const bannerImageId = "89d04074-2fc4-4f1f-a55b-eab6f990b282";

      const productTypeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      const bannerImage = productTypeResponse.data.banner;
      setBannerData(bannerImage);
    } catch (error) {
      console.error("Error al obtener los tipos de producto:", error);
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
    <div>
      <div>
        {" "}
        <BannerAbout02 />
      </div>
      <div>
        <section id="banner" className="w-full z-10">
          {loading ? (
            <section id="banner" className="w-full z-10 animate-pulse">
              <div className="relative font-[sans-serif] before:absolute before:w-full before:h-full before:inset-0 before:bg-gray-300 before:opacity-50 before:z-10">
                <div className="absolute inset-0 w-full h-full bg-gray-200"></div>
                <div className="min-h-[300px] relative z-10 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
                  <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </section>
          ) : (
            bannerData && (
              <div className="max-w-6xl mx-auto w-full px-4 md:px-0 py-12 md:py-24 flex flex-col md:flex-row items-center justify-center">
                {/* Contenedor de imagen con centrado completo en dispositivos móviles */}
                <div className="flex w-full md:flex-1 items-center justify-center mb-6 md:mb-0">
                  <img
                    alt={bannerData.images[0].title}
                    className="object-cover shadow-lg rounded-lg w-96"
                    src={bannerData.images[0].mainImage.url}
                  />
                </div>
                {/* Contenedor de texto centrado completamente en dispositivos móviles */}
                <div className="w-full md:flex-1 flex flex-col items-center text-center md:items-start md:text-left">
                  {/* <h4 className="text-primary text-lg md:text-xl mt-6 md:mt-0">{subtitulo}</h4> */}
                  <h1 className="mt-2 text-3xl md:text-5xl font-bold leading-tight text-foreground">
                    {bannerData.images[0].title}
                  </h1>
                  <p className="text-base md:text-lg text-foreground py-3"
                    dangerouslySetInnerHTML={{ __html: bannerData.images[0].landingText }}

                  />
                </div>
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
}

export default FBM;
