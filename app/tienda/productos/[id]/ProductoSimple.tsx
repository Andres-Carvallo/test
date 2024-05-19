/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { obtenerProductosID } from "@/app/utils/obtenerProductosID";
import { useParams } from "next/navigation";
import { useAPI } from "@/app/Context/ProductTypeContext";

function ProductoSimple() {
  const { id } = useParams();
  const { addToCartHandler } = useAPI();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [products, setProducts] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const data = await obtenerProductosID(id, SiteId);
        setProducts(data.product);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error as Error);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        if (products) {
          const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${id}/skus/${products.skuId}/images?siteId=${SiteId}`
          );
          const data = await response.json();
          setProductImages(data.skuImages);
          setSelectedImage(data.skuImages[0]?.imageUrl || "");
        }
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    };
    fetchProductImages();
  }, [products]);

  const handleThumbnailClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleAddToCart = () => {
    addToCartHandler(products?.skuId, quantity);
  };

  return (
    <div className="pb-5 pt-20 relative ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-16">
          <div className="pro-detail max-lg:max-w-[608px] max-lg:mx-auto lg:w-1/2 flex flex-col pt-8">
            <div className="flex gap-8">
              <div>
                {" "}
                <img
                  src={products?.mainImageUrl}
                  alt="Product Image"
                  className="w-24 h-auto aspect-square rounded-xl"
                />
              </div>
              <div>
                <h2 className="mb-2 font-manrope font-bold text-3xl leading-10 text-gray-900">
                  {products?.name}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <h6 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 pr-5 sm:border-r border-gray-200 mr-5">
                    $ {products?.pricings[0]?.amount}
                  </h6>
                  <div className="flex align-middle">
                    {products &&
                      products.productTypes.map(
                        (productType: any, index: any) => (
                          <p
                            key={index}
                            className="font-medium text-md text-white hover:bg-primary hover:text-dark  bg-dark w-fit p-1 px-2 rounded-xl"
                          >
                            {productType.name}
                          </p>
                        )
                      )}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-base font-normal my-8 ">
              {products?.description}
            </p>
            <div className="block w-full">
              <div className="text">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  <div className="flex items-center justify-center w-full">
                    <button className="group py-4 px-5 border border-gray-400 rounded-l-full shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-300 hover:bg-dark ">
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(Number(e.target.value), 1))
                      }
                      className="font-semibold text-gray-900 text-lg py-[13px] px-6 w-full lg:max-w-[118px] border-y border-gray-400 bg-transparent placeholder:text-gray-900 text-center hover:bg-gray-50 focus-within:bg-gray-50 outline-0"
                      placeholder="1"
                    />
                    <button className="group py-4 px-6 border border-gray-400 rounded-r-full shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-300 hover:bg-dark ">
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="group py-4 px-5 rounded-full bg-dark/20 text-dark font-semibold text-lg w-full flex items-center justify-center gap-2 shadow-sm shadow-transparent transition-all duration-500 hover:bg-primary hover:shadow-indigo-200"
                  >
                    Add to cart
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-center w-full px-5 py-4 rounded-[100px] bg-dark flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-primary hover:text-dark hover:shadow-primary">
                    {/* Icono de comprar ahora */}
                    Comprar Ahora
                  </button>
                </div>
              </div>
            </div>
            <section className="mt-8 border-t pt-6">
              <h2 className="font-bold text-md uppercase leading-10 text-gray-900">
                Información Adicional :
              </h2>

              <ul className="text-[0.875rem] leading-6 text-gray-700">
                <li>
                  Largo:{" "}
                  <span className="font-bold">
                    {products?.measures.length} cm.
                  </span>
                </li>
                <li>
                  Ancho:{" "}
                  <span className="font-bold">
                    {products?.measures.width} cm.
                  </span>
                </li>
                <li>
                  Alto:{" "}
                  <span className="font-bold">
                    {products?.measures.height} cm.
                  </span>
                </li>
                <li>
                  Peso:{" "}
                  <span className="font-bold">
                    {products?.measures.weight} kg.
                  </span>
                </li>
              </ul>
            </section>
          </div>
          <div className="slider-box lg:w-1/2 max-lg:max-w-[680px] max-lg:mx-auto">
            <div className="col-span-4">
              <img
                src={selectedImage || products?.mainImageUrl}
                alt="Product Image"
                className="w-full h-auto xl:min-w-[300px] aspect-square rounded-xl"
              />
            </div>
            <div className="grid grid-cols-4 gap-4 lg:gap-6 mt-4 lg:mt-6">
              {productImages.map((image, index) => (
                <img
                  key={index}
                  src={image.imageUrl}
                  alt={`Product Image ${index}`}
                  className="w-full h-auto cursor-pointer border-2 border-gray-50 transition-all duration-500 hover:border-primary rounded-xl"
                  onClick={() => handleThumbnailClick(image.imageUrl)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoSimple;
