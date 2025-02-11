import React, { useState, useEffect, useRef } from "react";
import ImageUpload from "./ImageUpload";
import Select, { SingleValue } from "react-select";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";
import { HandlePriceSku } from "@/app/utils/HandlePriceSku";
import { handleStockSku } from "@/app/utils/HandleStockSku";
import ImageUploaderVariable from "./ImageUploaderVariable";
import GalleryUpload2 from "@/components/Core/Products/ImgUpload/GalleryUploadV2";
import { useAPI } from "@/app/Context/ProductTypeContext";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";
import { defaultPreviewImage } from "@/app/config/IMGdefault";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import styles
import { useRevalidation } from "@/app/Context/RevalidationContext";
import { slugify } from "@/app/utils/slugify";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const VariationForm: React.FC<any> = ({
  index,
  variation,
  setVariations,
  fetchVariations,
  currentPrices,
  currentStocks,
  setIsEditMode,
  onDescriptionChange,
  onMainImageChange,
  onPreviewImageChange,
  onCloseForm,
  currentAttributes,
  productId,
  variationImages,
  fetchVariationImages,
  selectedImages,
  fetchAttributes,
  currentMinimumQuantities,
  handleImageRemove,
  baseProductDescription, //descripcion del producto base
}) => {
  const { attributes, setAttributes, loading, error } = useAPI();
  const editFormRef = useRef<HTMLDivElement>(null);
  const isEditMode = !!variation.id;
  const [useBaseDescription, setUseBaseDescription] = useState(false); //descripcion del producto base
  const currentVariationIndex = index;
  const [attributePairs, setAttributePairs] = useState([
    { id: "", value: "", isNew: true } as {
      id: string;
      value: string;
      isNew: boolean;
    },
  ]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [precioNormal, setPrecioNormal] = useState<number | null>(
    currentPrices[variation.id] !== null ? currentPrices[variation.id] : null
  );

  const [stockQuantity, setStockQuantity] = useState<number | null>(
    currentStocks[variation.id] !== null ? currentStocks[variation.id] : null
  );

  const searchParams = useSearchParams();
  const [checkOfferChecked, setCheckOfferChecked] = useState(
    variation.hasStockNotifications
  );
  const [alertStock, setAlertStock] = useState<number | null>(
    currentMinimumQuantities &&
      currentMinimumQuantities[variation.id] !== undefined
      ? currentMinimumQuantities[variation.id]
      : null
  );

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [image, setImage] = useState<any>(null);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const maxDescriptionLength = 1000;

  const { triggerRevalidation } = useRevalidation();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [pendingImageChanges, setPendingImageChanges] = useState({
    pendingDeletions: [] as string[],
    pendingImages: [] as any[],
  });

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Verifica si el texto excede el límite de caracteres
    if (value.length <= maxDescriptionLength) {
      setDescriptionLength(value.length); // Actualiza el contador de caracteres
      onDescriptionChange(e, index); // Llama a la función existente para manejar el cambio
    }
  };

  useEffect(() => {
    if (useBaseDescription && baseProductDescription) {
      onDescriptionChange(
        {
          target: {
            value: baseProductDescription,
          },
        } as React.ChangeEvent<HTMLTextAreaElement>,
        currentVariationIndex
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useBaseDescription, baseProductDescription]);

  useEffect(() => {
    const loadAttributes = async () => {
      try {
        await fetchAttributes();

        if (currentAttributes[variation.id]) {
          const preloadedAttributes = currentAttributes[variation.id].map(
            (attr: { label: any; value: any }) => {
              const matchedAttribute = attributes.find(
                (attribute: { name: any }) => attribute.name === attr.label
              );
              return {
                id: matchedAttribute ? matchedAttribute.id : undefined,
                value: attr.value,
                label: attr.label, // Para uso futuro o visualización si es necesario
              };
            }
          );
          setAttributePairs(preloadedAttributes);
          setSelectedAttributes(
            preloadedAttributes.map((attr: { id: any }) => attr.id)
          );
        }
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };
    loadAttributes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAttributePair = () => {
    if (attributes.length === selectedAttributes.length) {
      toast.error("Ya se han seleccionado todos los atributos disponibles.");
      return;
    }

    const lastPair = attributePairs[attributePairs.length - 1];

    if (lastPair && lastPair.id === "") {
      toast.error(
        "Debe seleccionar una opción antes de agregar un nuevo atributo"
      );
      return;
    }

    setAttributePairs([
      ...attributePairs,
      { id: "", value: "", isNew: true } as {
        id: string;
        value: string;
        isNew: boolean;
      },
    ]);
  };

  const handleSelectChange = (
    index: number,
    selectedOption: SingleValue<{ value: string; label: any }>
  ) => {
    const updatedPairs = attributePairs.map((pair, pairIndex) =>
      pairIndex === index
        ? { ...pair, id: selectedOption ? selectedOption.value : "" }
        : pair
    );

    const oldAttributeId = attributePairs[index].id;
    let updatedSelectedAttributes = selectedAttributes.filter(
      (id) => id !== oldAttributeId
    );

    if (selectedOption) {
      updatedSelectedAttributes.push(selectedOption.value);
    }

    setAttributePairs(updatedPairs);
    setSelectedAttributes(updatedSelectedAttributes);
  };

  const handleRemoveAttribute = async (index: number) => {
    // Verifica si es el último atributo
    if (attributePairs.length === 1) {
      toast.error(
        "Debe haber al menos un atributo. No se puede eliminar el último atributo."
      );
      return;
    }

    const removedAttribute = attributePairs[index];

    if (removedAttribute.isNew) {
      // Simplemente eliminar del estado local si es nuevo
      setAttributePairs(attributePairs.filter((_, i) => i !== index));
      setSelectedAttributes(
        selectedAttributes.filter((id) => id !== removedAttribute.id)
      );
      return;
    }

    if (removedAttribute.id && variation.id) {
      try {
        const token = getCookie("AdminTokenAuth");
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${variation.id}/attributes/${removedAttribute.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Atributo eliminado correctamente.");
        fetchVariations();
        // Actualizar el estado local después de eliminar en el servidor
        setAttributePairs(attributePairs.filter((_, i) => i !== index));
        setSelectedAttributes(
          selectedAttributes.filter((id) => id !== removedAttribute.id)
        );
      } catch (error) {
        console.error("Error eliminando el atributo:", error);
        toast.error("Hubo un error al eliminar el atributo.");
      }
    }
  };

  const handleStockQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);

    // Verifica si alertStock es mayor o igual al nuevo stock
    if (checkOfferChecked && alertStock !== null && alertStock >= value) {
      toast.error(
        "El stock debe ser mayor que el stock mínimo para la alerta."
      );
      return;
    }

    setStockQuantity(!isNaN(value) ? value : null);
  };

  const handleAlertStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);

    // Verifica si stockQuantity es null o undefined, y usa 0 como fallback
    const currentStock =
      stockQuantity !== null && stockQuantity !== undefined ? stockQuantity : 0;

    // Verifica si el valor de la alerta es mayor o igual al stock actual
    if (value >= currentStock) {
      toast.error(
        "El stock mínimo para la alerta debe ser menor que el stock disponible."
      );
      return;
    }

    setAlertStock(value ? value : null);
  };

  const handleInputChange = (index: number, newValue: string) => {
    const sanitizedValue = newValue
      .toUpperCase()
      .replace(/[^A-ZÁÉÍÓÚÑ0-9\s]/gi, "");
    const updatedPairs = [...attributePairs];
    updatedPairs[index].value = sanitizedValue;
    setAttributePairs(updatedPairs);
  };

  const handleImageGalleryChange = (newImages: string[]) => {
    setVariations((prevVariations: any) => {
      const updatedVariations = [...prevVariations];
      updatedVariations[index].selectedImages = newImages;
      return updatedVariations;
    });
  };

  const addProductImage = async (id: string, skuId: string, image: any) => {
    try {
      const base64data = image.data.split(",")[1]; // Obtiene solo la parte de datos
      const byteCharacters = atob(base64data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: image.type });

      const formattedImage = {
        mainImage: {
          name: image.name,
          type: image.type,
          size: image.size,
          data: image.data, // Mantén la imagen base64 en la carga
        },
      };

      const token = getCookie("AdminTokenAuth");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        formattedImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Image added successfully");
      } else {
        console.error("Error adding image:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!variation.hasUnlimitedStock && stockQuantity === null) {
      toast.error(
        "El stock es nulo. No puedes publicar o actualizar esta variación."
      );
      return;
    }

    const token = getCookie("AdminTokenAuth");
    const idVariable = searchParams.get("productVariableId");
    const currentVariation = variation;
    const errorMessages = [];

    if (!isEditMode) {
      if (!currentVariation.description) {
        errorMessages.push("Descripción es obligatoria.");
      }
      if (!currentVariation.mainImage) {
        errorMessages.push("Imagen principal es obligatoria.");
      }
      if (precioNormal === null || isNaN(precioNormal)) {
        errorMessages.push("Precio es obligatorio y debe ser un número.");
      }
      if (
        !variation.hasUnlimitedStock &&
        (stockQuantity === null || isNaN(stockQuantity))
      ) {
        errorMessages.push("Stock es obligatorio y debe ser un número.");
      }
      if (
        attributePairs.length === 0 ||
        attributePairs.some((attr) => !attr.id || !attr.value)
      ) {
        errorMessages.push(
          "Debe seleccionar un atributo y otorgarle un valor."
        );
      }
    }

    if (errorMessages.length > 0) {
      errorMessages.forEach((msg) => toast.error(msg));
      return;
    }

    setIsLoading(true);
    try {
      currentVariation.previewImage =
        currentVariation.previewImage || defaultPreviewImage;

      const variationData = {
        description: currentVariation.description,
        hasUnlimitedStock: currentVariation.hasUnlimitedStock,
        hasStockNotifications: currentVariation.hasStockNotifications,
        previewImage: currentVariation.previewImage,
        mainImage: currentVariation.mainImage,
      };

      let variationResponse;
      let variationId: any;

      if (isEditMode) {
        variationResponse = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${currentVariation.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          variationData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        variationId = currentVariation.id;
      } else {
        variationResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          variationData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        variationId = variationResponse.data.sku.id;

        // Procesar las imágenes de la galería para nueva variación
        if (variation.selectedImages && variation.selectedImages.length > 0) {
          await Promise.all(
            variation.selectedImages.map((image: any) =>
              fetch(
                `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variationId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ mainImage: image }),
                }
              )
            )
          );
        }
      }

      // Manejar precio y stock
      if (idVariable && stockQuantity !== null) {
        try {
          await HandlePriceSku(idVariable, variationId, precioNormal);
          await handleStockSku(
            idVariable,
            variationId,
            stockQuantity,
            alertStock
          );
        } catch (error) {
          console.error("Error handling price/stock:", error);
        }
      }

      // Procesar eliminaciones de imágenes pendientes
      if (
        pendingImageChanges.pendingDeletions &&
        pendingImageChanges.pendingDeletions.length > 0
      ) {
        await Promise.all(
          pendingImageChanges.pendingDeletions.map((imageId) =>
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variationId}/images/${imageId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          )
        );
      }

      // Procesar nuevas imágenes pendientes
      if (
        pendingImageChanges.pendingImages &&
        pendingImageChanges.pendingImages.length > 0
      ) {
        await Promise.all(
          pendingImageChanges.pendingImages.map((newImage) =>
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variationId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ mainImage: newImage }),
              }
            )
          )
        );
      }

      // Manejar atributos
      if (variationId && attributePairs.length > 0) {
        for (const attribute of attributePairs) {
          if (attribute.id && attribute.value) {
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variationId}/attributes?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
                { attributeId: attribute.id, value: attribute.value },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            } catch (error: any) {
              if (error.response?.status !== 409) {
                console.error("Error al crear atributo:", error);
              }
            }
          }
        }
      }

      if (
        variationResponse.status === 200 ||
        variationResponse.status === 201
      ) {
        await triggerRevalidation();
        // Primero actualizamos las imágenes
        await fetchVariationImages(idVariable, variationId);
        // Luego actualizamos las variaciones y mostramos el modal
        await fetchVariations();
        setShowConfirmationModal(true);
        // Limpiamos los cambios pendientes
        setPendingImageChanges({
          pendingImages: [],
          pendingDeletions: [],
        });
        toast.success(
          isEditMode ? "Variación actualizada" : "Variación creada"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la variación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueEditing = () => {
    setShowConfirmationModal(false);
  };

  const handleViewProduct = () => {
    setShowConfirmationModal(false);
    const searchParams = new URLSearchParams(window.location.search);
    const productVariableId = searchParams.get("productVariableId");

    if (productVariableId) {
      const token = getCookie("AdminTokenAuth");
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productVariableId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.product && data.product.name) {
            const productSlug = slugify(data.product.name);
            window.open(`/tienda/productos/${productSlug}`, "_blank");
          }
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
          toast.error("Error al obtener los detalles del producto");
        });
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div
        className="mt-4"
        ref={editFormRef}
      >
        <div className="w-full">
          <label htmlFor="description">Descripción</label>
          <ReactQuill
            className=" block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md  "
            theme="snow"
            value={variation.description}
            onChange={(content) =>
              onDescriptionChange(
                { target: { value: content } },
                currentVariationIndex
              )
            }
            readOnly={useBaseDescription} // Deshabilitar la edición si se usa la descripción base
          />
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="useBaseDescription"
              checked={useBaseDescription}
              onChange={(e) => setUseBaseDescription(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="useBaseDescription">
              Usar descripción del producto base
            </label>
          </div>
        </div>

        <div
          style={{ borderRadius: "var(--radius)" }}
          className="shadow p-4 my-3 w-full flex items-center mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 border-yellow-400 border "
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div className="flex flex-col">
            <div>
              Agrega los atributos que tendrá tu variación,{" "}
              <strong>como mínimo debe tener 1.</strong> - ej. Color, Talla,
              Material.
            </div>
          </div>
        </div>

        <h4 className="mt-4">Atributos:</h4>
        <div className="mt-2 grid grid-cols-1 lg:grid-cols1 gap-4">
          {attributePairs.map((pair, pairIndex) => (
            <div
              key={pairIndex}
              className="mt-2"
            >
              <div className="flex gap-2">
                <Select
                  className="fit-content min-w-[30%]"
                  options={attributes
                    .filter(
                      (attribute: { id: string }) =>
                        !selectedAttributes.includes(attribute.id) ||
                        attribute.id === pair.id
                    )
                    .map((attribute: { id: any; name: any }) => ({
                      value: attribute.id,
                      label: attribute.name,
                    }))}
                  onChange={(selectedOption) =>
                    handleSelectChange(pairIndex, selectedOption)
                  }
                  value={
                    pair.id
                      ? {
                          value: pair.id,
                          label: attributes.find(
                            (attribute: { id: string }) =>
                              attribute.id === pair.id
                          )?.name,
                        }
                      : null
                  }
                  // Deshabilitar si la variación ya está publicada (isEditMode)
                  isDisabled={isEditMode && !!pair.id}
                />

                <input
                  type="text"
                  className="border rounded px-2 py-1 mr-2 w-full"
                  value={pair.value}
                  onChange={(e) => handleInputChange(pairIndex, e.target.value)}
                  placeholder="Ingrese un valor..."
                />
                <button
                  onClick={() => {
                    handleRemoveAttribute(pairIndex);
                  }}
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
          ))}
        </div>

        <div className="w-full mt-4">
          <button
            onClick={handleAddAttributePair}
            className="flex gap-2 w-full justify-center bg-green-700 text-white px-4 py-2 rounded align-middle"
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
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Agrega otra opción de atributo
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 space-y-8 ">
          <div
            className="shadow border  p-4"
            style={{ borderRadius: "var(--radius)" }}
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-normal">Precio</label>
                <input
                  type="number"
                  className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
                  style={{ borderRadius: "var(--radius)" }}
                  value={precioNormal !== null ? precioNormal : ""}
                  onChange={(e) => setPrecioNormal(parseFloat(e.target.value))}
                  name="precioProducto"
                  required
                />
              </div>
              <div>
                <label className="font-normal">Stock</label>
                <input
                  type="number"
                  className={`shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300 ${
                    variation.hasUnlimitedStock
                      ? "bg-gray-200 cursor-not-allowed"
                      : ""
                  }`}
                  style={{ borderRadius: "var(--radius)" }}
                  value={stockQuantity !== null ? stockQuantity : ""}
                  onChange={handleStockQuantityChange} // Cambia a este nuevo manejador
                  name="stockProducto"
                  required
                  disabled={variation.hasUnlimitedStock}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <label
                className={`items-center cursor-pointer inline-flex pl-2 ${
                  variation.hasUnlimitedStock
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  id={`hasStockNotifications-${index}`}
                  className="sr-only peer"
                  checked={variation.hasStockNotifications}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setVariations((prevVariations: any) => {
                      const updatedVariations = [...prevVariations];
                      updatedVariations[
                        currentVariationIndex
                      ].hasStockNotifications = isChecked;
                      return updatedVariations;
                    });
                    setCheckOfferChecked(isChecked);
                  }}
                  disabled={variation.hasUnlimitedStock}
                />

                <div className="relative w-8 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-blue-400 dark:peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-blue-500 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-primary after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-gray-500" />

                <span className="ms-3 text-base text-gray-900 dark:text-gray-300">
                  Activar Alerta
                </span>
              </label>
              <label className="items-center cursor-pointer inline-flex pl-2 ">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  id={`hasUnlimitedStock-${index} `}
                  checked={variation.hasUnlimitedStock}
                  onChange={(e) =>
                    setVariations((prevVariations: any) => {
                      const updatedVariations = [...prevVariations];
                      const isUnlimitedStock = e.target.checked;

                      // Actualizamos el estado de "hasUnlimitedStock"
                      updatedVariations[
                        currentVariationIndex
                      ].hasUnlimitedStock = isUnlimitedStock;

                      // Si se activa "Stock Ilimitado"
                      if (isUnlimitedStock) {
                        // Si stockQuantity está vacío o es nulo, lo asignamos a 99999
                        if (!stockQuantity) {
                          setStockQuantity(99999);
                        }
                        // Desactivamos "Activar Alerta"
                        updatedVariations[
                          currentVariationIndex
                        ].hasStockNotifications = false;
                        setCheckOfferChecked(false);
                      }

                      return updatedVariations;
                    })
                  }
                />

                <div className="relative w-8 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-blue-400 dark:peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-blue-500 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-primary after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-gray-500" />

                <span className="ms-3 text-base text-gray-900 dark:text-gray-300">
                  Stock Ilimitado
                </span>
              </label>
            </div>
          </div>
          <div
            className={`mt-4 bg-primary p-4 text-dark shadow border ${
              checkOfferChecked ? "" : " hidden "
            }`}
            style={{ borderRadius: "var(--radius)" }}
          >
            <div>
              <label className="font-normal text-white">
                Recibirás una alerta al alcanzar el stock mínimo
              </label>
              <input
                type="number"
                className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
                style={{ borderRadius: "var(--radius)" }}
                name="AlertadeStock"
                value={
                  alertStock !== null && alertStock !== undefined
                    ? alertStock
                    : 1
                }
                onChange={handleAlertStockChange} // Cambia a esta función
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 mt-8 gap-4">
          <div className="col-span-4 md:col-span-1">
            <label className="font-normal">Imagen Principal</label>
            <div className="mt-2 flex justify-center items-center">
              <ImageUpload
                onImageChange={(image: any) => onMainImageChange(image, index)}
                preloadedImageUrl={
                  variation.mainImage?.data ||
                  variation.mainImageUrl ||
                  (typeof variation.mainImage === "string"
                    ? variation.mainImage
                    : null)
                }
              />
            </div>
          </div>
          <div className="col-span-4 md:col-span-3">
            <label className="font-normal">Galería de imágenes</label>
            <div className="h-[150px] mt-2">
              {variation && variation.id ? (
                <ImageUploaderVariable
                  productId={productId}
                  skuId={variation.id}
                  variationImages={variationImages}
                  fetchVariationImages={fetchVariationImages}
                  onImagesChange={(changes) => {
                    setPendingImageChanges(changes);
                  }}
                />
              ) : (
                <GalleryUpload2
                  selectedImages={variation.selectedImages || []}
                  handleImageGalleryChange={handleImageGalleryChange}
                  handleImageRemove={(index) => {
                    handleImageGalleryChange(
                      variation.selectedImages.filter(
                        (_: any, i: any) => i !== index
                      )
                    );
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-between">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded mt-4"
            onClick={handleSubmit}
          >
            {isEditMode ? "Actualizar Variación" : "Publicar Variación"}
          </button>
          <button
            onClick={onCloseForm}
            className="bg-red-700 text-white px-4 py-2 rounded mt-2"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? "Variación Actualizada" : "Variación Creada"}
            </h2>
            <p className="mb-6">¿Qué deseas hacer ahora?</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContinueEditing}
                className="flex-1 bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
              >
                Seguir Editando
              </button>
              <button
                onClick={handleViewProduct}
                className="flex-1 bg-secondary text-primary px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
              >
                Ver Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VariationForm;
