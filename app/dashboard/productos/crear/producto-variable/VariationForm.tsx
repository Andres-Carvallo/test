import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import Select from "react-select";
import axios from "axios";
import { getCookie } from "cookies-next";

interface Variation {
  [key: string]: any;
}

const VariationForm: React.FC<Variation> = ({
  index,
  variation,
  attributes,
  setVariations,
  fetchVariations,

  onDescriptionChange,
  onMainImageChange,
  onPreviewImageChange,
  onCloseForm,
  currentAttributes,
}) => {
  const currentVariationIndex = index;
  const [attributePairs, setAttributePairs] = useState([{ id: "", value: "" }]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const filteredAttributes = attributes.filter(
    (attribute: any) => !selectedAttributes.includes(attribute.id)
  );

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

  const handleSelectChange = (index: number, selectedOption: any) => {
    const updatedPairs = [...attributePairs];
    updatedPairs[index].id = selectedOption ? selectedOption.value : "";
    setAttributePairs(updatedPairs);

    if (selectedOption) {
      setSelectedAttributes([...selectedAttributes, selectedOption.value]);
    }
  };

  const handleRemoveAttribute = (index: number) => {
    const removedAttributeId = attributePairs[index].id;
    const updatedPairs = attributePairs.filter((pair, i) => i !== index);
    setAttributePairs(updatedPairs);

    const updatedSelectedAttributes = selectedAttributes.filter(
      (id) => id !== removedAttributeId
    );
    setSelectedAttributes(updatedSelectedAttributes);
  };

  const handleInputChange = (index: number, newValue: string) => {
    const updatedPairs = [...attributePairs];
    updatedPairs[index].value = newValue;
    setAttributePairs(updatedPairs);
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    try {
      // Obtener la variación actual del estado
      const currentVariation = variation;

      // Validar campos del formulario de variaciones
      if (
        !currentVariation.description ||
        !currentVariation.previewImage ||
        !currentVariation.mainImage
      ) {
        console.error("Todos los campos son obligatorios.");
        return;
      }

      // Construir el objeto de datos a enviar
      const variationData = {
        description: currentVariation.description,
        hasUnlimitedStock: currentVariation.hasUnlimitedStock,
        hasStockNotifications: currentVariation.hasStockNotifications,
        previewImage: currentVariation.previewImage,
        mainImage: currentVariation.mainImage,
      };

      // Enviar datos a la API de variaciones
      const searchParams = new URLSearchParams(window.location.search);
      const idVariable = searchParams.get("productVariableId");
      const token = getCookie("tokenAuth");
      const variationResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus`,
        variationData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (variationResponse.status === 200) {
        const variationId = variationResponse.data.sku.id;
        console.log(`Variation created with ID: ${variationId}`);

        // Verificar si hay atributos para enviar
        const validAttributePairs = attributePairs.filter(
          (attribute) => attribute.id !== "" && attribute.value !== ""
        );

        if (validAttributePairs.length > 0) {
          // Enviar datos a la API de atributos uno por uno
          validAttributePairs.forEach(async (attribute) => {
            try {
              const attributeResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus/${variationId}/attributes`,
                {
                  attributeId: attribute.id,
                  value: attribute.value,
                }
              );

              if (attributeResponse.status === 200) {
                const attributeId = attributeResponse.data.id;
                console.log(`Attribute created with ID: ${attributeId}`);
              } else {
                console.error(
                  "Error creating attribute:",
                  attributeResponse.statusText
                );
              }
            } catch (error) {
              console.error("Error creating attribute:", error);
            }
          });

          console.log("All attributes created successfully!");
        }
        onCloseForm();
        fetchVariations();
      } else {
        console.error(
          "Error creating variation:",
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
          {currentAttributes[variation.id]?.map(({ attribute, index }: any) => (
            <div
              key={index}
              className="mt-2 flex flex-wrap uppercase"
            >
              <div className="bg-primary px-2 py-1 rounded text-xs">
                {attribute.label}:
                <span className="font-bold">{attribute.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Muestra un formulario para agregar un nuevo par de atributo y valor */}
      <div className="mt-2  grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  if (selectedOption) {
                    handleSelectChange(pairIndex, selectedOption);
                    const filteredAttributes = selectedAttributes.filter(
                      (id) => id !== pair.id
                    );
                    setSelectedAttributes([
                      ...filteredAttributes,
                      selectedOption.value,
                    ]);
                  }
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
                className="border rounded px-2 py-1 mr-2 w-full "
                value={pair.value}
                onChange={(e) => handleInputChange(pairIndex, e.target.value)}
              />
              <button
                onClick={() => {
                  handleRemoveAttribute(pairIndex); // Limpiar la selección actual
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

        {/* Botón para agregar un nuevo par de atributo y valor */}
        <button
          onClick={handleAddAttributePair}
          disabled={filteredAttributes.length === 0}
          className="flex gap-2 bg-green-700 text-white px-4 py-2 rounded align-middle"
        >
          Agregar Atributo{" "}
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
      <div className="mt-2 grid grid-cols-2 gap-4 p-2 border border-dotted border-dark  rounded">
        {" "}
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
          {variation.id ? "Actualizar Variación" : "Crear Variación"}
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
