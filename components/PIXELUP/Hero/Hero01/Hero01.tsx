"use client";

import Hero from "./cdghero";
import { useState, useEffect } from "react";

export default function hero() {
  const HeroData = {
    titulo: "Venus Bindi",
    subtitulo: "Nueva Coleccion de Anillos",
    parrafo:
      "Venus es la Diosa del amor, del arte, la creatividad, belleza, sensualidad, fuerza femenina y vida. Este anillo nos recuerda que somos hermosas y tremendamente poderosas. Todas llevamos a Venus con nosotras. Somos fuerza femenina y vida. ",
    img: "/Images/Productos/04_CP_VenusBindi.png",
    BannerId: "d44bb72e-11d3-44a7-8cc7-d0cfd13ccf1c", 
    BannerImageId: "feb84c8b-d1a5-47dc-9deb-7c741e67006a",
  };

  return <Hero HeroData={HeroData} />;
}
