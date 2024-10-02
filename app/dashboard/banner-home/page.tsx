"use client";
import React, { useEffect, useState } from "react";
import BannerPrincipalBO from "@/components/conMantenedor/Mantenedores/BannerPrincipalBO";
import BannerTiendaBO from "@/components/conMantenedor/Mantenedores/BannerTiendaBO";
import BannersCategoriasBO from "@/components/conMantenedor/Mantenedores/BannersCategoriasBO";
import Hero01BO from "@/components/PIXELUP/Hero/Hero01/BackOffice/Hero01BO";
import Hero02BO from "@/components/PIXELUP/Hero/Hero02/BackOffice/Hero02BO";
import FrasesBO from "@/components/PIXELUP/Frases/BackOffice/FrasesBO";
import BannerPrincipal03BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal03/BannerPrincipal03BO";
import BannerPrincipal02BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02BO";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/BackOffice/MarqueeBO";
import BannerSinFotoBO from "@/components/PIXELUP/BannerSinFoto/BackOffice/BannerSinFotoBO";

export default function BannerHome() {
  return (
    <section className="gap-4 flex flex-col py-10 mx-10">
      <title>Content block - Home</title>
      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Barra Superior</div>
          <div>/ Home</div>
        </div>
        <MarqueeTOP />
      </div>

      <div
        className="border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Banner</div>
          <div>/ Home</div>
        </div>
        <BannerPrincipal03BO />
      </div>
      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Hero</div>
          <div>/ Home</div>
        </div>
        <Hero01BO />
      </div>
{/*       <div
        className="border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Categoría</div>
          <div>/ Home</div>
        </div>
        <BannersCategoriasBO />
      </div> */}
{/*       <div
        className="border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Sobre Mí</div>
          <div>/ Home</div>
        </div>
        <Hero02BO />
      </div> */}
{/*       <div
        className="border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Frases</div>
          <div>/ Home</div>
        </div>
        <FrasesBO />
      </div> */}
    </section>
  );
}
