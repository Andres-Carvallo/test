/* eslint-disable @next/next/no-img-element */
import React, { useState, ChangeEvent } from "react";
import Modal from "@/components/Products/ImgUpload/ModalGalleryUpload";

interface Props {
  selectedImages: any;
  handleImageGalleryChange: any;
  handleImageRemove: (index: number) => void;
}

const GalleryUpload: React.FC<Props> = ({
  selectedImages,
  handleImageGalleryChange,
  handleImageRemove,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = selectedImages.length + files.length;

    if (totalImages <= 4) {
      handleImageGalleryChange([...selectedImages, ...files]);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    handleImageGalleryChange(newImages);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end w-full">
      <label
        htmlFor="fileInput"
        style={{ borderRadius: "var(--radius)" }}
        className={`shadow flex flex-col bg-white justify-center items-center mt-2 pt-2 pb-5 border border-dashed border-gray-600 cursor-pointer ${
          selectedImages.length > 0 ? "md:w-1/4" : "md:w-full"
        } z-10`}
      >
        <div className="flex flex-col justify-center items-center p-2 text-center w-full">
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

      <input
        id="fileInput"
        type="file"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />

      <div
        className={`flex flex-wrap gap-4 md:w-3/4 md:flex-initial p-4 ${
          selectedImages.length > 0 ? "block" : "hidden"
        }`}
      >
        {selectedImages.map((image: any, index: any) => (
          <div
            key={index}
            className="relative"
          >
            <img
              src={URL.createObjectURL(image)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default GalleryUpload;
