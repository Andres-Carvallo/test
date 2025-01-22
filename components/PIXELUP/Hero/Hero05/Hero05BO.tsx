/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { getCroppedImg } from "@/lib/cropImage";
import Modal from "@/components/Core/Modals/ModalSeo";
import Cropper from "react-easy-crop";

interface ContentData {
  id: string;
  title: string;
  landingText: string;
  buttonText: string;
  buttonLink: string;
  mainImageLink: string;
  orderNumber: number;
  mainImage: {
    name: string;
    type: string;
    size: number | null;
    data: string;
  };
}

interface AdditionalData {
  subtitle: string;
  newServiceTitle: string;
  newServiceSubtitle: string;
  newServiceDescription: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ color: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
  "color",
];

const Hero05BO: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentData>({
    id: "",
    title: "",
    landingText: "",
    buttonText: "",
    buttonLink: "",
    mainImageLink: "",
    orderNumber: 1,
    mainImage: {
      name: "",
      type: "",
      size: null,
      data: "",
    },
  });

  const [additionalData, setAdditionalData] = useState<AdditionalData>({
    subtitle: "Peluquería canina de especialidad",
    newServiceTitle: "Spa Day Canino",
    newServiceSubtitle: "NUEVO",
    newServiceDescription: "Incluye baño relajante y masaje",
    primaryButtonText: "Reserva tu cita",
    secondaryButtonText: "Nuestros servicios"
  });

  const [mainImage, setMainImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Estados para el cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isMainImageUploaded, setIsMainImageUploaded] = useState(false);

  const prepareDataForSubmit = () => {
    console.log("Preparing data for submit");
    console.log("Current content state:", content);
    console.log("Current mainImage:", content.mainImage);

    const dataToSubmit = {
      ...content,
      buttonText: JSON.stringify(additionalData),
    };

    console.log("Data prepared for submit:", dataToSubmit);
    return dataToSubmit;
  };

  const parseReceivedData = (data: any) => {
    const parsedContent = {
      ...data,
      buttonText: "",
    };

    try {
      const additionalInfo = JSON.parse(data.buttonText);
      setAdditionalData({
        subtitle: additionalInfo.subtitle || "Peluquería canina de especialidad",
        newServiceTitle: additionalInfo.newServiceTitle || "Spa Day Canino",
        newServiceSubtitle: additionalInfo.newServiceSubtitle || "NUEVO",
        newServiceDescription: additionalInfo.newServiceDescription || "Incluye baño relajante y masaje",
        primaryButtonText: additionalInfo.primaryButtonText || "Reserva tu cita",
        secondaryButtonText: additionalInfo.secondaryButtonText || "Nuestros servicios"
      });
    } catch (e) {
      console.error("Error parsing additional data:", e);
      // Mantener valores por defecto
    }

    setContent({
      ...parsedContent,
      title: parsedContent.title || "Rosamonte, el lugar indicado para el cuidado de tu mascota",
      landingText: parsedContent.landingText || "Un lugar donde pueden estar seguros de que nosotras amaremos y respetaremos a tu perrin...",
      buttonLink: parsedContent.buttonLink || "/servicios",
      mainImageLink: parsedContent.mainImageLink || "",
      orderNumber: parsedContent.orderNumber || 1,
      mainImage: {
        name: parsedContent.mainImage?.name || "",
        type: parsedContent.mainImage?.type || "",
        size: parsedContent.mainImage?.size || null,
        data: parsedContent.mainImage?.data || "",
      },
    });
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_PROPUESTA_VALOR_ID}`;

      // Obtener contenido general
      const contentResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (contentResponse.data?.banner) {
        parseReceivedData(contentResponse.data.banner);
      }

      // Obtener imagen
      try {
        const imageId = `${process.env.NEXT_PUBLIC_PROPUESTA_VALOR_IMGID}`;
        const imageResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${imageId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const mainImage = imageResponse.data?.bannerImage?.mainImage;

        if (mainImage) {
          setContent((prev) => ({
            ...prev,
            mainImage: {
              name: mainImage.name || "",
              type: mainImage.type || "",
              size: mainImage.size || null,
              data: mainImage.url || mainImage.data || "",
            },
          }));
          setMainImage(mainImage.url || mainImage.data || "");
        }
      } catch (imageError) {
        console.error("Error al obtener la imagen:", imageError);
      }
    } catch (error) {
      console.error("Error al obtener el contenido:", error);
      toast.error("Error al cargar el contenido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_PROPUESTA_VALOR_ID}`;
      const imageId = `${process.env.NEXT_PUBLIC_PROPUESTA_VALOR_IMGID}`;

      // Aseguramos la estructura correcta pero manteniendo valores existentes
      const defaultData = {
        title: content.title || "Rosamonte, el lugar indicado para el cuidado de tu mascota",
        landingText: content.landingText || "Un lugar donde pueden estar seguros de que nosotras amaremos y respetaremos a tu perrin...",
        buttonText: JSON.stringify({
          subtitle: additionalData.subtitle || "Peluquería canina de especialidad",
          newServiceTitle: additionalData.newServiceTitle || "Spa Day Canino",
          newServiceSubtitle: additionalData.newServiceSubtitle || "NUEVO",
          newServiceDescription: additionalData.newServiceDescription || "Incluye baño relajante y masaje",
          primaryButtonText: additionalData.primaryButtonText || "Reserva tu cita",
          secondaryButtonText: additionalData.secondaryButtonText || "Nuestros servicios"
        }),
        buttonLink: content.buttonLink || "/servicios",
        mainImageLink: content.mainImageLink || "",
        orderNumber: content.orderNumber || 1,
      };

      // Enviamos los datos con la estructura asegurada
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        defaultData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Si hay una imagen en el estado (nueva o existente), la actualizamos
      if (content.mainImage?.data) {
        const imageData = {
          title: "Imagen Propuesta Valor",
          landingText: "Imagen Propuesta Valor",
          buttonText: "Imagen",
          buttonLink: "https://www.lafuentedebelleza.cl",
          orderNumber: 1,
          mainImageLink: "https://www.lafuentedebelleza.cl",
          mainImage: content.mainImage,
        };

        console.log("Enviando imagen:", imageData);

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${imageId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Recargamos el contenido
      await fetchContent();
      toast.success("Todos los cambios guardados exitosamente");
    } catch (error) {
      console.error("Error al actualizar el contenido:", error);
      toast.error("Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      toast.error("Error al procesar la imagen");
    }
  };

  const handleCropComplete = (
    croppedArea: any,
    croppedAreaPixels: CropArea
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    try {
      if (!tempImage || !croppedAreaPixels) return;

      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
      if (!croppedImage) return;

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

      setContent((prev) => ({
        ...prev,
        mainImage: {
          name: compressedFile.name || "imagen.jpg",
          type: compressedFile.type || "image/jpeg",
          size: compressedFile.size,
          data: base64,
        },
      }));
      setMainImage(base64);

      setIsModalOpen(false);
      setTempImage(null);
      toast.success("Imagen procesada correctamente");
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      toast.error("Error al procesar la imagen");
    }
  };

  const convertToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-12">
      <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
      
      {/* Vista previa del Hero Section */}
      <section className="py-24 bg-white border rounded-lg mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-4">
              <div>
                <span className="text-[#81C4BA] text-sm uppercase tracking-widest mb-4 block">
                  {additionalData.subtitle}
                </span>
                <h1 className="text-6xl font-light text-[#877EB6] leading-12">
                  {content.title}
                </h1>
              </div>
              <p className="text-lg text-gray-600">
                {content.landingText}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#81C4BA] text-white px-8 py-4 rounded hover:bg-[#1B9C84] transition-all">
                  {additionalData.primaryButtonText}
                </button>
                <button className="border-2 border-[#81C4BA] text-[#81C4BA] px-8 py-4 rounded hover:bg-[#81C4BA] hover:text-white transition-all">
                  {additionalData.secondaryButtonText}
                </button>
              </div>
            </div>

            <div className="relative">
              <img
                src={mainImage || content.mainImage.data || "https://placedog.net/800/600"}
                alt="Imagen principal"
                className="rounded shadow-xl w-full h-auto"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded shadow-lg max-w-[200px]">
                <span className="text-[#81C4BA] text-sm font-medium">
                  {additionalData.newServiceSubtitle}
                </span>
                <h3 className="text-[#877EB6] font-medium mt-2">
                  {additionalData.newServiceTitle}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {additionalData.newServiceDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <h3 className="text-lg font-semibold mb-4">Editar Hero Section</h3>
      
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtítulo Superior
          </label>
          <input
            type="text"
            value={additionalData.subtitle}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, subtitle: e.target.value })
            }
            className="shadow block w-full px-4 py-3 border border-gray-300 rounded-md"
            placeholder="Peluquería canina de especialidad"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título Principal
          </label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="shadow block w-full px-4 py-3 border border-gray-300 rounded-md"
            placeholder="Título principal..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Principal
          </label>
          <textarea
            value={content.landingText}
            onChange={(e) => setContent({ ...content, landingText: e.target.value })}
            className="shadow block w-full px-4 py-3 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Descripción principal..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto Botón Principal
            </label>
            <input
              type="text"
              value={additionalData.primaryButtonText}
              onChange={(e) => setAdditionalData({ ...additionalData, primaryButtonText: e.target.value })}
              className="shadow block w-full px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto Botón Secundario
            </label>
            <input
              type="text"
              value={additionalData.secondaryButtonText}
              onChange={(e) => setAdditionalData({ ...additionalData, secondaryButtonText: e.target.value })}
              className="shadow block w-full px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiqueta "Nuevo"
            </label>
            <input
              type="text"
              value={additionalData.newServiceSubtitle}
              onChange={(e) => setAdditionalData({ ...additionalData, newServiceSubtitle: e.target.value })}
              className="shadow block w-full px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título Servicio Nuevo
            </label>
            <input
              type="text"
              value={additionalData.newServiceTitle}
              onChange={(e) => setAdditionalData({ ...additionalData, newServiceTitle: e.target.value })}
              className="shadow block w-full px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Servicio Nuevo
            </label>
            <input
              type="text"
              value={additionalData.newServiceDescription}
              onChange={(e) => setAdditionalData({ ...additionalData, newServiceDescription: e.target.value })}
              className="shadow block w-full px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen Principal
          </label>
          <div className="mt-1 flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Seleccionar Imagen
            </button>
            {(mainImage || content.mainImage?.data) && (
              <div className="relative w-32 h-32">
                <img
                  src={mainImage || content.mainImage?.data}
                  alt="Vista previa"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMainImage(null);
                    setContent({
                      ...content,
                      mainImage: {
                        name: "",
                        type: "",
                        size: null,
                        data: "",
                      },
                    });
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="shadow bg-primary hover:bg-secondary w-full uppercase text-white font-bold py-2 px-4 rounded flex-wrap mt-6"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>

      {/* Modal de recorte de imagen */}
      {isModalOpen && (
        <Modal
          showModal={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Recortar Imagen"
        >
          <div className="relative w-full h-[60vh]">
            <Cropper
              image={tempImage || ""}
              crop={crop}
              zoom={zoom}
              aspect={560 / 500}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleCrop}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
            >
              Recortar y Guardar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Hero05BO;