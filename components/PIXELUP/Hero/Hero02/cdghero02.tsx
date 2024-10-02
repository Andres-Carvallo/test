"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Hero02Props {
  Hero02Data: {
    titulo: string;
    subtitulo: string;
    parrafo: string;
    img: string;
  };
}

interface BannerImage {
  mainImage: any;
  url: string;
  title: string;
  landingText: string;
  buttonLink: string;
  buttonText: string;
}

interface BannerData {
  images: BannerImage[];
}
 
const Hero02: React.FC<Hero02Props> = ({ Hero02Data }) => {
  const { titulo, subtitulo, parrafo, img } = Hero02Data;
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBannerHome = async () => {
    try {
      setLoading(true);
      const bannerId = `${process.env.NEXT_PUBLIC_HERO02_ID}`;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

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

  if (loading) {
    return <div className="w-full text-center p-6">Loading...</div>;
  }

  if (!bannerData) {
    return (
      <div className="w-full text-center p-6">No banner data available</div>
    );
  }

  const currentImage = bannerData.images[0];
  return (
<div className="container mx-auto max-w-7xl relative">
  <div className=" lg:px-0 mt-24 flex justify-center">
    <div
      className="relative w-full h-[600px] bg-cover bg-center"
      style={{ borderRadius: "var(--radius)" }}
    >
      <img
        src={currentImage.mainImage.url}
        alt="FBM Joyas"
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
      />
      <div className="absolute top-1/2 left-1/2 lg:left-[24%] transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-75 p-4 md:p-8 rounded-lg shadow-lg max-w-lg text-gray-800 w-[90%] md:w-full">
        <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">{currentImage.title}</h2>
        <div
          className="mb-2 md:mb-4 editortexto"
          dangerouslySetInnerHTML={{ __html: currentImage.landingText }}
        />
        <a
          href={currentImage.buttonLink}
          className="text-blue-500 hover:underline text-right"
        >
          {currentImage.buttonText}
        </a>
      </div>
    </div>
  </div>
</div>

  );
};

export default Hero02;
