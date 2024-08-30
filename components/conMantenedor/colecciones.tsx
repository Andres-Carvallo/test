"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useAPI } from "@/app/Context/ProductTypeContext";
import Loader from "../common/Loader";
import ProductCard from "@/components/PIXELUP/ProductCards/ProductCards01/ProductCard01";
import ProductCard02 from "../PIXELUP/ProductCards/ProductCards02/ProductCard02";

const Collection = () => {
  const [collectionData, setCollectionData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { addToCartHandler } = useAPI();
  const [collectionProduct, setCollectionProduct] = useState<any[]>([]);
  const { id } = useParams();

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
        const activeProducts = collection.products.filter(
          (product: any) => product.statusCode === "ACTIVE"
        );
        setCollectionData(collection);

        // Fetch prices and stock for each product
        const productsWithDetails = await Promise.all(
          activeProducts.map(async (product: any) => {
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
    return <Loader />;
  }

  if (!collectionData) {
    return <p>No se encontraron datos de la colección.</p>;
  }

  return (
    <>
      <title>{collectionData.bannerTitle}</title>
      <meta
        name="description"
        content={collectionData.bannerText}
      />
      <div className="z-10">
        {collectionData && (
          <div className="relative font-[sans-serif] before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-50 before:z-10">
            <img
              src={collectionData.mainImageUrl}
              alt="mainImageUrl"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="min-h-[300px] relative z-10 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
              <h2 className="sm:text-4xl text-2xl font-bold mb-6">
                {collectionData.bannerTitle}
              </h2>
              <p className="text-lg text-center text-gray-200">
                {collectionData.bannerText}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center mx-auto px-4 pt-20 pb-40">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 min-w-[300px]">
            {collectionProduct.map((product: any) => {
              return (
                <ProductCard02
                  key={product.id}
                  product={product}
                  addToCartHandler={addToCartHandler}
                  isOnSale={product.offers && product.offers.length > 0}
                  stock={product.stock}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collection;
