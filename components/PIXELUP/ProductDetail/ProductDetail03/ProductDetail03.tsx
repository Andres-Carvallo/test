/* eslint-disable @next/next/no-head-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAPI } from "@/app/Context/ProductTypeContext";
import Stars from "@/components/Core/Products/Detail/Stars";
import Head from "next/head";
import toast from "react-hot-toast";
import axios from "axios";
import { getCookie } from "cookies-next";
import Destacados01 from "../../Destacados/Destacado01";
import { useReviewSettings } from "@/hooks/useReviewSettings";
import Breadcrumbs from "@/components/Core/Navigation/Breadcrumbs";
import {
  fetchProductData,
  fetchStockData,
  fetchThumbnailData,
} from "@/app/utils/productApi";
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react";

interface Variation {
  id: string;
  product: {
    id: string;
    description: any;
    additionalData1?: string;
  };
  isBaseSku: boolean;
  mainImageUrl: string;
  description: string;
  attributes: { label: string; value: string }[];
  pricings: Array<{ unitPrice: number }>;
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

interface ProductDetail03Props {
  product: any;
}

const ProductDetail03: React.FC<ProductDetail03Props> = ({
  product: initialProduct,
}) => {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [variationsStock, setVariationsStock] = useState<{ [key: string]: number }>({});
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [isLoadingSelectedVariationStock, setIsLoadingSelectedVariationStock] = useState(false);
  const [stock, setStock] = useState<number | null>(null);
  
  // Debug: rastrear cuándo se establece el stock
  const setStockWithDebug = (value: number | null) => {
    console.log("🔍 DEBUG - setStock called with:", value, "at:", new Error().stack?.split('\n')[2]);
    setStock(value);
  };
  const [showModal, setShowModal] = useState(false);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | any>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<{[key: string]: string}>({});
  const [quantity, setQuantity] = useState(1);
  const [currentAttributes, setCurrentAttributes] = useState<{[key: string]: string[]}>({});
  const [currentPrices, setCurrentPrices] = useState<{[key: string]: number | null}>({});
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [showShortDescription, setShowShortDescription] = useState(true);
  const [showLongDescription, setShowLongDescription] = useState(true);
  const [productName, setProductName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedVariationPrice, setSelectedVariationPrice] = useState<number | null>(null);
  const [attributeSelected, setAttributeSelected] = useState(false);
  const [disabledAttributes, setDisabledAttributes] = useState<{[key: string]: boolean[]}>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [isBaseSku, setIsBaseSku] = useState(false);
  const [hasVariations, setHasVariations] = useState(Boolean);
  const [enabledForDelivery, setEnabledForDelivery] = useState(false);
  const [enabledForWithdrawal, setEnabledForWithdrawal] = useState(false);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [isAddToCartDisabled, setIsAddToCartDisabled] = useState(false);
  const [reviewAverageScore, setReviewAverageScore] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCartHandler } = useAPI();
  const { id } = useParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cuotasEnabled, setCuotasEnabled] = useState(false);
  const [numeroCuotas, setNumeroCuotas] = useState(0);
  const { isReviewEnabled } = useReviewSettings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [infoBoxesConfig, setInfoBoxesConfig] = useState<any>(null);
  const [freeShippingAmount, setFreeShippingAmount] = useState<string | null>(null);
  // Función para productos simples
  const fetchStockForSimpleProduct = useCallback(
    async (productId: string, skuId: string) => {
      try {
        const data = await fetchStockData(productId, skuId);
        if (data.code === 0 && data.skuInventories.length > 0) {
          const totalStock = data.skuInventories.reduce(
            (acc: number, inventory: any) => acc + inventory.quantity,
            0
          );
                  setStockWithDebug(totalStock);
      } else {
        setStockWithDebug(0);
      }
    } catch (error) {
      console.error("Error fetching stock for simple product:", error);
      setStockWithDebug(0);
      }
    },
    []
  );

  // Función para productos variables
  const fetchStockForVariableProduct = useCallback(
    async (productId: string, skuId: string) => {
      try {
        const data = await fetchStockData(productId, skuId);
        if (data.code === 0 && data.skuInventories.length > 0) {
          const totalStock = data.skuInventories.reduce(
            (acc: number, inventory: any) => acc + inventory.quantity,
            0
          );
          
          // Solo actualizar el stock de esta variación específica
          setVariationsStock(prev => ({
            ...prev,
            [skuId]: totalStock
          }));
        } else {
          setVariationsStock(prev => ({
            ...prev,
            [skuId]: 0
          }));
        }
      } catch (error) {
        console.error("Error fetching stock for variable product:", error);
        setVariationsStock(prev => ({
          ...prev,
          [skuId]: 0
        }));
      }
    },
    []
  );

  // Función para establecer stock global cuando se selecciona una variación
  const setStockForSelectedVariation = useCallback(
    async (productId: string, skuId: string) => {
      setIsLoadingSelectedVariationStock(true);
      try {
        const data = await fetchStockData(productId, skuId);
        if (data.code === 0 && data.skuInventories.length > 0) {
          const totalStock = data.skuInventories.reduce(
            (acc: number, inventory: any) => acc + inventory.quantity,
            0
          );
          setStockWithDebug(totalStock);
        } else {
          setStockWithDebug(0);
        }
      } catch (error) {
        console.error("Error fetching stock for selected variation:", error);
        setStockWithDebug(0);
      } finally {
        setIsLoadingSelectedVariationStock(false);
      }
    },
    []
  );

  const fetchAllVariationsStock = useCallback(
    async () => {
      if (variations.length === 0) return;
      
      setIsLoadingStock(true);
      
      const stockPromises = variations.map(async (variation) => {
        try {
          const data = await fetchStockData(variation.product.id, variation.id);
          if (data.code === 0 && data.skuInventories.length > 0) {
            const totalStock = data.skuInventories.reduce(
              (acc: number, inventory: any) => acc + inventory.quantity,
              0
            );
            return { skuId: variation.id, stock: totalStock };
          } else {
            return { skuId: variation.id, stock: 0 };
          }
        } catch (error) {
          console.error(`Error fetching stock for variation ${variation.id}:`, error);
          return { skuId: variation.id, stock: 0 };
        }
      });

      try {
        const results = await Promise.all(stockPromises);
        const stockMap: { [key: string]: number } = {};
        results.forEach(result => {
          stockMap[result.skuId] = result.stock;
        });
        setVariationsStock(stockMap);
      } catch (error) {
        console.error("Error fetching all variations stock:", error);
      } finally {
        setIsLoadingStock(false);
      }
    },
    [variations]
  );

  useEffect(() => {
    const fetchCuotasConfig = async () => {
      try {
        const contentBlockId = process.env.NEXT_PUBLIC_CUOTAS_CONTENTBLOCK;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
        );
        if (response.data.contentBlock?.contentText) {
          const cuotasConfig = JSON.parse(response.data.contentBlock.contentText);
          setCuotasEnabled(cuotasConfig.enabled);
          setNumeroCuotas(cuotasConfig.enabled ? parseInt(cuotasConfig.installments) : 0);
        }
      } catch (error) {
        console.error("Error al obtener configuración de cuotas:", error);
        setCuotasEnabled(false);
        setNumeroCuotas(0);
      }
    };

    const fetchInfoBoxesConfig = async () => {
      try {
        // Obtener configuración de cajas informativas del producto
        if (initialProduct?.skus?.[0]?.product?.additionalData2) {
          const config = JSON.parse(initialProduct.skus[0].product.additionalData2);
          setInfoBoxesConfig(config);
        }

        // Obtener monto de envío gratis desde content block
        try {
          const contentBlockId = process.env.NEXT_PUBLIC_MONTOENVIOGRATIS_CONTENTBLOCK;
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
          );
          const value = response.data.contentBlock.contentText;
          if (value && value.trim() !== "" && value !== "DISABLED") {
            setFreeShippingAmount(value);
          } else {
            setFreeShippingAmount(null);
          }
        } catch (error) {
          console.error("Error fetching free shipping content block:", error);
          setFreeShippingAmount(null);
        }
      } catch (error) {
        console.error("Error al obtener configuración de cajas informativas:", error);
      }
    };

    fetchCuotasConfig();
    fetchInfoBoxesConfig();
  }, [initialProduct]);

  useEffect(() => {
    const fetchStockData = async () => {
      if (selectedVariation) {
        // Para productos variables, establecer el stock global de la variación seleccionada
        if (hasVariations && variations.length > 1) {
          await setStockForSelectedVariation(
            selectedVariation.product.id,
            selectedVariation.id
          );
        } else {
          // Para productos simples, usar la función específica
          await fetchStockForSimpleProduct(
            selectedVariation.product.id,
            selectedVariation.id
          );
        }
      }
      // Removido el else para evitar conflictos con el useEffect específico de reset
    };

    fetchStockData();
  }, [selectedVariation, setStockForSelectedVariation, fetchStockForSimpleProduct, hasVariations, variations.length]);

  // Obtener stock de todas las variaciones cuando se cargan
  useEffect(() => {
    if (variations.length > 0) {
      fetchAllVariationsStock();
    }
  }, [variations, fetchAllVariationsStock]);

  // Resetear stock global para productos variables al inicio
  useEffect(() => {
    if (hasVariations && !selectedVariation) {
      console.log("🔍 DEBUG - Resetting stock to null for variable product on initial load");
      setStockWithDebug(null);
    }
  }, [hasVariations, selectedVariation]);

  // Para productos simples, obtener el stock del baseSku al cargar
  useEffect(() => {
    // Solo ejecutar si ya tenemos las variaciones cargadas y es un producto simple
    if (variations.length > 0 && !hasVariations && !isLoadingStock) {
      const baseSku = variations.find((v) => v.isBaseSku);
      if (baseSku && !variationsStock[baseSku.id]) {
        fetchStockForSimpleProduct(baseSku.product.id, baseSku.id);
      }
    }
  }, [hasVariations, variations, isLoadingStock, variationsStock, fetchStockForSimpleProduct]);

  const fetchThumbnails = useCallback(
    async (productId: string, skuId: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
        );
        const data = await response.json();
        if (data.code === 0) {
          const currentMainImage =
            mainImageUrl ||
            selectedVariation?.mainImageUrl ||
            initialProduct?.skus?.[0]?.mainImageUrl;

          if (currentMainImage) {
            const mainThumbnail = { id: "main", imageUrl: currentMainImage };
            const allThumbnails = [mainThumbnail, ...(data.skuImages || [])];
            setThumbnails(allThumbnails);
            // Solo establecer selectedThumbnail si no hay una selección previa
            if (!selectedThumbnail) {
              setSelectedThumbnail(currentMainImage);
            }
          }
        }
      } catch (error) {
        console.error("Error al obtener las miniaturas:", error);
      }
    },
    [mainImageUrl, selectedVariation, initialProduct?.skus, selectedThumbnail]
  );

  useEffect(() => {
    const resetToBaseProduct = async () => {
      const baseSku = initialProduct?.skus?.find((sku: any) => sku.isBaseSku);
      
      if (!selectedVariation && baseSku) {
        setCurrentSlide(0);
        // Solo establecer selectedThumbnail si no hay una selección manual previa
        if (!selectedThumbnail) {
          setSelectedThumbnail(baseSku.mainImageUrl);
        }
        await fetchThumbnails(baseSku.product.id, baseSku.id);
      } else if (selectedVariation) {
        await fetchThumbnails(
          selectedVariation.product.id,
          selectedVariation.id
        );
      }
    };

    resetToBaseProduct();
  }, [selectedVariation, initialProduct?.skus, fetchThumbnails]);

  const handleThumbnailClick = (index: number) => {
    setCurrentSlide(index);
    setSelectedThumbnail(thumbnails[index].imageUrl);
  };

  // Resetear selección de thumbnail cuando cambia la variación
  useEffect(() => {
    if (selectedVariation) {
      // Si hay una variación seleccionada, resetear a la imagen principal de esa variación
      setSelectedThumbnail(selectedVariation.mainImageUrl);
      setCurrentSlide(0);
    }
  }, [selectedVariation]);

  const moveSlide = (direction: any) => {
    const newIndex =
      (currentSlide + direction + thumbnails.length) % thumbnails.length;
    setCurrentSlide(newIndex);
    setSelectedThumbnail(thumbnails[newIndex].imageUrl); // Asegúrate de cambiar también la miniatura seleccionada
  };

  const handleTouchStart = (e: any) => {
    setStartX(e.touches[0].clientX);
    setIsTouching(true);
  };

  const handleTouchMove = (e: any) => {
    if (!isTouching) return;

    const touchX = e.touches[0].clientX;
    const touchDiff = startX - touchX;

    if (touchDiff > 50) {
      moveSlide(1); // Swipe left
      setIsTouching(false);
    } else if (touchDiff < -50) {
      moveSlide(-1); // Swipe right
      setIsTouching(false);
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  const renderThumbnails = () => {
    return (
      <>
        {/* Carrusel deslizable solo para pantallas pequeñas */}
        <div className="container mx-auto">
          <div className="relative max-w-4xl mx-auto overflow-hidden">
            <button
              className="lg:hidden absolute top-1/2 left-0 transform -translate-y-1/2 bg-[#4D4D4D] text-white p-2 z-10"
              onClick={() => moveSlide(-1)}
            >
              &#10094;
            </button>
            <div
              className="slider flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {thumbnails.map((thumbnail, index) => (
                <div
                  key={index}
                  className="slide min-w-full box-border"
                >
                  <img
                    src={thumbnail.imageUrl}
                    alt={`Slide ${index + 1}`}
                    className="w-full"
                    style={{
                      borderRadius: "var(--radius)",
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              className="lg:hidden absolute top-1/2 right-0 transform -translate-y-1/2 bg-[#4D4D4D] text-white p-2 z-10"
              onClick={() => moveSlide(1)}
            >
              &#10095;
            </button>
            <div className="flex justify-center mt-4 space-x-2">
              {thumbnails.map((thumbnail, index) => (
                <img
                  key={thumbnail.id}
                  src={thumbnail.imageUrl}
                  alt="Miniatura"
                  className={`object-cover cursor-pointer shadow-md ${
                    index === currentSlide ? "border-2 border-primary" : ""
                  }`}
                  style={{
                    width: "18%",
                    height: "auto",
                    borderRadius: "var(--radius)",
                  }}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Visualización original para pantallas más grandes */}
        {/*         <div className="hidden md:flex md:flex-col gap-4 justify-center items-center md:items-start mt-4 md:mt-0 md:mr-4">
          {thumbnails.map((thumbnail, index) => (
            <img
              key={thumbnail.id}
              src={thumbnail.imageUrl}
              alt="Miniatura"
              className={`object-cover cursor-pointer shadow-md ${
                selectedThumbnail === thumbnail.imageUrl
                  ? "border-2 border-primary"
                  : ""
              }`}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "var(--radius)",
              }}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div> */}
      </>
    );
  };

  // Inicialización de datos del producto
  useEffect(() => {
    if (initialProduct?.code === 0 && initialProduct?.skus) {
      try {
        const variations = initialProduct.skus;
        setVariationsQuantity(variations.length);
        setHasVariations(initialProduct.hasVariations || variations.length > 1);

        const processedVariations = variations.map((variation: any) => ({
          ...variation,
          offers: variation.offers || [],
          attributes: variation.attributes || [],
          pricings: variation.pricings || [],
        }));

        setVariations(processedVariations);

        // Procesar precios - Versión corregida
        const pricesByVariation: { [key: string]: number | null } = {};
        variations.forEach((variation: any) => {
          if (variation.pricings && variation.pricings.length > 0) {
            pricesByVariation[variation.id] = variation.pricings[0].unitPrice;
          } else {
            pricesByVariation[variation.id] = null;
          }
        });

        // Establecer precios min/max
        const validPrices = Object.values(pricesByVariation).filter(
          (price): price is number =>
            price !== null && !isNaN(price) && price > 0
        );

        if (validPrices.length > 0) {
          const minPriceValue = Math.min(...validPrices);
          const maxPriceValue = Math.max(...validPrices);
          setMinPrice(minPriceValue.toString());
          setMaxPrice(maxPriceValue.toString());
        } else {
          setMinPrice("0");
          setMaxPrice("0");
        }

        setCurrentPrices(pricesByVariation);

        // Procesar atributos
        const attributesByVariation: { [key: string]: any[] } = {};
        variations.forEach((variation: any) => {
          if (variation.attributes) {
            attributesByVariation[variation.id] = variation.attributes;
          }
        });

        // Agrupar atributos únicos
        const groupedAttributes: { [key: string]: Set<string> } = {};
        Object.values(attributesByVariation).forEach((attrs) => {
          attrs.forEach((attr) => {
            if (!groupedAttributes[attr.label]) {
              groupedAttributes[attr.label] = new Set();
            }
            groupedAttributes[attr.label].add(attr.value);
          });
        });

        // Convertir a formato final y ordenar
        const sortedAttributes: { [key: string]: string[] } = {};
        Object.keys(groupedAttributes).forEach((key) => {
          sortedAttributes[key] = sortAttributes(
            key,
            Array.from(groupedAttributes[key])
          );
        });

        setCurrentAttributes(sortedAttributes);

        // Primero establecemos los datos básicos
        const baseSku = variations.find((sku: any) => sku.isBaseSku);
        if (baseSku) {
          setMainImageUrl(baseSku.mainImageUrl);
          setProductName(baseSku.product.name);
          setEnabledForDelivery(baseSku.product.enabledForDelivery);
          setEnabledForWithdrawal(baseSku.product.enabledForWithdrawal);
          
          // Manejar descripción larga (description)
          let longDescriptionContent = "";
          let longDescriptionEnabled = true;
          try {
            if (baseSku.product.description) {
              const longDescData = JSON.parse(baseSku.product.description);
              longDescriptionContent = longDescData.content || "";
              longDescriptionEnabled = longDescData.enabled !== undefined ? longDescData.enabled : true;
            } else {
              longDescriptionContent = baseSku.product.description || "";
              longDescriptionEnabled = true;
            }
          } catch (error) {
            // Si no es JSON válido, usar como texto plano
            longDescriptionContent = baseSku.product.description || "";
            longDescriptionEnabled = true;
          }
          
          setDescription(longDescriptionContent);
          setShowLongDescription(longDescriptionEnabled);

          // Manejar descripción corta (additionalData1)
          let shortDescriptionContent = "";
          let shortDescriptionEnabled = true;
          try {
            if (baseSku.product.additionalData1) {
              const shortDescData = JSON.parse(baseSku.product.additionalData1);
              shortDescriptionContent = shortDescData.content || "";
              shortDescriptionEnabled = shortDescData.enabled !== undefined ? shortDescData.enabled : true;
            } else {
              shortDescriptionContent = baseSku.product.additionalData1 || "";
              shortDescriptionEnabled = true;
            }
          } catch (error) {
            // Si no es JSON válido, usar como texto plano
            shortDescriptionContent = baseSku.product.additionalData1 || "";
            shortDescriptionEnabled = true;
          }
          
          setShortDescription(shortDescriptionContent);
          setShowShortDescription(shortDescriptionEnabled);
          
          setReviewAverageScore(baseSku.product.reviewAverageScore);
          setTotalReviews(baseSku.product.totalReviews);

          if (baseSku.product.productTypes) {
            setCategories(
              baseSku.product.productTypes.map((type: any) => type.name)
            );
          }
        }

        // Procesar variaciones y atributos
        const processVariations = async () => {
          const pricesByVariation: { [key: string]: number | null } = {};

          // Obtener precios de manera segura
          if (variations.length > 0) {
            const variation = variations[0];
            if (variation.pricings && variation.pricings.length > 0) {
              pricesByVariation[variation.id] = variation.pricings[0].unitPrice;
            } else {
              pricesByVariation[variation.id] = null;
            }
          }

          // Actualizar estados
          setCurrentPrices(pricesByVariation);

          // Establecer precios min/max
          const validPrices = Object.values(pricesByVariation).filter(
            (price): price is number => price !== null && !isNaN(price)
          );
          if (validPrices.length > 0) {
            setMinPrice(Math.min(...validPrices).toString());
            setMaxPrice(Math.max(...validPrices).toString());
          }
        };

        processVariations().finally(() => {
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error processing initial product data:", error);
        setIsLoading(false);
      }
    }
  }, [initialProduct]);

  const customOrder = ["XS", "S", "M", "L", "XL", "XXL"];

  const sortAttributes = (attributeName: string, values: string[]) => {

        // Función auxiliar para extraer números de un rango
        const extractRange = (value: string) => {
          // Intenta encontrar números en formato "X-Y" o "X a Y"
          const numbers = value.match(/\d+/g);
          if (numbers && numbers.length >= 2) {
            return {
              start: parseInt(numbers[0]),
              end: parseInt(numbers[1])
            };
          }
          return null;
        };
    
        // Verifica si los valores son rangos
        const containsRanges = values.some(value => 
          value.includes('-') || value.toLowerCase().includes(' a ')
        );
    
        if (containsRanges) {
          return values.sort((a, b) => {
            const rangeA = extractRange(a);
            const rangeB = extractRange(b);
            
            if (rangeA && rangeB) {
              // Ordena por el número inicial del rango
              return rangeA.start - rangeB.start;
            }
            return a.localeCompare(b);
          });
        }
    // Intentamos convertir todos los valores a números primero.
    const allValuesAreNumbers = values.every((value) => !isNaN(Number(value)));

    if (allValuesAreNumbers) {
      // Ordena todos los valores como números si todos son numéricos.
      return values.sort((a, b) => Number(a) - Number(b));
    }

    // Si no todos son números, aplicamos el orden personalizado o alfabético.
    if (
      attributeName.toLowerCase() === "talla" ||
      attributeName.toLowerCase() === "tallas" ||
      attributeName.toLowerCase() === "tamaño" ||
      attributeName.toLowerCase() === "tamaños"
    ) {
      const customOrder = ["XS", "S", "M", "L", "XL", "XXL"];
      return values.sort((a, b) => {
        const indexA = customOrder.indexOf(a);
        const indexB = customOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    // Ordena lexicográficamente si no es un atributo de talla.
    return values.sort((a, b) => a.localeCompare(b));
  };
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const [variationsQuantity, setVariationsQuantity] = useState(0);

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

  const updateDisabledAttributes = useCallback(() => {
    const disabledAttrs: { [key: string]: boolean[] } = {};
    Object.keys(currentAttributes).forEach((attributeName) => {
      disabledAttrs[attributeName] = currentAttributes[attributeName].map(
        (value) => {
          // Verificar si existe al menos una variación con este valor
          const hasVariationWithValue = variations.some((variation) => {
            const attribute = variation.attributes.find(
              (attr) => attr.label === attributeName
            );
            return attribute && attribute.value === value;
          });

          // Si no existe ninguna variación con este valor, marcarlo como no disponible
          if (!hasVariationWithValue) {
            return true;
          }

          // Si hay atributos seleccionados, verificar si esta opción es compatible
          if (Object.keys(selectedAttributes).length > 0) {
            const isCompatible = variations.some((variation) => {
              // Verificar que la variación tenga el valor actual para este atributo
              const currentAttribute = variation.attributes.find(
                (attr) => attr.label === attributeName
              );
              if (!currentAttribute || currentAttribute.value !== value) {
                return false;
              }

              // Verificar que la variación sea compatible con los atributos ya seleccionados
              return Object.keys(selectedAttributes).every((key) => {
                if (key === attributeName) {
                  return true; // Es el atributo que estamos verificando
                }
                const attribute = variation.attributes.find(
                  (attr) => attr.label === key
                );
                return attribute && attribute.value === selectedAttributes[key];
              });
            });

            return !isCompatible;
          }

          // Si no hay atributos seleccionados, todas las opciones válidas están disponibles
          return false;
        }
      );
    });

    setDisabledAttributes(disabledAttrs);
  }, [currentAttributes, selectedAttributes, variations]);

  useEffect(() => {
    updateDisabledAttributes();
  }, [selectedAttributes, updateDisabledAttributes]);

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
      if (matchingVariation.pricings && matchingVariation.pricings.length > 0) {
        setSelectedVariationPrice(matchingVariation.pricings[0].unitPrice);
      } else {
        setSelectedVariationPrice(currentPrices[matchingVariation.id] || null);
      }

      setMainImageUrl(matchingVariation.mainImageUrl);
      setSelectedThumbnail(matchingVariation.mainImageUrl);
      
      // Manejar descripción larga para la variación
      let longDescriptionContent = "";
      let longDescriptionEnabled = true;
      try {
        const descToUse = matchingVariation.isBaseSku 
          ? matchingVariation.product.description 
          : matchingVariation.description || matchingVariation.product.description;
          
        if (descToUse) {
          const longDescData = JSON.parse(descToUse);
          longDescriptionContent = longDescData.content || "";
          longDescriptionEnabled = longDescData.enabled !== undefined ? longDescData.enabled : true;
        } else {
          longDescriptionContent = descToUse || "";
          longDescriptionEnabled = true;
        }
      } catch (error) {
        const descToUse = matchingVariation.isBaseSku 
          ? matchingVariation.product.description 
          : matchingVariation.description || matchingVariation.product.description;
        longDescriptionContent = descToUse || "";
        longDescriptionEnabled = true;
      }
      
      setDescription(longDescriptionContent);
      setShowLongDescription(longDescriptionEnabled);
      
      // Manejar descripción corta para la variación
      let shortDescriptionContent = "";
      let shortDescriptionEnabled = true;
      try {
        if (matchingVariation.product.additionalData1) {
          const shortDescData = JSON.parse(matchingVariation.product.additionalData1);
          shortDescriptionContent = shortDescData.content || "";
          shortDescriptionEnabled = shortDescData.enabled !== undefined ? shortDescData.enabled : true;
        } else {
          shortDescriptionContent = matchingVariation.product.additionalData1 || "";
          shortDescriptionEnabled = true;
        }
      } catch (error) {
        shortDescriptionContent = matchingVariation.product.additionalData1 || "";
        shortDescriptionEnabled = true;
      }
      
      setShortDescription(shortDescriptionContent);
      setShowShortDescription(shortDescriptionEnabled);
    } else {
      const baseSku = variations.find((v) => v.isBaseSku);
      if (baseSku) {
        setSelectedVariation(null);
        setSelectedVariationPrice(
          baseSku.pricings?.[0]?.unitPrice || null
        );
        setMainImageUrl(baseSku.mainImageUrl);
        
        // Manejar descripción larga del baseSku
        let longDescriptionContent = "";
        let longDescriptionEnabled = true;
        try {
          if (baseSku.product.description) {
            const longDescData = JSON.parse(baseSku.product.description);
            longDescriptionContent = longDescData.content || "";
            longDescriptionEnabled = longDescData.enabled !== undefined ? longDescData.enabled : true;
          } else {
            longDescriptionContent = baseSku.product.description || "";
            longDescriptionEnabled = true;
          }
        } catch (error) {
          longDescriptionContent = baseSku.product.description || "";
          longDescriptionEnabled = true;
        }
        
        setDescription(longDescriptionContent);
        setShowLongDescription(longDescriptionEnabled);
        
        // Manejar descripción corta del baseSku
        let shortDescriptionContent = "";
        let shortDescriptionEnabled = true;
        try {
          if (baseSku.product.additionalData1) {
            const shortDescData = JSON.parse(baseSku.product.additionalData1);
            shortDescriptionContent = shortDescData.content || "";
            shortDescriptionEnabled = shortDescData.enabled !== undefined ? shortDescData.enabled : true;
          } else {
            shortDescriptionContent = baseSku.product.additionalData1 || "";
            shortDescriptionEnabled = true;
          }
        } catch (error) {
          shortDescriptionContent = baseSku.product.additionalData1 || "";
          shortDescriptionEnabled = true;
        }
        
        setShortDescription(shortDescriptionContent);
        setShowShortDescription(shortDescriptionEnabled);
        setSelectedThumbnail(baseSku.mainImageUrl);
      }
    }
  }, [selectedAttributes, variations, currentPrices]);

  const fetchAttributesForVariation = async (variationId: string) => {
    try {
      // Obtener el ID del producto base
      const baseSku = variations.find((sku: any) => sku.isBaseSku);
      const productId = baseSku?.product?.id || id;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${variationId}/attributes?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      const responseData = await response.json();
      if (responseData.code === 0) {
        console.log(
          `Atributos obtenidos para variación ${variationId}:`,
          responseData.skuAttributes
        ); // Debug log
        return responseData.skuAttributes.map((skuAttribute: any) => ({
          value: skuAttribute.value,
          label: skuAttribute.attribute.name,
        }));
      }
    } catch (error) {
      console.error(
        `Error al obtener los atributos de la variación ${variationId}:`,
        error
      );
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
  const calculateDiscount = (originalPrice: number, offerPrice: number) => {
    const discount = ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.floor(discount);
  };

  const discountPercentage =
    selectedVariation &&
    selectedVariationPrice !== null &&
    selectedVariation.offers?.length > 0
      ? calculateDiscount(
          selectedVariationPrice,
          selectedVariation.offers[0].unitPrice
        )
      : 0; // O cualquier valor por defecto que prefieras

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

      // Si se hace clic en el mismo valor, deseleccionarlo
      if (newAttributes[attribute] === value) {
        delete newAttributes[attribute];
        setCurrentSlide(0);
        const baseSku = initialProduct.skus.find((sku: any) => sku.isBaseSku);
        if (baseSku) {
          setSelectedThumbnail(baseSku.mainImageUrl);
          // Resetear el precio al precio base
          if (baseSku.pricings && baseSku.pricings.length > 0) {
            setSelectedVariationPrice(baseSku.pricings[0].unitPrice);
          } else {
            setSelectedVariationPrice(null);
          }
        }
        setAttributeSelected(Object.keys(newAttributes).length > 0);
        return newAttributes;
      }

      // Verificar si la opción seleccionada está disponible
      const isOptionAvailable = variations.some((variation) => {
        const attr = variation.attributes.find((a) => a.label === attribute);
        return attr && attr.value === value;
      });

      if (!isOptionAvailable) {
        // Si la opción no existe, no hacer nada
        return prevAttributes;
      }

      // Asignar el nuevo valor al atributo seleccionado
      newAttributes[attribute] = value;

      // Verificar si la nueva combinación es válida
      const matchingVariation = variations.find((variation) => {
        return Object.keys(newAttributes).every((key) => {
          const attribute = variation.attributes.find(
            (attr) => attr.label === key
          );
          return attribute && attribute.value === newAttributes[key];
        });
      });

      if (matchingVariation) {
        // Si la combinación es válida, mantener todos los atributos seleccionados
        if (
          matchingVariation.pricings &&
          matchingVariation.pricings.length > 0
        ) {
          setSelectedVariationPrice(matchingVariation.pricings[0].unitPrice);
        } else {
          setSelectedVariationPrice(
            currentPrices[matchingVariation.id] || null
          );
        }
      } else {
        // Si la combinación no es válida, limpiar todos los atributos excepto el actual
        // y buscar combinaciones válidas que incluyan el atributo seleccionado
        const validCombinations = variations.filter((variation) => {
          const attr = variation.attributes.find(
            (a) => a.label === attribute
          );
          return attr && attr.value === value;
        });

        if (validCombinations.length > 0) {
          // Mantener solo el atributo actual y limpiar los demás
          const cleanedAttributes: { [key: string]: string } = {};
          cleanedAttributes[attribute] = value;
          
          // Intentar agregar otros atributos que sean compatibles
          validCombinations.forEach((variation) => {
            variation.attributes.forEach((attr) => {
              if (attr.label !== attribute && !cleanedAttributes[attr.label]) {
                // Verificar si este atributo es compatible con los ya seleccionados
                const isCompatible = validCombinations.some((v) => {
                  const currentAttr = v.attributes.find((a) => a.label === attr.label);
                  return currentAttr && currentAttr.value === attr.value;
                });
                
                if (isCompatible) {
                  cleanedAttributes[attr.label] = attr.value;
                }
              }
            });
          });
          
          Object.keys(newAttributes).forEach((key) => {
            if (!cleanedAttributes[key]) {
              delete newAttributes[key];
            }
          });
          
          // Agregar los atributos compatibles
          Object.keys(cleanedAttributes).forEach((key) => {
            if (key !== attribute) {
              newAttributes[key] = cleanedAttributes[key];
            }
          });
        } else {
          // Si no hay combinaciones válidas, mantener solo el atributo actual
          Object.keys(newAttributes).forEach((key) => {
            if (key !== attribute) {
              delete newAttributes[key];
            }
          });
        }
      }

      setAttributeSelected(Object.keys(newAttributes).length > 0);
      return newAttributes;
    });
  };

  const handleAddToCart = () => {
    // Si hay variaciones pero no están todas seleccionadas, mostrar modal
    if (hasVariations && !areAllAttributesSelected()) {
      setShowVariationModal(true);
      return;
    }

    // Si está cargando el stock, no permitir agregar al carrito
    if (isLoadingStock) {
      toast.error("Espera un momento mientras verificamos el stock...");
      return;
    }

    // Para productos con múltiples variaciones sin variación seleccionada, permitir agregar al carrito
    // (se mostrará el modal para seleccionar variaciones)
    if (variations.length > 1 && (!selectedVariation || (selectedVariation && selectedVariation.isBaseSku))) {
      // No verificar stock aquí, se verificará cuando se seleccione una variación
    } else {
      // Para productos con variación seleccionada o productos simples, verificar stock específico
      const stockStatus = getOverallStockStatus();
      if (!stockStatus.hasStock) {
        toast.error("Este producto no tiene stock disponible.");
        return;
      }
    }

    if (selectedVariation) {
      addToCartHandler(selectedVariation.id, quantity);
      toast.success("Producto agregado al carrito");
    } else if (!hasVariations) {
      // Si no hay variaciones, usar el ID del producto base
      const baseSku = variations.find((v) => v.isBaseSku);
      if (baseSku) {
        addToCartHandler(baseSku.id, quantity);
        toast.success("Producto agregado al carrito");
      } else {
        addToCartHandler(id as string, quantity);
        toast.success("Producto agregado al carrito");
      }
    } else {
      console.error("No se ha seleccionado una variación válida.");
    }
  };

  const areAllAttributesSelected = () => {
    if (!variations.length) return true;

    const requiredAttributes = Object.keys(currentAttributes);
    const selectedAttributesKeys = Object.keys(selectedAttributes);

    if (selectedAttributesKeys.length !== requiredAttributes.length) {
      return false;
    }

    const matchingVariation = variations.find((variation) => {
      return variation.attributes.every((attr) => {
        return selectedAttributes[attr.label] === attr.value;
      });
    });

    return !!matchingVariation;
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const shareData = {
      title: productName,
      text: shortDescription ? shortDescription.replace(/<[^>]*>/g, '') : `Mira este producto: ${productName}`,
      url: currentUrl,
    };

    try {
      // Intentar usar Web Share API (dispositivos móviles)
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback para desktop: copiar enlace al portapapeles
        await navigator.clipboard.writeText(currentUrl);
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      
      // Fallback adicional: abrir en nueva pestaña
      try {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
      }
    }
  };

  const hasAttributes = () => {
    const attributeCount = Object.keys(currentAttributes).length;
    return attributeCount > 0;
  };

  const getOverallStockStatus = () => {
    // Si se está cargando el stock de una variación seleccionada, no mostrar estado
    if (isLoadingSelectedVariationStock) {
      const result = {
        hasStock: null, // null indica que no se debe mostrar estado de stock
        stock: null
      };
      return result;
    }
    
    // Si hay una variación seleccionada (que no sea solo el base SKU), usar su stock
    if (selectedVariation && !selectedVariation.isBaseSku) {
      const result = {
        hasStock: stock && stock > 0,
        stock: stock
      };
      return result;
    }

    // Para productos simples (sin variaciones), obtener el stock del producto base
    if (variations.length === 1) {
      const baseSku = variations.find((v) => v.isBaseSku);
      if (baseSku) {
        // Si ya tenemos el stock cargado, usarlo
        if (variationsStock[baseSku.id] !== undefined) {
          const baseStock = variationsStock[baseSku.id];
          const result = {
            hasStock: baseStock > 0,
            stock: baseStock
          };
          return result;
        } else {
          // Si no tenemos el stock cargado, usar el stock actual
          const result = {
            hasStock: stock && stock > 0,
            stock: stock
          };
          return result;
        }
      }
    }

    // Para productos con múltiples variaciones sin variación seleccionada, no mostrar estado de stock
    if (variations.length > 1) {
      const result = {
        hasStock: null, // null indica que no se debe mostrar estado de stock
        stock: null
      };
      return result;
    }

    // Para productos con exactamente 2 variaciones sin variación seleccionada, también no mostrar estado de stock
    if (variations.length === 2 && !selectedVariation) {
      const result = {
        hasStock: null, // null indica que no se debe mostrar estado de stock
        stock: null
      };
      return result;
    }

    // Para cualquier producto sin variación seleccionada o solo con base SKU, no mostrar estado de stock
    if (!selectedVariation || (selectedVariation && selectedVariation.isBaseSku)) {
      const result = {
        hasStock: null, // null indica que no se debe mostrar estado de stock
        stock: null
      };
      return result;
    }

    // Fallback para productos sin variaciones
    const result = {
      hasStock: stock && stock > 0,
      stock: stock
    };
    return result;
  };
  const IconosData = [
    "/img/iconos/hechoamano.png",
    "/img/iconos/plata950.png",
    "/img/iconos/unico.png",
    "/img/iconos/emprendedora.png",
    "/img/iconos/slowfashion.png",
    "/img/iconos/conamor.png",
  ];
  // Modificar la renderización para mostrar el skeleton solo cuando sea necesario
  if (!initialProduct) {
    return <div>Cargando...</div>;
  }

  const renderInfoBoxes = () => {
    if (!infoBoxesConfig || !infoBoxesConfig.showInfoBoxes) {
      return null;
    }

    const activeBoxes = [];
    const { boxesConfig, warrantyText, returnsText } = infoBoxesConfig;

    // Envío Gratis
    if (boxesConfig.freeShipping && freeShippingAmount && freeShippingAmount !== "DISABLED") {
      activeBoxes.push(
        <div key="freeShipping" className="flex items-center gap-3 p-4 bg-white rounded-lg border">
          <Truck className="w-6 h-6 text-primary" />
          <div>
            <p className="font-medium text-sm">Envío Gratis</p>
            <p className="text-xs text-gray-500">
              {freeShippingAmount ? `En pedidos sobre $${freeShippingAmount}` : "En pedidos sobre monto mínimo"}
            </p>
          </div>
        </div>
      );
    }

    // Garantía
    if (boxesConfig.warranty) {
      activeBoxes.push(
        <div key="warranty" className="flex items-center gap-3 p-4 bg-white rounded-lg border">
          <Shield className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-medium text-sm">Garantía</p>
            <p className="text-xs text-gray-500">{warrantyText}</p>
          </div>
        </div>
      );
    }

    // Devoluciones
    if (boxesConfig.returns) {
      activeBoxes.push(
        <div key="returns" className="flex items-center gap-3 p-4 bg-white rounded-lg border">
          <RotateCcw className="w-6 h-6 text-orange-500" />
          <div>
            <p className="font-medium text-sm">Devoluciones</p>
            <p className="text-xs text-gray-500">{returnsText}</p>
          </div>
        </div>
      );
    }

    if (activeBoxes.length === 0) {
      return null;
    }

    // Distribuir las cajas en una grilla
    const gridCols = activeBoxes.length === 1 ? "grid-cols-1" : 
                    activeBoxes.length === 2 ? "grid-cols-1 sm:grid-cols-2" : 
                    "grid-cols-1 sm:grid-cols-3";
    return (
      <div className={`grid ${gridCols} gap-4`}>
        {activeBoxes}
      </div>
    );
  };

  const renderPrice = () => {
    // Para variación seleccionada con oferta
    if (selectedVariation) {
      const normalPrice = selectedVariation.pricings?.[0]?.unitPrice;
      const offerPrice = selectedVariation.offers?.[0]?.unitPrice;
      
  

      // Si tiene oferta, mostrar ambos precios
      if (offerPrice && normalPrice) {
        const precioPorCuota = offerPrice && cuotasEnabled ? Math.ceil(offerPrice / numeroCuotas) : 0;
        const discount = calculateDiscount(normalPrice, offerPrice);

        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-400 line-through">
                ${normalPrice.toLocaleString('es-CL')}
              </span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{discount}%
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-4xl font-bold text-red-600">
                ${offerPrice.toLocaleString('es-CL')}
              </span>
              {cuotasEnabled && numeroCuotas > 0 && (
                <div className="text-green-600 font-semibold">
                  En {numeroCuotas} cuotas sin interés de ${precioPorCuota.toLocaleString("es-CL")}
                </div>
              )}
            </div>
          </div>
        );
      }

      // Si no tiene oferta, mostrar solo el precio normal
      if (normalPrice) {
        const precioPorCuota = cuotasEnabled ? Math.ceil(normalPrice / numeroCuotas) : 0;
        return (
          <div className="space-y-2">
            <span className="text-4xl font-bold text-gray-900">
              ${normalPrice.toLocaleString("es-CL")}
            </span>
            {cuotasEnabled && numeroCuotas > 0 && (
              <div className="text-green-600 font-semibold">
                En {numeroCuotas} cuotas sin interés de ${precioPorCuota.toLocaleString("es-CL")}
              </div>
            )}
          </div>
        );
      }
    }

    // Para productos con variaciones y ofertas (cuando no hay variación seleccionada)
    if (variations.length > 1) {
      const normalPrices = variations
        .map(v => v.pricings?.[0]?.unitPrice)
        .filter((p): p is number => p !== undefined && p > 0);
      
      const offerPrices = variations
        .map(v => v.offers?.[0]?.unitPrice)
        .filter((p): p is number => p !== undefined && p > 0);

      // Si hay ofertas, mostrar ambos rangos de precios
      if (offerPrices.length > 0) {
        const minNormalPrice = Math.min(...normalPrices);
        const maxNormalPrice = Math.max(...normalPrices);
        const minOfferPrice = Math.min(...offerPrices);
        const maxOfferPrice = Math.max(...offerPrices);

        const maxDiscount = Math.max(
          ...variations
            .filter(v => v.offers?.[0]?.unitPrice && v.pricings?.[0]?.unitPrice)
            .map(v => calculateDiscount(v.pricings[0].unitPrice, v.offers![0].unitPrice))
        );

        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-400 line-through">
                {minNormalPrice === maxNormalPrice
                  ? `$${minNormalPrice.toLocaleString("es-CL")}`
                  : `$${minNormalPrice.toLocaleString("es-CL")} - $${maxNormalPrice.toLocaleString("es-CL")}`
                }
              </span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{maxDiscount}%
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-3xl font-bold text-red-600">
                {minOfferPrice === maxOfferPrice
                  ? `$${minOfferPrice.toLocaleString("es-CL")}`
                  : `$${minOfferPrice.toLocaleString("es-CL")} - $${maxOfferPrice.toLocaleString("es-CL")}`
                }
              </span>
              {cuotasEnabled && numeroCuotas > 0 && (
                <div className="text-green-600 font-semibold">
                  En {numeroCuotas} cuotas sin interés desde ${Math.ceil(minOfferPrice / numeroCuotas).toLocaleString("es-CL")}
                </div>
              )}
            </div>
          </div>
        );
      }

      // Si no hay ofertas, mostrar rango de precios normal
      if (normalPrices.length > 0) {
        const minPrice = Math.min(...normalPrices);
        const maxPrice = Math.max(...normalPrices);
        const precioPorCuota = cuotasEnabled ? Math.ceil(minPrice / numeroCuotas) : 0;

        return (
          <div className="space-y-2">
            <span className="text-3xl font-bold text-gray-900">
              {minPrice === maxPrice
                ? `$${minPrice.toLocaleString("es-CL")}`
                : `$${minPrice.toLocaleString("es-CL")} - $${maxPrice.toLocaleString("es-CL")}`
              }
            </span>
            {cuotasEnabled && numeroCuotas > 0 && (
              <div className="text-green-600 font-semibold">
                En {numeroCuotas} cuotas sin interés desde ${precioPorCuota.toLocaleString("es-CL")}
              </div>
            )}
          </div>
        );
      }
    }

    // Para precio base sin variaciones
    if (minPrice && maxPrice && !isNaN(parseFloat(minPrice)) && !isNaN(parseFloat(maxPrice))) {
      const minPriceNum = parseFloat(minPrice);
      const maxPriceNum = parseFloat(maxPrice);
      const precioPorCuota = cuotasEnabled ? Math.ceil(minPriceNum / numeroCuotas) : 0;

      return (
        <div className="space-y-2">
          <span className="text-3xl font-bold text-gray-900">
            {minPriceNum === maxPriceNum
              ? `$${minPriceNum.toLocaleString("es-CL")}`
              : `$${minPriceNum.toLocaleString("es-CL")} - $${maxPriceNum.toLocaleString("es-CL")}`
            }
          </span>
          {cuotasEnabled && numeroCuotas > 0 && (
            <div className="text-green-600 font-semibold">
              En {numeroCuotas} cuotas sin interés desde ${precioPorCuota.toLocaleString("es-CL")}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-2xl font-bold text-gray-500">
        Precio no disponible
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs category={categories[0]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border relative">
              <img
                src={selectedThumbnail || mainImageUrl}
                alt={productName}
                className="w-full h-full object-cover"
              />
              {/* Stock and offer indicators */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {selectedVariation?.offers?.length > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{discountPercentage}%
                  </span>
                )}
                {(() => {
                  const stockStatus = getOverallStockStatus();
                  
                  // Para productos variables sin variación seleccionada, verificar si todas las variaciones están agotadas
                  if (stockStatus.hasStock === null && variations.length > 1) {
                    const allVariationsOutOfStock = Object.values(variationsStock).every(stockValue => stockValue === 0);
                    if (allVariationsOutOfStock && Object.keys(variationsStock).length > 0) {
                      return (
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Agotado
                        </span>
                      );
                    }
                    return null;
                  }
                  
                  // Solo mostrar "Agotado" si realmente no hay stock (no durante la carga)
                  return stockStatus.hasStock === false && !isLoadingSelectedVariationStock && (
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Agotado
                    </span>
                  );
                })()}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {thumbnails.slice(0, 4).map((thumbnail, index) => (
                <div
                  key={thumbnail.id}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border cursor-pointer hover:border-gray-400 transition-colors ${
                    selectedThumbnail === thumbnail.imageUrl ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedThumbnail(thumbnail.imageUrl)}
                >
                  <img
                    src={thumbnail.imageUrl}
                    alt={`${productName} view ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {categories[0] && (
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  {categories[0]}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{productName}</h1>
              {showShortDescription && shortDescription && shortDescription.trim() !== "" && (
                <p className="text-gray-600 mb-4 ql-editor" dangerouslySetInnerHTML={{ __html: shortDescription }} />
              )}

              {/* Rating */}
              {reviewAverageScore && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(reviewAverageScore) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {reviewAverageScore.toFixed(1)} ({totalReviews} reseñas)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {renderPrice()}
            </div>

            {/* Stock Status */}
            {(() => {
              const stockStatus = getOverallStockStatus();
              
              // Mostrar skeleton cuando se está cargando el stock de una variación seleccionada
              if (isLoadingSelectedVariationStock) {
                return (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
                    <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
                  </div>
                );
              }
              
              // No mostrar estado de stock si hasStock es null (productos variables sin variación seleccionada)
              if (stockStatus.hasStock === null) {
                return null;
              }
              
              return (
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stockStatus.hasStock ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-sm font-medium ${stockStatus.hasStock ? "text-green-700" : "text-red-700"}`}>
                    {stockStatus.hasStock ? "En Stock" : "Agotado"}
                  </span>
                </div>
              );
            })()}

            {/* Product Variations */}
            {Object.entries(currentAttributes).map(([attributeName, values]) => (
              <div key={attributeName} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">{capitalizeFirstLetter(attributeName)}</h3>
                  {attributeName.toLowerCase().includes('talla') && (
                    <button 
                      onClick={() => setShowModal(true)}
                      className="text-primary hover:text-primary/80 text-sm underline"
                    >
                      Guía de tallas
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {values.map((value, index) => {
                    const isDisabled = disabledAttributes[attributeName]?.[index] || false;
                    const isSelected = selectedAttributes[attributeName] === value;
                    
                    return (
                                              <button
                          key={value}
                          onClick={() => handleAttributeChange(attributeName, value)}
                          title={isDisabled ? 'Opción no disponible - Hacer clic para reiniciar selección' : 'Opción disponible'}
                          className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                            isSelected 
                              ? 'bg-primary text-white border-primary' 
                              : isDisabled
                              ? 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200 hover:text-gray-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/10'
                          }`}
                        >
                          {value}
                        </button>
                    );
                  })}
                </div>
              </div>
            ))}

                                                   {/* Actions */}
             <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-center">
               {/* Mobile Layout */}
               <div className="flex flex-col gap-3 sm:hidden">
                 {/* Quantity Selector */}
                 <div className="flex items-center border border-gray-300 overflow-hidden w-fit" style={{ borderRadius: "var(--radius)" }}>
                   <button
                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
                     className="px-3 py-2 hover:bg-gray-50 transition-colors bg-white"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                   <span className="px-4 py-2 border-x bg-white border-gray-300 min-w-[60px] text-center font-medium">
                     {quantity}
                   </span>
                   <button
                     onClick={() => setQuantity(Math.min(10, quantity + 1))}
                     className="px-3 py-2 hover:bg-gray-50 transition-colors bg-white"
                   >
                     <Plus className="w-4 h-4" />
                   </button>
                 </div>

                 {/* Add to Cart and Share Buttons - Mobile */}
                 <div className="flex gap-3">
                   {/* Add to Cart Button */}
                   <button
                     onClick={handleAddToCart}
                     disabled={(() => {
                       const stockStatus = getOverallStockStatus();
                       if (stockStatus.hasStock === null) {
                         return false;
                       }
                       return !stockStatus.hasStock;
                     })()}
                     className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
                       (() => {
                         const stockStatus = getOverallStockStatus();
                         if (stockStatus.hasStock === null) {
                           return false;
                         }
                         return !stockStatus.hasStock;
                       })()
                         ? 'bg-gray-400 text-white cursor-not-allowed'
                         : 'bg-primary text-white hover:bg-primary/80'
                     }`}
                     style={{
                       borderRadius: "var(--radius)",
                     }}
                   >
                     {(() => {
                       const stockStatus = getOverallStockStatus();
                       if (stockStatus.hasStock === null) {
                         return 'Agregar al Carrito';
                       }
                       return !stockStatus.hasStock ? 'Agotado' : 'Agregar al Carrito';
                     })()}
                   </button>

                   {/* Share Button */}
                   <button 
                     onClick={handleShare}
                     className="p-3 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
                     style={{ borderRadius: "var(--radius)" }}
                   >
                     <Share2 className="w-5 h-5" />
                   </button>
                 </div>
               </div>

               {/* Desktop Layout */}
               <div className="hidden sm:flex sm:gap-4 sm:items-center sm:w-full">
                 {/* Quantity Selector */}
                 <div className="flex items-center border border-gray-300 overflow-hidden w-fit" style={{ borderRadius: "var(--radius)" }}>
                   <button
                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
                     className="px-3 py-2 hover:bg-gray-50 transition-colors bg-white"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                   <span className="px-4 py-2 border-x bg-white border-gray-300 min-w-[60px] text-center font-medium">
                     {quantity}
                   </span>
                   <button
                     onClick={() => setQuantity(Math.min(10, quantity + 1))}
                     className="px-3 py-2 hover:bg-gray-50 transition-colors bg-white"
                   >
                     <Plus className="w-4 h-4" />
                   </button>
                 </div>

                 {/* Add to Cart and Share Buttons Container */}
                 <div className="flex gap-4 flex-1">
                   {/* Add to Cart Button */}
                   <button
                     onClick={handleAddToCart}
                     disabled={(() => {
                       const stockStatus = getOverallStockStatus();
                       if (stockStatus.hasStock === null) {
                         return false;
                       }
                       return !stockStatus.hasStock;
                     })()}
                     className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors ${
                       (() => {
                         const stockStatus = getOverallStockStatus();
                         if (stockStatus.hasStock === null) {
                           return false;
                         }
                         return !stockStatus.hasStock;
                       })()
                         ? 'bg-gray-400 text-white cursor-not-allowed'
                         : 'bg-primary text-white hover:bg-primary/80'
                     }`}
                     style={{
                       borderRadius: "var(--radius)",
                     }}
                   >
                     {(() => {
                       const stockStatus = getOverallStockStatus();
                       if (stockStatus.hasStock === null) {
                         return 'Agregar al Carrito';
                       }
                       return !stockStatus.hasStock ? 'Agotado' : 'Agregar al Carrito';
                     })()}
                   </button>

                   {/* Share Button */}
                   <button 
                     onClick={handleShare}
                     className="p-3 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
                     style={{ borderRadius: "var(--radius)" }}
                   >
                     <Share2 className="w-5 h-5" />
                   </button>
                 </div>
               </div>
             </div>

         

            {/* Shipping & Returns */}
            {renderInfoBoxes()}

            {/* Delivery Information */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-lg mb-4">Información de Entrega</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${enabledForDelivery ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-700">
                    {enabledForDelivery ? 'Disponible para delivery' : 'Delivery no disponible'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${enabledForWithdrawal ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-700">
                    {enabledForWithdrawal ? 'Disponible para retiro' : 'Retiro no disponible'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Description */}
        {showLongDescription && description && description.trim() !== "" && (
          <div className="mt-6 sm:mt-16 bg-white rounded-lg border p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Descripción del Producto</h2>
            <div className="prose prose-lg max-w-none ql-editor" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        )}

        {/* Related Products */}
        <div className="mt-6 sm:mt-16">
          <Destacados01 text="TE PUEDE GUSTAR" />
          {isReviewEnabled && (
            <Stars
              reviewAverageScore={reviewAverageScore}
              totalReviews={totalReviews}
              productId={selectedVariation?.product?.id || initialProduct?.skus?.[0]?.product?.id}
            />
          )}
        </div>
      </div>

      {/* Modal de guía de tallas */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-2xl w-full mx-4" style={{ borderRadius: "var(--radius)" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">Guía de tallas</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Aquí puedes agregar el contenido de tu guía de tallas */}
            <div className="prose">
              <p>Contenido de la guía de tallas...</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de selección de variaciones */}
      {showVariationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-md w-full mx-4" style={{ borderRadius: "var(--radius)" }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Selecciona las opciones</h3>
              <button
                onClick={() => setShowVariationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 p-1 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm">
                  Para agregar este producto al carrito, necesitas seleccionar todas las opciones disponibles.
                </p>
              </div>
              
              <div className="space-y-3">
                {Object.entries(currentAttributes).map(([attributeName, values]) => (
                  <div key={attributeName} className="border-l-4 border-primary pl-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {capitalizeFirstLetter(attributeName)}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {values.map((value, index) => {
                        const isSelected = selectedAttributes[attributeName] === value;
                        const isDisabled = disabledAttributes[attributeName]?.[index] || false;
                        
                        return (
                                                                                <button
                             key={value}
                             onClick={() => {
                               handleAttributeChange(attributeName, value);
                             }}
                             className={`px-3 py-1.5 border text-sm font-medium transition-colors ${
                               isSelected 
                                 ? 'bg-primary text-white border-primary' 
                                 : isDisabled
                                 ? 'bg-gray-100 text-gray-400 border-gray-200'
                                 : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/10'
                             }`}
                             style={{ borderRadius: "var(--radius)" }}
                           >
                             {value}
                           </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                                     <div className="flex items-center gap-3">
                     <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                     <div className="flex items-center border border-gray-300 overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                       <button
                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
                         className="px-3 py-2 hover:bg-gray-50 transition-colors bg-white"
                       >
                         <Minus className="w-4 h-4" />
                       </button>
                       <span className="px-4 py-2 border-x bg-white border-gray-300 min-w-[60px] text-center font-medium">
                         {quantity}
                       </span>
                       <button
                         onClick={() => setQuantity(Math.min(10, quantity + 1))}
                         className="px-3 py-2 hover:bg-gray-50 transition-colors bg-white"
                       >
                         <Plus className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowVariationModal(false)}
                    className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 transition-colors"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (areAllAttributesSelected()) {
                        // Si todas las variaciones están seleccionadas, agregar al carrito
                        if (selectedVariation) {
                          addToCartHandler(selectedVariation.id, quantity);
                          toast.success("Producto agregado al carrito");
                        }
                        setShowVariationModal(false);
                      } else {
                        toast.error("Selecciona todas las opciones para continuar");
                      }
                    }}
                    disabled={(() => {
                      if (!areAllAttributesSelected()) return false;
                      if (!selectedVariation) return false;
                      const variationStock = variationsStock[selectedVariation.id];
                      return variationStock !== undefined && variationStock === 0;
                    })()}
                    className={`px-6 py-2 transition-colors font-medium ${
                      (() => {
                        if (!areAllAttributesSelected()) return 'bg-primary text-white hover:bg-primary/80';
                        if (!selectedVariation) return 'bg-primary text-white hover:bg-primary/80';
                        const variationStock = variationsStock[selectedVariation.id];
                        if (variationStock !== undefined && variationStock === 0) {
                          return 'bg-gray-400 text-white cursor-not-allowed';
                        }
                        return 'bg-primary text-white hover:bg-primary/80';
                      })()
                    }`}
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {(() => {
                      if (!areAllAttributesSelected()) return 'Agregar al Carrito';
                      if (!selectedVariation) return 'Agregar al Carrito';
                      const variationStock = variationsStock[selectedVariation.id];
                      if (variationStock !== undefined && variationStock === 0) {
                        return 'Sin Stock';
                      }
                      return 'Agregar al Carrito';
                    })()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="bg-white p-6 shadow-lg relative max-w-md w-full mx-4"
            style={{ borderRadius: "var(--radius)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Métodos de Pago</h3>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Tarjetas de crédito</h4>
                  <p className="text-sm text-gray-600 mb-2">Acreditación instantánea.</p>
                  <p className="text-sm text-green-500 font-medium mb-2">
                    Paga en {numeroCuotas} cuotas sin interés con estas tarjetas
                  </p>
                  <p className="text-sm text-gray-600 mb-3">Con todos los bancos.</p>
                  <div className="flex gap-4">
                    <img 
                      src="/images/Tarjetas/visa.png" 
                      alt="Visa" 
                      className="h-10" 
                    />
                    <img src="/images/Tarjetas/mastercard.png" alt="Mastercard" className="h-10" />
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Tarjetas de débito</h4>
                  <p className="text-sm text-gray-600">Acreditación instantánea.</p>
                  <div className="flex gap-4 mt-2">
                    <img 
                      src="/images/Tarjetas/visa.png" 
                      alt="Visa" 
                      className="h-10" 
                    />
                    <img src="/images/Tarjetas/mastercard.png" alt="Mastercard" className="h-10" />
                    <img src="/images/Tarjetas/redcompra.webp" alt="Webpay" className="h-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail03;