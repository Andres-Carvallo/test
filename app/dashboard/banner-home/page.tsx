"use client";
import React, { useEffect, useState } from "react";
import BannerPrincipalBO from "@/components/conMantenedor/Mantenedores/BannerPrincipalBO";
import BannerTiendaBO from "@/components/conMantenedor/Mantenedores/BannerTiendaBO";
import BannersCategoriasBO from "@/components/conMantenedor/Mantenedores/BannersCategoriasBO";
import Hero01BO from "@/components/PIXELUP/Hero01/BackOffice/Hero01BO";

export default function BannerHome() {
  return (
    <section className="gap-4 flex flex-col">
      <div className="shadow-md border border-primary p-4 bg-white" style={{ borderRadius: 'var(--radius)' }}>
      <h4 className="uppercase font-bold mb-4">Banner Home</h4>
        <BannerPrincipalBO />
      </div>
      {/* banner tienda */}
      <div className="shadow-md border border-primary mt-6 p-4 bg-white" style={{ borderRadius: 'var(--radius)' }}>
        <h4 className="uppercase font-bold mb-4">Banner Tienda</h4>
        <BannerTiendaBO />
      </div>
      {/* banner categorias home */}
      <div className="shadow-md border border-primary mt-6 p-4 bg-white" style={{ borderRadius: 'var(--radius)' }}>
        <h4 className="uppercase font-bold mb-4">Banner Categorías Home</h4>
        <BannersCategoriasBO />
      </div>
      <div className="shadow-md border border-primary mt-6 p-4 bg-white" style={{ borderRadius: 'var(--radius)' }}>
        <h4 className="uppercase font-bold mb-4">Banner Hero</h4>
        <Hero01BO/>
      </div>
    </section>
  );
}
