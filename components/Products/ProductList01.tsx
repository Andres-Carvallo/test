"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { obtenerProductos } from "@/app/utils/obtenerProductos";
import { useAPI } from "@/app/Context/ProductTypeContext";
import Link from "next/link";

const ProductList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { addToCartHandler, products, setProducts } = useAPI();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const PageNumber = 1;
        const PageSize = 8;

        const data = await obtenerProductos(SiteId, PageNumber, PageSize);
        setProducts(data.products);
        setLoading(false); // set loading to false after successful data fetch
      } catch (error) {
        setLoading(false); // set loading to false in case of error
        setError(error as Error); // set error state if an error occurs
      }
    };
    fetchProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-900 w-full">
        <div className="container px-6 py-10 mx-auto animate-pulse">
          <h1 className="w-48 h-2 mx-auto bg-gray-200 rounded-lg dark:bg-gray-700" />

          <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
          <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg sm:w-80 dark:bg-gray-700" />

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
            <div className="w-full ">
              <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600" />

              <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
              <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
            </div>

            <div className="w-full ">
              <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600" />

              <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
              <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
            </div>

            <div className="w-full ">
              <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600" />

              <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
              <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
            </div>

            <div className="w-full ">
              <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600" />

              <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
              <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
            </div>

            <div className="w-full ">
              <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600" />

              <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
              <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
            </div>

            <div className="w-full ">
              <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600" />

              <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
              <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
            </div>

            <div className="w-full ">
              <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600" />

              <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
              <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
            </div>

            <div className="w-full ">
              <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600" />

              <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
              <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="w-full mx-auto bg-white">
      <div className="font-[sans-serif] py-6 w-[70%] mx-auto">
        <div className="p-4 mx-auto ">
          <h2 className="mb-8 text-center text-2xl font-bold text-dark md:mb-12 lg:text-3xl uppercase">
            Productos Destacados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((producto: any) => (
              <div
                key={producto.id}
                className="w-full max-w-sm bg-white border rounded-xl border-gray-200 shadow dark:bg-dark dark:border-dark"
              >
                <Link href={`/tienda/productos/${producto.id}`}>
                  <div
                    className="p-8 rounded-t-lg bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${producto.previewImageUrl})`,
                      height: "250px",
                    }}
                  />
                </Link>
                <div className="px-5 pb-5">
                  <Link href={`/tienda/productos/${producto.id}`}>
                    <h5 className="text-sm pt-3 text-center font-semibold tracking-tight text-gray-900 dark:text-white">
                      {producto.name}
                    </h5>
                    <h4 className="text-xs my-2 py-1 text-center bg-dark rounded-lg  text-white ">
                      {" "}
                      {producto.productTypes[0].name}
                    </h4>
                  </Link>
                  <div className=" hidden items-center mt-2 mb-2">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className="w-4 h-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                      5.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      $ {producto.pricings[0].amount}
                    </span>
                    <button
                      onClick={() => addToCartHandler(producto.skuId, 1)}
                      className="text-dark bg-primary hover:bg-dark hover:text-white font-medium rounded-lg text-sm mt-1 px-2.5 py-2.5 text-center "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
