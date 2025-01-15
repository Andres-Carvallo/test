/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const SinFoto01: React.FC = () => {

  const [loading, setLoading] = useState(false);
  const [bannerData, setBannerData] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchBannerHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = `${process.env.NEXT_PUBLIC_SINFOTO01_ID}`;
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || null;
      const WelcomeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${bannerId}?siteId=${siteId}`
      );

      const bannerImage = WelcomeResponse.data.contentBlock;
      setBannerData(bannerImage);
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

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-900 w-full min-h-96">
        <div className="container px-6 py-10 mx-auto animate-pulse">
          <h1 className="w-48 h-2 mx-auto bg-gray-200 rounded-lg dark:bg-gray-700" />
          <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
          <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg sm:w-80 dark:bg-gray-700" />
        </div>
      </section>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="relative p-6  min-h-96 bg-gray-100">
      {/* Imágenes de fondo arriba y abajo */}
{/*       <div className="absolute inset-0 flex flex-col justify-between">
        <img
          src="/fran/bg00.png"
          alt="Maquillaje superior"
          className="absolute top-0 left-0 max-w-[300px] h-auto object-cover"
        />
        <img
          src="/fran/bg01.png"
          alt="Maquillaje superior"
          className="absolute bottom-0 right-0 max-w-[600px] h-auto object-cover"
        />
      </div> */}

      {/* Contenido del banner */}
      <div className="relative z-10 max-w-4xl mx-auto container px-4  md:py-24 sm:px-6 lg:px-8 ">
        <h2 className="text-center text-7xl md:text-8xl font-semibold text-dark mb-2 font-brush">
          Hola
        </h2>
        <div
          className="text-center text-2xl md:text-3xl text-primary"
          dangerouslySetInnerHTML={{ __html: bannerData?.title }}
        />
        <div
          className="mt-6 text-center text-lg md:text-xl font-light text-[#666] max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{ __html: bannerData?.contentText }}
        />
        <div className="flex justify-center items-center mt-10 gap-4 flex-wrap">
          <Link href="/sobre-mi">
            <button className="rounded-lg text-lg md:text-xl bg-secondary px-6 py-2  duration-300 ease-in-out hover:scale-110">{/*  bg-[#004643] */}
              Saber más
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SinFoto01;