"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";

const BannerPrincipal = () => {
  const [bannerData, setBannerData] = useState<any | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const fetchBannerHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = "d24e992c-ac47-44f0-a9e6-fa5b6b8f7bfc";
      const bannerImageId = "e38d6684-20c2-4a08-a46d-4a45306cacad";

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
      className="w-full"
    >
      {bannerData && (
        <div className="relative font-sans  before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-30 before:z-10">
          <img
            src={bannerData.images[0].mainImage.url}
            alt="Banner Image"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="min-h-[300px] relative z-10 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
            <h2 className=" text-2xl font-semibold mb-2 uppercase">
              {bannerData.images[0].title}
            </h2>
            <p className="text-md text-center text-gray-200">
              {bannerData.images[0].landingText}
            </p>
            <a
              href={bannerData.images[0].buttonLink}
              className="mt-8 bg-dark bg-primary text-secondary hover:text-primary text-base font-semibold py-2.5 px-6  rounded hover:bg-secondary"
              >
              {bannerData.images[0].buttonText}
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default BannerPrincipal;
