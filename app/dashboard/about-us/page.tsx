"use client";
import React, { useEffect, useState } from "react";
import BannerAbout02BO from "@/components/PIXELUP/BannerAbout/BannerAbout02/BackOffice/BannerAbout02BO";
import About01BO from "@/components/PIXELUP/About/About01/BackOffice/About01BO";
import BannerPrincipal01BO from "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01BO";
import BannerAbout01BO from "@/components/PIXELUP/BannerAbout/BannerAbout01/BackOffice/BannerAbout01BO";
import BannerAbout01BOMobile from "@/components/PIXELUP/BannerAbout/BannerAbout01Mobile/BackOffice/BannerAbout01BOMobile";

export default function BannerHome() {
  return (
    <section className="gap-4 flex flex-col px-10 py-10 ">
      <title>Content block - About</title>
      {/*       <div
        className="shadow-md  border-primary mt-6 p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Banner About Me</h4>
        <BannerAbout02BO />
      </div>
      <div
        className="shadow-md  border-primary mt-6 p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">Hero About Me</h4>
        <Hero03BO />
      </div> */}
 
      <div
        className="shadow-md  border-primary mt-6 p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">About Us Banner</h4>
        <BannerAbout01BO />
      </div>
      <div
        className="shadow-md  border-primary mt-6 p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">About Us Banner Mobile</h4>
        <BannerAbout01BOMobile/>
      </div>
      <div
        className="shadow-md  border-primary mt-6 p-4 bg-white"
        style={{ borderRadius: "var(--radius)" }}
      >
        <h4 className="uppercase font-bold mb-4">About Us Texto</h4>
        <About01BO />
        
      </div>
    </section>
  );
}
