import React, { useState, useEffect, useRef } from "react";
import ImageUpload from "./ImageUpload";
import Select, { SingleValue } from "react-select";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";
import { HandlePriceSku } from "@/app/utils/HandlePriceSku";
import { handleStockSku } from "@/app/utils/HandleStockSku";
import ImageUploaderVariable from "./ImageUploaderVariable";
import GalleryUpload2 from "@/components/Products/ImgUpload/GalleryUploadV2";
import { useAPI } from "@/app/Context/ProductTypeContext";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import styles

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
      .replace(/[^A-ZÁÉÍÓÚÑ0-9\s]/g, "");
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
  const defaultPreviewImage = {
    name: "default-preview.png", // Nombre de la imagen predeterminada
    type: "image/png", // Tipo MIME de la imagen
    size: 10385, // Tamaño en bytes de la imagen
    data: "data:image/png;base64,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gg4ADQg6ADQg6ADQgKADQAOCDgANCDoANCDoANCAoANAA4IOAA0IOgA0IOgA0ICgA0ADgg4ADQg6ADQg6ADQgKADQAOCDgANCDoANCDoANCAoANAA4IOAA0IOgA0IOgA0ICgA0ADgg4ADQg6ADQg6ADQgKADQAOCDgANCDoANCDoANCAoANAA4IOAA0IOgA0IOgA0ICgA0ADgg4ADQg6ADQg6ADQgKADQAOCDgANCDoANCDoANCAoANAA4IOAA0IOgA0IOgA0ICgA0ADgg4ADQg6ADQg6ADQgKADQAOCDgANCDoANCDoANCAoANAA4IOAA0IOgA0IOgA0ICgA0ADgg4ADQg6ADQg6ADQgKADQAOCDgANCDoANCDoANCAoANAA4IOAA0IOgA0IOgA0ICgA0ADgg4ADQg6ADQg6ADQgKADQAOCDgANCDoANCDoANCAoANAA4IOAA0IOgA0IOgA0ICgA0ADgg4ADQg6ADQg6ADQgKADQAOCDgANCDoANCDoANCAoANAA4IOAA0IOgA0IOgA0ICgA0ADgg4ADQg6ADQg6ADQgKADQAOCDgANCDoANCDoANCAoANAA4IOAA0IOgA0IOgA0ICgA0ADgg4ADfwH7QDX/xQMJgUAAAAASUVORK5CYII=",
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!variation.hasUnlimitedStock && stockQuantity === null) {
      toast.error(
        "El stock es nulo. No puedes publicar o actualizar esta variación."
      );
      return; // No continuar con la ejecución
    }
    const token = getCookie("AdminTokenAuth");
    const idVariable = searchParams.get("productVariableId");
    const currentVariation = variation;

    // Inicializa un array para almacenar los mensajes de error
    const errorMessages = [];

    // Verificación de campos obligatorios y agregado de mensajes de error específicos
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

    // Si hay mensajes de error, mostrar toasts y retornar
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
      let variationId;

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
      }
      if (idVariable && stockQuantity !== null) {
        try {
          await HandlePriceSku(idVariable, variationId, precioNormal);
        } catch (error) {
          console.error("Error handling stock:", error);
        }
      } else {
        console.error("Invalid input parameters for stock handling.");
      }

      if (idVariable && stockQuantity !== null) {
        try {
          await handleStockSku(
            idVariable,
            variationId,
            stockQuantity,
            alertStock
          );
        } catch (error) {
          console.error("Error handling stock:", error);
        }
      } else {
        console.error("Invalid input parameters for stock handling.");
      }
      // Verificación y recorrido de las imágenes seleccionadas
      if (variation.selectedImages && Array.isArray(variation.selectedImages)) {
        for (const image of variation.selectedImages) {
          console.log("Llamando a addProductImage con imagen:", image);
          if (idVariable !== null) {
            await addProductImage(idVariable, variationId, image);
          }
        }
      }
      // Manejar los atributos de la variación
      if (variationId && attributePairs.length > 0) {
        for (let i = 0; i < attributePairs.length; i++) {
          const attribute = attributePairs[i];
          if (attribute.id && attribute.value) {
            const attributeUrl = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variationId}/attributes/${attribute.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`;
            try {
              const existingAttributeResponse = await axios.get(attributeUrl, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (existingAttributeResponse.status === 200) {
                await axios.put(
                  attributeUrl,
                  { value: attribute.value },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
              } else if (existingAttributeResponse.status === 404) {
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
              }
            } catch (error: any) {
              if (error.response && error.response.status === 404) {
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
              } else {
                console.error("Error al verificar el atributo:", error);
              }
            }

            // Actualizar el estado de isNew a false después de la creación
            setAttributePairs((prevPairs) => {
              const updatedPairs = [...prevPairs];
              updatedPairs[i].isNew = false;
              return updatedPairs;
            });
          }
        }
      }

      if (
        variationResponse.status === 200 ||
        variationResponse.status === 201
      ) {
        fetchVariations();
        onCloseForm();
      } else {
        console.error(
          "Error al enviar la solicitud:",
          variationResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
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
                    updatedVariations[currentVariationIndex].hasUnlimitedStock =
                      isUnlimitedStock;

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
                alertStock !== null && alertStock !== undefined ? alertStock : 1
              }
              onChange={handleAlertStockChange} // Cambia a esta función
              required
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <div className="w-48">
          <h4>Imagen Principal</h4>
          <ImageUpload
            onImageChange={(image: any) => onMainImageChange(image, index)}
            preloadedImageUrl={variation.mainImageUrl}
          />
        </div>
        <div>
          <h4>Galería de Imágenes</h4>
          {variation && variation.id ? (
            <ImageUploaderVariable
              productId={productId}
              skuId={variation.id}
              variationImages={variationImages}
              fetchVariationImages={fetchVariationImages}
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
      <div></div>

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
  );
};

export default VariationForm;