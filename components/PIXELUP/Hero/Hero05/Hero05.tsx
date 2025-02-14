"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface AdditionalData {
  subtitle: string;
  newServiceTitle: string;
  newServiceSubtitle: string;
  newServiceDescription: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

interface ContentData {
  id: string;
  title: string;
  landingText: string;
  buttonText: string;
  buttonLink: string;
  mainImageLink: string;
  mainImage: {
    name: string;
    type: string;
    size: number | null;
    data: string;
    url?: string;
  };
}

const Hero05 = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentData | null>(null);
  const [additionalData, setAdditionalData] = useState<AdditionalData>({
    subtitle: "Pixel Up",
    newServiceTitle: "Pixel Up",
    newServiceSubtitle: "Pixel Up",
    newServiceDescription: "Pixel Up",
    primaryButtonText: "Pixel Up",
    secondaryButtonText: "Pixel Up"
  });

  const fetchContent = async () => {
    try {
      setLoading(true);
      const bannerId = `${process.env.NEXT_PUBLIC_PROPUESTA_VALOR_ID}`;

      // Obtener contenido general
      const contentResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      if (contentResponse.data?.banner) {
        const data = contentResponse.data.banner;
        setContent(data);
        
        // Parsear datos adicionales del buttonText
        try {
          const parsedAdditionalData = JSON.parse(data.buttonText);
          setAdditionalData(parsedAdditionalData);
        } catch (e) {
          console.error("Error parsing additional data:", e);
        }
      }

    } catch (error) {
      console.error("Error al obtener el contenido:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) {
    return <div role="status" className="w-full animate-pulse">
      <div className="flex items-center justify-center w-full h-96 bg-gray-300 rounded">
        <svg className="w-10 h-10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z"/>
        </svg>
      </div>
      <span className="sr-only">Cargando...</span>
    </div>;
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-4">
            <div>
              <span className="text-[#81C4BA] text-sm uppercase tracking-widest mb-4 block">
                {additionalData.subtitle}
              </span>
              <h1 className="text-6xl font-light text-[#877EB6] leading-12">
                {content?.title}
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              {content?.landingText}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/" className="bg-[#81C4BA] text-white px-8 py-4 rounded hover:bg-[#1B9C84] transition-all">
                {additionalData.primaryButtonText}
              </Link>
              <Link href="/" className="border-2 border-[#81C4BA] text-[#81C4BA] px-8 py-4 rounded hover:bg-[#81C4BA] hover:text-white transition-all">
                {additionalData.secondaryButtonText}
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src={content?.mainImage?.url || content?.mainImage?.data || "https://placedog.net/800/600"}
              alt="Perro feliz"
              className="rounded shadow-xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded shadow-lg max-w-[200px]">
              <span className="text-[#81C4BA] text-sm font-medium">
                {additionalData.newServiceSubtitle}
              </span>
              <h3 className="text-[#877EB6] font-medium mt-2">
                {additionalData.newServiceTitle}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {additionalData.newServiceDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero05;
