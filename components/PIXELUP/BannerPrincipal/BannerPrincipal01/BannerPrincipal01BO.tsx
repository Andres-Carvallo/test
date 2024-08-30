"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

interface BannerImage {
  id: string;
  url: any;
  title: string;
  landingText: string;
  buttonLink: string;
  buttonText: string;
  mainImageLink: string;
  orderNumber: number;
  mainImage?: any;
}

const BannerPrincipalBO: React.FC = () => {
  const [isMainImageUploaded, setIsMainImageUploaded] = useState(false);
  const [isAddingImage, setIsAddingImage] = useState<boolean>(false);
  const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);
  const [bannerData, setBannerData] = useState<BannerImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [formData, setFormData] = useState<BannerImage>({
    id: "",
    url: "",
    title: "",
    landingText: "",
    buttonLink: "",
    buttonText: "",
    mainImageLink: "pixelup.cl",
    orderNumber: 1,
    mainImage: {
      url: "",
      name: "",
      type: "",
      size: null,
      data: "",
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [mainImage, setMainImage] = useState<string | null>(null);

  const fetchBannerHome = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = "a9253899-5470-4cff-8ab9-fec7992a78e9";

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data, "bannerData");
      setBannerData(response.data.bannerImages);
      if (response.data.bannerImages.length > 0) {
        const initialImage = response.data.bannerImages[0];
        setFormData(initialImage);
        setMainImage(initialImage.mainImage.url || initialImage.mainImage.data);
      }
    } catch (error) {
      console.error("Error al obtener los datos del banner:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerHome();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: any, setImage: any, imageKey: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);

        const imageInfo = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: result,
        };
        // Determina qué imagen se está cambiando y actualiza el estado correspondiente
        if (imageKey === "mainImage") {
          setIsMainImageUploaded(true);
        } else if (imageKey === "previewImage") {
          setIsPreviewImageUploaded(true);
        }
        setFormData((prevFormData) => ({
          ...prevFormData,
          [imageKey]: imageInfo,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setMainImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = "a9253899-5470-4cff-8ab9-fec7992a78e9";

      if (isAddingImage) {
        // Realizar una solicitud POST para crear una nueva imagen
        const newData = {
          ...formData,
          mainImageLink: "pixelup.cl",
        };

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images`,
          newData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setIsAddingImage(false); // Resetear el estado después de agregar
      } else {
        // Realizar una solicitud PUT para actualizar la imagen existente
        let updatedData = {
          ...formData,
          orderNumber: formData.orderNumber,
        };

        // Filtrar el campo mainImage si no se ha cargado una nueva imagen
        if (!isMainImageUploaded && updatedData) {
          delete updatedData.mainImage;
        }

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${formData.id}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      fetchBannerHome();
    } catch (error) {
      console.error("Error al actualizar el banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");

      const bannerId = "a9253899-5470-4cff-8ab9-fec7992a78e9";
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${formData.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchBannerHome();
    } catch (error) {
      console.error("Error al borrar la imagen del banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextImage = () => {
    const nextIndex = (currentIndex + 1) % bannerData.length;
    setCurrentIndex(nextIndex);
    const nextImage = bannerData[nextIndex];
    setFormData(nextImage);
    setMainImage(nextImage.mainImage.url || nextImage.mainImage.data);
    setIsMainImageUploaded(false); // Reiniciar el estado de la imagen cargada
  };

  const handlePrevImage = () => {
    const prevIndex =
      (currentIndex - 1 + bannerData.length) % bannerData.length;
    setCurrentIndex(prevIndex);
    const prevImage = bannerData[prevIndex];
    setFormData(prevImage);
    setMainImage(prevImage.mainImage.url || prevImage.mainImage.data);
    setIsMainImageUploaded(false); // Reiniciar el estado de la imagen cargada
  };
  const handleAddImageClick = () => {
    setFormData({
      id: "",
      url: "",
      title: "",
      landingText: "",
      buttonLink: "",
      buttonText: "",
      mainImageLink: "",
      orderNumber: 1,
      mainImage: {
        url: "",
        name: "",
        type: "",
        size: null,
        data: "",
      },
    });
    setMainImage(null);
    setIsAddingImage(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
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
    );
  }

  return (
    <section
      id="banner"
      className="w-full"
    >
      <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-30 before:z-10">
        <img
          src={mainImage || formData.mainImage.url}
          alt="Banner Image"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="min-h-[300px] relative z-10 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
          <h2 className="text-2xl font-semibold mb-2">{formData.title}</h2>
          <p className="text-md text-center text-gray-200">
            {formData.landingText}
          </p>
          <a
            href={formData.buttonLink}
            className="mt-8 bg-dark bg-primary text-secondary hover:text-primary text-base font-semibold py-2.5 px-6 rounded hover:bg-secondary"
          >
            {formData.buttonText}
          </a>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleAddImageClick}
          className="shadow bg-green-500 hover:bg-green-700 w-full uppercase text-white font-bold py-2 px-4 rounded flex-wrap"
          style={{ borderRadius: "var(--radius)" }}
        >
          Agregar Imagen
        </button>
        <button
          type="button"
          onClick={handleDeleteImage}
          className="shadow bg-red-500 hover:bg-red-700 w-full uppercase text-white font-bold py-2 px-4 rounded flex-wrap ml-4"
          style={{ borderRadius: "var(--radius)" }}
        >
          Borrar Imagen
        </button>
      </div>
      <div className="flex justify-center items-center mt-8">
        <button
          onClick={handlePrevImage}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-l"
        >
          Prev
        </button>
        <button
          onClick={handleNextImage}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-r"
        >
          Next
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="px-4 mx-auto mt-8"
      >
        <h3 className="font-normal text-primary">
          Titulo <span className="text-primary">*</span>
        </h3>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Title"
        />
        <h3 className="font-normal text-primary">
          Texto <span className="text-primary">*</span>
        </h3>
        <input
          type="text"
          name="landingText"
          value={formData.landingText}
          onChange={handleChange}
          className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Landing Text"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <h3 className="font-normal text-primary">
              Texto Boton <span className="text-primary">*</span>
            </h3>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleChange}
              className="shadow block w-full px-4 py-3 mb-4 mt-2 border border-gray-300 rounded-md"
              placeholder="Button Text"
            />
          </div>
          <div>
            <h3 className="font-normal text-primary">
              Link de destino <span className="text-primary">*</span>
            </h3>
            <input
              type="text"
              name="buttonLink"
              value={formData.buttonLink}
              onChange={handleChange}
              className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Button Link"
            />
          </div>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            id="mainImage"
            className="hidden"
            onChange={(e) => handleImageChange(e, setMainImage, "mainImage")}
          />
          {mainImage ? (
            <div>
              <span className="font-normal text-primary">Foto </span>
              <div className="relative mt-3 h-[150px] rounded-lg object-contain overflow-hidden">
                <img
                  src={mainImage}
                  alt="Main Image"
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
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-normal text-primary">
                Foto <span className="text-primary">*</span>
              </h3>
              <label
                htmlFor="mainImage"
                className="border-primary shadow flex mt-3 flex-col bg-white justify-center items-center pt-5 pb-6 border border-dashed  rounded-lg cursor-pointer w-full z-10"
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
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Subir Imagen</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG o Webp (800x800px)
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="shadow bg-primary hover:bg-secondary w-full uppercase text-secondary hover:text-primary font-bold py-2 px-4 rounded flex-wrap mt-6"
          style={{ borderRadius: "var(--radius)" }}
        >
          <svg
            aria-hidden="true"
            role="status"
            className={`inline w-4 h-4 me-3 text-white animate-spin ${
              loading ? "block" : "hidden"
            }`}
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          {loading
            ? "Loading..."
            : isAddingImage
            ? "Crear Imagen"
            : "Actualizar"}
        </button>
      </form>
    </section>
  );
};

export default BannerPrincipalBO;
