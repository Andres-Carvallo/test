/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerProductos } from "@/app/utils/obtenerProductos";
import { obtenerPrecioProducto } from "@/app/utils/obtenerPrecioProducto";
import HeroSection from "@/components/Banners/HeroSection";
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

const ProductGridShop = () => {
  const [productos, setProductos] = useState<ProductoConPrecio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const SiteId = `${process.env.NEXT_PUBLIC_API_URL_SITEID}`;
        const PageNumber = 1;
        const PageSize = 10;
        const ProductTypeId = "58e982fe-75f8-4d15-bd0a-00126a0ed2d9";

        const data = await obtenerProductos(
          SiteId,
          PageNumber,
          PageSize
          //ProductTypeId
        );

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-svh">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <section className=" relative pb-12">
      <HeroSection />
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center max-lg:gap-4 justify-between w-full">
          <ul className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
            <li className="flex items-center cursor-pointer outline-none group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
                />
              </svg>
              <span className="font-normal text-md uppercase leading-8 text-indigo-600 ml-2 mr-3 transition-all duration-500 group-hover:text-indigo-600">
                Más Vendidos
              </span>
              <button className="flex aspect-square h-6 rounded-full border border-indigo-600  items-center justify-center font-manrope font-medium text-base text-indigo-600  transition-all duration-500 group-hover:border-indigo-600 group-hover:text-indigo-600">
                8
              </button>
            </li>

            <li className="flex items-center cursor-pointer outline-none group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span className="font-normal uppercase text-md leading-8 text-black pl-2 pr-3 transition-all duration-500 group-hover:text-indigo-600">
                En Oferta
              </span>
              <span className="w-6 h-6 rounded-full border border-gray-900 flex items-center justify-center font-manrope font-medium text-base text-gray-900 transition-all duration-500 group-hover:border-indigo-600 group-hover:text-indigo-600">
                3
              </span>
            </li>

            <li className="flex items-center cursor-pointer outline-none group">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="stroke-black transition-all duration-500 group-hover:stroke-indigo-600"
                  d="M9.69081 22H13.537M11.6139 2V3.53846M18.4123 4.8163L17.3244 5.90416M4.8155 4.81701L5.90336 5.90486M2 11.6154H3.53846M19.6893 11.6154H21.2278M7.53442 15.6948C5.2814 13.4418 5.2814 9.78895 7.53442 7.53592C9.78744 5.2829 13.4403 5.2829 15.6933 7.53592C17.9464 9.78895 17.9464 13.4418 15.6933 15.6948C15.1999 16.1883 14.6393 16.5737 14.041 16.851C13.745 16.9881 13.537 17.2743 13.537 17.6005L13.537 18.9231C13.537 19.3479 13.1926 19.6923 12.7677 19.6923H10.46C10.0352 19.6923 9.69081 19.3479 9.69081 18.9231V17.6005C9.6908 17.2743 9.48274 16.9881 9.18677 16.851C8.58845 16.5737 8.02786 16.1883 7.53442 15.6948Z"
                  stroke="black"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-normal text-md uppercase leading-8 text-black pl-2 pr-3 transition-all duration-500 group-hover:text-indigo-600">
                Nuevos
              </span>
              <span className="w-6 h-6 rounded-full border border-gray-900 flex items-center justify-center font-manrope font-medium text-base text-gray-900 transition-all duration-500 group-hover:border-indigo-600 group-hover:text-indigo-600">
                1
              </span>
            </li>
          </ul>
          <div className="relative w-full max-w-xs">
            <svg
              className="absolute top-1/2 -translate-y-1/2 left-4 z-50"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5555 3.33203H3.44463C2.46273 3.33203 1.66675 4.12802 1.66675 5.10991C1.66675 5.56785 1.84345 6.00813 2.16004 6.33901L6.83697 11.2271C6.97021 11.3664 7.03684 11.436 7.0974 11.5068C7.57207 12.062 7.85127 12.7576 7.89207 13.4869C7.89728 13.5799 7.89728 13.6763 7.89728 13.869V16.251C7.89728 17.6854 9.30176 18.6988 10.663 18.2466C11.5227 17.961 12.1029 17.157 12.1029 16.251V14.2772C12.1029 13.6825 12.1029 13.3852 12.1523 13.1015C12.2323 12.6415 12.4081 12.2035 12.6683 11.8158C12.8287 11.5767 13.0342 11.3619 13.4454 10.9322L17.8401 6.33901C18.1567 6.00813 18.3334 5.56785 18.3334 5.10991C18.3334 4.12802 17.5374 3.33203 16.5555 3.33203Z"
                stroke="black"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </svg>
            <select
              id="Offer"
              className="h-12 border border-gray-300 text-gray-900 pl-11 text-base font-normal leading-7 rounded-full block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white transition-all duration-500 hover:border-gray-400 hover:bg-gray-50 focus-within:bg-gray-50"
            >
              <option selected={true}>Ordena Por</option>
              <option value="option 1">option 1</option>
              <option value="option 2">option 2</option>
              <option value="option 3">option 3</option>
              <option value="option 4">option 4</option>
            </select>
            <svg
              className="absolute top-1/2 -translate-y-1/2 right-4 z-50"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609"
                stroke="#111827"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <svg
          className="my-7 w-full"
          xmlns="http://www.w3.org/2000/svg"
          width="1216"
          height="2"
          viewBox="0 0 1216 2"
          fill="none"
        >
          <path
            d="M0 1H1216"
            stroke="#E5E7EB"
          />
        </svg>
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-3 w-full max-md:max-w-md max-md:mx-auto">
            <div className="box rounded-xl border border-gray-300 bg-white p-6 w-full md:max-w-sm">
              <h6 className="font-medium text-base leading-7 text-black mb-5">
                Buscar Producto
              </h6>

              <div className="relative w-full mb-8">
                <input
                  id="FROM"
                  className="h-12 border border-gray-300 text-gray-900 text-xs font-medium rounded-full block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white"
                ></input>
              </div>
              <button className="w-full py-2.5 flex items-center justify-center gap-2 rounded-full bg-indigo-600 text-white font-semibold text-xs shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-200  ">
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.4987 13.9997L13.1654 12.6663M13.832 7.33301C13.832 10.6467 11.1457 13.333 7.83203 13.333C4.51832 13.333 1.83203 10.6467 1.83203 7.33301C1.83203 4.0193 4.51832 1.33301 7.83203 1.33301C11.1457 1.33301 13.832 4.0193 13.832 7.33301Z"
                    stroke="white"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Search
              </button>
            </div>

            <div className="mt-7 box rounded-xl border border-gray-300 bg-white p-6 w-full md:max-w-sm">
              <div className="flex items-center justify-between w-full pb-3 border-b border-gray-200 mb-7">
                <p className="font-medium uppercase text-base leading-7 text-black ">
                  Filtros
                </p>
                <p className="font-medium text-xs text-gray-500 cursor-pointer transition-all duration-500 hover:text-indigo-600">
                  RESET
                </p>
              </div>

              <div className="w-full mb-7">
                <div className="flex items-center mb-5 gap-1">
                  <p className="text-xs text-gray-500">PRECIO</p>
                  <div className="relative w-full">
                    <select
                      id="preciofilter"
                      className="h-12 border border-gray-300 text-gray-900 text-xs font-medium rounded-full block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white"
                    >
                      <option selected={true}>Min</option>
                      <option value="option 1">option 1</option>
                      <option value="option 2">option 2</option>
                      <option value="option 3">option 3</option>
                      <option value="option 4">option 4</option>
                    </select>
                    <svg
                      className="absolute top-1/2 -translate-y-1/2 right-4 z-50"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609"
                        stroke="#111827"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="px-1 font-normal text-sm leading-6 text-gray-600">
                    to
                  </p>
                  <div className="relative w-full">
                    <select
                      id="FROM"
                      className="h-12 border border-gray-300 text-gray-900 text-xs font-medium rounded-full block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white"
                    >
                      <option selected={true}>Max</option>
                      <option value="option 1">option 1</option>
                      <option value="option 2">option 2</option>
                      <option value="option 3">option 3</option>
                      <option value="option 4">option 4</option>
                    </select>
                    <svg
                      className="absolute top-1/2 -translate-y-1/2 right-4 z-50"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609"
                        stroke="#111827"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <label
                htmlFor="Offer"
                className="font-medium text-sm uppercase  text-gray-600"
              >
                Categorías
              </label>
              <div className="relative w-full mt-2 mb-7">
                <select
                  id="Offer"
                  className="h-12 border border-gray-300 text-gray-900 text-xs font-medium rounded-full block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white"
                >
                  <option selected={true}>option 0</option>
                  <option value="option 1">option 1</option>
                  <option value="option 2">option 2</option>
                  <option value="option 3">option 3</option>
                  <option value="option 4">option 4</option>
                </select>
                <svg
                  className="absolute top-1/2 -translate-y-1/2 right-4 z-50"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609"
                    stroke="#111827"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-medium text-sm leading-6 text-black mb-3">
                Discount
              </p>
              <div className="box flex flex-col gap-2">
                <div className="flex items-center">
                  <input
                    id="checkbox-default-1"
                    type="checkbox"
                    className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]"
                  />
                  <label
                    htmlFor="checkbox-default-1"
                    className="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
                  >
                    20% or more
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="checkbox-default-2"
                    type="checkbox"
                    className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]"
                  />
                  <label
                    htmlFor="checkbox-default-2"
                    className="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
                  >
                    30% or more
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="checkbox-default-3"
                    type="checkbox"
                    className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]"
                  />
                  <label
                    htmlFor="checkbox-default-3"
                    className="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
                  >
                    50% or more
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            {" "}
            {/* Abre la columna */}
            <div className="grid grid-cols-1 p-6 sm:grid-cols-2 md:grid-cols-3  gap-2">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-gray-50 w-auto shadow-md overflow-hidden rounded cursor-pointer hover:-translate-y-2 transition-all relative"
                >
                  <div className="bg-white shadow-lg w-10 h-10 flex items-center justify-center rounded-full cursor-pointer absolute top-3 right-3">
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
                      alt={producto.name}
                      className=" object-contain w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{producto.name}</h3>
                    <p className="text-sm text-gray-600">
                      {producto.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {producto.precio
                          ? `$${producto.precio}`
                          : "Precio no disponible"}
                      </span>
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>{" "}
          {/* Cierra la columna */}
        </div>
      </div>
    </section>
  );
};

export default ProductGridShop;
