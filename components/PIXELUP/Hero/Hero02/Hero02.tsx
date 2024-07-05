'use client'

import Hero02 from './cdghero02';
import { useState, useEffect } from "react";


export default function hero() {
  const HeroData = {
    titulo: "Lorem ipsum",
    subtitulo: "Nueva Colección",
    parrafo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat sem est, sit amet consequat leo elementum a. Proin ultricies hendrerit viverra. Nunc non pharetra eros.",
    img: '/img/Aboutme/SobreMi.webp',
  };


  return (
    <Hero02 Hero02Data={HeroData}/>
  )
}