"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, ChangeEvent, useRef } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import imageCompression from "browser-image-compression";
import Modal from "@/components/Core/Modals/ModalSeo";
import { getCroppedImg } from "@/lib/cropImage";
import { useLogo } from "@/context/LogoContext";

interface UpdatedData {
  title: string;
  landingText: string;
  buttonText: string;
  buttonLink: string;
  mainImageLink: string;
  orderNumber: number;
  mainImage?: {
    name: string;
    type: string;
    size: number;
    data: string;
  };
}

interface LogoEditProps {
  onClose?: () => void;
}

const LogoEdit: React.FC<LogoEditProps> = ({ onClose }) => {
  const [logoData, setLogoData] = useState<any | null>(null);
  const [mainImageLogo, setMainImageLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formDataHero, setFormDataHero] = useState<any>({
    title: "Logo Principal",
    landingText: "Logo Principal",
    buttonText: "Logo Principal",
    buttonLink: "Logo Principal",
    mainImageLink: "Logo Principal",
    orderNumber: 1,
  });
  const { refreshLogo } = useLogo();

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchLogoData = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_LOGOEDIT_ID}`;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const bannerImage = response.data.bannerImages;
      setLogoData(bannerImage);
      
      // Actualizar el estado formDataHero con los datos del logo
      if (bannerImage && bannerImage.length > 0) {
        setFormDataHero({
          title: bannerImage[0].title || "Logo Principal",
          landingText: bannerImage[0].landingText || "Logo Principal",
          buttonText: bannerImage[0].buttonText || "Logo Principal",
          buttonLink: bannerImage[0].buttonLink || "Logo Principal",
          mainImageLink: bannerImage[0].mainImageLink || "Logo Principal",
          orderNumber: 1,
        });
      }
    } catch (error) {
      console.error("Error al obtener el logo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogoData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_LOGOEDIT_ID}`;
      const bannerImageId = `${process.env.NEXT_PUBLIC_LOGOEDIT_IMGID}`;

      // Crear un objeto de datos actualizado basado en formDataHero
      const updatedData: UpdatedData = {
        ...formDataHero,
      };

      // Si hay una imagen seleccionada, incluirla en los datos
      if (mainImageLogo) {
        // Obtener el tamaño real de la imagen en base64
        const base64Size = Math.ceil((mainImageLogo.length * 3) / 4);
        
        updatedData.mainImage = {
          name: "logoIMG",
          type: "image/png",
          size: base64Size,
          data: mainImageLogo,
        };
      }

      // Enviar los datos actualizados al servidor
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

      // Revalidar la caché para que se actualice el logo en el frontend
      await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: `/api/v1/banners/${bannerId}`,
        }),
      });

      // Volver a obtener los datos del logo
      fetchLogoData();
      
      // Actualizar el logo en el contexto global
      await refreshLogo();
      
      // Cerrar el modal después de guardar
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error al actualizar el logo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    imageKey: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        
        // Comprimir la imagen directamente
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.8,
          fileType: 'image/png'
        });

        // Convertir el archivo comprimido a base64
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          const imageInfo = {
            name: "logoIMG",
            type: "image/png",
            size: compressedFile.size,
            data: base64,
          };

          setMainImageLogo(base64);
          setFormDataHero((prevFormDataHero: any) => ({
            ...prevFormDataHero,
            mainImage: imageInfo,
          }));
        };
      } catch (error) {
        console.error('Error al procesar la imagen:', error);
      } finally {
        setLoading(false);
      }
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
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setImage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormDataHero({ ...formDataHero, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div role="status" className="flex flex-col items-center gap-4">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin fill-primary"
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
          <span className="text-sm text-gray-500">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <section
      id="banner"
      className="w-full"
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Cambiar Logo Principal
      </h2>        </div>

        {logoData && (
          <div className="flex flex-col items-center py-4">
            <div className="mb-4">
              <img
                src={logoData[0].mainImage.url}
                alt="Logo Principal"
                className="w-[150px] h-[150px] object-contain border border-gray-200 rounded-md"
              />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Este es el logo actual que se muestra en el sitio web
            </p>
            <div
              className="mb-4 flex items-center rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800"
              role="alert"
            >
              <svg
                className="me-3 inline h-4 w-4 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium"></span>{" "}
                Recuerda subir un archivo PNG para que el logo se vea correctamente.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-4 mx-auto">
          <input
            type="number"
            name="orderNumber"
            value={formDataHero.orderNumber}
            onChange={handleChange}
            className="hidden w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
          />

          <div>
            <input
              type="file"
              accept="image/*"
              id="mainImage"
              className="hidden"
              onChange={(e) => handleImageChange(e, setMainImageLogo, "mainImage")}
            />
            {mainImageLogo ? (
              <div className="flex flex-col items-center mt-3 relative">
                <h4 className="font-normal text-primary text-center text-slate-600 w-full">
                  Tu logo{" "}
                  <span className="text-dark">
                    {formDataHero.mainImage?.name || "logo.png"}
                  </span>{" "}
                  ya ha sido cargado.
                  <br /> Actualiza para ver los cambios.
                </h4>

                <button
                  className="bg-red-500 gap-4 flex item-center justify-center px-4 py-2 hover:bg-red-700 text-white rounded-full text-xs mt-4"
                  onClick={() => handleClearImage(setMainImageLogo)}
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
                  Logo <span className="text-primary">*</span>
                </h3>
                <label
                  htmlFor="mainImage"
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
                      <span className="font-semibold">Subir Logo</span>
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
                fill="currentColor"
              />
            </svg>
            {loading ? "Cargando..." : "Actualizar Logo"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LogoEdit;
