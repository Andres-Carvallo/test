/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
function ContentBienvenida() {
  const [loading, setLoading] = useState(false);
  const [bannerData, setBannerData] = useState<any | null>(null);

  const fetchBannerHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = "88097fde-c6cf-402a-b5a3-8d13e181d204";

      const productTypeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      const bannerImage = productTypeResponse.data.contentBlock;
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
    <section className="py-6">
      <div className=" text-[#333] p-8 font-[sans-serif]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl  font-extrabold relative after:absolute after:-bottom-5 after:h-1 after:w-1/2 after:bg-primary after:left-0 after:right-0 after:mx-auto after:rounded-full">
            {bannerData?.title}
          </h2>
          <div className="mt-12">
            <p className="text-base">{bannerData?.contentText}</p>
          </div>
        </div>
        <div className="flex max-w-[500px] mx-auto justify-between mt-12">
          <img
            src="/img/banners/icon_corazon.png"
            className="w-1/3"
            alt=""
          />
          <img
            src="/img/banners/icon-diosa.png"
            className="w-1/3"
            alt=""
          />
          <img
            src="/img/banners/icon-hechoamano.png"
            className="w-1/3"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}

export default ContentBienvenida;
