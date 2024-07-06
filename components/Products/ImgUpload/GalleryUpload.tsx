/* eslint-disable @next/next/no-img-element */
import React, { useState, ChangeEvent } from "react";
import Modal from "@/components/Products/ImgUpload/ModalGalleryUpload";
interface Props {
  selectedImages: string[];
  handleImageGalleryChange: any;
  handleImageRemove: (index: number) => void;
}
const GalleryUpload: React.FC<Props> = ({
  selectedImages,
  handleImageGalleryChange,
  handleImageRemove,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para manejar el cambio de imágenes seleccionadas
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImagesArray: string[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        newImagesArray.push(result);
        if (newImagesArray.length === files.length) {
          const totalImages = selectedImages.length + newImagesArray.length;
          if (totalImages <= 4) {
            // Enviar las nuevas imágenes al componente padre
            handleImageGalleryChange([...selectedImages, ...newImagesArray]);
          } else {
            setIsModalOpen(true);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    handleImageRemove(index); // Llamar a la función de devolución de llamada para manejar la eliminación de la imagen
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end w-full">
      {/* Etiqueta label emulando el diseño del input */}
      <label
        htmlFor="fileInput"
        style={{ borderRadius: "var(--radius)" }}
        className={`shadow flex flex-col bg-white justify-center items-center mt-2 pt-2 pb-5 border border-dashed border-gray-600 cursor-pointer ${
          selectedImages.length > 0 ? "md:w-1/4" : "md:w-full"
        } z-10`}
      >
        <div className="flex flex-col justify-center items-center  p-2 text-center w-full">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {selectedImages.length > 0 ? null : (
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              <span className="font-semibold">Click to upload</span>
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
            PNG, JPG or Webp (MAX. 1MB)
          </p>
        </div>
      </label>

      {/* Input oculto */}
      <input
        id="fileInput"
        type="file"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Mostrar miniaturas de las imágenes seleccionadas */}
      <div
        className={`flex flex-wrap gap-4 md:w-3/4 md:flex-initial p-4  ${
          selectedImages.length > 0 ? "block" : "hidden"
        } `}
      >
        {selectedImages.map((image, index) => (
          <div
            key={index}
            className="relative "
          >
            <img
              src={image}
              alt={`Image ${index}`}
              className="w-14 h-14 object-cover rounded-md"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 m-1 text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Modal de advertencia */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default GalleryUpload;
