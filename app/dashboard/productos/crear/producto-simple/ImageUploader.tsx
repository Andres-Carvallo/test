/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next"; // asegúrate de tener cookies-next instalado

const ImageUploader: React.FC<any> = ({
  productId,
  skuId,
  skuImages,
  fetchImages,
}) => {
  const token = getCookie("AdminTokenAuth");

  useEffect(() => {
    // Cargar imágenes iniciales desde la API
    fetchImages(productId, skuId);
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
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (imageId: any) => {
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
    <div className="flex space-x-4 overflow-x-auto p-4">
      {skuImages.map((image: any, index: any) => (
        <div
          key={image.id}
          className="min-w-[100px] h-[100px] relative"
        >
          <img
            src={image.imageUrl}
            alt={`Image ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <button
            className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            onClick={() => handleClearImage(image.id)}
          >
            X
          </button>
          <label
            htmlFor={`imageUpdate${index}`}
            className="absolute bottom-0 left-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded cursor-pointer"
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
          className="min-w-[100px] h-[100px] flex justify-center items-center border border-dashed border-primary cursor-pointer"
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
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500">
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
