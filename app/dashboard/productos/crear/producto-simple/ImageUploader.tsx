/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { getCookie } from "cookies-next"; // asegúrate de tener cookies-next instalado
import Loader from "@/components/common/Loader";
import Modal from "@/components/Core/Modals/ModalSeo";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { getCroppedImg } from "@/lib/cropImage";
import { toast } from "react-hot-toast";

const ImageUploader: React.FC<any> = ({
  productId,
  skuId,
  skuImages,
  fetchImages,
  onImagesChange,
}) => {
  const token = getCookie("AdminTokenAuth");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [pendingImages, setPendingImages] = useState<any[]>([]);
  const [pendingDeletions, setPendingDeletions] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [imageQueue, setImageQueue] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1);
  const [currentFileName, setCurrentFileName] = useState<string>("");

  const MAX_IMAGES = 4;

  const getTotalImagesCount = () => {
    const currentImagesCount =
      skuImages?.filter((image: any) => !pendingDeletions.includes(image?.id))
        ?.length || 0;
    return currentImagesCount + pendingImages.length;
  };

  // Efecto para la carga inicial
  useEffect(() => {
    if (isInitialLoad && productId && skuId) {
      fetchImages(productId, skuId);
      setIsInitialLoad(false);
    }
  }, [productId, skuId, isInitialLoad]);

  // Efecto para notificar cambios
  useEffect(() => {
    // Para productos nuevos o existentes
    onImagesChange?.({
      pendingImages,
      pendingDeletions,
      currentImages: skuImages || [],
    });
  }, [pendingImages, pendingDeletions, skuImages]);

  const handleImageUpload = async (event: any) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const totalNewImages = getTotalImagesCount() + files.length;
    if (totalNewImages > MAX_IMAGES) {
      toast.error(
        `No puedes agregar más de ${MAX_IMAGES} imágenes en la galería. Puedes seleccionar hasta ${
          MAX_IMAGES - getTotalImagesCount()
        } imágenes más.`
      );
      return;
    }

    // Agregar archivos a la cola
    setImageQueue(Array.from(files));
    setCurrentImageIndex(0);
    processNextImage(Array.from(files), 0);
  };

  const processNextImage = (queue: File[], index: number) => {
    if (index >= queue.length) {
      // Hemos terminado de procesar todas las imágenes
      setImageQueue([]);
      setCurrentImageIndex(-1);
      setIsModalOpen(false);
      return;
    }

    const file = queue[index];
    setCurrentFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainImage(reader.result as string);
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = (imageId: string) => {
    setPendingDeletions((prev) => [...prev, imageId]);
  };

  const handleUpdateImage = (event: any, imageId: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedImage = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result, // Base64 encoded data
        };

        fetch(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images/${imageId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mainImage: updatedImage }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 0) {
              console.log("Updated image:", data);
              fetchImages(productId, skuId);
            } else {
              console.error("Error al actualizar la imagen:", data.message);
            }
          })
          .catch((error) => {
            console.error("Error al actualizar la imagen:", error);
          });
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
    if (!mainImage) return;
    setIsLoading(true);

    try {
      const croppedImage = await getCroppedImg(mainImage, croppedAreaPixels);
      if (!croppedImage) {
        console.error("Error al recortar la imagen: croppedImage es null");
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1900,
        useWebWorker: true,
        initialQuality: 0.95,
      };

      const compressedFile = await imageCompression(
        croppedImage as File,
        options
      );
      const base64 = await convertToBase64(compressedFile);

      const newImage = {
        name: currentFileName,
        type: compressedFile.type,
        size: compressedFile.size,
        data: base64,
      };

      setPendingImages((prev) => [...prev, newImage]);

      // Procesar la siguiente imagen en la cola
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      processNextImage(imageQueue, nextIndex);
    } catch (error) {
      console.error("Error al recortar/comprimir la imagen:", error);
      toast.error("Error al procesar la imagen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    // Si se cierra el modal, pasar a la siguiente imagen
    const nextIndex = currentImageIndex + 1;
    setCurrentImageIndex(nextIndex);
    processNextImage(imageQueue, nextIndex);
  };

  const convertToBase64 = (file: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemovePendingImage = (index: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative flex space-x-4 overflow-x-auto p-4">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <Loader />
        </div>
      )}
      {/* Mostrar imágenes existentes solo si hay productId y skuId */}
      {productId &&
        skuId &&
        skuImages
          ?.filter((image: any) => !pendingDeletions.includes(image.id))
          .map((image: any, index: any) => (
            <div
              key={image.id}
              className="min-w-[80px] h-[80px] relative"
            >
              <img
                src={image.imageUrl}
                alt={`Image ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <button
                className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 m-1 text-xs"
                onClick={() => handleClearImage(image.id)}
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
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
              <label
                htmlFor={`imageUpdate${index}`}
                className="absolute bottom-0 hidden left-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded cursor-pointer"
              >
                Update
                <input
                  id={`imageUpdate${index}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleUpdateImage(event, image.id)}
                />
              </label>
            </div>
          ))}
      {/* Mostrar imágenes pendientes */}
      {pendingImages.map((image: any, index: number) => (
        <div
          key={`pending-${index}`}
          className="min-w-[80px] h-[80px] relative"
        >
          <img
            src={image.data}
            alt={`Pending Image ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <button
            className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 m-1 text-xs"
            onClick={() => handleRemovePendingImage(index)}
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
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
      ))}
      {/* Mostrar botón de subir imagen si hay espacio */}
      {getTotalImagesCount() < MAX_IMAGES && (
        <label
          htmlFor="imageUpload"
          className="min-w-[80px] p-2 flex justify-center items-center border border-dashed border-primary cursor-pointer"
          style={{ borderRadius: "var(--radius)" }}
        >
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
            <p className="mb-2 text-sm text-gray-500 text-center">
              <span className="font-semibold">Subir Imágenes</span>
            </p>
            <p className="text-xs text-gray-500 text-center">
              PNG, JPG o Webp (800x800px)
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Puedes seleccionar hasta {MAX_IMAGES - getTotalImagesCount()}{" "}
              {MAX_IMAGES - getTotalImagesCount() === 1 ? "imagen" : "imágenes"}
            </p>
          </div>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      )}
      {isModalOpen && (
        <Modal
          showModal={isModalOpen}
          onClose={handleModalClose}
        >
          <div className="relative h-96 w-full">
            <div className="absolute top-0 left-0 right-0 bg-gray-100 p-2 text-center text-sm">
              Imagen {currentImageIndex + 1} de {imageQueue.length}
            </div>
            <Cropper
              image={mainImage || ""}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
          <div className="flex flex-col justify-end">
            <div className="w-full py-6">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.01}
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setZoom(parseFloat(e.target.value));
                }}
                className="zoom-range w-full custom-range"
              />
            </div>
            <div className="flex justify-between w-full gap-2">
              <button
                onClick={handleCrop}
                className="bg-primary text-[13px] md:text-[16px] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Recortar y Continuar
              </button>
              <button
                onClick={handleModalClose}
                className="bg-red-800 text-[13px] md:text-[16px] hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Omitir
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ImageUploader;
