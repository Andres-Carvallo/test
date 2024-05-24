/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { obtenerProductos } from "@/app/utils/obtenerProductos";
import { useAPI } from "@/app/Context/ProductTypeContext";
import BannerTienda from "@/components/conMantenedor/BannerTienda";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const ProductGridShop = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { addToCartHandler, products, setProducts } = useAPI();
  const [productTypes, setProductTypes] = useState([]);
  const [productTypeId, setProductTypeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const fetchProductos = async (productTypeId?: string) => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const PageNumber = 1;
      const PageSize = 8;
      const urlProductTypeId =
        productTypeId ?? searchParams.get("productTypeId");
      let data;
      if (urlProductTypeId) {
        if (urlProductTypeId === "ALL") {
          data = await obtenerProductos(SiteId, PageNumber, PageSize);
        } else {
          data = await obtenerProductos(
            SiteId,
            PageNumber,
            PageSize,
            urlProductTypeId
          );
        }
      } else {
        data = await obtenerProductos(SiteId, PageNumber, PageSize);
      }

      // Filtra los productos según el término de búsqueda
      const filteredProducts = data.products.filter((producto: any) =>
        producto.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setProducts(filteredProducts);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error as Error);
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const sortByPrice = (products: any, order: any) => {
    if (order === "asc") {
      return products
        .slice()
        .sort((a: any, b: any) => a.pricings[0].amount - b.pricings[0].amount);
    } else if (order === "desc") {
      return products
        .slice()
        .sort((a: any, b: any) => b.pricings[0].amount - a.pricings[0].amount);
    } else {
      // Si no se selecciona un orden válido, se devuelve sin ordenar
      return products;
    }
  };

  const handleSortChange = (order: string) => {
    const sortedProducts = sortByPrice(products, order);
    // Actualiza el estado con los productos ordenados
    setProducts(sortedProducts);
  };

  const updateURL = (pathname: any, value: any) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("productTypeId", value);
    const newURL = `${pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, "", newURL);
  };
  const fetchProductTypes = async () => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/product-types?siteId=${SiteId}&pageNumber=1&pageSize=50`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product types");
      }
      const data = await response.json();
      setProductTypes(data.productTypes);
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };
  const handleChangeCategories = async (value: any) => {
    // Actualizar el estado de productTypeId
    setProductTypeId(value);

    // Llamar a fetchProductos() con el valor más reciente de productTypeId
    try {
      await fetchProductos(value);

      updateURL(window.location.pathname, `${value}`);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchProductTypes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProductos(productTypeId || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, productTypeId]);

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
    <section className=" relative pb-12 z-0">
      <BannerTienda />
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className=" flex-col lg:flex-row lg:items-center max-lg:gap-4 justify-between w-full hidden">
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
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-3 w-full max-md:mx-auto">
            <div className="box rounded-xl border border-gray-300 bg-white p-6 w-full md:max-w-sm">
              <p className="text-xs text-gray-500 mb-2 uppercase">Ordenar</p>
              <div className="relative w-full max-w-xs mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute top-1/2 -translate-y-1/2 left-4 z-50 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                  />
                </svg>

                <select
                  onChange={(e) => handleSortChange(e.target.value)}
                  id="Offer"
                  className="h-12 border z-1 border-gray-300 text-gray-900 pl-11 text-base font-normal leading-7 rounded-full block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white transition-all duration-500 hover:border-gray-400 hover:bg-gray-50 focus-within:bg-gray-50"
                  defaultValue="option 1"
                >
                  <>
                    <option defaultValue="asc">Ordenar por...</option>
                    <option value="asc">Precio: Menor a Mayor</option>
                    <option value="desc">Precio: Mayor a Menor</option>
                  </>
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

              <p className="text-xs text-gray-500 mb-2 mt-6 uppercase">
                Buscar Producto
              </p>

              <div className="relative w-full">
                <input
                  id="FROM"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-12 border border-gray-300 text-gray-900 text-xs font-medium rounded-full block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white"
                ></input>
              </div>
              <p className="text-xs text-gray-500 mb-2 mt-6 uppercase">
                Categorías
              </p>
              <div className="relative w-full mt-2 mb-7">
                <select
                  className="h-12 border border-gray-300 text-gray-900 text-xs font-medium rounded-full block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white"
                  id="productType"
                  name="productType"
                  onChange={(e: any) => {
                    handleChangeCategories(e.target.value);
                  }}
                >
                  <option value="ALL">Todos</option>
                  {productTypes.map((productType: any) => (
                    <option
                      key={productType.id}
                      value={productType.id}
                    >
                      {productType.name}
                    </option>
                  ))}
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
          <div className="col-span-12 md:col-span-9 mt-4 md:mt-0 ">
            {" "}
            {/* Abre la columna */}
            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:ml-6">
              {products.map((producto: any) => (
                <div
                  key={producto.id}
                  className="w-full  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  <Link href={`/tienda/productos/${producto.id}`}>
                    <div
                      className="p-8 rounded-t-lg bg-cover bg-center "
                      style={{
                        backgroundImage: `url(${producto.previewImageUrl})`,
                        height: "300px",
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
          </div>{" "}
          {/* Cierra la columna */}
        </div>
      </div>
    </section>
  );
};

export default ProductGridShop;
