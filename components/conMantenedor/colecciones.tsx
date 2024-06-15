"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAPI } from "@/app/Context/ProductTypeContext";

const Collection = () => {
  const [collectionData, setCollectionData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { addToCartHandler, products, setProducts } = useAPI();
  const [collectionProduct, setCollectionProduct] = useState<any | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/collections/${id}?pageNumber=1&pageSize=50&siteId=${siteId}`
        );
        const collection = response.data.collection;
        setCollectionProduct(collection.products);
        setCollectionData(collection);

        console.log(collection.products, "Product");
        console.log(collection, "collection");
      } catch (error) {
        console.error("Error al obtener el contacto:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
    return () => {};
  }, [id]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!collectionData) {
    return <p>No se encontraron datos de la colección.</p>;
  }

  return (
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
      <div className="w-full mx-auto ">
        <div className="p-4 mx-auto lg:max-w-6xl sm:max-w-full py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4 justify-items-center">
            {collectionProduct.map((product: any) => (
              <div
                key={product.id}
                className="w-80 bg-background p-4 shadow-xl"
                style={{ borderRadius: "var(--radius)" }}
              >
                <div
                  className=""
                  style={{ borderRadius: "var(--radius)" }}
                >
                  <Link
                    href={`/tienda/productos/${product.id}`}
                    className="group block overflow-hidden border shadow-sm"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    <div
                      className="h-60 relative bg-background flex flex-col justify-between p-6 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${product.previewImageUrl})`,
                      }}
                    >
                      <p
                        className="px-2 absolute top-1 py-1 mt-2 bg-primary text-secondary font-light text-xs text-center"
                        style={{ borderRadius: "var(--radius)" }}
                      >
                        {product.productTypes[0].name}
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="p-2 flex flex-col items-center">
                  <h1 className="text-black dark:text-white text-center font-semibold mt-1">
                    {product.name}
                  </h1>
                  <h3 className="text-black dark:text-white text-center text-xs mt-1">
                    {product.description.slice(0, 100)}
                    {product.description.length > 100 ? "..." : ""}
                  </h3>
                  {/* <p className="text-center text-black font-xs font-semibold dark:text-white mt-1">
              {renderPrice()}
            </p> */}
                  <div className="flex items-center justify-center">
                    {product.hasVariations ? (
                      <Link
                        href={`/tienda/productos/${product.id}`}
                        className="shadow text-center mt-4 py-2 px-4 bg-primary hover:bg-secondary text-secondary hover:text-primary"
                        style={{ borderRadius: "var(--radius)" }}
                      >
                        Ver más detalles
                      </Link>
                    ) : (
                      <button
                        className="shadow mt-4 py-2 px-4 bg-primary hover:bg-secondary text-secondary hover:text-primary"
                        style={{ borderRadius: "var(--radius)" }}
                        onClick={() => addToCartHandler(product.skuId, 1)}
                      >
                        Agregar al carrito
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
