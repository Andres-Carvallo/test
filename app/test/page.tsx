"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Marquee from "react-fast-marquee";
import { getCookie } from "cookies-next";

function MarqueeTOP() {
  const [loading, setLoading] = useState(false);
  const [bannerData, setBannerData] = useState<any | null>(null);
  const [bannerData2, setBannerData2] = useState<any | null>(null);

  const fetchMarqueeHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = "40d4f2f0-581f-4a79-b2c4-aa1eb01031d5";
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
      const productTypeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${bannerId}?siteId=${siteId}`
      );
      const bannerImage = productTypeResponse.data.contentBlock;
      console.log(productTypeResponse.data.contentBlock, "bannerdata");
      setBannerData(bannerImage);
    } catch (error) {
      console.error("Error al obtener maruqetop:", error);
      // Manejar el error según sea necesario
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };
  const fetchMarquee = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = "40d4f2f0-581f-4a79-b2c4-aa1eb01031d5";
      const Token = getCookie("AdminTokenAuth");
      const productTypeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${bannerId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const bannerImage = productTypeResponse.data.contentBlock;
      console.log(productTypeResponse.data.contentBlock, "bannerdata2");
      setBannerData2(bannerImage);
    } catch (error) {
      console.error("Error al obtener los tipos de producto:", error);
      // Manejar el error según sea necesario
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  useEffect(() => {
    fetchMarqueeHome();
    fetchMarquee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Debería ejecutarse solo en el montaje inicial
  return (
    <section>
      <div className="flex items-center max-md:flex-col bg-primary font-medium text-white px-6 py-2 font-sans uppercase">
        <div className="max-md:mt-4">
          <h3 className="bg-white text-blue-500 font-semibold py-2 px-4 rounded text-sm hover:bg-slate-100 mx-6">
            {bannerData?.title}
          </h3>{" "}
        </div>
        <p className="text-base flex-1">
          <Marquee>{bannerData?.contentText}</Marquee>
        </p>
      </div>
      <div className="flex items-center max-md:flex-col bg-primary font-medium text-white px-6 py-2 font-sans uppercase">
        <div className="max-md:mt-4">
          <h3 className="bg-white text-blue-500 font-semibold py-2 px-4 rounded text-sm hover:bg-slate-100 mx-6">
            {bannerData?.title}
          </h3>{" "}
        </div>
        <p className="text-base flex-1">
          <Marquee>{bannerData2?.contentText}</Marquee>
        </p>
      </div>
    </section>
  );
}

export default MarqueeTOP;
