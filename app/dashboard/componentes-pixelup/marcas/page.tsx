// app/page.js

'use client';

import LogosCarrusel from "@/components/PIXELUP/Marcas/LogosCarrusel/LogosCarrusel";
import LogosDinamicos from "@/components/PIXELUP/Marcas/LogosDinamicos/LogosDinamicos";
import LogosFijos from "@/components/PIXELUP/Marcas/LogosFijos/LogosFijos";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const revalidate = 60; // Revalida cada 60 segundos

export const dynamic = "force-dynamic"; // O 'force-static' si quieres comportamiento estático


export default function marcas() {
    return (
      <>

        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Marcas Carrusel</span>
</div>
<LogosCarrusel/>
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-80 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Marcas Dinámicas</span>
</div>
        <LogosDinamicos/>
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Marcas Fijas</span>
</div>
        <LogosFijos />

</>
    );
}


