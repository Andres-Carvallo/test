import React from "react";
import ProductGridShop from "../../components/PIXELUP/Tienda/ProductGridHome/ProductGridShop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Tienda",
};
const TiendaHome = () => {
  return (
    <div>
      <ProductGridShop />
    </div>
  );
};

export default TiendaHome;
