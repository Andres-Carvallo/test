/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
type ImageUploaderVariableProps = {
  productId: string;
  skuId: string;
  variationImages: any[]; // Assuming variationImages is an array
  fetchVariationImages: (productId: string, skuId: string) => void;
};
const ImageUploaderVariable: React.FC<ImageUploaderVariableProps> = ({
  productId,
  skuId,
  variationImages,
  fetchVariationImages,
}) => {
  const token = getCookie("AdminTokenAuth");

  useEffect(() => {
    fetchVariationImages(productId, skuId); // Cargar imágenes de variación
  }, [productId, skuId, token]);

  const handleImageUpload = (event: any) => {
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
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
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
              console.log("Uploaded variation image:", data);
              fetchVariationImages(productId, skuId); // Actualiza solo las imágenes de variación
            } else {
              console.error(
                "Error al subir la imagen de variación:",
                data.message
              );
            }
          })
          .catch((error) => {
            console.error("Error al subir la imagen de variación:", error);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (imageId: any) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images/${imageId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
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
          fetchVariationImages(productId, skuId);
        } else {
          console.error("Error al borrar la imagen:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error al borrar la imagen:", error);
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
              fetchVariationImages(productId, skuId);
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
    <div className="flex space-x-4 overflow-x-auto p-4">
      <div className="flex flex-wrap gap-2">
        {variationImages.map((image, index) => (
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
      </div>

      {/* Permitir subir una nueva imagen de variación si no se alcanza el límite */}
      {variationImages.length < 4 && (
        <label
          htmlFor="variationImageUpload"
          className="min-w-[100px]  flex justify-center items-center border border-dashed border-primary cursor-pointer"
          style={{ borderRadius: "var(--radius)" }}
        >
          <div className="flex flex-col justify-center items-center p-3">
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
            <p className="text-xs text-gray-500 text-center">
              SVG, PNG, JPG or GIF
            </p>
          </div>
          <input
            id="variationImageUpload"
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

export default ImageUploaderVariable;
