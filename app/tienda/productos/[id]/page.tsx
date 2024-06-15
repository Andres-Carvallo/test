import React from "react";
import Stars from "@/components/Products/Detail/Stars";
import BannerTienda from "@/components/conMantenedor/BannerTienda";
import ProductDetail from "@/app/tienda/productos/ProductDetail";
import Buscador01 from "@/components/PIXELUP/Buscador/Buscador01";
interface Order {
  [x: string]: any;
  correlative: string;
  // Add other properties as needed
}
export default function DetalleProductos() {
  return (
    <section>
      <BannerTienda />

      <ProductDetail />

      <Stars />
    </section>
  );
}
