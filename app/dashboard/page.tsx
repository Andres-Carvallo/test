/* eslint-disable @next/next/no-img-element */
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | PixelUP",
  description: "Dashboard Pixelup",
};
const inicioDashboard = () => {
  return (
    <div className="text-gray-600 body-font min-h-[85vh]">
      <Breadcrumb pageName="Inicio" />
      <div className="flex flex-col ">
        <div className="flex justify-center mt-20">
          <h1>Bienvenido a PixelUP</h1>
        </div>
        <div className="flex justify-center">
          <img
            src="/img/pixelup.png"
            className="w-60"
            alt="Logo"
          />
        </div>
      </div>
    </div>
  );
};

export default inicioDashboard;
