"use client";
import React, { useEffect, useState } from "react";
import BannerPrincipalBO from "@/components/conMantenedor/Mantenedores/BannerPrincipalBO";
import BannerTiendaBO from "@/components/conMantenedor/Mantenedores/BannerTiendaBO";
import BannersCategoriasBO from "@/components/conMantenedor/Mantenedores/BannersCategoriasBO";
import Hero01BO from "@/components/PIXELUP/Hero/Hero01/BackOffice/Hero01BO";
import ColeccionesBO from "../../../components/conMantenedor/Mantenedores/coleccionesBO";

export default function BannerHome() {
  return (
    <section className="gap-4 flex flex-col">
      <div
        className=" p-4 "
        style={{ borderRadius: "var(--radius)" }}
      >
        {/* <h4 className="uppercase font-bold mb-4">Colecciones</h4> */}
        <ColeccionesBO />
      </div>
    </section>
  );
}
