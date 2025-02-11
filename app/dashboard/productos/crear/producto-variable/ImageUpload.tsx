/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { getCroppedImg } from "@/lib/cropImage"; // Asegúrate de tener esta función implementada
import Modal from "@/components/Core/Modals/ModalSeo";
function ImageUpload({ onImageChange, preloadedImageUrl }: any) {
  const [image, setImage] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  useEffect(() => {
    if (preloadedImageUrl) {
      fetchImage(preloadedImageUrl);
    }
  }, [preloadedImageUrl]);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    console.log("Imagen cargada:", file);
    if (file) {
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as any);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    if (!originalFile || !image) return;

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (!croppedImage) {
        console.error("Error al recortar la imagen: croppedImage es nulo");
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const file = new File([croppedImage], originalFile.name, {
        type: croppedImage.type,
        lastModified: originalFile.lastModified,
      });

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result as string;
        const imageData = {
          name: originalFile.name,
          type: compressedFile.type,
          size: compressedFile.size,
          data: base64data,
        };
        setImage(base64data);
        onImageChange(imageData);
        setIsModalOpen(false);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error al recortar o comprimir la imagen:", error);
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
                  <span className="font-semibold">Subir Imagen</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  PNG, JPG o Webp (800x800px)
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="bg-white rounded-lg shadow-lg relative w-[95%] md:w-[80%] max-w-3xl p-6">
            <div className="sticky top-0 bg-white border-b flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Recortar Imagen Principal
              </h2>
              <button
                onClick={() => {
                  setImage(null);
                  setIsModalOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="relative h-96 w-full">
              <Cropper
                image={image || ""}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div className="mt-6 space-y-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoom
                </label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.01}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCrop}
                  className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Recortar y Continuar
                </button>
                <button
                  onClick={() => {
                    setImage(null);
                    setIsModalOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
