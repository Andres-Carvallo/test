/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

export default function Collection01() {
  return (
    <div>
      <div className=" py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl uppercase">
            Categorías
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {/* product - start */}
            <div className="max-w-[200px]">
              <Link
                href="#"
                className="group relative flex h-96 items-end overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg"
              >
                <img
                  src="/img/category/colec_Mini_DiosaMadre.webp"
                  loading="lazy"
                  alt="Colección Diosa Madre"
                  className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                />

                <div className="relative flex w-full flex-col rounded-lg bg-white p-4 text-center">
                  <span className="text-lg font-bold text-gray-800 lg:text-xl">
                    Diosa Madre
                  </span>
                </div>
              </Link>
            </div>
            {/* product - end */}
          </div>
        </div>
      </div>
    </div>
  );
}
