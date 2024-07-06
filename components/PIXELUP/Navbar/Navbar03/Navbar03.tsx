"use client";

import Navbar03 from "./cdgnavbar";
import { useState, useEffect } from "react";

export default function Navbar() {
  const NavbarData = {
    titulo: "Adventure calls, conquer mountain trails.",
    subtitulo: "Adventure calls, conquer mountain trails.",
    parrafo: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    img: "/img/pixelup.png",
  };

  return <Navbar03 />;
}
