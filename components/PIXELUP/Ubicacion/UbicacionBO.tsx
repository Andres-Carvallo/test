import React from "react";
import { Toaster } from "react-hot-toast";
import UbicacionContentBO from "./UbicacionContentBO";
import UbicacionImagesBO from "./UbicacionImagesBO";

interface UbicacionBOProps {
  // agregar props si los hay
}

const UbicacionBO: React.FC<UbicacionBOProps> = () => {
  return (
    <div className="space-y-8 pb-20">
      <Toaster />
      <UbicacionContentBO />
      <UbicacionImagesBO />
    </div>
  );
};

export default UbicacionBO;
