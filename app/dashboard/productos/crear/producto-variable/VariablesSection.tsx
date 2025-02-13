import React, { useState, useEffect } from "react";

import { getCookie } from "cookies-next";
import VariationForm from "./VariationForm";
import axios from "axios";
import toast from "react-hot-toast";
import { useRevalidation } from "@/app/Context/RevalidationContext";

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
  baseProductDescription,
}: any) {
  const [variationImages, setVariationImages] = useState<any[]>([]); // Estado para las imágenes de la variación actual
  const [allVariationImages, setAllVariationImages] = useState<{
    [key: string]: any[];
  }>({});
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [attributes, setAttributes] = useState<any[]>([]);
  const [currentAttributes, setCurrentAttributes] = useState<any>({});
  const [currentPrices, setCurrentPrices] = useState({});
  const [currentStocks, setCurrentStocks] = useState({});
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState<any>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isDeletingVariation, setIsDeletingVariation] = useState(false);
  const [deletingVariationId, setDeletingVariationId] = useState<string | null>(
    null
  );

  const showDeleteModal = (variation: any) => {
    setVariationToDelete(variation);
    setIsDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setVariationToDelete(null);
  };
  const confirmDeleteVariation = async () => {
    if (variationToDelete) {
      hideDeleteModal(); // Cerramos el modal inmediatamente
      await handleDeleteVariation(
        variationToDelete.id,
        variations.indexOf(variationToDelete)
      );
    }
  };

  const [currentMinimumQuantities, setCurrentMinimumQuantities] = useState<{
    [key: string]: number | null;
  }>({});

  const [currentVariationIndex, setCurrentVariationIndex] = useState<
    number | null
  >(null);

  const { triggerRevalidation } = useRevalidation();

  useEffect(() => {
    const initializeData = async () => {
      const attrs = await fetchAttributes();
      if (attrs) {
        setAttributes(attrs);
        await fetchVariations();
        // Cargar imágenes de todas las variaciones inmediatamente
        await fetchAllVariationImages();
      }
    };
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllVariationImages = async () => {
    setIsLoadingImages(true);
    const searchParams = new URLSearchParams(window.location.search);
    const idVariable = searchParams.get("productVariableId");
    const token = getCookie("AdminTokenAuth");

    try {
      const promises = variations.map(async (variation: Variation) => {
        if (!variation.id || imagesLoaded[variation.id]) return;

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variation.id}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) return;

          const data = await response.json();
          if (data && data.skuImages) {
            return { id: variation.id, images: data.skuImages };
          }
        } catch (error) {
          console.error("Error fetching variation images:", error);
        }
      });

      const results = await Promise.all(promises);
      const imagesMap = results.reduce((acc: any, result) => {
        if (result) {
          acc[result.id] = result.images;
        }
        return acc;
      }, {});

      setAllVariationImages((prev) => ({ ...prev, ...imagesMap }));
      setImagesLoaded((prev) => {
        const newLoaded = { ...prev };
        variations.forEach((variation: Variation) => {
          if (variation.id) {
            newLoaded[variation.id] = true;
          }
        });
        return newLoaded;
      });
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const fetchAttributes = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/attributes?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.code === 0) {
        return data.attributes;
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
  const pricesByVariation: PricesByVariation = {};
  const stockByVariation: StockByVariation = {};
  const minimumQuantitiesByVariation: { [key: string]: number | null } = {};

  const fetchVariations = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const searchParams = new URLSearchParams(window.location.search);
      const idVariable = searchParams.get("productVariableId");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus?statusCode=ACTIVE&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
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

        // Separar variaciones existentes y nuevas
        const existingVariations = filteredVariations.filter(
          (v: any) => !v.isNew
        );
        const newVariations = variations.filter((v: any) => v.isNew);

        // Ordenar las variaciones existentes por fecha de creación
        existingVariations.sort((a: any, b: any) => {
          if (a.createdAt && b.createdAt) {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          }
          return 0;
        });

        // Combinar las variaciones manteniendo el orden
        const combinedVariations = [...existingVariations, ...newVariations];

        // Crear promesas para fetchPriceForVariation, fetchStockForVariation y fetchAttributesForVariation
        const fetchTasks = combinedVariations.map(async (variation: any) => {
          const [price, stockData, attributes] = await Promise.all([
            fetchPriceForVariation(idVariable as string, variation.id),
            fetchStockForVariation(idVariable, variation.id),
            fetchAttributesForVariation(variation.id),
          ]);

          if (stockData && stockData !== null) {
            variation.stock = stockData.stock;
            variation.minimumQuantity = stockData.minimumQuantity;
          }
          variation.hasStockNotifications =
            variation.hasStockNotifications || false;

          return {
            variationId: variation.id,
            price,
            stock: stockData?.stock,
            minimumQuantity: stockData?.minimumQuantity ?? 0,
            attributes,
          };
        });

        const results = await Promise.all(fetchTasks);

        // Actualizar los estados con los resultados
        const newPrices: { [key: string]: number | null } = {};
        const newStocks: { [key: string]: number | null } = {};
        const newMinimumQuantities: { [key: string]: number | null } = {};
        const newAttributes: { [key: string]: any[] } = {};

        results.forEach((result) => {
          if (result.variationId) {
            newPrices[result.variationId] = result.price;
            newStocks[result.variationId] = result.stock;
            newMinimumQuantities[result.variationId] = result.minimumQuantity;
            if (result.attributes) {
              newAttributes[result.variationId] = result.attributes;
            }
          }
        });

        setCurrentPrices(newPrices);
        setCurrentStocks(newStocks);
        setCurrentMinimumQuantities(newMinimumQuantities);
        setCurrentAttributes(newAttributes);
        setVariations(combinedVariations);
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
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/pricings?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
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
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/warehouses?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
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
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/inventories?warehouseId=${warehouseId}&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.code === 0) {
        const stock =
          data.skuInventories.length > 0
            ? data.skuInventories[0].quantity
            : null;

        const minimumQuantity =
          data.skuInventories.length > 0
            ? data.skuInventories[0].minimumQuantity ?? 0
            : 0;

        // Devuelve un objeto con ambas propiedades
        return { stock, minimumQuantity };
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
      const attributesUrl = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productVariableId}/skus/${variationId}/attributes?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`;

      const response = await fetch(attributesUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      if (responseData.code === 0) {
        return responseData.skuAttributes.map((skuAttribute: any) => ({
          value: skuAttribute.value,
          label: skuAttribute.attribute.name,
        }));
      }
      return null;
    } catch (error) {
      console.error("Error al obtener los atributos de la variación:", error);
      return null;
    }
  };

  const handleAddVariation = () => {
    // Verificar si ya existe una variación nueva sin guardar
    const hasUnsavedVariation = variations.some((v: any) => v.isNew);
    if (hasUnsavedVariation) {
      toast.error(
        "Por favor, guarde la variación actual antes de crear una nueva"
      );
      return;
    }

    // Verificar si hay una variación seleccionada actualmente
    if (currentVariationIndex !== null) {
      toast.error(
        "Por favor, cierre la variación actual antes de crear una nueva"
      );
      return;
    }

    const newVariation = {
      description: "",
      hasUnlimitedStock: false,
      hasStockNotifications: false,
      mainImage: null,
      previewImage: null,
      images: [],
      isNew: true,
      tempId: Date.now(),
    };

    // Actualizar las variaciones y el índice de manera síncrona
    setVariations((prevVariations: Variation[]) => {
      const newVariations = [...prevVariations, newVariation];
      return newVariations;
    });
    setCurrentVariationIndex(variations.length);
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
      setVariations((prevVariations: any) =>
        prevVariations.filter((_: any, i: number) => i !== index)
      );
      toast.success("Variación eliminada con éxito");
      return;
    }

    setIsDeletingVariation(true);
    setDeletingVariationId(skuId);

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idVariable = searchParams.get("productVariableId");
      const token = getCookie("AdminTokenAuth");

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${skuId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await triggerRevalidation();
        await fetchVariations();
        toast.success("Variación eliminada con éxito");
        setIsDeletingVariation(false);
        setDeletingVariationId(null);
      } else {
        console.error("Error deleting variation:", response.statusText);
        toast.error("Error al eliminar la variación");
        setIsDeletingVariation(false);
        setDeletingVariationId(null);
      }
    } catch (error) {
      console.error("Error deleting variation:", error);
      toast.error("Error al eliminar la variación");
      setIsDeletingVariation(false);
      setDeletingVariationId(null);
    }
  };
  const handleVariationSelect = async (index: number) => {
    // Si el índice actual es el mismo que estamos intentando seleccionar, lo cerramos
    if (currentVariationIndex === index) {
      setCurrentVariationIndex(null);
      setVariationImages([]); // Solo limpiamos las imágenes del estado local
      return;
    }

    // Establecer el índice de variación actual primero
    setCurrentVariationIndex(index);

    // Si es un índice diferente, verificamos si necesitamos cargar las imágenes
    const variation = variations[index];
    if (variation && variation.id) {
      setIsLoadingImages(true);
      try {
        // Si no tenemos las imágenes en caché, las cargamos
        if (
          !allVariationImages[variation.id] ||
          allVariationImages[variation.id].length === 0
        ) {
          const searchParams = new URLSearchParams(window.location.search);
          const idVariable = searchParams.get("productVariableId");
          const token = getCookie("AdminTokenAuth");

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variation.id}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data && data.skuImages) {
              setAllVariationImages((prev) => ({
                ...prev,
                [variation.id]: data.skuImages,
              }));
              setVariationImages(data.skuImages);
            }
          }
        } else {
          // Si ya tenemos las imágenes en caché, las usamos
          setVariationImages(allVariationImages[variation.id]);
        }
      } catch (error) {
        console.error("Error loading variation images:", error);
        toast.error("Error al cargar las imágenes de la variación");
      } finally {
        setIsLoadingImages(false);
      }
    }
  };

  const handleCloseForm = () => {
    setCurrentVariationIndex(null);
    setVariationImages([]); // Limpiar las imágenes al cerrar el formulario
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
          disabled={variations.some((v: any) => v.isNew)}
        >
          Agregar Variación
        </button>
      </div>

      {variations
        .filter((v: any) => v.id || v.isNew)
        .map((variation: any, index: any) => (
          <div key={variation.id || variation.tempId || index}>
            <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm mb-2 relative">
              {isDeletingVariation && deletingVariationId === variation.id && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="mt-2 text-sm text-gray-500">
                      Eliminando variación...
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium border p-2 rounded bg-white">
                  {index + 1}
                </span>
                {variation.id && currentAttributes[variation.id] && (
                  <div className="flex items-center gap-2">
                    {currentAttributes[variation.id].map(
                      (attr: any, attrIndex: number) => (
                        <span
                          key={attrIndex}
                          className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                        >
                          {attr.label}: {attr.value}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVariationSelect(index)}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                  {currentVariationIndex === index ? "Cerrar" : "Editar"}
                </button>
                {(variation.id || variation.isNew) && (
                  <button
                    onClick={() => showDeleteModal(variation)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
            <div>
              {currentVariationIndex === index && (
                <div className="relative">
                  {isLoadingImages && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <span className="mt-2 text-sm text-gray-500">
                          Cargando imágenes...
                        </span>
                      </div>
                    </div>
                  )}
                  <VariationForm
                    variation={variation}
                    fetchVariations={fetchVariations}
                    currentPrices={currentPrices}
                    currentStocks={currentStocks}
                    currentMinimumQuantities={currentMinimumQuantities}
                    currentAttributes={currentAttributes}
                    setVariations={setVariations}
                    fetchVariationImages={fetchAllVariationImages}
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
                    baseProductDescription={baseProductDescription}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      {isDeleteModalVisible && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Eliminar Variación
                  </h3>
                  <div className="mt-2">
                    <p>¿Estás seguro de que deseas eliminar esta variación?</p>
                    <p className="text-sm text-red-500 uppercase mt-2">
                      Esta acción no se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse justify-between">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={hideDeleteModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDeleteVariation}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VariationsComponente;
