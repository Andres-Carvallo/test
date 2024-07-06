import React, { useState, useEffect } from "react";

import { getCookie } from "cookies-next";
import VariationForm from "./VariationForm";
import axios from "axios";
interface Variation {
  description: string;
  images: any[];
  [key: string]: any;
}
type AttributesByVariation = {
  [key: string]: any[];
};
function VariationsComponente({
  isEditMode,
  setIsEditMode,
  productId,
  skuId,
  skuImages,
  fetchImages,
  selectedImages,
  handleImageGalleryChange,
  handleImageRemove,
  variations,
  setVariations,
}: any) {
  const [variationImages, setVariationImages] = useState<any[]>([]); // Estado para las imágenes de la variación
  const [attributes, setAttributes] = useState<any[]>([]);
  const [currentAttributes, setCurrentAttributes] = useState<any>({});
  const [currentPrices, setCurrentPrices] = useState({});
  const [currentStocks, setCurrentStocks] = useState({});

  const [currentVariationIndex, setCurrentVariationIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    fetchAttributes();
    fetchVariations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVariationImages = async (productId: any, skuId: any) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, "datito");

      if (data && data.skuImages) {
        setVariationImages(data.skuImages); // Actualiza el estado local con las imágenes obtenidas
      }
    } catch (error) {
      console.error("Error fetching variation images:", error);
    }
  };

  const fetchAttributes = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/attributes?pageNumber=1&pageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.code === 0) {
        setAttributes(data.attributes);
      } else {
        console.error("Error fetching attributes:", data.message);
      }
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  };

  // Definir los tipos de datos
  type AttributesByVariation = { [key: string]: any[] };
  type PricesByVariation = { [key: string]: number | null };
  type StockByVariation = { [key: string]: number | null };

  // Definir el objeto para almacenar los atributos y precios por variación fuera de la función
  const attributesByVariation: AttributesByVariation = {};
  const pricesByVariation: PricesByVariation = {};
  const stockByVariation: StockByVariation = {};

  const fetchVariations = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const searchParams = new URLSearchParams(window.location.search);
      const idVariable = searchParams.get("productVariableId");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus?statusCode=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseVariations = await response.json();
      if (responseVariations.code === 0) {
        const filteredVariations = responseVariations.skus.filter(
          (variation: any) => !variation.isBaseSku
        );

        // Crear promesas para fetchAttributesForVariation, fetchPriceForVariation y fetchStockForVariation
        const fetchTasks = filteredVariations.map(async (variation: any) => {
          const [attributes, price, stock] = await Promise.all([
            fetchAttributesForVariation(variation.id),
            fetchPriceForVariation(idVariable as string, variation.id),
            fetchStockForVariation(idVariable, variation.id),
            fetchVariationImages(idVariable, variation.id),
          ]);

          if (attributes !== null) {
            attributesByVariation[variation.id] = attributes;
          } else {
            console.log(
              `No se encontraron atributos para la variación con ID: ${variation.id}`
            );
          }

          pricesByVariation[variation.id] = price;
          stockByVariation[variation.id] = stock;
        });

        await Promise.all(fetchTasks);

        // Establecer los atributos, precios y stock actuales
        setCurrentAttributes(attributesByVariation);
        setCurrentPrices(pricesByVariation);
        setCurrentStocks(stockByVariation);

        // Establecer las variaciones filtradas
        setVariations(filteredVariations);
      } else {
        console.error("Error fetching variations:", responseVariations.message);
      }
    } catch (error) {
      console.error("Error fetching variations:", error);
    }
  };

  const fetchPriceForVariation = async (productId: string, skuId: string) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/pricings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.code === 0) {
        // Extracción del precio de la primera skuPricing, si existe
        const price =
          data.skuPricings.length > 0 ? data.skuPricings[0].unitPrice : null;
        return price;
      } else {
        console.error(
          "Error al obtener el precio de la variación:",
          data.message
        );
        return null; // En caso de error, devuelve null
      }
    } catch (error) {
      console.error("Error al obtener el precio de la variación:", error);
      return null; // En caso de error, devuelve null
    }
  };
  const getWarehouseId = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/warehouses?pageNumber=1&pageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data &&
        response.data.warehouses &&
        response.data.warehouses.length > 0
      ) {
        return response.data.warehouses[0].id; // Devuelve el id del primer almacén
      } else {
        console.error("No se encontraron almacenes.");
        return null;
      }
    } catch (error) {
      console.error("Error obteniendo almacén:", error);
      return null;
    }
  };
  const fetchStockForVariation = async (productId: any, skuId: any) => {
    try {
      const warehouseId = await getWarehouseId();
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/inventories?warehouseId=${warehouseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.code === 0) {
        // Extracción del stock de la primera skuInventory, si existe
        const stock =
          data.skuInventories.length > 0
            ? data.skuInventories[0].quantity
            : null;
        return stock;
      } else {
        console.error(
          "Error al obtener el stock de la variación:",
          data.message
        );
        return null; // En caso de error, devuelve null
      }
    } catch (error) {
      console.error("Error al obtener el stock de la variación:", error);
      return null; // En caso de error, devuelve null
    }
  };

  const fetchAttributesForVariation = async (variationId: string) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const searchParams = new URLSearchParams(window.location.search);
      const productVariableId = searchParams.get("productVariableId");
      const attributesUrl = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productVariableId}/skus/${variationId}/attributes`;

      const response = await fetch(attributesUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      if (responseData.code === 0) {
        const attributes = responseData.skuAttributes.map(
          (skuAttribute: any) => ({
            value: skuAttribute.value,
            label: skuAttribute.attribute.name,
          })
        );
        return attributes; // Devuelve los atributos en lugar de guardarlos en el estado
      } else {
        console.error(
          "Error al obtener los atributos de la variación:",
          responseData.message
        );
        return null; // En caso de error, devuelve null
      }
    } catch (error) {
      console.error("Error al obtener los atributos de la variación:", error);
      return null; // En caso de error, devuelve null
    }
  };

  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        description: "",
        hasUnlimitedStock: false,
        hasStockNotifications: false,
        mainImage: null,
        previewImage: null,
        images: [],
      },
    ]);
    setCurrentVariationIndex(variations.length); // Abrir el formulario del último agregado
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = e.target;
    setVariations((prevVariations: any) => {
      const updatedVariations = [...prevVariations];
      updatedVariations[index].description = value;
      return updatedVariations;
    });
  };

  const handleMainImageChange = (image: any, index: number) => {
    console.log(" Image:", image); // Añadir este log para verificar la imagen
    setVariations((prevVariations: any) => {
      const updatedVariations = [...prevVariations];
      updatedVariations[index].mainImage = image;
      return updatedVariations;
    });
  };

  const handlePreviewImageChange = (image: any, index: number) => {
    setVariations((prevVariations: any) => {
      const updatedVariations = [...prevVariations];
      updatedVariations[index].previewImage = image;
      return updatedVariations;
    });
  };
  const handleDeleteVariation = async (skuId: string, index: number) => {
    if (!skuId) {
      // Si no hay ID, elimina la variación del estado local
      setVariations((prevVariations: any) =>
        prevVariations.filter((_: any, i: number) => i !== index)
      );
      return;
    }
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idVariable = searchParams.get("productVariableId");
      const token = getCookie("AdminTokenAuth");

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${skuId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(`Variation with ID: ${skuId} deleted successfully.`);
        fetchVariations(); // Call fetchVariations to update the list
      } else {
        console.error("Error deleting variation:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting variation:", error);
    }
  };
  const handleCloseForm = () => {
    setCurrentVariationIndex(null);
  };

  if (!isEditMode) {
    return null;
  }

  return (
    <div className="space-y-4 border-dark border-t mt-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold uppercase mt-4">Variaciones</h2>
        <button
          onClick={handleAddVariation}
          className="bg-green-700 text-white px-4 py-2 rounded mt-4"
        >
          Agregar Variación
        </button>
      </div>

      {variations.map((variation: any, index: any) => (
        <div
          key={index}
          className="p-4 border border-dotted border-dark bg-white rounded-xl shadow"
        >
          <div className="flex justify-between">
            <div className="flex gap-2">
              <h4 className="bg-primary text-xs uppercase text-white px-2 py-1 rounded">
                N° {index + 1}
              </h4>
              <div className="current-attributes flex gap-2">
                {currentAttributes[variation.id]?.map(
                  (attribute: any, index: any) => (
                    <h4
                      key={index}
                      className="bg-primary text-xs text-white px-2 py-1 rounded"
                    >
                      {attribute.label}:
                      <span className="font-bold">
                        {""} {attribute.value}
                      </span>
                    </h4>
                  )
                )}
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setCurrentVariationIndex(index)}>
                {currentVariationIndex === index ? null : (
                  <div>
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
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => handleDeleteVariation(variation.id, index)}
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
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div>
            {currentVariationIndex === index && (
              <VariationForm
                variation={variation}
                fetchVariations={fetchVariations}
                currentPrices={currentPrices}
                currentStocks={currentStocks}
                currentAttributes={currentAttributes}
                setVariations={setVariations}
                fetchVariationImages={fetchVariationImages}
                variationImages={variationImages}
                index={index}
                setIsEditMode={setIsEditMode}
                attributes={attributes}
                onDescriptionChange={(e: any) =>
                  handleDescriptionChange(e, index)
                }
                onMainImageChange={(image: any) =>
                  handleMainImageChange(image, index)
                }
                onPreviewImageChange={(image: any) =>
                  handlePreviewImageChange(image, index)
                }
                onCloseForm={handleCloseForm}
                productId={productId}
                skuId={skuId}
                skuImages={skuImages}
                fetchImages={fetchImages}
                selectedImages={selectedImages}
                handleImageGalleryChange={handleImageGalleryChange}
                handleImageRemove={handleImageRemove}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VariationsComponente;
