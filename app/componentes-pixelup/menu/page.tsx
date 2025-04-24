// app/page.js

'use client';

import LogosCarrusel from "@/components/PIXELUP/Marcas/LogosCarrusel/LogosCarrusel";
import LogosDinamicos from "@/components/PIXELUP/Marcas/LogosDinamicos/LogosDinamicos";
import LogosFijos from "@/components/PIXELUP/Marcas/LogosFijos/LogosFijos";
import Navbar01 from "@/components/PIXELUP/Navbar/Navbar01/Navbar01";
import Navbar02 from "@/components/PIXELUP/Navbar/Navbar02/Navbar02";
import Navbar03 from "@/components/PIXELUP/Navbar/Navbar03/Navbar03";
import Navbar04 from "@/components/PIXELUP/Navbar/Navbar04/Navbar04";
import Navbarbanner from "@/components/PIXELUP/Navbar/Navbarbanner/Navbarbanner";
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const revalidate = 60; // Revalida cada 60 segundos

export const dynamic = "force-dynamic"; // O 'force-static' si quieres comportamiento estático



export default function menu() {
    return (
      <>
<div className="bg-gray-100 pb-16">
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 left-1/2 dark:text-white dark:bg-gray-900 bg-gray-100">Navbar 01</span>
</div>
<div className="border shadow-lg">
<Navbar01/>
</div>

        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2  left-1/2 dark:text-white dark:bg-gray-900 bg-gray-100">Navbar 03</span>
</div>
<div className="border shadow-lg">
<Navbar03/>
</div>
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 left-1/2 dark:text-white dark:bg-gray-900 bg-gray-100">Navbar 04</span>
</div>
<div className="border shadow-lg">
<Navbar04   />
</div>
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 left-1/2 dark:text-white dark:bg-gray-900 bg-gray-100">Navbar Banner</span>
</div>
<div className="border shadow-lg">
<Navbarbanner/>
</div>
</div>

</>
    );
}


