"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const BannerPrincipal = () => {
  const [bannerData, setBannerData] = useState<any | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBannerHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = process.env.NEXT_PUBLIC_BANNER_ABOUT_ID;
      const bannerImageId = process.env.NEXT_PUBLIC_BANNER_ABOUT_IMGID;

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
    <section
      id="banner"
      className="w-full z-10"
    >
      {loading ? (
        <section
          id="banner"
          className="w-full z-10 animate-pulse"
        >
          <div className="relative font-[sans-serif] before:absolute before:w-full before:h-full before:inset-0 before:bg-gray-300 before:opacity-00 before:z-10">
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
          <div className="hidden relative lg:flex items-start justify-center w-full overflow-hidden">
            <img
              src={bannerData.images[0].mainImage.url}
              alt={bannerData.images[0].title}
              className="w-full h-auto object-contain transition-opacity duration-1000 ease-in-out"
            />
          </div>
        )
      )}
    </section>
  );
};

export default BannerPrincipal;
