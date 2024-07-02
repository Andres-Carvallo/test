import type { Metadata } from "next";
import CrearProductoSimple from "./CrearProductoSimple";

export const metadata: Metadata = {
  title: "Crear Producto | PixelUP",
  description: "Dashboard Pixelup",
};
const inicioDashboard = () => {
  return (
    <div>
      <CrearProductoSimple />
    </div>
  );
};

export default inicioDashboard;
