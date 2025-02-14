/* eslint-disable @next/next/no-img-element */
import React from "react";

export const revalidate = 60; // ISR: Regenerar cada 60 segundos

const fetchBannerData = async () => {
  const bannerId = process.env.NEXT_PUBLIC_BANNER_TIENDA_ID;
  const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

  if (!bannerId || !siteId) {
    throw new Error("Faltan variables de entorno necesarias");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${siteId}`,
    {
      cache: "force-cache",
      next: { revalidate: 60 }, // Mejor manera de manejar la revalidación
    }
  );

  if (!res.ok) {
    throw new Error(`Error fetching banner data: ${res.status}`);
  }

  return res.json();
};

const BannerPrincipal = async () => {
  try {
    const bannerData = await fetchBannerData();
    console.log("Banner Data:", bannerData); // Temporal para debugging

    if (
      !bannerData ||
      !bannerData.banner ||
      !bannerData.banner.images?.[0]?.mainImage?.url
    ) {
      return (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Banner no disponible</p>
        </div>
      );
    }

    const imageUrl = bannerData.banner.images[0].mainImage.url;

    return (
      <section
        id="banner"
        className="w-full z-10 relative"
      >
        <div className="hidden relative lg:flex items-start justify-center w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={bannerData.banner.title || "Banner"}
            className="w-full h-auto object-contain transition-opacity duration-1000 ease-in-out"
            loading="lazy" // Lazy loading para optimización
          />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error al cargar el banner:", error);
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Error al cargar el banner</p>
      </div>
    );
  }
};

export default BannerPrincipal;
