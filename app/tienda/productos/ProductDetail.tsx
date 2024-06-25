/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useAPI } from "@/app/Context/ProductTypeContext";
import Head from "next/head";

interface Variation {
  id: string;
  product: { id: string; name: string; productTypes: { name: string }[] };
  isBaseSku: boolean;
  mainImageUrl: string;
  description: string;
  attributes: { label: string; value: string }[];
  offers?: {
    unitPrice: number;
    startDate: string;
    endDate: string;
  }[];
}

interface Thumbnail {
  id: string;
  imageUrl: string;
}

const ProductDetail: React.FC = () => {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [currentAttributes, setCurrentAttributes] = useState<{
    [key: string]: string[];
  }>({});
  const [currentPrices, setCurrentPrices] = useState<{ [key: string]: number }>(
    {}
  );
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [productName, setProductName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedVariationPrice, setSelectedVariationPrice] = useState<
    number | null
  >(null);
  const [attributeSelected, setAttributeSelected] = useState(false);
  const [disabledAttributes, setDisabledAttributes] = useState<{
    [key: string]: boolean[];
  }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [isBaseSku, setIsBaseSku] = useState(false);
  const [hasVariations, setHasVariations] = useState(Boolean);
  const [enabledForDelivery, setEnabledForDelivery] = useState(false);
  const [enabledForWithdrawal, setEnabledForWithdrawal] = useState(false);

  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(
    null
  );

  const fetchThumbnails = async (productId: string, skuId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      const data = await response.json();

      if (data.code === 0) {
        const mainThumbnail = { id: "main", imageUrl: mainImageUrl };
        const allThumbnails = [mainThumbnail, ...data.skuImages];
        setThumbnails(allThumbnails);
        setSelectedThumbnail(mainImageUrl);
      } else {
        console.error("Error fetching thumbnails:", data.message);
      }
    } catch (error) {
      console.error("Error al obtener las miniaturas:", error);
    }
  };

  useEffect(() => {
    if (selectedVariation) {
      fetchThumbnails(selectedVariation.product.id, selectedVariation.id);
    } else {
      fetchThumbnails(id as string, id as string);
    }
  }, [selectedVariation]);

  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedThumbnail(imageUrl);
  };

  const renderThumbnails = () => {
    const thumbnailCount = thumbnails.length; // Número de miniaturas
    const containerWidth = 500; // Ancho del contenedor principal de la imagen
    const thumbnailWidth =
      thumbnailCount > 0 ? Math.floor(containerWidth / thumbnailCount) : 20; // Ancho de cada miniatura

    return thumbnails.map((thumbnail) => (
      <img
        key={thumbnail.id}
        src={thumbnail.imageUrl}
        alt="Miniatura"
        className={`object-cover cursor-pointer shadow-md ${
          selectedThumbnail === thumbnail.imageUrl
            ? "border-2 border-blue-500"
            : ""
        }`}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "var(--radius)",
        }}
        onClick={() => handleThumbnailClick(thumbnail.imageUrl)}
      />
    ));
  };

  const { addToCartHandler } = useAPI();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchVariations();
    }
  }, [id]);

  const fetchVariations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${id}/skus?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      const responseVariations = await response.json();
      if (responseVariations.code === 0) {
        const variations = responseVariations.skus;
        console.log(variations, "variations");
        const variationsWithOffers = variations.map((variation: any) => ({
          ...variation,
          offers: variation.offers || [],
        }));

        setVariations(variationsWithOffers);

        const isBaseSku = variations.some(
          (variation: any) => variation.isBaseSku
        );
        setHasVariations(variations.length > 1);

        const baseSku = variations.find((sku: any) => sku.isBaseSku);
        if (baseSku) {
          setMainImageUrl(baseSku.mainImageUrl);
          setDescription(baseSku.product.description);
          setProductName(baseSku.product.name);
          setEnabledForDelivery(baseSku.product.enabledForDelivery);
          setEnabledForWithdrawal(baseSku.product.enabledForWithdrawal);
        }
        if (baseSku && baseSku.product && baseSku.product.productTypes) {
          setCategories(
            baseSku.product.productTypes.map((type: any) => type.name)
          );
        }

        const attributesByVariation: { [key: string]: any[] } = {};
        const pricesByVariation: { [key: string]: number | null } = {};
        const offersByVariation: { [key: string]: any | null } = {};

        const fetchTasks = variations.map(async (variation: any) => {
          const [attributes, price, offer] = await Promise.all([
            fetchAttributesForVariation(variation.id),
            fetchPriceForVariation(id as string, variation.id),
            fetchOffersForVariation(id as string, variation.id),
          ]);

          if (attributes !== null) {
            attributesByVariation[variation.id] = attributes;
          }

          pricesByVariation[variation.id] = price;
          offersByVariation[variation.id] = offer;
        });

        await Promise.all(fetchTasks);

        setCurrentAttributes(groupAttributesByLabel(attributesByVariation));
        setCurrentPrices(pricesByVariation as { [key: string]: number });

        setVariations(
          variations.map((variation: any) => ({
            ...variation,
            attributes: attributesByVariation[variation.id] || [],
            offer: offersByVariation[variation.id] || null,
          }))
        );

        const prices = Object.values(pricesByVariation).filter(
          (price) => price !== null
        ) as number[];
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setMinPrice(minPrice.toString());
          setMaxPrice(maxPrice.toString());
        } else {
          setMinPrice("No disponible");
          setMaxPrice("No disponible");
        }
        setIsLoading(false); // En caso de error, detener el loading
      }
    } catch (error) {
      console.error("Error fetching variations:", error);
      setIsLoading(false); // En caso de error, detener el loading
    }
  };

  const groupAttributesByLabel = (attributesByVariation: {
    [key: string]: any[];
  }) => {
    const groupedAttributes: { [key: string]: Set<string> } = {};

    Object.values(attributesByVariation).forEach((attributes) => {
      attributes.forEach((attribute) => {
        if (!groupedAttributes[attribute.label]) {
          groupedAttributes[attribute.label] = new Set();
        }
        groupedAttributes[attribute.label].add(attribute.value);
      });
    });

    const result: { [key: string]: string[] } = {};
    Object.keys(groupedAttributes).forEach((key) => {
      result[key] = Array.from(groupedAttributes[key]);
    });

    return result;
  };

  useEffect(() => {
    const matchingVariation = variations.find((variation) => {
      return Object.keys(selectedAttributes).every((key) => {
        const attribute = variation.attributes.find(
          (attr) => attr.label === key
        );
        return attribute && attribute.value === selectedAttributes[key];
      });
    });

    if (matchingVariation) {
      setSelectedVariationPrice(currentPrices[matchingVariation.id] ?? null);
      setIsBaseSku(matchingVariation.isBaseSku);
    } else {
      setSelectedVariationPrice(null);
    }
  }, [selectedAttributes, variations, currentPrices]);

  const fetchAttributesForVariation = async (variationId: string) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${id}/skus/${variationId}/attributes?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      const responseData = await response.json();
      if (responseData.code === 0) {
        return responseData.skuAttributes.map((skuAttribute: any) => ({
          value: skuAttribute.value,
          label: skuAttribute.attribute.name,
        }));
      }
    } catch (error) {
      console.error("Error al obtener los atributos de la variación:", error);
    }
    return null;
  };

  const fetchPriceForVariation = async (productId: string, skuId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/pricings?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      const data = await response.json();
      if (data.code === 0) {
        const price =
          data.skuPricings.length > 0 ? data.skuPricings[0].unitPrice : null;
        return price;
      }
    } catch (error) {
      console.error("Error al obtener el precio de la variación:", error);
    }
    return null;
  };
  const calculateDiscount = (originalPrice: any, offerPrice: any) => {
    return ((originalPrice - offerPrice) / originalPrice) * 100;
  };
  const fetchOffersForVariation = async (productId: string, skuId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/pricings?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      const data = await response.json();
      if (data.code === 0) {
        const offers = data.sku.offers;
        if (offers.length > 0) {
          return offers[0];
        } else {
          const productResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
          );
          const productData = await productResponse.json();
          if (productData.code === 0 && productData.offers.length > 0) {
            return productData.offers[0];
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener las ofertas de la variación:", error);
    }
    return null;
  };

  const handleAttributeChange = (attribute: string, value: string) => {
    setSelectedAttributes((prevAttributes) => {
      const newAttributes = { ...prevAttributes };
      if (newAttributes[attribute] === value) {
        delete newAttributes[attribute];
      } else {
        newAttributes[attribute] = value;
      }
      setAttributeSelected(Object.keys(newAttributes).length > 0);
      return newAttributes;
    });
  };

  useEffect(() => {
    const matchingVariation = variations.find((variation) => {
      return Object.keys(selectedAttributes).every((key) => {
        const attribute = variation.attributes.find(
          (attr) => attr.label === key
        );
        return attribute && attribute.value === selectedAttributes[key];
      });
    });

    if (matchingVariation) {
      setSelectedVariation(matchingVariation);
      setMainImageUrl(matchingVariation.mainImageUrl || mainImageUrl);
      setDescription(matchingVariation.description);
    } else {
      setSelectedVariation(null);
      setMainImageUrl("");
      setDescription("");
    }
    updateDisabledAttributes();
  }, [
    selectedAttributes,
    variations,
    mainImageUrl,
    currentPrices,
    hasVariations,
  ]);

  const updateDisabledAttributes = () => {
    const disabledAttrs: { [key: string]: boolean[] } = {};
    Object.keys(currentAttributes).forEach((attributeName) => {
      disabledAttrs[attributeName] = currentAttributes[attributeName].map(
        (value) => {
          return !variations.some((variation) => {
            const attributesMatch = Object.keys(selectedAttributes).every(
              (key) => {
                if (key === attributeName) {
                  return true;
                }
                const attribute = variation.attributes.find(
                  (attr) => attr.label === key
                );
                return attribute && attribute.value === selectedAttributes[key];
              }
            );

            const attribute = variation.attributes.find(
              (attr) => attr.label === attributeName
            );
            return attributesMatch && attribute && attribute.value === value;
          });
        }
      );
    });

    setDisabledAttributes(disabledAttrs);
    setIsAddToCartDisabled(hasVariations && !selectedVariation);
  };

  const handleAddToCart = () => {
    if (!areAllAttributesSelected()) {
      console.error("Debe seleccionar todos los atributos.");
      return;
    }

    if (selectedVariation) {
      addToCartHandler(selectedVariation.id, quantity);
    } else if (!hasVariations) {
      addToCartHandler(id, quantity);
    } else {
      console.error("No se ha seleccionado una variación válida.");
    }
  };

  const [isAddToCartDisabled, setIsAddToCartDisabled] = useState(false);
  const [image, setImage] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleSizeChange = (size: any) => {
    setSelectedSize(size);
  };

  const areAllAttributesSelected = () => {
    if (!variations.length) return false;
    const requiredAttributes = Object.keys(currentAttributes);
    const selectedAttributesKeys = Object.keys(selectedAttributes);

    return requiredAttributes.every((attr) =>
      selectedAttributesKeys.includes(attr)
    );
  };

  return (
    <>
      {" "}
      <title>{productName}</title>
      <meta
        name="description"
        content={description}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 animate-pulse">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:flex-1 px-4">
                <div className="flex items-center justify-center">
                  <div className="flex flex-col justify-center items-center space-y-2 mr-4">
                    <div className="flex flex-col gap-4 justify-start items-center">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <div
                          key={index}
                          className="w-20 h-20 bg-gray-200 rounded"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="w-[500px] h-[500px] bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="md:flex-1 px-4 ml-4 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="h-10 w-10 bg-gray-200 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
              <div className="flex items-center justify-center">
                <div className="flex flex-col justify-center items-center space-y-2 mr-4">
                  {/* Miniaturas en una columna a la izquierda */}
                  <div className="flex flex-col gap-4 justify-start items-center">
                    {renderThumbnails()}
                  </div>
                </div>
                {/* Imagen principal */}
                <div
                  className="w-[500px] h-[500px] bg-gray-100 flex items-center justify-center shadow-md"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  <img
                    src={selectedThumbnail || mainImageUrl}
                    alt="Producto"
                    className="object-cover h-full w-full rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="md:flex-1 px-4 ml-4">
              <h2 className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">
                {productName}
              </h2>
              <p className="text-gray-500 text-sm">
                Categoría: {categories.join(", ")}
              </p>

              <div className="flex items-center space-x-4 my-4">
                {selectedVariation &&
                selectedVariation.offers &&
                selectedVariation.offers.length > 0 ? (
                  <div className="flex items-center">
                    <div className="rounded-lg bg-background flex py-2 px-3">
                      <div className="flex flex-col">
                        {" "}
                        <span className="font-bold text-primary text-3xl line-through mr-4">
                          ${selectedVariationPrice?.toLocaleString("es-CL")}
                        </span>
                        <span className="font-bold text-red-700 text-3xl mr-2">
                          $
                          {selectedVariation.offers[0].unitPrice.toLocaleString(
                            "es-CL"
                          )}
                        </span>
                      </div>
                      <span className="text-white text-xl font-semibold bg-primary h-8 px-2 rounded">
                        Dcto.{" "}
                        {calculateDiscount(
                          selectedVariationPrice,
                          selectedVariation.offers[0].unitPrice
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-background flex py-2 px-3">
                    <span className="font-bold text-primary text-3xl">
                      {selectedVariationPrice !== null ? (
                        <span>
                          ${selectedVariationPrice.toLocaleString("es-CL")}
                        </span>
                      ) : (
                        <span>
                          {minPrice !== "No disponible" &&
                          maxPrice !== "No disponible"
                            ? `$${parseFloat(minPrice).toLocaleString(
                                "es-CL"
                              )} - $${parseFloat(maxPrice).toLocaleString(
                                "es-CL"
                              )}`
                            : "Precio no disponible"}
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-foreground">
                  Acerca del producto
                </h3>
                <p className="mt-4 text-gray-700">
                  {description ||
                    "Femenina, encantadora y misteriosa. Es la hermosa Luna que rige sobre el mundo de las emociones y da ritmo a los ciclos de vida. Para las que amamos la luna y sus secretos."}
                </p>
                <div className="mt-10 flex flex-wrap">
                  <div>
                    <p>
                      {enabledForDelivery ? (
                        <div className="flex">
                          <span>
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
                                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                              />
                            </svg>
                          </span>
                          <small className="px-2 text-primary self-center">
                            Disponible para Delivery
                          </small>
                        </div>
                      ) : (
                        <div className="flex">
                          <span>
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
                                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                              />
                            </svg>
                          </span>

                          <small className="px-2 text-red-800 self-center">
                            Delivery No Disponible
                          </small>
                        </div>
                      )}
                    </p>
                    <p>
                      {enabledForWithdrawal ? (
                        <div className="flex">
                          <span>
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
                                d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                              />
                            </svg>
                          </span>
                          <small className="px-2 text-primary self-center">
                            Disponible para Retiro
                          </small>
                        </div>
                      ) : (
                        <div className="flex">
                          <span>
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
                                d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                              />
                            </svg>
                          </span>

                          <small className="px-2 text-red-800 self-center">
                            Retiro No Disponible
                          </small>
                        </div>
                      )}
                    </p>
                  </div>
                  <div className=" w-auto">
                    <img
                      src="/img/pixelup/wplus.svg"
                      className="h-10 px-2"
                      alt="LogoWebpay"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold">Atributos:</h3>
                <div className="flex flex-col space-y-4 mt-2">
                  {Object.entries(currentAttributes).map(
                    ([attributeName, attributeValues]) => (
                      <div key={attributeName}>
                        <h4>{attributeName}:</h4>
                        <div className="flex space-x-2">
                          {attributeValues.map((value, index) => (
                            <button
                              key={`${attributeName}-${index}`}
                              className={`px-3 py-1 rounded border ${
                                selectedAttributes[attributeName] === value
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-gray-800"
                              } ${
                                disabledAttributes[attributeName] &&
                                disabledAttributes[attributeName][index]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() =>
                                !disabledAttributes[attributeName][index] &&
                                handleAttributeChange(attributeName, value)
                              }
                              disabled={
                                disabledAttributes[attributeName] &&
                                disabledAttributes[attributeName][index]
                              }
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex py-4 space-x-4 items-center mt-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-center text-xs uppercase text-gray-400 tracking-wide font-semibold">
                    Cantidad
                  </div>
                  <div className="relative w-[80px]">
                    <select
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="cursor-pointer w-full appearance-none rounded-xl border border-gray-200 h-8 flex items-center justify-center text-center text-base"
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option
                          className="text-center"
                          key={i}
                        >
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`h-14 px-6 py-2 font-semibold rounded-xl bg-primary text-white hover:bg-secondary hover:text-primary ${
                    hasVariations &&
                    (!attributeSelected || !areAllAttributesSelected())
                      ? "bg-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    hasVariations &&
                    (!attributeSelected || !areAllAttributesSelected())
                  }
                >
                  {hasVariations &&
                  (!attributeSelected || !areAllAttributesSelected())
                    ? "Selecciona todas las Variaciones"
                    : "Agregar al Carrito"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
