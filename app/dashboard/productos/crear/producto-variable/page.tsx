import type { Metadata } from "next";
import CrearVariable from "./CrearVariable";

export const metadata: Metadata = {
  title: "Crear Producto Varibale | PixelUP",
  description: "Dashboard Pixelup",
};
const CrearProductoVariablePage = () => {
  return (
    <div>
      <CrearVariable />
    </div>
  );
};

export default CrearProductoVariablePage;
