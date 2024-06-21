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

const BannerPrincipal: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBannerHome = async () => {
    try {
      setLoading(true);
      const bannerId = "d24e992c-ac47-44f0-a9e6-fa5b6b8f7bfc";

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

  useEffect(() => {
    if (bannerData && bannerData.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % bannerData.images.length
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [bannerData]);

  if (loading) {
    return <div className="w-full text-center p-6">Loading...</div>;
  }

  if (!bannerData) {
    return (
      <div className="w-full text-center p-6">No banner data available</div>
    );
  }

  const currentImage = bannerData.images[currentIndex];

  return (
    <section
      id="banner"
      className="w-full"
    >
      <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-30 before:z-10">
        <img
          src={currentImage.mainImage.url}
          alt={currentImage.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="min-h-[300px] relative z-10 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
          <h2 className="text-2xl font-semibold mb-2 uppercase">
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
          </a>
        </div>
      </div>
    </section>
  );
};

export default BannerPrincipal;
