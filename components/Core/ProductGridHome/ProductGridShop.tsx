"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAPI } from "@/app/Context/ProductTypeContext";
import { useRevalidation } from "@/app/Context/RevalidationContext";
import { slugify } from "@/app/utils/slugify";
import Loader from "@/components/common/Loader-t";
import { getActiveComponents } from "@/app/config/GlobalConfig";

interface ProductGridShopProps {
  initialProducts: any[];
  initialProductTypes: any[];
  selectedCategory: string | null;
  currentPage: number;
}

const ProductGridShop = ({
  initialProducts,
  initialProductTypes,
  selectedCategory,
  currentPage: initialPage,
}: ProductGridShopProps) => {
  const { ProductCard } = getActiveComponents();
  const { shouldRevalidate, setShouldRevalidate } = useRevalidation();
  const [products, setProducts] = useState(initialProducts);
  const [productTypes] = useState(initialProductTypes);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string>("asc");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCartHandler } = useAPI();
  const pageSize = 12;

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const delta = 1; // Número de páginas a mostrar antes y después de la página actual
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        i === currentPage || 
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  // Efecto para recargar datos cuando shouldRevalidate es true
  useEffect(() => {
    if (shouldRevalidate) {
      setIsLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}&pageNumber=1&pageSize=1000`
      )
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.products);
          setShouldRevalidate(false);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error reloading products:", error);
          setIsLoading(false);
        });
    }
  }, [shouldRevalidate, setShouldRevalidate]);

  // Efecto para desactivar el loader después de cualquier navegación
  useEffect(() => {
    setIsLoading(false);
  }, [page, selectedCategory]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    setIsLoading(true);
    setPage(newPage);

    // Añadir referencia a la sección de productos
    const productSection = document.querySelector(".product-grid-section");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }

    router.push(`/tienda?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (categoryId: string) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "ALL") {
      params.delete("categoria");
      params.delete("page");
      router.push(`/tienda`);
    } else {
      const selectedCategoryData = productTypes.find(
        (category: any) => category.id === categoryId
      );
      if (selectedCategoryData) {
        params.set("categoria", slugify(selectedCategoryData.name));
        params.delete("page");
        router.push(`/tienda?${params.toString()}`);
      }
    }
    setPage(1);
  };

  // Filtrar productos según la categoría seleccionada
  const filteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory === "ALL") {
      return products;
    }

    return products.filter((product: any) => {
      if (product.productTypes && Array.isArray(product.productTypes)) {
        return product.productTypes.some(
          (type: any) => slugify(type.name) === selectedCategory
        );
      }
      return false;
    });
  }, [products, selectedCategory]);

  // Ordenar productos filtrados
  const sortedProducts = useMemo(() => {
    return filteredProducts.slice().sort((a, b) => {
      const getPrice = (product: any) => {
        let priceRange = {
          min: Infinity,
          max: -Infinity,
        };

        if (
          !product.hasVariations &&
          product.offers &&
          product.offers.length > 0
        ) {
          priceRange.min = product.offers[0].amount;
          priceRange.max = product.offers[0].amount;
        } else if (product.hasVariations && product.pricingRanges) {
          priceRange.min = product.pricingRanges[0].minimumAmount;
          priceRange.max = product.pricingRanges[0].maximumAmount;
        } else if (product.pricings) {
          priceRange.min = product.pricings[0].amount;
          priceRange.max = product.pricings[0].amount;
        }

        return sortBy === "asc" ? priceRange.min : priceRange.max;
      };

      const priceA = getPrice(a);
      const priceB = getPrice(b);

      return sortBy === "asc" ? priceA - priceB : priceB - priceA;
    });
  }, [filteredProducts, sortBy]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedProducts.slice(startIndex, startIndex + pageSize);
  }, [sortedProducts, page, pageSize]);

  const totalPages = Math.ceil(sortedProducts.length / pageSize);

  const handleSortChange = (order: string) => {
    setSortBy(order);
    setPage(1);
  };

  // Modificamos el valor del select para manejar correctamente "ALL"
  const currentValue =
    selectedCategory === "ALL" || !selectedCategory
      ? "ALL"
      : productTypes.find((pt: any) => slugify(pt.name) === selectedCategory)
          ?.id || "ALL";

  // Modificamos la condición de renderizado del loader
  if (isLoading) {
    return (
      <section className="relative pb-32 z-0">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </section>
    );
  }

  return (
    <section className="relative pb-32 z-0 product-grid-section">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 pt-8 px-4">
        <div className="w-full md:w-auto">
          <p className="text-xs font-semibold text-center md:text-left">
            Mostrando {paginatedProducts.length} productos por página
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:w-48">
            <select
              className="w-full shadow h-12 border border-gray-300 text-gray-900 text-xs font-normal leading-7 rounded-full py-2.5 px-4 appearance-none focus:outline-none bg-white transition-all duration-500 hover:border-gray-400 hover:bg-gray-50"
              id="productType"
              name="productType"
              value={currentValue}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="ALL">Todas las categorías</option>
              {productTypes?.map((productType: any) => (
                <option
                  key={productType.id}
                  value={productType.id}
                >
                  {productType.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              id="Offer"
              className="w-full shadow h-12 border border-gray-300 text-gray-900 text-xs font-normal leading-7 rounded-full py-2.5 px-4 appearance-none focus:outline-none bg-white transition-all duration-500 hover:border-gray-400 hover:bg-gray-50"
            >
              <option value="asc">Ordenar por...</option>
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center">
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 max-w-[1100px]">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="flex justify-center"
                >
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCartHandler={addToCartHandler}
                    isOnSale={product.offers && product.offers.length > 0}
                    stock={product.stock}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-8">
                <p className="text-center text-gray-500">
                  No se encontraron productos en esta categoría
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {getPageNumbers(page, totalPages).map((pageNum, index) => (
              <button
                key={index}
                onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : undefined}
                className={`px-3 py-1 text-sm border rounded-md transition-colors duration-200 ${
                  pageNum === page
                    ? "bg-primary text-white border-primary"
                    : pageNum === '...'
                    ? "bg-white border-gray-300 cursor-default"
                    : "bg-white hover:bg-gray-50 border-gray-300"
                }`}
                disabled={pageNum === '...'}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductGridShop;
