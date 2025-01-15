// app/page.js


import BannerPrincipal03 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal03/BannerPrincipal03";
import BannerPrincipal02 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02";
import BannerPrincipal02Mobile from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02Mobile/BannerPrincipal02Mobile";
import Parallax01 from "@/components/PIXELUP/Parallax01/Parallax01";
import BannerPrincipal01 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01";
import BannerPrincipal04 from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal04/BannerPrincipal04";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const revalidate = 60; // Revalida cada 60 segundos

export const dynamic = "force-dynamic"; // O 'force-static' si quieres comportamiento estático



export default async function banners() {
    return (
      <>
          <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Banner 01</span>
</div>
        <BannerPrincipal04/>
          <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Banner 01</span>
</div>
        <BannerPrincipal01/>
          <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Banner 02</span>
</div>
        <BannerResponsive/>
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Banner 03</span>
</div>
        <BannerPrincipal03/>
        <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 text-2xl text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Parallax 01</span>
</div>
    <Parallax01/>
      </>
    );
}

const BannerResponsive = () => (
  <>
    <div className="block lg:hidden">
      <BannerPrincipal02Mobile />
    </div>
    <div className="hidden lg:block">
      <BannerPrincipal02 />
    </div>
  </>
);

