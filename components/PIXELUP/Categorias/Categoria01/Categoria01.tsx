"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const Categoria01 = () => {
  const [bannerData, setBannerData] = useState<any | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [textAlign, setTextAlign] = useState<'center' | 'left' | 'right'>('center');

  const fetchBannerCategoryHome = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = `${process.env.NEXT_PUBLIC_CATEGORIA01_ID}`;

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

  const handleAlignmentChange = (alignment: 'center' | 'left' | 'right') => {
    setTextAlign(alignment);
  };

  return (
    <section
      id="banner"
      className="w-full z-10"
    >
      {bannerData && (
        <div>
          <div className="sm:py-8">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
              {/* Controles de alineación */}
              <div className="mb-4 flex justify-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="alignment"
                    value="left"
                    checked={textAlign === 'left'}
                    onChange={() => handleAlignmentChange('left')}
                    className="mr-2"
                  />
                  Izquierda
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="alignment"
                    value="center"
                    checked={textAlign === 'center'}
                    onChange={() => handleAlignmentChange('center')}
                    className="mr-2"
                  />
                  Centro
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="alignment"
                    value="right"
                    checked={textAlign === 'right'}
                    onChange={() => handleAlignmentChange('right')}
                    className="mr-2"
                  />
                  Derecha
                </label>
              </div>

              <div className="flex flex-wrap gap-6 items-center align-middle justify-center">
                {/* product - start */}
                {bannerData.map((banner: any) => (
                  <div
                    className="flex-1 max-w-[200px] min-w-[200px]"
                    key={banner.id}
                  >
                    <Link
                      href={banner.buttonLink}
                      className="group relative flex flex-wrap h-96 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg"
                    >
                      <img
                        src={banner.mainImage.url}
                        loading="lazy"
                        alt="Colección Diosa Madre"
                        className="absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="relative w-full p-4">
                        <h3 className={`text-xl font-bold text-white text-${textAlign}`}>
                          {banner.title}
                        </h3>
                      </div>
                    </Link>
                  </div>
                ))}

                {/* product - end */}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Categoria01;
