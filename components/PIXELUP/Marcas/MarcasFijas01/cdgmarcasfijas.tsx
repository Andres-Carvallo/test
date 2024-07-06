/* eslint-disable @next/next/no-img-element */

"use client";

import React from "react";

const MarcasFijas: React.FC<any> = ({ MarcasFijasData }) => {
  const { titulo, marcas } = MarcasFijasData;

  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
        <h1 className="md:mb-12 mb-6 text-3xl leading-9 text-center font-extrabold text-foreground sm:text-4xl sm:leading-10 py-2">
          {titulo}
        </h1>
        <div className="grid grid-cols-2 items-center justify-center gap-8 rounded-md bg-background p-16 px-8 py-12 sm:grid-cols-3 md:gap-16">
          {marcas.map((marca: any, index: any) => (
            <div
              key={index}
              className="flex items-center justify-center"
            >
              <img
                src={marca}
                alt=""
                className="max-w-full sm:max-w-[80%]"
                style={{ borderRadius: "var(--radius)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarcasFijas;
