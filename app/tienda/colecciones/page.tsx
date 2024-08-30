"use client";
import React, { useEffect, useState } from "react";
import Collection from "@/components/conMantenedor/colecciones";

export default function BannerHome() {
  return (
    <section className=" gap-4 flex flex-col">
      {/*       <div
        className="shadow-md border border-primary p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      ></div> */}
      {/* <h4 className="uppercase font-bold mb-4">Colecciones</h4> */}
      <Collection />
    </section>
  );
}
