import type { Metadata } from "next";
import CrearProductoSimple from "./CrearProductoSimple";

export const metadata: Metadata = {
  title: "Crear Producto Simple | PixelUP",
  description: "Dashboard Pixelup",
};
const CrearProductoSimplePage = () => {
  return (
    <div>
      <CrearProductoSimple />
    </div>
  );
};

export default CrearProductoSimplePage;
