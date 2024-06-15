/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface HeroProps {
  HeroData: {
    titulo: string;
    subtitulo: string;
    parrafo: string;
    BannerId: string;
    BannerImageId: string;
  };
}

const Hero: React.FC<HeroProps> = ({ HeroData }) => {
  const { titulo, subtitulo, BannerId, BannerImageId, parrafo } = HeroData;

  const [bannerData, setBannerData] = useState<any | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const fetchBannerHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = `${BannerId}`;
      const bannerImageId = `${BannerImageId}`;

      const productTypeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      const bannerImage = productTypeResponse.data.banner;
      setBannerData(bannerImage);
      console.log(bannerImage, "banner image");
    } catch (error) {
      console.error("Error al obtener los tipos de producto:", error);
      // Manejar el error según sea necesario
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  useEffect(() => {
    fetchBannerHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Debería ejecutarse solo en el montaje inicial

  /* PARA QUE LA IMAGEN ESTE AL LADO IZQUIERDO LO UNICO QUE HAY QUE HACER ES CAMBIAR EL CONTENEDOR DE LA IMAGEN ANTES QUE LA DEL TEXTO */

  return (
    <section className="w-full bg-foreground/5 my-10">
      <div className="text-gray-600 body-font">
        {bannerData && (
          <div className="container py-10 mx-auto flex flex-col md:flex-row items-center md:space-x-4 max-w-3xl">
            <img
              className="w-1/2 md:w-1/3 xl:w-2/4 object-cover object-center rounded mx-auto"
              alt="hero"
              src={bannerData.images[0].mainImage.url}
              style={{ borderRadius: "var(--radius)" }}
            />
            <div className="md:pl-4">
              <h4 className="text-primary text-lg md:text-xl mt-6 md:mt-0">
                {bannerData.buttonText}
              </h4>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight text-foreground">
                {bannerData.title}
              </h1>
              <p className="text-base md:text-lg text-foreground py-3">
                {bannerData.landingText}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
