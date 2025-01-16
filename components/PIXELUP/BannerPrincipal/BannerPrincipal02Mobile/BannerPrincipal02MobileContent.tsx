/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBannerData } from "@/lib/api";
import { BannerData } from "../types";

const BannerPrincipal02MobileContent: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const hasMultipleImages = bannerData?.images && bannerData.images.length > 1;

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getBannerData(
          process.env.NEXT_PUBLIC_BANNERPRINCIPAL02MOBILE_ID ?? ""
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
    if (hasMultipleImages) {
      const interval = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % bannerData!.images.length
        );
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [bannerData, hasMultipleImages]);

  if (error) {
    return <div className="w-full text-center p-6 text-red-500">{error}</div>;
  }

  if (!bannerData?.images) {
    return null;
  }

  return (
    <section
      id="banner-mobile"
      className="relative w-full overflow-hidden"
      aria-label="Banner principal móvil"
    >
      <div className="relative w-full">
        {bannerData.images.map((image, index) => (
          <div
            key={index}
            className={`transition-opacity duration-1000 ease-in-out ${
              index === currentIndex
                ? "opacity-100 relative"
                : "opacity-0 absolute inset-0"
            }`}
          >
            <Link
              href={image.buttonLink || "#"}
              /* target="_blank" */
              rel="noopener noreferrer"
              aria-label={image.title}
            >
              <img
                src={image.mainImage.url}
                alt={image.title}
                width={768}
                height={500}
                className="w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </Link>
          </div>
        ))}
      </div>

      {hasMultipleImages && (
        <>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black/50 p-2 rounded"
            onClick={() => {
              if (!bannerData?.images) return;
              setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? bannerData.images.length - 1 : prevIndex - 1
              );
            }}
            aria-label="Imagen anterior"
          >
            &#10094;
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black/50 p-2 rounded"
            onClick={() => {
              if (!bannerData?.images) return;
              setCurrentIndex((prevIndex) =>
                prevIndex === bannerData.images.length - 1 ? 0 : prevIndex + 1
              );
            }}
            aria-label="Siguiente imagen"
          >
            &#10095;
          </button>
        </>
      )}
    </section>
  );
};

export default BannerPrincipal02MobileContent;
