"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Marquee from "react-fast-marquee";

function MarqueeTOP() {
  const [loading, setLoading] = useState(false);
  const [bannerData, setBannerData] = useState<any | null>(null);

  const fetchBannerHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = "3ceacd14-be7c-4342-a129-0bde85115cd1";

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
    <section>
      <div className="flex items-center max-md:flex-col bg-primary font-medium text-white px-6 py-2 font-sans uppercase">
        {/*  <div className="max-md:mt-4">
          <h3 className="bg-white text-blue-500 font-semibold py-2 px-4 rounded text-sm hover:bg-slate-100 mx-6">
            {bannerData?.title}
          </h3>
        </div>*/}
        <p className="text-base flex-1">
          <Marquee>{bannerData?.contentText}</Marquee>
        </p>
      </div>
    </section>
  );
}

export default MarqueeTOP;
