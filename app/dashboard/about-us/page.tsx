"use client";
import React, { useEffect, useState } from "react";
import Hero03BO from "@/components/PIXELUP/Hero/Hero03/BackOffice/Hero03BO";
import BannerAbout02BO from "@/components/PIXELUP/BannerAbout/BannerAbout02/BackOffice/BannerAbout02BO";

export default function BannerHome() {
  return (
    <section className="gap-4 flex flex-col">
      <div
        className="shadow-md border border-primary mt-6 p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Banner About Me</h4>
        <BannerAbout02BO/>
      </div>
      <div
        className="shadow-md border border-primary mt-6 p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Hero About Me</h4>
        <Hero03BO/>
      </div>
    </section>
  );
}
