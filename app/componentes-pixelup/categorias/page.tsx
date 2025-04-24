// app/page.js

'use client';
import Categoria02 from "@/components/PIXELUP/Categorias/Categoria02/Categoria02";
import Categoria01 from "@/components/PIXELUP/Categorias/Categoria01/Categoria01";
import Categoria03 from "@/components/PIXELUP/Categorias/Categoria03/Categoria03";
import Categoria04 from "@/components/PIXELUP/Categorias/Categoria04/Categoria04";
import Categoria05 from "@/components/PIXELUP/Categorias/Categoria05/Categoria05";
import Categoria06 from "@/components/PIXELUP/Categorias/Categoria06/Categoria06";
import Categoria07 from "@/components/PIXELUP/Categorias/Categoria07/Categoria07";
import Colecciones01 from "@/components/PIXELUP/Colecciones/Colecciones01/Colecciones01";
import Colecciones02 from "@/components/PIXELUP/Colecciones/Colecciones02/Colecciones02";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const revalidate = 60; // Revalida cada 60 segundos

export const dynamic = "force-dynamic"; // O 'force-static' si quieres comportamiento estático

export default function categorias() {
    return (
      <>
              <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Categoría 01</span>
</div>
        <Categoria01/>
          <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Categoría 02</span>
</div>
        <Categoria02/>

        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Categoría 03</span>
</div>
    <Categoria03/>
    <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Categoría 04</span>
</div>
      <Categoria04/>
      <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Categoría 05</span>
</div>
<Categoria05/>
<div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Categoría 06</span>
</div>
<Categoria06/>
<div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Categoría 07</span>
</div>
<Categoria07/>
<div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Colecciones</span>
</div>
<Colecciones01/>
<div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Colecciones</span>
</div>
<Colecciones02/>
</>
    );
}

