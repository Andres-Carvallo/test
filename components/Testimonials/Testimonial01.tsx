/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import Marquee from "react-fast-marquee";
import Primero from "./Testimonial/Primero";
import Segundo from "./Testimonial/Segundo";
import Tercero from "./Testimonial/Tercero";

function Testimonial01() {
  return (
    <div>
      <div className="my-6 font-[sans-serif] ">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold">Testimonials</h2>
          <p className="text-sm text-[#333] mt-4 leading-relaxed">
            Veniam proident aute magna anim excepteur et ex consectetur velit
            ullamco veniam minim aute sit. Elit occaecat officia et laboris
            Lorem minim. Officia do aliqua adipisicing ullamco in
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          <Marquee className="w-full h-96 max-w-[90%] overflow-hidden">
            <Segundo />
            <Primero />
            <Tercero />
          </Marquee>
        </div>
      </div>
    </div>
  );
}

export default Testimonial01;
