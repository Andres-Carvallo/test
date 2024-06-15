/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useAPI } from "@/app/Context/ProductTypeContext";

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
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(
    null
  );

  const fetchThumbnails = async (productId: string, skuId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images?siteId=586b6573-f223-44bd-849a-caac59c4999a`
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
        className={`object-cover cursor-pointer ${
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${id}/skus?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      const responseVariations = await response.json();
      if (responseVariations.code === 0) {
        const variations = responseVariations.skus;

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
          setDescription(baseSku.description);
          setProductName(baseSku.product.name);
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
      }
    } catch (error) {
      console.error("Error fetching variations:", error);
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
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${id}/skus/${variationId}/attributes?siteId=586b6573-f223-44bd-849a-caac59c4999a`
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
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/pricings?siteId=586b6573-f223-44bd-849a-caac59c4999a`
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

  const fetchOffersForVariation = async (productId: string, skuId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/pricings?siteId=586b6573-f223-44bd-849a-caac59c4999a`
      );
      const data = await response.json();
      if (data.code === 0) {
        const offers = data.sku.offers;
        if (offers.length > 0) {
          return offers[0];
        } else {
          const productResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}?siteId=586b6573-f223-44bd-849a-caac59c4999a`
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
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
              className="w-[500px] h-[500px] bg-gray-100 flex items-center justify-center"
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
            <div>
              <div className="rounded-lg bg-background flex py-2 px3">
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
                          )} - $${parseFloat(maxPrice).toLocaleString("es-CL")}`
                        : "Precio no disponible"}
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex-1">
              {selectedVariation &&
                selectedVariation.offers &&
                selectedVariation.offers.length > 0 && (
                  <p className="text-red-600">
                    Precio Oferta: $
                    {selectedVariation.offers[0].unitPrice.toLocaleString(
                      "es-CL"
                    )}
                  </p>
                )}
              <p className="text-primary text-xl font-semibold">Dcto. 25%</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-foreground">
              Acerca del producto
            </h3>
            <p className="mt-4 text-gray-700">
              {description ||
                "Femenina, encantadora y misteriosa. Es la hermosa Luna que rige sobre el mundo de las emociones y da ritmo a los ciclos de vida. Para las que amamos la luna y sus secretos."}
            </p>
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
                  {Array.from({ length: 5 }, (_, i) => (
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
              className={`h-14 px-6 py-2 font-semibold rounded-xl bg-primary hover:bg-secondary text-foreground ${
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
    </div>
  );
};

export default ProductDetail;
