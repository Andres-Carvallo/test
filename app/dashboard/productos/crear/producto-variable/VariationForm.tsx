import React from "react";
import ImageUpload from "./ImageUpload";
import Select from "react-select";

const VariationForm = ({
  index,
  variation,
  setVariations,
  fetchVariations,
  attributes,
  onDescriptionChange,
  onAttributeChange,
  onMainImageChange,
  onPreviewImageChange,
  handleInputChange,
  inputValue,
  onCloseForm,
}) => {
  const currentVariationIndex = index;

  const handleSubmit = async () => {
    // Lógica para el submit
  };

  return (
    <div className="">
      <label htmlFor="description">Descripción</label>
      <textarea
        className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
        name="description"
        value={variation.description}
        onChange={(e) => onDescriptionChange(e, currentVariationIndex)}
      />
      <label htmlFor="selectedAttribute">Atributo</label>
      <Select
        options={attributes.map((attribute) => ({
          value: attribute.id,
          label: attribute.name,
        }))}
        isMulti
        value={variation.selectedAttributes}
        onChange={(selectedOptions) => {
          console.log("Selected attributes changed:", selectedOptions);
          onAttributeChange(selectedOptions);
        }}
        className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
      />
      {variation.selectedAttributes &&
        variation.selectedAttributes.map(
          (selectedAttribute, attributeIndex) => (
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
                name={selectedAttribute.inputName}
                value={inputValue[attributeIndex] || ""} // Asegurarse de que el valor sea una cadena
                onChange={(e) => handleInputChange(e, currentVariationIndex)}
                className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
              />
            </div>
          )
        )}
      <div className="mt-2">
        <input
          type="checkbox"
          id={`hasUnlimitedStock-${index}`}
          checked={variation.hasUnlimitedStock}
          onChange={(e) =>
            setVariations((prevVariations) => {
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
            setVariations((prevVariations) => {
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
        label="Imagen Principal"
        onImageChange={(image) => onMainImageChange(image, index)}
        preloadedImageUrl={variation.mainImageUrl}
      />
      <ImageUpload
        label="Imagen de Previsualización"
        onImageChange={(image) => onPreviewImageChange(image, index)}
        preloadedImageUrl={variation.previewImageUrl}
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
