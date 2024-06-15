/* eslint-disable @next/next/no-img-element */
import React, { useState, ChangeEvent } from "react";
import Modal from "@/components/Products/ImgUpload/ModalGalleryUpload";

interface ImageData {
  name: string;
  type: string;
  size: number;
  data: string;
}

interface Props {
  selectedImages: ImageData[];
  handleImageGalleryChange: (images: ImageData[]) => void;
  handleImageRemove: (index: number) => void;
}

const GalleryUploadV2: React.FC<Props> = ({
  selectedImages,
  handleImageGalleryChange,
  handleImageRemove,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImagesArray: ImageData[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const imageData: ImageData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: result,
        };
        newImagesArray.push(imageData);
        if (newImagesArray.length === files.length) {
          const totalImages = selectedImages.length + newImagesArray.length;
          if (totalImages <= 4) {
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
    handleImageRemove(index);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end">
      <label
        htmlFor="fileInput"
        style={{ borderRadius: "var(--radius)" }}
        className={`shadow flex flex-col bg-white justify-center items-center mt-2 pt-2 pb-2 border border-dashed border-primary cursor-pointer ${
          selectedImages.length > 0 ? "md:w-1/4" : "md:w-full"
        } z-10`}
      >
        <div className="flex flex-col justify-center items-center p-2 text-center">
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
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            <span className="font-semibold">Click to upload</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
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
              src={image.data}
              alt={`Image ${index}`}
              className="w-16 h-16 object-cover rounded-md"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 m-1 text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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

export default GalleryUploadV2;
