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
    BannerId: "24eed87b-2b78-4922-836a-9d860f878350",
    BannerImageId: "62ef3e11-da1d-47ef-8332-f00aa953d181",
  };

  return <Hero HeroData={HeroData} />;
}
