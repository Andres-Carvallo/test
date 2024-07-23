"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useAPI } from "@/app/Context/ProductTypeContext";
import Loader from "@/components/common/Loader";
import ProductCard02 from "@/components/PIXELUP/ProductCards/ProductCards02/ProductCard02";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Colecciones01: React.FC<any> = ({ CarruselData }) => {
  const [collectionData, setCollectionData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { addToCartHandler } = useAPI();
  const [collectionProduct, setCollectionProduct] = useState<any[]>([]);
  const [autoplay, setAutoplay] = useState(true);

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
      console.log(`SKUs para el producto ${productId}:`, data); // Log para verificar datos de SKUs
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
      console.log(`Rango de precios para producto variable ${product.id}:`, {
        minimumAmount,
        maximumAmount,
      }); // Log para verificar rangos de precios
      return { minimumAmount, maximumAmount };
    }
    return { minimumAmount: null, maximumAmount: null };
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const id = "4d04381a-4f7a-4f49-8095-8316081b3557";
        const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/collections/${id}?pageNumber=1&pageSize=50&siteId=${siteId}`
        );
        const collection = response.data.collection;
        setCollectionData(collection);

        // Fetch prices for each product
        const productsWithPrices = await Promise.all(
          collection.products.map(async (product: any) => {
            if (product.hasVariations) {
              const pricingRanges = await getPriceForVariableProduct(product);
              return { ...product, pricingRanges: [pricingRanges] };
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
              return { ...product, pricings: [{ amount: price }] };
            }
          })
        );

        setCollectionProduct(productsWithPrices);
      } catch (error) {
        console.error("Error al obtener el contacto:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader />;
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
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    /*     <>
      <title>{collectionData.bannerTitle}</title>
      <div className="z-10">
        <div className="flex w-full justify-center pt-6">
          <div className="flex flex-wrap max-w-[1500px] w-full justify-center gap-8 px-4 py-8">
            {collectionProduct.map((product: any) => {
              console.log(
                `Producto ${product.id} con precio:`,
                product.pricings || product.pricingRanges
              ); // Log para verificar precios pasados a ProductCard
              return (
                <ProductCard02
                  key={product.id}
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              );
            })}
          </div>
        </div>
      </div>
    </> */

    <div className="container mx-auto m-8 mt-16 max-w-7xl">
      <h1 className="mb-8 text-center text-3xl font-semibold text-primary sm:text-4xl">
        {collectionData.bannerTitle}
      </h1>

      <Carousel
        swipeable={true}
        draggable={true}
        showDots={false} /* necesito ver como bajar los puntos */
        responsive={responsive}
        infinite={true}
        autoPlay={autoplay}
        autoPlaySpeed={10000}
        keyBoardControl={true}
        customTransition="all .5s"
        transitionDuration={500}
        containerClass="carousel-container"
        /* removeArrowOnDeviceType={["tablet", "mobile"]} */
        dotListClass="custom-dot-list-style mt-16"
        itemClass="px-2 py-12" // Reducido el padding horizontal
      >
        {collectionProduct.map((product: any) => {
          return (
            <ProductCard02
              key={product.id}
              product={product}
              addToCartHandler={addToCartHandler}
            />
          );
        })}
      </Carousel>
      {/*         <div className="flex items-center justify-center"> 
  <button className="px-4 py-2 mt-12 tracking-wide text-secondary capitalize transition-colors duration-300 transform bg-primary hover:bg-secondary hover:text-primary" style={{ borderRadius: 'var(--radius)' }}>
    {textoboton}
  </button>
</div> */}
    </div>
  );
};

export default Colecciones01;
