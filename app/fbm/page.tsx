/* eslint-disable @next/next/no-img-element */
"use client";

import BannerTienda from "../dashboard/tienda/page";
import BannerAbout01 from "@/components/PIXELUP/BannerAbout/BannerAbout01/BannerAbout01";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Marquee from "react-fast-marquee";
import { getCookie } from "cookies-next";

function FBM() {
  const [loading, setLoading] = useState(false);
  const [bannerData, setBannerData] = useState<any | null>(null);

  const fetchMarqueeHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = `${process.env.NEXT_PUBLIC_CONTENT_ABOUT_ID}`;
      const productTypeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      const bannerImage = productTypeResponse.data.contentBlock;
      setBannerData(bannerImage);
    } catch (error) {
      console.error("Error al obtener maruqetop:", error);
      // Manejar el error según sea necesario
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  useEffect(() => {
    fetchMarqueeHome();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Debería ejecutarse solo en el montaje inicial

  return (
    <div className="">
      <BannerAbout01 />
      <div className="bg-white min-h-[475px] text-[#333] font-[sans-serif] pt-16 pb-32">
        <div className=" justify-center items-center text-center gap-8">
          <div className="max-w-4xl mx-auto p-4 ">
            <h2 className="text-3xl md:text-3xl font-extrabold my-6 uppercase">
              {bannerData?.title}
            </h2>
            <p
              className="text-base"
              dangerouslySetInnerHTML={{ __html: bannerData?.contentText }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FBM;
