/* eslint-disable @next/next/no-img-element */
import React from "react";

export const revalidate = 60; // ISR: Regenerar cada 60 segundos

const fetchBannerMobileData = async () => {
  const bannerId = process.env.NEXT_PUBLIC_BANNER_TIENDAMOBILE_ID;
  const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${siteId}`,
    { cache: "force-cache" }
  );

  if (!res.ok) {
    throw new Error("Error fetching mobile banner data");
  }

  return res.json();
};

const BannerTienda01Mobile = async () => {
  try {
    const bannerData = await fetchBannerMobileData();

    if (
      !bannerData ||
      !bannerData.banner ||
      !bannerData.banner.images?.[0]?.mainImage?.url
    ) {
      return (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Banner móvil no disponible</p>
        </div>
      );
    }

    const imageUrl = bannerData.banner.images[0].mainImage.url;

    return (
      <section
        id="banner-mobile"
        className="w-full z-10 relative lg:hidden"
      >
        <div className="relative flex items-start justify-center w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={bannerData.banner.title || "Banner móvil"}
            className="w-full h-auto object-contain transition-opacity duration-1000 ease-in-out"
            loading="lazy" // Lazy loading para optimización
          />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error al cargar el banner móvil:", error);
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Error al cargar el banner móvil</p>
      </div>
    );
  }
};

export default BannerTienda01Mobile;
