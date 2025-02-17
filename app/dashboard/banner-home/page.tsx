"use client";
import React, { useEffect, useState } from "react";
import Hero01BO from "@/components/PIXELUP/Hero/Hero01/Hero01BO";
import Hero02BO from "@/components/PIXELUP/Hero/Hero02/Hero02BO";
import FrasesBO from "@/components/PIXELUP/Frases/BackOffice/FrasesBO";
import BannerPrincipal02BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02BO";
import BannerPrincipal01BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01BO";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/BackOffice/MarqueeBO";
import BannerPrincipal02BOMobile from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02Mobile/BannerPrincipal02BOMobile";
import Categoria02BO from "@/components/PIXELUP/Categorias/Categoria02/CategoriaBO02";
import FeedInstagramBO from "@/components/PIXELUP/FeedInstagram/FeedInstagramBO";
import TestimoniosBO from "@/components/PIXELUP/Testimonios/Testimonios01/Testimonios01BO";
import LogosCarruselBO from "@/components/PIXELUP/Marcas/LogosCarrusel/LogosCarruselBO";
import SinFoto01BO from "@/components/PIXELUP/SinFoto/SinFoto01/SinFoto01BO";
import SinFoto02BO from "@/components/PIXELUP/SinFoto/SinFoto02/SinFoto02BO";
import Hero03BO from "@/components/PIXELUP/Hero/Hero03/Hero03BO";
import Hero04BO from "@/components/PIXELUP/Hero/Hero04/Hero04BO";
import CardsPage from "@/components/PIXELUP/SinFoto/SinFoto03/SinFoto03BO";
import BannerPrincipal04BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal04/BannerPrincipal04BO";

export default function BannerHome() {
  return (
    <section className="gap-4 flex flex-col py-10 mx-4">
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
        <BannerPrincipal01BO />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Barra Superior</div>
          <div>/ Home</div>
        </div>
        <BannerPrincipal04BO />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Hero 03</div>
          <div>/ Home</div>
        </div>
        <CardsPage />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Hero 03</div>
          <div>/ Home</div>
        </div>
        <Hero03BO />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Hero 04</div>
          <div>/ Home</div>
        </div>
        <Hero04BO />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Hero 01</div>
          <div>/ Home</div>
        </div>
        <Hero01BO />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Hero 02</div>
          <div>/ Home</div>
        </div>
        <Hero02BO />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Sin Foto 01</div>
          <div>/ Home</div>
        </div>
        <SinFoto01BO />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Sin Foto 02</div>
          <div>/ Home</div>
        </div>
        <SinFoto02BO />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Feed Instagram</div>
          <div>/ Home</div>
        </div>
        <FeedInstagramBO />
      </div>
      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Testimonios</div>
          <div>/ Home</div>
        </div>
        <TestimoniosBO />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Barra Superior</div>
          <div>/ Home</div>
        </div>
        <Categoria02BO />
      </div>

      <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Barra Superior</div>
          <div>/ Home</div>
        </div>
        <LogosCarruselBO />
      </div>

      <div
        className="border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Banner Mobile</div>
          <div>/ Home</div>
        </div>
        <BannerPrincipal02BOMobile />
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
      <div
        className="border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Sobre Mí</div>
          <div>/ Home</div>
        </div>
        <Hero02BO />
      </div>
      <div
        className="border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Frases</div>
          <div>/ Home</div>
        </div>
        <FrasesBO />
      </div>
    </section>
  );
}
