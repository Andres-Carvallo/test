import type { Metadata } from "next";
import CrearVariable from "./CrearVariable_starken";

export const metadata: Metadata = {
  title: "Crear Producto Varibale",
  description: "Crear Producto Varibale",
};
const CrearProductoVariablePage = () => {
  return (
    <div>
      <CrearVariable />
    </div>
  );
};

export default CrearProductoVariablePage;
