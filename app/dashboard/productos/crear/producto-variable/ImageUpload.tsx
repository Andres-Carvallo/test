/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";

function ImageUpload({ onImageChange, preloadedImageUrl }: any) {
  const [image, setImage] = useState<any>(null);

  useEffect(() => {
    if (preloadedImageUrl) {
      fetchImage(preloadedImageUrl);
    }
  }, [preloadedImageUrl]);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    console.log("Imagen cargada:", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result,
        };
        setImage(reader.result as any);
        onImageChange(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    onImageChange(null);
  };

  const fetchImage = async (url: any) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      setImage(URL.createObjectURL(blob) as any);
    } catch (error) {
      console.error("Error al cargar la imagen:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {image ? (
          <div>
            <div className="relative mt-2 h-[150px] rounded-lg object-contain overflow-hidden">
              <img
                src={image}
                alt="Preview Image"
                className="w-full"
              />
              <button
                className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 m-1 text-xs"
                onClick={handleClearImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <label className="flex mt-2 flex-col bg-white justify-center items-center pt-5 pb-6 border border-dashed border-primary rounded-lg cursor-pointer w-full z-10 p-2">
              <div className="flex flex-col justify-center items-center">
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
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  SVG, PNG, JPG or GIF
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
