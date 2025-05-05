// app/page.js

'use client';

import { useEffect, useState } from 'react';
import Destacados01 from "@/components/PIXELUP/Destacados/Destacado01";
import ProductCard01 from "@/components/PIXELUP/ProductCards/ProductCards01/ProductCard01";
import ProductCard02 from "@/components/PIXELUP/ProductCards/ProductCards02/ProductCard02";
import ProductCard03 from "@/components/PIXELUP/ProductCards/ProductCards03/ProductCard03";
import ProductCard04 from '@/components/PIXELUP/ProductCards/ProductCards04/ProductCards04';
import Destacados02 from '@/components/PIXELUP/Destacados/Destacados02/Destacado02';
import Destacados03 from '@/components/PIXELUP/Destacados/Destacados03/Destacado03';
import ProductCard05 from '@/components/PIXELUP/ProductCards/ProductCards05/ProductCards05';
import DestacadosCat from '@/components/PIXELUP/Destacados/DestacadosCat/DestacadosCat';
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default function Productos() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if (!isLoaded) {
        return <div>Cargando...</div>;
    }

    return (
      <>
        <Destacados01 
          text="Tipo de Producto 1 - Detalle 1"
          ProductCardComponent={ProductCard01}
        />
        <Destacados01 
          text="Tipo de Producto 2 - Detalle 2"
          ProductCardComponent={ProductCard02}
        />
        <Destacados01 
          text="Tipo de Producto 3 - Detalle 3"
          ProductCardComponent={ProductCard03}
        />
        <Destacados01 
          text="Tipo de Producto 4"
          ProductCardComponent={ProductCard04}
        />
        <Destacados01 
          text="Tipo de Producto 5"
          ProductCardComponent={ProductCard05}
        />
        <Destacados02/>
        <Destacados03/>
        <DestacadosCat/>
      </>
    );
}
