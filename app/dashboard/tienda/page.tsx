"use client";
import React, { useEffect, useState } from "react";
import BannerPrincipalBO from "@/components/conMantenedor/Mantenedores/BannerPrincipalBO";
import BannerTiendaBO from "@/components/conMantenedor/Mantenedores/BannerTiendaBO";
import BannerTienda01BO from "@/components/PIXELUP/BannerTienda/BannerTienda01/BackOffice/BannerTienda01BO";
import BannersCategoriasBO from "@/components/conMantenedor/Mantenedores/BannersCategoriasBO";
import FrasesBO from "@/components/PIXELUP/Frases/BackOffice/FrasesBO";
import BannerTienda01BOMobile from "@/components/PIXELUP/BannerTienda/BannerTienda01Mobile/BackOffice/BannerTienda01BOMobile";

export default function BannerTienda() {
  return (
    <section className="gap-4 flex flex-col px-10 py-10 ">
      <title>Content block - Tienda</title>
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
