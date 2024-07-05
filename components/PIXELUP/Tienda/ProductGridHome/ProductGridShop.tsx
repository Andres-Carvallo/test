"use client";
import React, { useEffect, useState, useRef } from "react";
import { obtenerProductos } from "@/app/utils/obtenerProductos";
import { useAPI } from "@/app/Context/ProductTypeContext";
import BannerTienda from "@/components/conMantenedor/BannerTienda";
import Link from "next/link";
import ProductCard from "@/components/PIXELUP/Productos03/ProductCard";
import Loader from "@/components/common/Loader";
import ProductCard01 from "@/components/PIXELUP/ProductCards/ProductCards01/ProductCard01";

const ProductGridShop = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { addToCartHandler, products, setProducts } = useAPI();
  const [productTypes, setProductTypes] = useState([]);
  const [productTypeId, setProductTypeId] = useState<string | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(8); // Estado para la cantidad de productos por página
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [totalPages, setTotalPages] = useState(1); // Estado para el total de páginas

  // Referencia al contenedor de productos
  const productsRef = useRef<HTMLDivElement>(null);

  const fetchProductos = async (
    productTypeId?: string,
    pageNumber: number = 1
  ) => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const PageSize = pageSize; // Tamaño de página configurable
      const urlProductTypeId = productTypeId ?? undefined; // Convertir null a undefined

      let data;
      if (urlProductTypeId) {
        if (urlProductTypeId === "ALL") {
          data = await obtenerProductos(
            SiteId,
            pageNumber,
            PageSize,
            null,
            false
          );
        } else {
          data = await obtenerProductos(
            SiteId,
            pageNumber,
            PageSize,
            urlProductTypeId,
            false
          );
        }
      } else {
        data = await obtenerProductos(
          SiteId,
          pageNumber,
          PageSize,
          null,
          false
        );
      }

      // Actualiza el estado con la cantidad de productos por página y la cantidad de páginas
      setPageSize(data.pagination.pageSize);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(pageNumber);

      const filteredProducts = data.products.filter((producto: any) =>
        producto.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setProducts(filteredProducts);
      console.log(filteredProducts, "filas");
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
    return products.slice().sort((a: any, b: any) => {
      const getPrice = (product: any) => {
        if (product.hasVariations && product.pricingRanges) {
          return order === "asc"
            ? product.pricingRanges[0].maximumAmount
            : product.pricingRanges[0].minimumAmount;
        } else if (product.pricings) {
          return product.pricings[0].amount;
        } else {
          return Infinity;
        }
      };

      const priceA = getPrice(a);
      const priceB = getPrice(b);

      return order === "asc" ? priceA - priceB : priceB - priceA;
    });
  };

  const handleSortChange = (order: string) => {
    const sortedProducts = sortByPrice(products, order);
    setProducts(sortedProducts);
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

  const handleChangeCategories = async (value: string) => {
    setProductTypeId(value === "ALL" ? undefined : value);
    try {
      await fetchProductos(value === "ALL" ? undefined : value, 1); // Reset page to 1 on category change
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    fetchProductos(productTypeId, pageNumber);
    // Desplazarse a la sección de productos al cambiar de página
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchProductos();
    fetchProductTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProductos(productTypeId, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, productTypeId, currentPage]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-12">
        {/* Skeleton para el banner de ancho completo */}
        <div className="h-48 bg-gray-200 rounded"></div>

        {/* Skeleton para la grilla de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="relative pb-32 z-0">
      <BannerTienda />

      <div className="w-full px-16 mx-auto mt-12 ">
        <div
          ref={productsRef}
          className="absolute top-[19rem] left-0 w-full h-px"
        ></div>
        <div className="w-full max-md:mx-auto flex flex-wrap md:justify-between md:items-center gap-4 mb-8">
          <div className="w-full md:w-auto flex items-center">
            <p className="text-xs font-semibold w-full md:w-auto text-center md:text-left">
              Mostrando {pageSize} productos por página
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-64 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 absolute left-3 text-gray-400 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                id="FROM"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="shadow h-12 border border-gray-300 text-gray-900 text-xs font-medium rounded-full block w-full py-2.5 pl-10 pr-4 appearance-none focus:outline-none bg-white"
              />
            </div>

            <div className="relative w-full md:w-48 flex items-center">
              <select
                className="shadow h-12 border border-gray-300 text-gray-900 pl-4 pr-10 text-xs font-normal leading-7 rounded-full block w-full py-2.5 px-4 appearance-none focus:outline-none bg-white transition-all duration-500 hover:border-gray-400 hover:bg-gray-50 focus-within:bg-gray-50"
                id="productType"
                name="productType"
                onChange={(e) => handleChangeCategories(e.target.value)}
              >
                <option
                  value="ALL"
                  disabled
                >
                  Categorías
                </option>
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
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="absolute right-3 size-6 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>

            <div className="relative w-full md:w-48 flex items-center">
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                id="Offer"
                className="shadow h-12 border border-gray-300 text-gray-900 pl-4 pr-10 text-xs font-normal leading-7 rounded-full block w-full py-2.5 px-4 appearance-none focus:outline-none bg-white transition-all duration-500 hover:border-gray-400 hover:bg-gray-50 focus-within:bg-gray-50"
                defaultValue="asc"
              >
                <option value="asc">Ordenar por...</option>
                <option value="asc">Precio: Menor a Mayor</option>
                <option value="desc">Precio: Mayor a Menor</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="absolute right-3 size-6 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center pt-6">
          <div className="flex flex-wrap max-w-[1500px] w-full justify-center gap-8 px-4">
            {products.map((product: any) => (
              <ProductCard01
                key={product.id}
                product={product}
                addToCartHandler={addToCartHandler}
              />
            ))}
          </div>
        </div>

        {/* PAGINATION */}
        <div
          aria-label="Page navigation example"
          className="mt-10 flex justify-center pt-8"
        >
          <ul className="flex items-center -space-x-px h-10 text-base">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
                  currentPage === 1 ? "cursor-not-allowed" : ""
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-3 h-3 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePageChange(index + 1)}
                  className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
                    currentPage === index + 1
                      ? "text-blue-600 border-blue-300 bg-blue-50"
                      : ""
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                  currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-3 h-3 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProductGridShop;
