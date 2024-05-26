import React, { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import Select from "react-select";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";

const VariationForm: React.FC<any> = ({
  index,
  variation,
  attributes,
  setVariations,
  fetchVariations,
  setIsEditMode,
  onDescriptionChange,
  onMainImageChange,
  onPreviewImageChange,
  onCloseForm,
  currentAttributes,
}) => {
  const isEditMode = !!variation.id;
  const currentVariationIndex = index;
  const [attributePairs, setAttributePairs] = useState([{ id: "", value: "" }]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Cargar atributos actuales si está en modo edición
    if (isEditMode && currentAttributes[variation.id]) {
      const loadedAttributes = currentAttributes[variation.id].map(
        (attr: any) => ({
          id: attr.attribute ? attr.attribute.id : "", // Verificar si attr.attribute está definido
          value: attr.attribute ? attr.attribute.value : "", // Verificar si attr.attribute está definido
        })
      );
      setAttributePairs(loadedAttributes);
      setSelectedAttributes(loadedAttributes.map((attr: any) => attr.id));
    }
  }, [isEditMode, currentAttributes, variation.id]);

  const handleAddAttributePair = () => {
    const lastPair = attributePairs[attributePairs.length - 1];
    if (lastPair.id !== "") {
      setAttributePairs([...attributePairs, { id: "", value: "" }]);
    } else {
      console.log(
        "Debe seleccionar una opción antes de agregar un nuevo par de atributo y valor."
      );
    }
  };

  const handleSelectChange = (index: any, selectedOption: any) => {
    const updatedPairs = [...attributePairs];
    updatedPairs[index].id = selectedOption ? selectedOption.value : "";
    setAttributePairs(updatedPairs);

    if (selectedOption) {
      setSelectedAttributes([...selectedAttributes, selectedOption.value]);
    }
  };

  const handleRemoveAttribute = (index: any) => {
    const removedAttributeId = attributePairs[index].id;
    const updatedPairs = attributePairs.filter((_, i) => i !== index);
    setAttributePairs(updatedPairs);

    const updatedSelectedAttributes = selectedAttributes.filter(
      (id) => id !== removedAttributeId
    );
    setSelectedAttributes(updatedSelectedAttributes);
  };

  const handleInputChange = (index: any, newValue: any) => {
    const updatedPairs = [...attributePairs];
    updatedPairs[index].value = newValue;
    setAttributePairs(updatedPairs);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const token = getCookie("tokenAuth");
    const idVariable = searchParams.get("productVariableId");
    const currentVariation = variation;

    try {
      if (
        !isEditMode &&
        (!currentVariation.description ||
          !currentVariation.previewImage ||
          !currentVariation.mainImage)
      ) {
        console.error("Todos los campos son obligatorios.");
        return;
      }

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
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${currentVariation.id}`,
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
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus`,
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

      if (variationId && attributePairs.length > 0) {
        for (const attribute of attributePairs) {
          if (attribute.id && attribute.value) {
            const attributeUrl = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variationId}/attributes/${attribute.id}`;
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
                  `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variationId}/attributes`,
                  { attributeId: attribute.id, value: attribute.value },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
              }
            } catch (error) {
              if (error.response && error.response.status === 404) {
                await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variationId}/attributes`,
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
          }
        }
      }

      if (
        variationResponse.status === 200 ||
        variationResponse.status === 201
      ) {
        fetchVariations();
      } else {
        console.error(
          "Error al enviar la solicitud:",
          variationResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label htmlFor="description">Descripción</label>
          <textarea
            className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
            name="description"
            value={variation.description}
            onChange={(e) => onDescriptionChange(e, currentVariationIndex)}
          />
        </div>
        <div className="current-attributes">
          <h3>Atributos Actuales:</h3>
          {currentAttributes[variation.id]?.map(
            (attribute: any, index: any) => (
              <div
                key={index}
                className="mt-2 flex flex-wrap uppercase"
              >
                <div className="bg-primary px-2 py-1 rounded text-xs">
                  {attribute.label}:
                  <span className="font-bold">{attribute.value}</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {attributePairs.map((pair, pairIndex) => (
          <div
            key={pairIndex}
            className="mt-2"
          >
            <div className="flex gap-2">
              <Select
                className="fit-content min-w-[120px]"
                options={attributes
                  .filter(
                    (attribute: any) =>
                      !selectedAttributes.includes(attribute.id)
                  )
                  .map((attribute: any) => ({
                    value: attribute.id,
                    label: attribute.name,
                  }))}
                onChange={(selectedOption) => {
                  handleSelectChange(pairIndex, selectedOption);
                  const filteredAttributes = selectedAttributes.filter(
                    (id) => id !== pair.id
                  );
                  setSelectedAttributes([
                    ...filteredAttributes,
                    selectedOption.value,
                  ]);
                }}
                value={
                  pair.id
                    ? {
                        value: pair.id,
                        label: attributes.find(
                          (attribute: any) => attribute.id === pair.id
                        )?.name,
                      }
                    : null
                }
              />

              <input
                type="text"
                className="border rounded px-2 py-1 mr-2 w-full"
                value={pair.value}
                onChange={(e) => handleInputChange(pairIndex, e.target.value)}
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

        <button
          onClick={handleAddAttributePair}
          disabled={attributes.length === selectedAttributes.length}
          className="flex gap-2 bg-green-700 text-white px-4 py-2 rounded align-middle"
        >
          Agregar Atributo
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
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-4 border border-dark border-dotted rounded p-2">
        <div className="mt-2 flex gap-2">
          <input
            type="checkbox"
            id={`hasUnlimitedStock-${index}`}
            checked={variation.hasUnlimitedStock}
            onChange={(e) =>
              setVariations((prevVariations: any) => {
                const updatedVariations = [...prevVariations];
                updatedVariations[currentVariationIndex].hasUnlimitedStock =
                  e.target.checked;
                return updatedVariations;
              })
            }
          />
          <label htmlFor={`hasUnlimitedStock-${index}`}>Stock ilimitado</label>
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="checkbox"
            id={`hasStockNotifications-${index}`}
            checked={variation.hasStockNotifications}
            onChange={(e) =>
              setVariations((prevVariations: any) => {
                const updatedVariations = [...prevVariations];
                updatedVariations[currentVariationIndex].hasStockNotifications =
                  e.target.checked;
                return updatedVariations;
              })
            }
          />
          <label htmlFor={`hasStockNotifications-${index}`}>
            Notificaciones de stock
          </label>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4 p-2 border border-dotted border-dark rounded">
        <ImageUpload
          label="Imagen Principal"
          onImageChange={(image: any) => onMainImageChange(image, index)}
          preloadedImageUrl={variation.mainImageUrl}
        />
        <ImageUpload
          label="Imagen de Previsualización"
          onImageChange={(image: any) => onPreviewImageChange(image, index)}
          preloadedImageUrl={variation.previewImageUrl}
        />
      </div>
      <div className="mt-2 flex justify-between">
        <button
          className="bg-green-700 text-white px-4 py-2 rounded mt-4"
          onClick={handleSubmit}
        >
          {isEditMode ? "Actualizar Variación" : "Crear Variación"}
        </button>
        <button
          onClick={onCloseForm}
          className="bg-red-700 text-white px-4 py-2 rounded mt-2"
        >
          Cerrar Formulario
        </button>
      </div>
    </div>
  );
};

export default VariationForm;
