"use client";
import React, { useEffect, useState } from "react";
import BannerPrincipalBO from "@/components/conMantenedor/Mantenedores/BannerPrincipalBO";
import BannerTiendaBO from "@/components/conMantenedor/Mantenedores/BannerTiendaBO";
import BannersCategoriasBO from "@/components/conMantenedor/Mantenedores/BannersCategoriasBO";
import Hero01BO from "@/components/PIXELUP/Hero01/BackOffice/Hero01BO";
import Hero02BO from "@/components/PIXELUP/Hero02/BackOffice/Hero02BO";
import FrasesBO from "@/components/PIXELUP/Frases/BackOffice/FrasesBO";
import BannerPrincipalBO01 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/BackOffice/MarqueeBO";
import BannerSinFotoBO from "@/components/PIXELUP/BannerSinFoto/BackOffice/BannerSinFotoBO";

export default function BannerHome() {
  return (
    <section className="gap-4 flex flex-col">
      <div
        className="shadow-md border border-primary p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Marquee</h4>
        <MarqueeTOP />
      </div>
      <div
        className="shadow-md border border-primary p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Banner Bienvenida</h4>
        <BannerSinFotoBO />
      </div>
      <div
        className="shadow-md border border-primary p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Banner Home</h4>
        <BannerPrincipalBO />
      </div>

      <div
        className="shadow-md border border-primary mt-6 p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Categoría</h4>
        <BannersCategoriasBO />
      </div>
      <div
        className="shadow-md border border-primary mt-6 p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Banner About Me</h4>
        <Hero02BO />
      </div>
      <div
        className="shadow-md border border-primary mt-6 p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Frases</h4>
        <FrasesBO />
      </div>
    </section>
  );
}
