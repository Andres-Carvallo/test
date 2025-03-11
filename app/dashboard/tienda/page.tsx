"use client";
import BannerTienda01BO from "@/components/PIXELUP/BannerTienda/BannerTienda01/BannerTienda01BO";

export default function BannerTienda() {
  return (
    <section className="gap-4 flex flex-col px-10 py-10 ">
      <title>Content block - Tienda</title>
      <div
        className="mt-6 p-4  "
        style={{ borderRadius: "var(--radius)" }}
      >
        <BannerTienda01BO />
      </div>
    </section>
  );
}
