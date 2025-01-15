// app/page.js

'use client';

import Hero01 from "@/components/PIXELUP/Hero/Hero01/Hero01";
import Hero02 from "@/components/PIXELUP/Hero/Hero02/Hero02";
import Hero03 from "@/components/PIXELUP/Hero/Hero03/Hero03";
import Hero04 from "@/components/PIXELUP/Hero/Hero04/Hero04";
import SinFoto01 from "@/components/PIXELUP/SinFoto/SinFoto01/SinFoto01";
import SinFoto02 from "@/components/PIXELUP/SinFoto/SinFoto02/SinFoto02";
import SinFoto03 from "@/components/PIXELUP/SinFoto/SinFoto03/SinFoto03";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const revalidate = 60; // Revalida cada 60 segundos

export const dynamic = "force-dynamic"; // O 'force-static' si quieres comportamiento estático



export default async function hero() {
    return (
      <>
              <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Hero 01</span>
</div>
        <Hero01 />

        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Hero 02</span>
</div>
<Hero02/>

        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Hero 03</span>
</div>
<Hero03/>

        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Hero 04</span>
</div>
<Hero04/>

        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-80 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Sin Foto 01</span>
</div>
        <SinFoto01/>
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-80 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Sin Foto 02</span>
</div>
        <SinFoto02           
                  WelcomeData={{
                    BannerId: process.env.NEXT_PUBLIC_SINFOTO02_ID || "",
                    Box1Id: process.env.NEXT_PUBLIC_SINFOTO02_BOX1_ID || "",
                    Box2Id: process.env.NEXT_PUBLIC_SINFOTO02_BOX2_ID || "",
                    Box3Id: process.env.NEXT_PUBLIC_SINFOTO02_BOX3_ID || "",
                  }}/>
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-80 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Sin Foto 03</span>
</div>
        <SinFoto03/>

</>
    );
}


