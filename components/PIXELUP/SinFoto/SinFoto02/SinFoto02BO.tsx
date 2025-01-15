"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Modal from "@/components/Core/Modals/ModalSeo";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { getCroppedImg } from "@/lib/cropImage";
import Loader from "@/components/common/Loader-t";

// Definir interfaces para el tipado
interface MainImage {
  name: string;
  type: string;
  size: number; // Cambiado de null a number
  data: string;
}

interface BannerData {
  title: string;
  landingText: string;
  buttonLink: string;
  buttonText: string;
  mainImageLink: string;
  orderNumber: number;
  mainImage: MainImage;
}

// Actualizar la interfaz BoxContent para incluir todos los campos
interface BoxContent {
  id?: string;
  title: string;
  contentText: string;
  creationDate?: string;
}

interface ApiResponse {
  code: number;
  message: string;
  contentBlock: BoxContent;
}

// Agregar interfaces para el manejo de errores
interface AxiosError {
  response?: {
    data: any;
  };
}

const SinFoto02BO: React.FC<any> = () => {
  const BannerId = process.env.NEXT_PUBLIC_SINFOTO02_ID || "";
  const BannerImageId = process.env.NEXT_PUBLIC_SINFOTO02_IMGID || "";
  const Box1Id = process.env.NEXT_PUBLIC_SINFOTO02_BOX1_ID || "";
  const Box2Id = process.env.NEXT_PUBLIC_SINFOTO02_BOX2_ID || "";
  const Box3Id = process.env.NEXT_PUBLIC_SINFOTO02_BOX3_ID || "";
  const [bannerData, setBannerData] = useState<any | null>(null);
  const [mainImageHero, setMainImageHero] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isMainImageUploaded, setIsMainImageUploaded] = useState(false);
  const [originalFileName, setOriginalFileName] = useState<string>("");

  // Estados para los boxes
  const [box1Data, setBox1Data] = useState<BoxContent>({
    title: "",
    contentText: "", // Cambiado a contentText
  });
  const [box2Data, setBox2Data] = useState<BoxContent>({
    title: "",
    contentText: "",
  });
  const [box3Data, setBox3Data] = useState<BoxContent>({
    title: "",
    contentText: "",
  });

  const [formDataHero, setFormDataHero] = useState({
    title: "",
    landingText: "",
    buttonText: "",
    buttonLink: "www.pixelup.cl" as const,
    mainImageLink: "www.pixelup.cl" as const,
    orderNumber: 1,
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [updatedBannerData, setUpdatedBannerData] = useState<BannerData>({
    title: "",
    landingText: "",
    buttonLink: "www.pixelup.cl",
    buttonText: "",
    mainImageLink: "www.pixelup.cl",
    orderNumber: 1,
    mainImage: {
      name: "",
      type: "",
      size: 0, // Inicializado con 0 en lugar de null
      data: "",
    },
  });

  // Agregar nuevo estado para controlar la visibilidad de la vista previa
  const [showPreview, setShowPreview] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

      // Fetch banner data
      const bannerResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${BannerId}/images/${BannerImageId}?siteId=${siteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Actualizar el estado del banner
      if (bannerResponse.data.bannerImage) {
        setBannerData(bannerResponse.data.bannerImage);
        setFormDataHero({
          title: bannerResponse.data.bannerImage.title || "",
          landingText: bannerResponse.data.bannerImage.landingText || "",
          buttonText: bannerResponse.data.bannerImage.buttonText || "",
          buttonLink: "www.pixelup.cl",
          mainImageLink: "www.pixelup.cl",
          orderNumber: 1,
        });
      }

      // Fetch data for boxes
      try {
        // Box 1
        console.log("Fetching Box 1...");
        const box1Response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${Box1Id}?siteId=${siteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (box1Response.data.code === 0 && box1Response.data.contentBlock) {
          setBox1Data({
            title: box1Response.data.contentBlock.title,
            contentText: box1Response.data.contentBlock.contentText,
          });
        }

        // Box 2

        const box2Response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${Box2Id}?siteId=${siteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (box2Response.data.code === 0 && box2Response.data.contentBlock) {
          setBox2Data({
            title: box2Response.data.contentBlock.title,
            contentText: box2Response.data.contentBlock.contentText,
          });
        }

        // Box 3

        const box3Response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${Box3Id}?siteId=${siteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (box3Response.data.code === 0 && box3Response.data.contentBlock) {
          setBox3Data({
            title: box3Response.data.contentBlock.title,
            contentText: box3Response.data.contentBlock.contentText,
          });
        }
      } catch (boxError: unknown) {
        if (
          boxError &&
          typeof boxError === "object" &&
          "response" in boxError
        ) {
          console.error(
            "Error detallado en fetch de boxes:",
            (boxError as AxiosError).response?.data || boxError
          );
        } else {
          console.error("Error detallado en fetch de boxes:", boxError);
        }
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        console.error(
          "Error detallado general:",
          (error as AxiosError).response?.data || error
        );
      } else {
        console.error("Error detallado general:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejadores para actualizar los boxes
  const handleBoxChange = async (boxId: string, data: any) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${boxId}?siteId=${siteId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Revalidar el cache del cliente
      const revalidateResponse = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: `/api/v1/content-blocks/${boxId}`,
        }),
      });

      console.log(
        "Respuesta de revalidación:",
        await revalidateResponse.json()
      );

      // Refrescar datos
      await fetchData();
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        console.error(
          "Error detallado en actualización:",
          (error as AxiosError).response?.data || error
        );
      } else {
        console.error("Error detallado en actualización:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataHero({ ...formDataHero, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");

      // Asegurarnos de que todos los campos requeridos estén presentes
      const updatedDataWithoutImage = {
        title: formDataHero.title || "",
        landingText: formDataHero.landingText || "",
        buttonText: formDataHero.buttonText || "",
        buttonLink: "www.pixelup.cl", // Valor fijo
        mainImageLink: "www.pixelup.cl", // Valor fijo
        orderNumber: 1,
      } as const; // Asegurarnos de que TypeScript trate estos valores como constantes

      const bannerId = `${process.env.NEXT_PUBLIC_SINFOTO02_ID}`;
      const bannerImageId = `${process.env.NEXT_PUBLIC_SINFOTO02_IMGID}`;

      // Actualizar el banner
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${bannerImageId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        JSON.stringify(updatedDataWithoutImage), // Convertir explícitamente a JSON
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);

      // Revalidar el cache del cliente
      await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: `/api/v1/banners/${bannerId}`,
        }),
      });

      await fetchData(); // Esperar a que fetchData termine
    } catch (error) {
      console.error("Error completo:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error de Axios:", error.response?.data);
      }
    } finally {
      setLoading(false);
      setIsMainImageUploaded(false);
    }
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    imageKey: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        setIsModalOpen(true);
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
        setUpdatedBannerData((prevData) => ({
          ...prevData,
          [imageKey]: imageInfo,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setImage(null); // Limpiar la imagen seleccionada
  };

  const convertToBase64 = (file: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

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
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        initialQuality: 0.95,
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
        mainImage: imageInfo,
      }));
      setUpdatedBannerData((prevData) => ({
        ...prevData,
        mainImage: imageInfo,
      }));
      setMainImageHero(base64);
      setIsModalOpen(false);
      setIsMainImageUploaded(true);
    } catch (error) {
      console.error("Error al recortar/comprimir la imagen:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <section
      id="banner"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Banner Principal Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold mb-2 sm:mb-0">Sección Bienvenida</h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200"
          >
            {showPreview ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
                <span className="pl-2">Ocultar Vista Previa</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <span className="pl-2">Mostrar Vista Previa</span>
              </>
            )}
          </button>
        </div>

        {/* Vista previa */}
        {bannerData && showPreview && (
          <div className="mb-8 overflow-x-auto">
            <h3 className="font-medium text-gray-700 mb-4">Vista Previa:</h3>
            <div className="px-4 text-center container mx-auto pt-10">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 font-kalam">
                {bannerData?.buttonText}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
                {bannerData?.landingText}
              </p>
              <p className="text-lg text-gray-600 font-kalam mb-8">
                {bannerData?.title}
              </p>

              {/* Boxes Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {/* Box 1 Preview */}
                {box1Data && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white rounded-full p-2 shadow-md">
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
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-[16px] font-semibold text-primary mb-2">
                      {box1Data.title}
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-6">
                      {box1Data.contentText}
                    </p>
                  </div>
                )}

                {/* Box 2 Preview */}
                {box2Data && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white rounded-full p-2 shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-[16px] font-semibold text-primary mb-2">
                      {box2Data.title}
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-6">
                      {box2Data.contentText}
                    </p>
                  </div>
                )}

                {/* Box 3 Preview */}
                {box3Data && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white rounded-full p-2 shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-[16px] font-semibold text-primary mb-2">
                      {box3Data.title}
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-6">
                      {box3Data.contentText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Formulario de edición */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Epígrafe
              </label>
              <input
                type="text"
                name="buttonText"
                value={formDataHero.buttonText}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-50 py-2 px-4 rounded-md border-gray-300 shadow-sm"
                placeholder="Texto del epígrafe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                name="title"
                value={formDataHero.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 py-2 px-4 shadow-sm"
                placeholder="Título principal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Texto Principal
            </label>
            <textarea
              name="landingText"
              value={formDataHero.landingText}
              onChange={(e) =>
                setFormDataHero({
                  ...formDataHero,
                  landingText: e.target.value,
                })
              }
              className="mt-1 bg-gray-50 py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
              placeholder="Texto principal de la sección"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80 transition-colors"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar Sección"}
          </button>
        </form>
      </div>

      {/* Boxes Forms en grid responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Box 1 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Box 1</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                value={box1Data.title}
                onChange={(e) =>
                  setBox1Data({ ...box1Data, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 py-2 px-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contenido
              </label>
              <textarea
                value={box1Data.contentText}
                onChange={(e) =>
                  setBox1Data({ ...box1Data, contentText: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 py-2 px-4"
                rows={3}
              />
            </div>
            <button
              onClick={() => handleBoxChange(Box1Id, box1Data)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Actualizar Box 1
            </button>
          </div>
        </div>

        {/* Box 2 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Box 2</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                value={box2Data.title}
                onChange={(e) =>
                  setBox2Data({ ...box2Data, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 py-2 px-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contenido
              </label>
              <textarea
                value={box2Data.contentText}
                onChange={(e) =>
                  setBox2Data({ ...box2Data, contentText: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 py-2 px-4"
                rows={3}
              />
            </div>
            <button
              onClick={() => handleBoxChange(Box2Id, box2Data)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Actualizar Box 2
            </button>
          </div>
        </div>

        {/* Box 3 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Box 3</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                value={box3Data.title}
                onChange={(e) =>
                  setBox3Data({ ...box3Data, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 py-2 px-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contenido
              </label>
              <textarea
                value={box3Data.contentText}
                onChange={(e) =>
                  setBox3Data({ ...box3Data, contentText: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 py-2 px-4"
                rows={3}
              />
            </div>
            <button
              onClick={() => handleBoxChange(Box3Id, box3Data)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Actualizar Box 3
            </button>
          </div>
        </div>
      </div>

      {/* Modal para el cropper */}
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
              aspect={3 / 4}
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
                step={0.1}
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
    </section>
  );
};

export default SinFoto02BO;