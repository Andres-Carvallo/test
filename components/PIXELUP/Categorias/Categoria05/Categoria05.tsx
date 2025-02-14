"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const Categoria05 = () => {
  const [bannerData, setBannerData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const defaultImage = "/img/placeholder.webp";
  
  const getDefaultBanner = (banner: any) => {
    return banner || {
      mainImage: { url: defaultImage },
      title: "Titulo por defecto",
      description: "Descripción no disponible",
      buttonLink: "#",
    };
  };

  const fetchBannerCategoryHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = `${process.env.NEXT_PUBLIC_CATEGORIA05_ID}`;

      const BannersCategory = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      const bannerImages = BannersCategory.data.banner.images;
      const sortedBannerImages = bannerImages.sort(
        (a: any, b: any) => a.orderNumber - b.orderNumber
      );
      setBannerData(sortedBannerImages);
    } catch (error) {
      console.error("Error al obtener los tipos de producto:", error);
      // Manejar el error según sea necesario
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  useEffect(() => {
    fetchBannerCategoryHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Debería ejecutarse solo en el montaje inicial

  return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <h1 className="text-2xl font-bold text-center my-6 text-foreground">
        Nuestras Categorías
      </h1>

      <div className="flex flex-wrap -mx-4 text-center">
        {bannerData?.map((banner: any, index: number) => (
          <div key={index} className="w-full sm:w-1/3 p-4 flex flex-col items-center">
            <img 
              src={getDefaultBanner(banner).mainImage.url} 
              alt={getDefaultBanner(banner).title} 
              className="w-full h-[460px] object-cover rounded-lg shadow-md" 
              style={{ borderRadius: 'var(--radius)' }}
            />
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-foreground">
                {getDefaultBanner(banner).title}
              </h2>
              <Link 
                href={getDefaultBanner(banner).buttonLink} 
                className="flex items-center justify-center text-primary hover:text-secondary transition duration-300 ease-in-out"
              >
                Ver más
                <svg className="ml-2 w-4 h-4 fill-current" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L8.293 9H1.5a.5.5 0 0 1 0-1h6.793L4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-foreground bg-secondary hover:bg-primary shadow-sm transition duration-300 ease-in-out">
          Ver todas las categorías
        </button>
      </div>
    </div>
  );
};

export default Categoria05;

