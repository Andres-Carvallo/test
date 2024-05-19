import React from "react";
import Stars from "@/components/Products/Detail/Stars";
import BannerTienda from "@/components/conMantenedor/BannerTienda";
import ProductoSimple from "./ProductoSimple";
interface Order {
  [x: string]: any;
  correlative: string;
  // Add other properties as needed
}
export default function DetalleProductos() {
  return (
    <section>
      <BannerTienda />
      <ProductoSimple />

      <Stars />
    </section>
  );
}
