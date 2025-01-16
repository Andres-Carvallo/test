/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBannerData } from "@/lib/api";
import { BannerData } from "../types";

const BannerPrincipal02Content: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const hasMultipleImages = bannerData?.images && bannerData.images.length > 1;

  const handlePrev = () => {
    if (!bannerData) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bannerData.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (!bannerData) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === bannerData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getBannerData(
          process.env.NEXT_PUBLIC_BANNERPRINCIPAL02_ID ?? ""
        );
        setBannerData(data);
      } catch (err) {
        setError("Error al cargar el banner");
        console.error(err);
      }
    };
    fetchBanner();
  }, []);

  useEffect(() => {
    if (bannerData && bannerData.images.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [bannerData]);

  if (error) {
    return <div className="w-full text-center p-6 text-red-500">{error}</div>;
  }

  if (!bannerData?.images) {
    return null;
  }

  return (
    <section
      id="banner"
      className="relative w-full h-[450px]"
      aria-label="Banner principal"
    >
      <div className="relative w-full h-full">
        <Link
          href={bannerData.images[currentIndex].buttonLink || "#"}
          /* target="_blank" */
          rel="noopener noreferrer"
          aria-label={bannerData.images[currentIndex].title}
          className="block w-full h-full"
        >
          {bannerData.images.map((image, index) => (
            <img
              key={index}
              src={image.mainImage.url}
              alt={image.title}
              className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ position: index === currentIndex ? 'relative' : 'absolute', top: 0, left: 0 }}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </Link>
      </div>

      {/* Controles de carrusel */}
      {bannerData && bannerData.images.length > 1 && (
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center">
          <button 
            onClick={handlePrev}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={handleNext}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Indicadores de slide */}
      {bannerData && bannerData.images.length > 1 && (
        <div className="absolute bottom-8 inset-x-0">
          <div className="flex justify-center gap-2">
            {bannerData.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded transition-colors ${
                  index === currentIndex 
                    ? "w-16 bg-white" 
                    : "w-8 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default BannerPrincipal02Content;
