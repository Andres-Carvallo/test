"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Modal from "@/components/Core/Modals/ModalSeo"; // Asegúrate de importar el modal
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import imageCompression from "browser-image-compression";

// Cargar react-quill dinámicamente para evitar problemas de SSR (Server-Side Rendering)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const BannerTienda01BO: React.FC<any> = () => {
  const [isMainImageUploaded, setIsMainImageUploaded] = useState(false);

  // Estilos para la sombra del texto
  const shadowTextStyle = {
    textShadow: "0px 0px 8px rgba(0, 0, 0, 0.8)",
  };

  const [bannerData, setBannerData] = useState<any | null>(null);
  const [mainImageHero, setMainImageHero] = useState<string | null>(null);
  // States for image cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formDataHero, setFormDataHero] = useState<any>({
    title: "pixelup.cl",
    landingText: "pixelup.cl",
    buttonLink: "pixelup.cl",
    buttonText: "pixelup.cl",
  });

  // Configuración adicional que se almacenará como JSON en landingText
  const [configOptions, setConfigOptions] = useState({
    showTitle: true,
    showLandingText: true,
    showButton: true,
    textAlignment: "center", // Opciones: "left", "center", "right"
    textContent: "pixelup.cl", // El contenido real del texto
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [updatedBannerData, setUpdatedBannerData] = useState({
    title: "pixelup.cl",
    landingText: "pixelup.cl",
    buttonLink: "pixelup.cl",
    buttonText: "pixelup.cl",
    mainImageLink: "pixelup.cl",
    orderNumber: 1, // Modifica este valor según tu lógica
    mainImage: {
      name: "",
      type: "",
      size: null,
      data: "",
    },
  });

  const [originalFileName, setOriginalFileName] = useState<string>("");

  const MAX_CHARACTERS = 200;
  const ALERT_CHARACTERS = 199;

  // Agregar nuevos estados para la imagen móvil
  const [previewImageHero, setPreviewImageHero] = useState<string | null>(null);
  const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);
  const [isPreviewImageModalOpen, setIsPreviewImageModalOpen] = useState(false);

  // Agregar estado para controlar la vista previa
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet">(
    "desktop"
  );

  // Agregar nuevos estados para la imagen móvil
  const [mobileImageHero, setMobileImageHero] = useState<string | null>(null);
  const [isMobileImageUploaded, setIsMobileImageUploaded] = useState(false);
  const [isMobileImageModalOpen, setIsMobileImageModalOpen] = useState(false);

  const fetchBannerHome = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_BANNER_TIENDA_ID}`;

      // Obtener datos del banner base
      const bannerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      if (!bannerResponse.ok) {
        throw new Error(
          `Error en la petición del banner base: ${bannerResponse.status}`
        );
      }

      const bannerBaseData = await bannerResponse.json();
      console.log("Banner base:", bannerBaseData);

      // Obtener datos de las imágenes del banner
      const imagesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      if (!imagesResponse.ok) {
        throw new Error(
          `Error en la petición de imágenes: ${imagesResponse.status}`
        );
      }

      const imagesData = await imagesResponse.json();
      const bannerImage = imagesData.bannerImages[0];
      console.log("Banner image:", bannerImage);

      // Combinar los datos
      const combinedData = {
        ...bannerBaseData.banner,
        images: [bannerImage],
      };

      setBannerData([bannerImage]);

      // Intentar extraer la configuración del JSON en landingText del banner base
      let extractedConfig = {
        showTitle: true,
        showLandingText: true,
        showButton: true,
        textAlignment: "center",
        textContent: bannerImage.landingText || "pixelup.cl", // El contenido del texto está en la imagen
      };

      try {
        // Verificar si landingText del banner base contiene un JSON válido
        if (
          bannerBaseData.banner.landingText &&
          bannerBaseData.banner.landingText.trim().startsWith("{")
        ) {
          const parsedConfig = JSON.parse(bannerBaseData.banner.landingText);
          if (parsedConfig && typeof parsedConfig === "object") {
            // Mantener el contenido del texto de la imagen
            extractedConfig = {
              ...extractedConfig,
              ...parsedConfig,
              textContent:
                bannerImage.landingText ||
                parsedConfig.textContent ||
                "pixelup.cl",
            };
          }
        }
      } catch (error) {
        console.error("Error al parsear la configuración JSON:", error);
      }

      // Actualizar configOptions con los datos extraídos
      setConfigOptions(extractedConfig);

      // Actualizar formDataHero con los datos del banner
      setFormDataHero({
        title: bannerBaseData.banner.title,
        landingText: extractedConfig.textContent,
        buttonLink: bannerBaseData.banner.buttonLink,
        buttonText: bannerBaseData.banner.buttonText,
        mainImageLink: bannerImage.mainImageLink,
        orderNumber: bannerImage.orderNumber,
        mainImage: bannerImage.mainImage,
        mobileImage: bannerImage.mobileImage,
      });

      // Establecer las imágenes si existen
      if (bannerImage.mainImage?.url) {
        setMainImageHero(bannerImage.mainImage.url);
      }
      if (bannerImage.mobileImage?.url) {
        setMobileImageHero(bannerImage.mobileImage.url);
      }
    } catch (error) {
      console.error("Error al obtener los datos del banner:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Debería ejecutarse solo en el montaje inicial

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataHero({ ...formDataHero, [name]: value });
  };

  const handleEditorChange = (value: string) => {
    if (value.length <= MAX_CHARACTERS) {
      setFormDataHero({ ...formDataHero, landingText: value });
      setConfigOptions({ ...configOptions, textContent: value });
    }
  };

  // Función para actualizar las opciones de configuración
  const handleConfigChange = (name: string, value: any) => {
    setConfigOptions({ ...configOptions, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_BANNER_TIENDA_ID}`;
      const bannerImageId = `${process.env.NEXT_PUBLIC_BANNER_TIENDA_IMGID}`;

      // Crear un JSON con la configuración y el contenido del texto
      const configJSON = JSON.stringify(configOptions);

      // Primero, actualizar el banner base para guardar la configuración JSON en landingText
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formDataHero.title,
            landingText: configJSON, // Guardar la configuración como JSON en landingText del banner base
            buttonText: formDataHero.buttonText,
            buttonLink: formDataHero.buttonLink,
          }),
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      // Preparar los datos para actualizar la imagen del banner
      const updateData = {
        ...formDataHero,
        landingText: configOptions.textContent, // Solo guardar el contenido del texto en la imagen
        orderNumber: formDataHero.orderNumber,
      };

      // Eliminar ambas imágenes del objeto base
      delete updateData.mainImage;
      delete updateData.mobileImage;

      // Agregar solo las imágenes que han sido modificadas
      if (isMainImageUploaded) {
        updateData.mainImage = formDataHero.mainImage;
      }
      if (isMobileImageUploaded) {
        updateData.mobileImage = formDataHero.mobileImage;
      }

      // Actualizar la imagen del banner
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${bannerImageId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      fetchBannerHome();
    } catch (error) {
      console.error("Error updating banner:", error);
    } finally {
      setLoading(false);
      setIsMainImageUploaded(false);
      setIsMobileImageUploaded(false);
    }
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    imageKey: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFileName(file.name); // Guardar el nombre del archivo original
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
        setFormDataHero((prevFormDataHero: any) => ({
          ...prevFormDataHero,
          [imageKey]: imageInfo,
        }));
        // Actualizar updatedBannerData con la información de la imagen
        setUpdatedBannerData((prevData: any) => ({
          ...prevData,
          [imageKey]: imageInfo,
        }));
        setIsModalOpen(true); // Abrir el modal para recortar la imagen
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setImage(null); // Limpiar la imagen seleccionada
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevenir comportamiento predeterminado del Tab
    }
  };

  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const convertToBase64 = (file: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCrop = async () => {
    if (!mainImageHero) return;

    try {
      const croppedImage = await getCroppedImg(
        mainImageHero,
        croppedAreaPixels
      );
      if (!croppedImage) {
        console.error("Error al recortar la imagen: croppedImage es null");
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1900,
        useWebWorker: true,
        initialQuality: 1,
      };
      const compressedFile = await imageCompression(
        croppedImage as File,
        options
      );
      const base64 = await convertToBase64(compressedFile);

      const imageInfo = {
        name: originalFileName, // Usar el nombre del archivo original
        type: compressedFile.type,
        size: compressedFile.size,
        data: base64,
      };

      setFormDataHero((prevFormDataHero: any) => ({
        ...prevFormDataHero,
        mainImage: imageInfo,
      }));
      setMainImageHero(base64);
      setIsModalOpen(false);
      setIsMainImageUploaded(true);
    } catch (error) {
      console.error("Error al recortar/comprimir la imagen:", error);
    }
  };

  const handlePreviewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewImageHero(result);
        setIsPreviewImageModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewCrop = async () => {
    if (!previewImageHero) return;

    try {
      const croppedImage = await getCroppedImg(
        previewImageHero,
        croppedAreaPixels
      );
      if (!croppedImage) {
        console.error("Error al recortar la imagen: croppedImage es null");
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
        initialQuality: 1,
      };
      const compressedFile = await imageCompression(
        croppedImage as File,
        options
      );
      const base64 = await convertToBase64(compressedFile);

      const imageInfo = {
        name: originalFileName,
        type: compressedFile.type,
        size: compressedFile.size,
        data: base64,
      };

      setFormDataHero((prevFormDataHero: any) => ({
        ...prevFormDataHero,
        previewImage: imageInfo,
      }));
      setPreviewImageHero(base64);
      setIsPreviewImageModalOpen(false);
      setIsPreviewImageUploaded(true);
    } catch (error) {
      console.error("Error al recortar/comprimir la imagen:", error);
    }
  };

  const handleClearPreviewImage = () => {
    setPreviewImageHero(null);
    setIsPreviewImageUploaded(false);
    setFormDataHero((prevFormDataHero: any) => ({
      ...prevFormDataHero,
      previewImage: {
        name: "",
        type: "",
        size: null,
        data: "",
      },
    }));
  };

  const handleMobileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setMobileImageHero(result);
        setIsMobileImageUploaded(true);
        setIsMobileImageModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileCrop = async () => {
    if (!mobileImageHero) return;

    try {
      const croppedImage = await getCroppedImg(
        mobileImageHero,
        croppedAreaPixels
      );
      if (!croppedImage) {
        console.error("Error al recortar la imagen: croppedImage es null");
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
        initialQuality: 1,
      };
      const compressedFile = await imageCompression(
        croppedImage as File,
        options
      );
      const base64 = await convertToBase64(compressedFile);

      const imageInfo = {
        name: originalFileName,
        type: compressedFile.type,
        size: compressedFile.size,
        data: base64,
      };

      setFormDataHero((prevFormDataHero: any) => ({
        ...prevFormDataHero,
        mobileImage: imageInfo,
      }));
      setMobileImageHero(base64);
      setIsMobileImageModalOpen(false);
      setIsMobileImageUploaded(true);
    } catch (error) {
      console.error("Error al recortar/comprimir la imagen:", error);
    }
  };

  const handleClearMobileImage = () => {
    setMobileImageHero(null);
    setIsMobileImageUploaded(false);
    setFormDataHero((prevFormDataHero: any) => ({
      ...prevFormDataHero,
      mobileImage: {
        name: "",
        type: "",
        size: null,
        data: "",
      },
    }));
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
      {/* Preview del banner */}
      <div className="shadow-md rounded-lg p-4 bg-white my-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-dark md:mb-12 lg:text-3xl uppercase">
          Vista Previa
        </h2>

        {/* Controles de vista previa */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setPreviewMode("desktop")}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              previewMode === "desktop"
                ? "bg-primary text-secondary"
                : "bg-gray-200 text-gray-700"
            }`}
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
                d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
              />
            </svg>
            Desktop
          </button>
          <button
            onClick={() => setPreviewMode("tablet")}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              previewMode === "tablet"
                ? "bg-primary text-secondary"
                : "bg-gray-200 text-gray-700"
            }`}
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
                d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-15a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            Tablet y Mobile
          </button>
        </div>

        {/* Container con diferentes tamaños según el modo */}
        <div
          className={`mx-auto transition-all duration-300 overflow-hidden ${
            previewMode === "desktop" ? "w-full" : "w-[768px]"
          }`}
        >
          <div className="relative">
            {/* Vista previa de la imagen */}
            <div
              className="relative w-full"
              style={{
                aspectRatio:
                  previewMode === "desktop" ? "1920/300" : "1080/300",
              }}
            >
              {previewMode === "tablet" ? (
                <img
                  src={
                    mobileImageHero ||
                    formDataHero.mobileImage?.data ||
                    bannerData?.[0]?.mobileImage?.url ||
                    bannerData?.[0]?.mainImage?.url
                  }
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={
                    mainImageHero ||
                    formDataHero.mainImage?.data ||
                    bannerData?.[0]?.mainImage?.url
                  }
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Contenido superpuesto para la vista previa */}
              <div
                className={`absolute inset-0 flex flex-col justify-center p-6 max-w-6xl mx-auto w-full`}
              >
                <div className={`w-full text-${configOptions.textAlignment}`}>
                  {configOptions.showTitle && formDataHero.title && (
                    <h2
                      className="text-3xl md:text-4xl font-bold text-white mb-4 shadow-text"
                      style={shadowTextStyle}
                    >
                      {formDataHero.title}
                    </h2>
                  )}

                  {configOptions.showLandingText &&
                    formDataHero.landingText && (
                      <div
                        className="text-lg md:text-xl text-white mb-6 shadow-text"
                        style={shadowTextStyle}
                        dangerouslySetInnerHTML={{
                          __html: formDataHero.landingText,
                        }}
                      />
                    )}

                  {configOptions.showButton && formDataHero.buttonText && (
                    <div className={`text-${configOptions.textAlignment}`}>
                      <a
                        href="#"
                        className="inline-block bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        {formDataHero.buttonText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-4 mx-auto mt-8"
      >
        <input
          type="number"
          name="orderNumber"
          value={formDataHero.orderNumber}
          onChange={handleChange}
          className="hidden w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        />
        <div className="grid gap-4">
          <div className="mb-6">
            <h3 className="font-normal text-primary">
              Título <span className="text-primary">*</span>
            </h3>
            <div className="flex items-center mb-2">
              <input
                type="text"
                name="title"
                value={formDataHero.title}
                onChange={handleChange}
                className="shadow block w-full px-4 py-3 mt-2 border border-gray-300"
                style={{ borderRadius: "var(--radius)" }}
                placeholder="Título"
              />
              <div className="ml-4 flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="showTitle"
                    checked={configOptions.showTitle}
                    onChange={(e) =>
                      handleConfigChange("showTitle", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Mostrar
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-normal text-primary">
              Párrafo <span className="text-primary">*</span>
            </h3>
            <div className="flex items-center mb-2">
              <ReactQuill
                value={formDataHero.landingText}
                onChange={handleEditorChange}
                className="shadow block w-full px-4 py-3 mt-2 border border-gray-300"
                style={{ borderRadius: "var(--radius)" }}
                placeholder="Texto del banner"
                onKeyDown={handleKeyDown}
              />
              <div className="ml-4 flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="showLandingText"
                    checked={configOptions.showLandingText}
                    onChange={(e) =>
                      handleConfigChange("showLandingText", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Mostrar
                  </span>
                </label>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              {formDataHero.landingText.length}/{MAX_CHARACTERS}
            </div>
            {formDataHero.landingText.length > ALERT_CHARACTERS && (
              <div
                className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                role="alert"
              >
                <svg
                  className="flex-shrink-0 inline w-4 h-4 me-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium">Límite Alcanzado!</span> Los
                  caracteres extras no serán mostrados.
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-normal text-primary">
              Botón <span className="text-primary">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Texto del botón
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={formDataHero.buttonText}
                  onChange={handleChange}
                  className="shadow block w-full px-4 py-3 mt-2 border border-gray-300"
                  style={{ borderRadius: "var(--radius)" }}
                  placeholder="Texto del botón"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enlace del botón
                </label>
                <input
                  type="text"
                  name="buttonLink"
                  value={formDataHero.buttonLink}
                  onChange={handleChange}
                  className="shadow block w-full px-4 py-3 mt-2 border border-gray-300"
                  style={{ borderRadius: "var(--radius)" }}
                  placeholder="URL del botón"
                />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="showButton"
                  checked={configOptions.showButton}
                  onChange={(e) =>
                    handleConfigChange("showButton", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Mostrar botón
                </span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-normal text-primary">
              Alineación del texto <span className="text-primary">*</span>
            </h3>
            <div className="flex space-x-4 mt-2">
              <button
                type="button"
                onClick={() => handleConfigChange("textAlignment", "left")}
                className={`p-2 border ${
                  configOptions.textAlignment === "left"
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h10M4 18h16"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleConfigChange("textAlignment", "center")}
                className={`p-2 border ${
                  configOptions.textAlignment === "center"
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M6 12h12M4 18h16"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleConfigChange("textAlignment", "right")}
                className={`p-2 border ${
                  configOptions.textAlignment === "right"
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M10 12h10M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            id="mainImageHero"
            className="hidden"
            onChange={(e) =>
              handleImageChange(e, setMainImageHero, "mainImageHero")
            }
          />
          {isMainImageUploaded ? (
            <div className="flex flex-col items-center mt-3 relative">
              <h4 className="font-normal text-primary text-center text-slate-600 w-full">
                Tu fotografía{" "}
                <span className="text-dark">
                  {" "}
                  {formDataHero.mainImage.name}
                </span>{" "}
                ya ha sido cargada.
                <br /> Actualiza para ver los cambios.
              </h4>

              <button
                className="bg-red-500 gap-4 flex item-center justify-center px-4 py-2 hover:bg-red-700 text-white rounded-full   text-xs mt-4"
                onClick={() => handleClearImage(setMainImageHero)}
              >
                <span className="self-center">Seleccionar otra Imagen</span>
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
          ) : (
            <div>
              <h3 className="font-normal text-primary">
                Foto Desktop<span className="text-primary">*</span>
              </h3>
              <label
                htmlFor="mainImageHero"
                className="border-primary shadow flex mt-3 flex-col bg-white justify-center items-center pt-5 pb-6 border border-dashed rounded-lg cursor-pointer w-full z-10"
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
                    PNG, JPG o Webp (Recomendada 1080 × 300px)
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            id="mobileImage"
            className="hidden"
            onChange={handleMobileImageChange}
          />
          {isMobileImageUploaded ? (
            <div className="flex flex-col items-center mt-10">
              <h4 className="font-normal text-primary text-center text-slate-600 w-full">
                Tu fotografía{" "}
                <span className="text-dark">
                  {formDataHero.mobileImage?.name}
                </span>{" "}
                ha sido cargada.
                <br /> Actualiza para ver los cambios.
              </h4>
              <button
                className="bg-red-500 gap-4 flex item-center justify-center px-4 py-2 hover:bg-red-700 text-white rounded-full text-xs mt-4"
                onClick={handleClearMobileImage}
              >
                <span className="self-center">Seleccionar otra Imagen</span>
              </button>
            </div>
          ) : (
            <div>
              <h3 className="font-normal text-primary">
                Foto Mobile y Tablet <span className="text-primary">*</span>
              </h3>
              <label
                htmlFor="mobileImage"
                className="border-primary shadow flex mt-3 flex-col bg-white justify-center items-center pt-5 pb-6 border border-dashed rounded-lg cursor-pointer w-full z-10"
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
                    <span className="font-semibold">Subir Imagen</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG o Webp (Recomendada 960 × 150px)
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            id="previewImage"
            className="hidden"
            onChange={handlePreviewImageChange}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shadow bg-primary hover:bg-secondary w-full uppercase text-secondary hover:text-primary  font-bold py-2 px-4 rounded flex-wrap mt-6"
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
              fill="currentColor"
            />
          </svg>
          {loading ? "Loading..." : "Actualizar Banner"}
        </button>
      </form>
      {isModalOpen && (
        <Modal
          showModal={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="relative h-96 w-full">
            <Cropper
              image={mainImageHero || ""} // Asegurar que se pasa una cadena no nula
              crop={crop}
              zoom={zoom}
              aspect={1920 / 300}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
            <div className="controls"></div>
          </div>
          <div className="flex flex-col  justify-end ">
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
                className="zoom-range w-full custom-range "
              />
            </div>

            <div className="flex justify-between w-full ">
              <button
                onClick={handleCrop}
                className="bg-primary hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Recortar y Subir
              </button>
              <button
                onClick={() => {
                  setMainImageHero(null);
                  setIsMainImageUploaded(false);
                  setIsModalOpen(false);
                }}
                className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isPreviewImageModalOpen && (
        <Modal
          showModal={isPreviewImageModalOpen}
          onClose={() => setIsPreviewImageModalOpen(false)}
        >
          <div className="relative h-96 w-full">
            <Cropper
              image={previewImageHero || ""}
              crop={crop}
              zoom={zoom}
              aspect={1080 / 300}
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
            <div className="flex justify-between w-full">
              <button
                onClick={handlePreviewCrop}
                className="bg-primary hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Recortar y Subir
              </button>
              <button
                onClick={() => {
                  setPreviewImageHero(null);
                  setIsPreviewImageUploaded(false);
                  setIsPreviewImageModalOpen(false);
                }}
                className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isMobileImageModalOpen && (
        <Modal
          showModal={isMobileImageModalOpen}
          onClose={() => setIsMobileImageModalOpen(false)}
        >
          <div className="relative h-96 w-full">
            <Cropper
              image={mobileImageHero || ""}
              crop={crop}
              zoom={zoom}
              aspect={1080 / 300}
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
            <div className="flex justify-between w-full">
              <button
                onClick={handleMobileCrop}
                className="bg-primary hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Recortar y Subir
              </button>
              <button
                onClick={() => {
                  setMobileImageHero(null);
                  setIsMobileImageUploaded(false);
                  setIsMobileImageModalOpen(false);
                }}
                className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default BannerTienda01BO;
