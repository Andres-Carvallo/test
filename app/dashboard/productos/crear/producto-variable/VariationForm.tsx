import React from "react";
import ImageUpload from "./ImageUpload";
import Select from "react-select";
import { getCookie } from "cookies-next";

interface Props {
  index: number;
  variation: any;
  setVariations: any;
  attributes: any[];
  onDescriptionChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => void;
  onAttributeChange?: any;
  onMainImageChange: (image: any, index: number) => void;
  onPreviewImageChange: (image: any, index: number) => void;
  onCloseForm: () => void;
  currentVariationIndex?: number;
  fetchVariations: any;
}

const VariationForm: React.FC<Props> = ({
  index,
  variation,
  setVariations,
  fetchVariations,
  attributes,
  onDescriptionChange,
  onAttributeChange,
  onMainImageChange,
  onPreviewImageChange,
  onCloseForm,
}) => {
  const currentVariationIndex = index;

  const handleSubmit = async () => {
    // Verificar si la variación ya existe (tiene un ID)
    if (variation.id) {
      // Código para actualizar la variación existente...
    } else {
      // Crear una nueva variación
      try {
        const token = getCookie("tokenAuth");
        const requestBody = {
          description: variation.description,
          hasUnlimitedStock: variation.hasUnlimitedStock,
          hasStockNotifications: variation.hasStockNotifications,
          previewImage: {
            name: variation.previewImage.name,
            type: variation.previewImage.type,
            size: variation.previewImage.size,
            data: variation.previewImage.data,
          },
          mainImage: {
            name: variation.mainImage.name,
            type: variation.mainImage.type,
            size: variation.mainImage.size,
            data: variation.mainImage.data,
          },
        };

        // Realizar la solicitud POST para crear la variación
        const searchParams = new URLSearchParams(window.location.search);
        const idVariable = searchParams.get("productVariableId");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}/skus`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const responseData = await response.json();
        if (responseData.code === 0) {
          console.log("Variación creada exitosamente:", responseData);
          fetchVariations();
          // Aquí podrías realizar alguna acción adicional, como actualizar el estado de las variaciones
          // o cerrar el formulario.
        } else {
          console.error("Error al crear la variación:", responseData.message);
        }
      } catch (error) {
        console.error("Error al crear la variación:", error);
      }
    }
  };

  return (
    <div className="">
      <label htmlFor="description">Descripción</label>
      <textarea
        className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
        name="description"
        value={variation.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onDescriptionChange(e, index)
        }
      />
      <label htmlFor="selectedAttribute">Atributo</label>
      <Select
        options={attributes.map((attribute) => ({
          value: attribute.id,
          label: attribute.name,
        }))}
        isMulti
        value={variation.selectedAttributes}
        onChange={onAttributeChange}
        className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
      />
      {variation.selectedAttributes &&
        variation.selectedAttributes.map(
          (selectedAttribute: any, attributeIndex: any) => (
            <div
              key={attributeIndex}
              className="mt-2"
            >
              <label htmlFor={`attribute-${attributeIndex}`}>
                {selectedAttribute.label}
              </label>
              <input
                type="text"
                id={`attribute-${attributeIndex}`}
                name={`attribute-${attributeIndex}`}
                value={variation[selectedAttribute.value] || ""}
                onChange={(e) => {
                  const { value } = e.target;
                  setVariations((prevVariations: any) => {
                    const updatedVariations = [...prevVariations];
                    updatedVariations[currentVariationIndex][
                      selectedAttribute.value
                    ] = value;
                    return updatedVariations;
                  });
                }}
                className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
              />
            </div>
          )
        )}
      {/* Checkboxes para hasUnlimitedStock y hasStockNotifications */}
      <div className="mt-2">
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
      <div className="mt-2">
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
      <ImageUpload
        label="Imagen de Principal"
        onImageChange={(image: any) => onMainImageChange(image, index)}
        preloadedImageUrl={variation.mainImageUrl} // Propiedad para la imagen precargada
      />
      <ImageUpload
        label="Imagen de Previsualización"
        onImageChange={(image: any) => onPreviewImageChange(image, index)}
        preloadedImageUrl={variation.previewImageUrl} // Propiedad para la imagen precargada
      />
      <button
        onClick={handleSubmit}
        className="bg-green-700 text-white px-4 py-2 rounded mt-4"
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
  );
};

export default VariationForm;
