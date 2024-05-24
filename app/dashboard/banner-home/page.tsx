"use client";
import React, { useEffect, useState } from "react";
import BannerPrincipalBO from "@/components/conMantenedor/Mantenedores/BannerPrincipalBO";
import BannerTiendaBO from "@/components/conMantenedor/Mantenedores/BannerTiendaBO";
import BannersCategoriasBO from "@/components/conMantenedor/Mantenedores/BannersCategoriasBO";

export default function BannerHome() {
  return (
    <section className="gap-4 flex flex-col">
      <div className="border border-dashed border-dark/50 rounded-lg p-4 bg-white">
        <h4 className="uppercase font-bold mb-4">Banner Home</h4>
        <BannerPrincipalBO />
      </div>
      {/* banner tienda */}
      <div className="border border-dashed border-dark/50 rounded-lg p-4 bg-white">
        <h4 className="uppercase font-bold mb-4">Banner Tienda</h4>
        <BannerTiendaBO />
      </div>
      {/* banner categorias home */}
      <div className="border border-dashed border-dark/50 rounded-lg p-4 bg-white">
        <h4 className="uppercase font-bold mb-4">Banner Categorías Home</h4>
        <BannersCategoriasBO />
      </div>
    </section>
  );
}
