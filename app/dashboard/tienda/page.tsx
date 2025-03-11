"use client";
import BannerTienda01BO from "@/components/PIXELUP/BannerTienda/BannerTienda01/BannerTienda01BO";

export default function BannerTienda() {
  return (
    <section className="gap-4 flex flex-col px-10 py-10 ">
      <title>Content block - Tienda</title>
      <div
        className="shadow-md border-primary mt-6 p-4 bg-white "
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Banner Tienda</h4>
        <BannerTienda01BO />
      </div>
    </section>
  );
}
