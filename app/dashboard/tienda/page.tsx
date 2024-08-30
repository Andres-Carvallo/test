"use client";
import React, { useEffect, useState } from "react";
import BannerPrincipalBO from "@/components/conMantenedor/Mantenedores/BannerPrincipalBO";
import BannerTiendaBO from "@/components/conMantenedor/Mantenedores/BannerTiendaBO";
import BannerTienda01BO from "@/components/PIXELUP/BannerTienda/BannerTienda01/BackOffice/BannerTienda01BO";
import BannersCategoriasBO from "@/components/conMantenedor/Mantenedores/BannersCategoriasBO";
import Hero01BO from "@/components/PIXELUP/Hero/Hero01/BackOffice/Hero01BO";
import Hero02BO from "@/components/PIXELUP/Hero/Hero02/BackOffice/Hero02BO";
import FrasesBO from "@/components/PIXELUP/Frases/BackOffice/FrasesBO";

export default function BannerTienda() {
  return (
    <section className="gap-4 flex flex-col px-10 py-10 ">
      <div
        className="shadow-md border-primary mt-6 p-4 bg-white "
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Banner Tienda</h4>
        <BannerTienda01BO />
      </div>
    </section>
  );
}
