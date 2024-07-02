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
      const bannerId = "24eed87b-2b78-4922-836a-9d860f878350";

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
    <div>
      <div className="px-6 lg:px-0 mt-24 flex justify-center">
        <div
          className="relative w-full max-w-6xl h-[500px] bg-cover bg-center"
          style={{ borderRadius: "var(--radius)" }}
        >
          <img
            src={currentImage.mainImage.url}
            alt="FBM Joyas"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
          <div className="absolute top-1/2 left-[24%] transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-75 p-8 rounded-lg shadow-lg max-w-lg text-gray-800">
            <h2 className="text-2xl font-bold mb-4">{currentImage.title}</h2>
            <div
              className="mb-4 editortexto"
              dangerouslySetInnerHTML={{ __html: currentImage.landingText }}
            />
            {/*                     <p className="mb-4">{currentImage.buttonLink}</p>
             */}{" "}
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
