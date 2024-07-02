'use client'

import Footer from './cdgfooter01';
import { useState, useEffect } from "react";

export default function footer() {
  const FooterData = {
    titulo: "Adventure calls, conquer mountain trails.",
    subtitulo: "Adventure calls, conquer mountain trails.",
    parrafo: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    img: "/img/Logo/Logo-500x500-blanco.png",
  };


  return (
    <Footer FooterData={FooterData}/>
  )
}