import React from "react";
import Stars from "@/components/Products/Detail/Stars";
import BannerTienda from "@/components/conMantenedor/BannerTienda";
import ProductDetail from "@/app/tienda/productos/ProductDetail";
import Buscador01 from "@/components/PIXELUP/Buscador/Buscador01";
import Colecciones from "@/components/conMantenedor/colecciones";
interface Order {
  [x: string]: any;
  correlative: string;
  // Add other properties as needed
}
export default function DetalleColeccion() {
  return (
    <section>
      <Colecciones />
    </section>
  );
}
