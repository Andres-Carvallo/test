"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Categoria05Props {
  Categoria05Data: {
    titulo: string;
    categoria1: string;
    img1: string;
    categoria2: string;
    img2: string;
    categoria3: string;
    img3: string;
    categoria4: string;
    img4: string;
  };
}

const Categoria05: React.FC<Categoria05Props> = ({ Categoria05Data }) => {
  const {
    titulo,
    categoria1,
    img1,
    categoria2,
    img2,
    categoria3,
    img3,
    categoria4,
    img4,
  } = Categoria05Data;

  const [bannerData, setBannerData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBannerCategoryHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = "cb50bccd-aff7-4ac7-8e13-8d784ad125ac";

      const BannersCategory = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      const bannerImages = BannersCategory.data.banner.images;
      const sortedBannerImages = bannerImages.sort(
        (a: any, b: any) => a.orderNumber - b.orderNumber
      );
      setBannerData(sortedBannerImages);
    } catch (error) {
      console.error("Error al obtener los tipos de producto:", error);
      // Manejar el error según sea necesario
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  useEffect(() => {
    fetchBannerCategoryHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Debería ejecutarse solo en el montaje inicial

  const defaultImage =
    "https://i0.wp.com/ayuda.marketplace.paris.cl/wp-content/uploads/2024/02/placeholder.png?fit=1200%2C800&ssl=1";
  const getDefaultBanner = (index: number) => {
    return bannerData && bannerData[index]
      ? bannerData[index]
      : { mainImage: { url: defaultImage }, title: "Titulo por defecto" };
  };

  return (
    <div>
      {bannerData && (
        <div className="flex items-center justify-center px-4 lg:px-0">
          <div className="max-w-7xl mx-auto rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* COLGANTES */}
              <div className="relative flex flex-col items-center w-full">
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <div
                    className="w-[280px] h-[150px] md:w-[300px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-cover bg-center mx-auto"
                    style={{
                      backgroundImage: `url(${
                        getDefaultBanner(0).mainImage.url
                      })`,
                      borderRadius: "var(--radius)",
                      backgroundPosition: "center bottom",
                    }}
                  >
                    <div
                      className="w-full h-full flex items-end justify-start p-4"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <h2 className="text-2xl md:text-4xl font-bold text-white">
                        {getDefaultBanner(0).title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              {/* ANILLOS */}
              <div className="relative flex flex-col items-center w-full">
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <div
                    className="w-[280px] h-[250px] md:w-[300px] md:h-[380px] lg:w-[600px] lg:h-[480px] bg-cover bg-center mx-auto"
                    style={{
                      backgroundImage: `url(${
                        getDefaultBanner(1).mainImage.url
                      })`,
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <div
                      className="w-full h-full flex items-end justify-end p-4"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <h2 className="text-2xl md:text-4xl font-bold text-white">
                        {getDefaultBanner(1).title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              {/* PULSERAS */}
              <div className="relative flex flex-col items-center w-full">
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <div
                    className="w-[280px] h-[150px] md:w-[300px] md:h-[260px] lg:w-[600px] lg:h-[360px] bg-cover bg-center mx-auto"
                    style={{
                      backgroundImage: `url(${
                        getDefaultBanner(2).mainImage.url
                      })`,
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <div
                      className="w-full h-full flex items-start justify-start p-4"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <h2 className="text-2xl md:text-4xl font-bold text-white">
                        {getDefaultBanner(2).title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              {/* AROS */}
              <div className="relative flex flex-col items-center w-full mt-0 md:mt-[-120px]">
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <div
                    className="w-[280px] h-[250px] md:w-[300px] md:h-[380px] lg:w-[600px] lg:h-[480px] bg-cover bg-center mx-auto"
                    style={{
                      backgroundImage: `url(${
                        getDefaultBanner(3).mainImage.url
                      })`,
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <div
                      className="w-full h-full flex items-end justify-end p-4"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <h2 className="text-2xl md:text-4xl font-bold text-white">
                        {getDefaultBanner(3).title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categoria05;
