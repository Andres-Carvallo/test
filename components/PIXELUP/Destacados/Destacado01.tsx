"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAPI } from "@/app/Context/ProductTypeContext";
import Link from "next/link";
import ProductCard02 from "../ProductCards/ProductCards02/ProductCard02";
import ProductCard01 from "@/components/PIXELUP/ProductCards/ProductCards01/ProductCard01";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface Product {
  id: string;
  skuId: string;
  stock?: any;
  // Otros campos que puedan estar en el producto
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const Destacados01: React.FC<any> = ({
  text,
  ProductCardComponent = ProductCard01,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { addToCartHandler } = useAPI();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchStockForVariation = async (productId: string, skuId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/inventories?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        { next: { tags: ["inventory"] } }
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

  const fetchProducts = async (page: number) => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const pageSize = 4; // Número de productos por página

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products?pageNumber=${page}&pageSize=${pageSize}&isFeatured=true&siteId=${SiteId}`,
        { next: { tags: ["products"] } }
      );

      const data = await response.json();

      const productsWithStock = await Promise.all(
        data.products.map(async (producto: any) => {
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

      setProducts(productsWithStock);
      setAllProducts((prev) => [...prev, ...productsWithStock]);
      setPagination({
        currentPage: data.pagination.pageNumber,
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.totalRecords,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error as Error);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleNext = () => {
    if (currentIndex < allProducts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (
        (currentIndex + 1) % 4 === 0 &&
        pagination.currentPage < pagination.totalPages
      ) {
        setLoading(true);
        fetchProducts(pagination.currentPage + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (currentIndex % 4 === 0 && pagination.currentPage > 1) {
        setLoading(true);
        fetchProducts(pagination.currentPage - 1);
      }
    }
  };

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-900 w-full">
        <div className="container px-6 py-10 mx-auto animate-pulse">
          <h1 className="w-48 h-2 mx-auto bg-gray-200 rounded-lg dark:bg-gray-700" />
          <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
          <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg sm:w-80 dark:bg-gray-700" />
          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-full"
              >
                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600" />
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const CustomButtonGroupAsArrows = () => {
    return (
      <div className="absolute inset-y-0 lg:-left-5 lg:-right-5 lg:flex items-center justify-between px-4 pointer-events-none">
        <button
          className={`text-gray-900 rounded-full h-10 w-10 flex items-center justify-center pointer-events-auto hover:transform hover:scale-125 ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          className={`text-gray-900 rounded-full h-10 w-10 flex items-center justify-center pointer-events-auto hover:transform hover:scale-125 ${
            currentIndex === pagination.totalItems - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleNext}
          disabled={currentIndex === pagination.totalItems - 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto m-8 max-w-6xl relative">
      <h1 className="text-center text-3xl font-semibold text-primary sm:text-4xl">
        {text}
      </h1>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <Carousel
          swipeable={true}
          draggable={true}
          ssr={true}
          showDots={true}
          responsive={responsive}
          infinite={false}
          autoPlay={false}
          arrows={false}
          keyBoardControl={true}
          customTransition="all .5s"
          transitionDuration={500}
          containerClass="carousel-container relative"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style mt-12"
          itemClass="px-2 mb-12"
          customButtonGroup={<CustomButtonGroupAsArrows />}
          renderButtonGroupOutside={true}
          beforeChange={(nextSlide) => {
            if (nextSlide > currentIndex) {
              handleNext();
            } else {
              handlePrevious();
            }
          }}
        >
          {allProducts.map((product: any) => (
            <ProductCardComponent
              key={product.id}
              product={product}
              addToCartHandler={addToCartHandler}
              isOnSale={product.offers && product.offers.length > 0}
              stock={product.stock}
            />
          ))}
        </Carousel>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <Link
          className="px-4 cursor-pointer py-2 mt-2 tracking-wide text-secondary capitalize transition-colors duration-300 transform bg-primary hover:scale-105 rounded"
          href="/tienda/"
        >
          Ir a Tienda
        </Link>
      </div>
    </div>
  );
};

export default Destacados01;

const getInventoryId = async (
  id: string,
  skuId: string
): Promise<number | null> => {
  try {
    const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${id}/skus/${skuId}/inventories?siteId=${SiteId}`
    );
    if (response.data && response.data.skuInventories) {
      return response.data.skuInventories[0]?.quantity || null;
    } else {
      console.error(
        "No se encontraron inventarios para el SKU en el almacén especificado."
      );
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo inventoryId:", error);
    return null;
  }
};
