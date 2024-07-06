/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next"; // asegúrate de tener cookies-next instalado
import Loader from "@/components/common/Loader";

const ImageUploader: React.FC<any> = ({
  productId,
  skuId,
  skuImages,
  fetchImages,
}) => {
  const token = getCookie("AdminTokenAuth");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Cargar imágenes iniciales desde la API
    fetchImages(productId, skuId);
  }, [productId, skuId, token]);

  const handleImageUpload = (event: any) => {
    setIsLoading(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result, // Base64 encoded data
        };

        fetch(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mainImage: newImage }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 0) {
              console.log("Uploaded image:", data);
              fetchImages(productId, skuId);
            } else {
              console.error("Error al subir la imagen:", data.message);
            }
          })
          .catch((error) => {
            console.error("Error al subir la imagen:", error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      };
      reader.readAsDataURL(file);
    } else {
      setIsLoading(false);
    }
  };

  const handleClearImage = (imageId: any) => {
    setIsLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 0) {
          console.log("Deleted image with id:", imageId);
          fetchImages(productId, skuId);
        } else {
          console.error("Error al borrar la imagen:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error al borrar la imagen:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images/${imageId}`,
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

  return (
    <div className="relative flex space-x-4 overflow-x-auto p-4">
      {isLoading && (
        <div className="absolute  inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {skuImages.map((image: any, index: any) => (
        <div
          key={image.id}
          className="min-w-[80px] h-[80px]  relative"
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
      {skuImages.length < 4 && (
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
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500   text-center">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
