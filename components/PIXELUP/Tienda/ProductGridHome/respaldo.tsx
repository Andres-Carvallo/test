"use client";
import React, { useEffect, useState, useRef } from "react";
import { obtenerProductos } from "@/app/utils/obtenerProductos";
import { useAPI } from "@/app/Context/ProductTypeContext";
import BannerTienda from "@/components/conMantenedor/BannerTienda";
import ProductCard02 from "../../ProductCards/ProductCards02/ProductCard02";
import ProductCard01 from "../../ProductCards/ProductCards01/ProductCard01";
import Loader from "@/components/common/Loader";

const ProductGridShop = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { addToCartHandler, products, setProducts } = useAPI();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [productTypeId, setProductTypeId] = useState<string | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(12); // Cantidad de productos por página
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  const productsRef = useRef<HTMLDivElement>(null);

  const fetchProductos = async (productTypeId?: string) => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const PageSize = 1000; // Incrementar para obtener todos los productos

      let data: any[] = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const response = await obtenerProductos(
          SiteId,
          currentPage,
          PageSize,
          productTypeId ?? undefined,
          false
        );

        data = data.concat(response.products);
        totalPages = response.pagination.totalPages;
        currentPage++;
      }

      const filtered: any = data.filter((producto: any) =>
        producto.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Obtener el stock de los productos simples
      const productsWithStock = await Promise.all(
        filtered.map(async (producto: any) => {
          if (!producto.hasVariations && producto.skuId) {
            const stock = await fetchStockForVariation(
              producto.id,
              producto.skuId
            );

            return { ...producto, stock } as any;
          }
          return { ...producto, stock: null } as any;
        })
      );

      setFilteredProducts(productsWithStock as any); // Usar los productos con stock actualizado
      setTotalPages(Math.ceil(productsWithStock.length / pageSize));
      updatePaginatedProducts(productsWithStock, 1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error as Error);
    }
  };

  const fetchStockForVariation = async (productId: string, skuId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/inventories?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      const data = await response.json();
      let stock = 0;
      if (data.code === 0 && data.skuInventories.length > 0) {
        stock = data.skuInventories.reduce(
          (acc: number, inventory: any) => acc + inventory.quantity,
          0
        );
      }

      return stock;
    } catch (error) {
      console.error("Error fetching stock:", error);
      return 0;
    }
  }; 

  const updatePaginatedProducts = (products: any[], page: number) => {
    const startIndex = (page - 1) * pageSize;
    const paginated: any = products.slice(startIndex, startIndex + pageSize);
    setPaginatedProducts(paginated);
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (order: string) => {
    const sortedProducts: any = sortByPrice(filteredProducts, order);
    setFilteredProducts(sortedProducts);
    updatePaginatedProducts(sortedProducts, 1);
  };

  const sortByPrice = (products: any[], order: string) => {
    return products.slice().sort((a, b) => {
      const getPrice = (product: any) => {
        let priceRange = {
          min: Infinity,
          max: -Infinity,
        };
  
        // Priorizar el precio de oferta si el producto no tiene variaciones y tiene una oferta
        if (!product.hasVariations && product.offers && product.offers.length > 0) {
          priceRange.min = product.offers[0].amount;
          priceRange.max = product.offers[0].amount;
        } else if (product.hasVariations && product.pricingRanges) {
          // Verificar si tiene variaciones y rangos de precios
          priceRange.min = Math.min(
            priceRange.min,
            product.pricingRanges[0].minimumAmount
          );
          priceRange.max = Math.max(
            priceRange.max,
            product.pricingRanges[0].maximumAmount
          );
        } else if (product.pricings) {
          // Si no tiene oferta y no tiene variaciones, usar el precio normal
          priceRange.min = Math.min(priceRange.min, product.pricings[0].amount);
          priceRange.max = Math.max(priceRange.max, product.pricings[0].amount);
        }

        // Devolver el precio dependiendo del orden solicitado (ascendente o descendente)
        return order === "asc" ? priceRange.min : priceRange.max;
      };
  
      const priceA = getPrice(a);
      const priceB = getPrice(b);
  
      return order === "asc" ? priceA - priceB : priceB - priceA;
    });
  };
  
  

  const handlePageChange = (page: number) => {
    updatePaginatedProducts(filteredProducts, page);
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
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
    await fetchProductos(value === "ALL" ? undefined : value);
  };

  useEffect(() => {
    fetchProductos();
    fetchProductTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updatePaginatedProducts(filteredProducts, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts]);

  useEffect(() => {
    fetchProductos(productTypeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-12">
        <div className="h-48 bg-gray-200 rounded"></div>
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

      <div className="w-full px-4 md:px-16 mx-auto mt-12">
        <div
          ref={productsRef}
          className="absolute top-[19rem] left-0 w-full h-px"
        ></div>
        <div className="w-full max-md:mx-auto flex flex-wrap md:justify-between md:items-center gap-4 mb-8">
          <div className="w-full md:w-auto flex items-center">
            <p className="text-xs font-semibold w-full md:w-auto text-center md:text-left">
              Mostrando {paginatedProducts.length} productos por página
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-64 flex items-center">
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
                <option value="ALL">Todas las categorías</option>
                {productTypes.map((productType: any) => (
                  <option
                    key={productType.id}
                    value={productType.id}
                  >
                    {productType.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-48 flex items-center">
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                id="Offer"
                className="shadow h-12 border border-gray-300 text-gray-900 pl-4 pr-10 text-xs font-normal leading-7 rounded-full block w-full py-2.5 px-4 appearance-none focus:outline-none bg-white transition-all duration-500 hover:border-gray-400 hover:bg-gray-50 focus-within:bg-gray-50"
              >
                <option value="asc">Ordenar por...</option>
                <option value="asc">Precio: Menor a Mayor</option>
                <option value="desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center mx-auto px-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 min-w-[300px] max-w-[1100px]">
            {paginatedProducts.map((product: any) => (
              <ProductCard02
                key={product.id}
                product={product}
                addToCartHandler={addToCartHandler}
                isOnSale={product.offers && product.offers.length > 0}
                stock={product.stock}
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
                  className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500  border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
                    currentPage === index + 1
                      ? "text-primary bg-gray-200"
                      : "text-gray-300 bg-white"
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
                    d="M1 9l4-4-4-4"
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
