"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import Modal from "@/components/Modals/ModalSeo";
import { getCroppedImg } from "@/lib/cropImage";

const Mailing: React.FC = () => {
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [footerImage, setFooterImage] = useState<string | null>(null);
  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
  const [footerImageFile, setFooterImageFile] = useState<File | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageType, setCurrentImageType] = useState<"header" | "footer">(
    "header"
  );

  const fetchBannerData = async () => {
    try {
      setIsLoading(true);
      const token = getCookie("AdminTokenAuth");
      const headerId = `${process.env.NEXT_PUBLIC_HEADER_ID_BANNER}`;
      const footerId = `${process.env.NEXT_PUBLIC_FOOTER_ID_BANNER}`;

      const headerResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${headerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const footerResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${footerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setHeaderImage(headerResponse.data.bannerImages[0].mainImage.url);
      setFooterImage(footerResponse.data.bannerImages[0].mainImage.url);
    } catch (error) {
      console.error("Error al obtener los banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>,
    imageType: "header" | "footer"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageToCrop(result); // Asignar la imagen que se va a recortar
        setImageFile(file); // Guardar el archivo de la imagen en el estado
        setCurrentImageType(imageType); // Establecer el tipo de imagen (header o footer)
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
    if (!imageToCrop) return;

    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        initialQuality: 0.8,
      };
      const compressedFile = await imageCompression(
        croppedImage as File,
        options
      );
      const base64 = await convertToBase64(compressedFile);

      if (currentImageType === "header") {
        setHeaderImage(base64);
        setHeaderImageFile(compressedFile);
      } else if (currentImageType === "footer") {
        setFooterImage(base64);
        setFooterImageFile(compressedFile);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al recortar/comprimir la imagen:", error);
    }
  };

  const convertToBase64 = (file: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleClearImage = (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    setImage(null);
    setImageFile(null);
  };

  const handleSubmit = async (
    e: React.FormEvent,
    image: string | null,
    bannerId: string,
    imageFile: File | null,
    isFooter: boolean
  ) => {
    e.preventDefault();
    if (!image || !imageFile) return;

    try {
      setIsLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerImageId = isFooter
        ? `${process.env.NEXT_PUBLIC_FOOTER_IDIMG_BANNER}`
        : `${process.env.NEXT_PUBLIC_HEADER_IDIMG_BANNER}`;

      // Datos requeridos por la API, con valores por defecto para los campos que no usas activamente
      const updatedData = {
        title: "Lorem Ipsum", // Valor predeterminado
        landingText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", // Valor predeterminado
        buttonLink: "#", // Valor predeterminado (un enlace vacío o el que prefieras)
        buttonText: "Click here", // Valor predeterminado
        orderNumber: 1, // Orden predeterminado, ajusta según tu lógica si es necesario
        mainImageLink: "#", // Enlace de la imagen, lo puedes dejar como "#"
        mainImage: {
          name: "imageFile", // Nombre real de la imagen
          type: imageFile.type, // Tipo de imagen real
          size: imageFile.size, // Tamaño real de la imagen
          data: image, // Imagen en base64
        },
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${bannerImageId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchBannerData(); // Refrescar los datos después de la actualización
    } catch (error) {
      console.error("Error actualizando el banner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="mailing"
      className="w-full p-10"
    >
      <div className="flex flex-col gap-8">



        <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Header Banner</div>
          <div>/ Mailing</div>
        </div>
        <div>
          {headerImage && (
            <div className="flex justify-center mb-4">
              <img
                src={headerImage}
                alt="Header Banner Preview"
                className="w-[1000px] h-[250px] object-cover"
              />
            </div>
          )}
          <form
            onSubmit={(e) =>
              handleSubmit(
                e,
                headerImage,
                process.env.NEXT_PUBLIC_HEADER_ID_BANNER || "",
                headerImageFile,
                false // Para header
              )
            }
          >
            <div className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                id="headerImage"
                className="hidden"
                onChange={(e) =>
                  handleImageChange(
                    e,
                    setHeaderImage,
                    setHeaderImageFile,
                    "header"
                  )
                }
              />
              <label
                htmlFor="headerImage"
                className="border-primary shadow flex mt-3 flex-col bg-white justify-center items-center pt-5 pb-6 border border-dashed cursor-pointer w-full z-10 flex-1"
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
                  <p className="mb-2 text-sm text-gray-500">Subir Imagen</p>
                  <p className="text-xs text-gray-500">PNG, JPG o Webp (800x800px)</p>
                </div>
              </label>
              {headerImage && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="shadow bg-primary hover:bg-secondary w-full uppercase text-secondary hover:text-primary font-bold py-2 px-4 rounded mt-6"
                >
                  {isLoading ? "Loading..." : "Actualizar Header"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>



        <div
        className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Footer Banner</div>
          <div>/ Mailing</div>
        </div>
        <div>
          {footerImage && (
            <div className="flex justify-center mb-4">
              <img
                src={footerImage}
                alt="Footer Banner Preview"
                className="w-[1000px] h-[250px] object-cover"
              />
            </div>
          )}
          <form
            onSubmit={(e) =>
              handleSubmit(
                e,
                footerImage,
                process.env.NEXT_PUBLIC_FOOTER_ID_BANNER || "",
                footerImageFile,
                true // Para footer
              )
            }
          >
            <div className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                id="footerImage"
                className="hidden"
                onChange={(e) =>
                  handleImageChange(
                    e,
                    setFooterImage,
                    setFooterImageFile,
                    "footer"
                  )
                }
              />
              <label
                htmlFor="footerImage"
                className="border-primary shadow flex mt-3 flex-col bg-white justify-center items-center pt-5 pb-6 border border-dashed cursor-pointer w-full z-10 flex-1"
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
                      d="M12 6v6m0 0v6m-6-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">Subir Imagen</p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG o Webp (800x800px)
                  </p>
                </div>
              </label>
              {footerImage && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="shadow bg-primary hover:bg-secondary w-full uppercase text-secondary hover:text-primary font-bold py-2 px-4 rounded mt-6"
                >
                  {isLoading ? "Loading..." : "Actualizar Footer"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>



      </div>

      {isModalOpen && (
        <Modal
          showModal={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="relative h-96 w-full">
            <Cropper
              image={imageToCrop || ""}
              crop={crop}
              zoom={zoom}
              aspect={4 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
          <div className="flex justify-end mt-4 space-x-4">
            <button
              onClick={handleCrop}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Recortar y Subir
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default Mailing;
