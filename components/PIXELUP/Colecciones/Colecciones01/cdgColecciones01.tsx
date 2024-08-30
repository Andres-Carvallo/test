"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAPI } from "@/app/Context/ProductTypeContext";
import ProductCard02 from "@/components/PIXELUP/ProductCards/ProductCards02/ProductCard02";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";

const Colecciones01: React.FC<any> = ({ id, coleccion, text }) => {
  const [collectionData, setCollectionData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { addToCartHandler } = useAPI();
  const [collectionProduct, setCollectionProduct] = useState<any[]>([]);
  const [autoplay, setAutoplay] = useState(true);

  const CustomButtonGroupAsArrows = ({
    next,
    previous,
  }: {
    next?: () => void;
    previous?: () => void;
  }) => {
    return (
      <div className="absolute inset-y-0 -left-5 -right-5 top-[20%] flex items-center justify-between px-4 pointer-events-none">
        <button
          className="text-gray-900 rounded-full h-10 w-10 flex items-center justify-center pointer-events-auto hover:transform hover:scale-125"
          onClick={previous}
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
          className="text-gray-900 rounded-full h-10 w-10 flex items-center justify-center pointer-events-auto hover:transform hover:scale-125"
          onClick={next}
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

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoplay(!autoplay);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const fetchPriceForProduct = async (productId: string, skuId: string) => {
    try {
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/pricings?siteId=${siteId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener el precio de la variación:", error);
      return null;
    }
  };

  const fetchSkusForProduct = async (productId: string) => {
    try {
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus?siteId=${siteId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los SKUs del producto:", error);
      return null;
    }
  };

  const getPriceForVariableProduct = async (product: any) => {
    const skus = await fetchSkusForProduct(product.id);
    if (skus && skus.skus && skus.skus.length > 0) {
      const prices = await Promise.all(
        skus.skus.map(async (sku: any) => {
          const priceData = await fetchPriceForProduct(product.id, sku.id);
          return priceData &&
            priceData.skuPricings &&
            priceData.skuPricings.length > 0
            ? priceData.skuPricings[0].unitPrice
            : null;
        })
      );
      const validPrices = prices.filter((price) => price !== null);
      const minimumAmount = Math.min(...validPrices);
      const maximumAmount = Math.max(...validPrices);
      return { minimumAmount, maximumAmount };
    }
    return { minimumAmount: null, maximumAmount: null };
  };
  const fetchStockForProduct = async (productId: string, skuId: string) => {
    try {
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/inventories?siteId=${siteId}`
      );
      const data = await response.json();
      if (data.code === 0 && data.skuInventories.length > 0) {
        return data.skuInventories.reduce(
          (acc: number, inventory: any) => acc + inventory.quantity,
          0
        );
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error fetching stock:", error);
      return 0;
    }
  };
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/collections/${id}?pageNumber=1&pageSize=50&siteId=${siteId}`
        );
        const collection = response.data.collection;
        setCollectionData(collection);

        const selectedProductsFromApi = collection.products.filter(
          (product: any) => product.statusCode === "ACTIVE"
        );

        const productsWithDetails = await Promise.all(
          selectedProductsFromApi.map(async (product: any) => {
            let stock = null;
            if (!product.hasVariations && product.skuId) {
              stock = await fetchStockForProduct(product.id, product.skuId);
            }

            if (product.hasVariations) {
              const pricingRanges = await getPriceForVariableProduct(product);
              return { ...product, pricingRanges: [pricingRanges], stock };
            } else {
              const priceData = await fetchPriceForProduct(
                product.id,
                product.skuId
              );
              const price =
                priceData &&
                priceData.skuPricings &&
                priceData.skuPricings.length > 0
                  ? priceData.skuPricings[0].unitPrice
                  : null;
              return { ...product, pricings: [{ amount: price }], stock };
            }
          })
        );

        setCollectionProduct(productsWithDetails);
      } catch (error) {
        console.error("Error al obtener el contacto:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div>
        {" "}
        <section className="bg-white dark:bg-gray-900">
          <div className="container px-6 py-10 mx-auto animate-pulse">
            <h1 className="w-48 h-2 mx-auto bg-gray-200 rounded-lg dark:bg-gray-700"></h1>

            <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg sm:w-80 dark:bg-gray-700"></p>

            <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>

                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
              </div>

              <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>

                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
              </div>

              <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>

                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!collectionData) {
    return <p>No se encontraron datos de la colección.</p>;
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
    minitablet: {
      breakpoint: { max: 724, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const shouldShowMoreButton = collectionProduct.length > 4;
  const shouldShowArrows = collectionProduct.length > 3;

  return (
    <div className="container mx-auto m-8 mt-16 max-w-7xl relative">
      <h1 className="text-center text-3xl font-semibold text-primary sm:text-4xl">
        {coleccion}
      </h1>
      <p className="text-center mt-4 text-gray-500">{text}</p>

      <Carousel
        swipeable={true}
        draggable={true}
        ssr={true}
        showDots={true}
        responsive={responsive}
        infinite={true}
        autoPlay={autoplay}
        arrows={false}
        autoPlaySpeed={10000}
        keyBoardControl={true}
        customTransition="all .5s"
        transitionDuration={500}
        containerClass="carousel-container relative"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style mt-16"
        itemClass="px-2 py-12"
        customButtonGroup={
          shouldShowArrows ? <CustomButtonGroupAsArrows /> : null
        }
        renderButtonGroupOutside={true}
      >
        {collectionProduct.map((product: any) => (
          <ProductCard02
            key={product.id}
            product={product}
            addToCartHandler={addToCartHandler}
            isOnSale={product.offers && product.offers.length > 0}
            stock={product.stock}
          />
        ))}
      </Carousel>

      {shouldShowMoreButton && (
        <div className="flex items-center justify-center">
          <Link
            href={`/tienda/colecciones/${id}`}
            className="px-4 py-2 mt-12 tracking-wide text-secondary capitalize transition-colors duration-300 transform bg-primary hover:scale-105 rounded"
          >
            Ver más
          </Link>
        </div>
      )}
    </div>
  );
};

export default Colecciones01;
