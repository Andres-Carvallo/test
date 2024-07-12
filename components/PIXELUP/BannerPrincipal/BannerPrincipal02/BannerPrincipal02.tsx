"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";

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

const BannerPrincipal01: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBannerHome = async () => {
    try {
      setLoading(true);
      const bannerId = "900a5ae4-8224-4758-84a4-c7f728d73f38";

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      console.log(response.data.banner, "banner xxxx");
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

  useEffect(() => {
    if (bannerData && bannerData.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % bannerData.images.length
        );
      }, 8000); // Aumenta el tiempo del intervalo a 5000ms (5 segundos)
      return () => clearInterval(interval);
    }
  }, [bannerData]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? (bannerData?.images.length ?? 0) - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === (bannerData?.images.length ?? 0) - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return <div className="w-full text-center p-6">Loading...</div>;
  }

  if (!bannerData) {
    return (
      <div className="w-full text-center p-6">No banner data available</div>
    );
  }

  const currentImage = bannerData.images[currentIndex];
  const multipleImages = bannerData.images.length > 1;

  return (
    <section
      id="banner"
      className="w-full"
    >
      <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:z-10">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {bannerData.images.map((image, index) => (
            <img
              key={index}
              src={image.mainImage.url}
              alt={image.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className=" min-h-[400px] relative z-10 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
          {/*           <h2 className="text-2xl font-semibold mb-2 uppercase">
            {currentImage.title}
          </h2>
          <p className="text-md text-center text-gray-200">
            {currentImage.landingText}
          </p>
          <a
            href={currentImage.buttonLink}
            className="mt-8 bg-dark bg-primary text-secondary hover:text-primary text-base font-semibold py-2.5 px-6 rounded hover:bg-secondary"
          >
            {currentImage.buttonText}
          </a> */}
        </div>
        {multipleImages && (
          <>
            <button
              className="absolute left-4 top-1/2 transform cursor-pointer z-10 -translate-y-1/2 rounded text-white bg-opacity-50 p-2"
              onClick={handlePrev}
            >
              &#10094;
            </button>
            <button
              className="absolute right-4 top-1/2 transform cursor-pointer z-10 -translate-y-1/2 text-white rounded bg-opacity-50 p-2"
              onClick={handleNext}
            >
              &#10095;
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {bannerData.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BannerPrincipal01;
