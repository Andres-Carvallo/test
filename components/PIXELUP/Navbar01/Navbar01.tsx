"use client";

import Navbar01 from "./cdgnavbar2";
import { useState, useEffect } from "react";

export default function Navbar() {
  const NavbarData = {
    titulo: "Adventure calls, conquer mountain trails.",
    subtitulo: "Adventure calls, conquer mountain trails.",
    parrafo: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    img: "/img/pixelup-white.png",
  };

  return <Navbar01 />;
}
