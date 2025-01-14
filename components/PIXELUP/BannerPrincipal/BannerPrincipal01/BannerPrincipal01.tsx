"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

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
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  const fetchBannerHome = async () => {
    try {
      setLoading(true);
      const bannerId = `${process.env.NEXT_PUBLIC_BANNERPRINCIPAL03_ID}`;

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

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    setTextAlign(alignment);
  };

  if (loading) {
    return <div role="status" className="w-full animate-pulse  rtl:space-x-reverse md:flex md:items-center">
        <div className="flex items-center justify-center w-full h-96 bg-gray-300 rounded dark:bg-gray-700">
            <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
            </svg>
        </div>
        <span className="sr-only">Loading...</span>
    </div>;
  }

  if (!bannerData) {
    return (
      <div className="w-full text-center p-6">No banner data available</div>
    );
  }

  const currentImage = bannerData.images[currentIndex];
  const multipleImages = bannerData.images.length > 1;

  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Panel de control de alineación */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-4 bg-black/20 backdrop-blur-sm px-4 py-2 rounded">
        <button
          onClick={() => handleAlignmentChange('left')}
          className={`p-2 rounded ${
            textAlign === 'left' 
              ? 'bg-white text-black' 
              : 'text-white hover:bg-white/20'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h7" />
          </svg>
        </button>
        <button
          onClick={() => handleAlignmentChange('center')}
          className={`p-2 rounded ${
            textAlign === 'center' 
              ? 'bg-white text-black' 
              : 'text-white hover:bg-white/20'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M9 18h6" />
          </svg>
        </button>
        <button
          onClick={() => handleAlignmentChange('right')}
          className={`p-2 rounded ${
            textAlign === 'right' 
              ? 'bg-white text-black' 
              : 'text-white hover:bg-white/20'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M11 18h7" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div role="status" className="w-full animate-pulse  rtl:space-x-reverse md:flex md:items-center">
            <div className="flex items-center justify-center w-full h-96 bg-gray-300 rounded dark:bg-gray-700">
                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                </svg>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
      ) : !bannerData ? (
        <div className="w-full text-center p-6">No banner data available</div>
      ) : (
        <>
          <div className="absolute inset-0">
            {bannerData.images.map((image, index) => (
              <Link href={image.buttonLink || ''} key={index} className="absolute inset-0">
                <img
                  src={image.mainImage.url}
                  alt={image.title}
                  className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          {/* Controles de carrusel */}
          {bannerData.images.length > 1 && (
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

          {/* Contenido del banner */}
          <div className="relative h-full max-w-7xl mx-auto px-4">
            <div className={`flex flex-col justify-center h-full max-w-2xl ${
              textAlign === 'center' ? 'mx-auto items-center text-center' :
              textAlign === 'right' ? 'ml-auto items-end text-right' :
              'items-start text-left'
            }`}>
              <h2 className="text-5xl md:text-7xl text-white font-light mb-6 leading-tight">
                {currentImage.title}
              </h2>
              <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
                {currentImage.landingText}
              </p>
              {currentImage.buttonText && (
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href={currentImage.buttonLink || ''}
                    className="bg-[#81C4BA] text-white px-8 py-4 rounded hover:bg-[#1B9C84] transition-all"
                  >
                    {currentImage.buttonText}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Indicadores de slide */}
          {bannerData.images.length > 1 && (
            <div className="absolute bottom-8 inset-x-0">
              <div className="flex justify-center gap-2">
                {bannerData.images.map((_, index) => (
                  <button
                    key={index}
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
        </>
      )}
    </section>
  );
};

export default BannerPrincipal01;
