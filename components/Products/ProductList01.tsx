"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerProductos } from "@/app/utils/obtenerProductos";
import { obtenerPrecioProducto } from "@/app/utils/obtenerPrecioProducto";
interface Producto {
  id: string;
  name: string;
  mainImageUrl: string;
  description: string;
  siteId: string;
}

interface ProductoConPrecio extends Producto {
  precio: number | null;
}

const ProductList01 = () => {
  const [productos, setProductos] = useState<ProductoConPrecio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const SiteId = `${process.env.NEXT_PUBLIC_API_URL_SITEID}`;
        const PageNumber = 1;
        const PageSize = 10;
        // const ProductTypeId = "58e982fe-75f8-4d15-bd0a-00126a0ed2d9";

        const data = await obtenerProductos(SiteId, PageNumber, PageSize);

        // Obtener el precio para cada producto
        const productosConPrecio = await Promise.all(
          data.products.map(async (producto: any) => {
            const precio = await obtenerPrecioProducto(producto.id, SiteId);
            return { ...producto, precio };
          })
        );
        setProductos(productosConPrecio);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
          setLoading(false);
          console.error("An error occurred:", error.message);
        } else {
          setLoading(false);
          console.error("An unknown error occurred:", error);
        }
      }
    }

    fetchProductos();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section>
      <div className="font-[sans-serif] py-12">
        <div className="p-4 mx-auto lg:max-w-7xl sm:max-w-full">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
            Premium Sneakers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Product 1 */}

            {Array.isArray(productos) &&
              productos.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-gray-50 shadow-md overflow-hidden rounded cursor-pointer hover:-translate-y-2 transition-all relative"
                >
                  <Link href="/producto">
                    <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer absolute top-3 right-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18px"
                        className="fill-gray-800 inline-block"
                        viewBox="0 0 64 64"
                      >
                        <path
                          d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                          data-original="#000000"
                        />
                      </svg>
                    </div>
                    <div className="w-11/12 h-[220px] p-4 overflow-hidden mx-auto aspect-w-16 aspect-h-8 md:mb-2 mb-4">
                      <img
                        src={producto.mainImageUrl}
                        alt="Product 1"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="text-lg font-bold text-gray-800">
                        {producto.name}
                      </h3>
                      <h4 className="text-lg text-gray-700 font-bold mt-2">
                        {producto.precio}
                      </h4>
                      <p className="text-gray-500 text-sm mt-2">
                        {producto.description}
                      </p>
                      <div className="flex space-x-2 mt-6">
                        <svg
                          className="w-5 fill-[#facc15]"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                        </svg>
                        <svg
                          className="w-5 fill-[#facc15]"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList01;
