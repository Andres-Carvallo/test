"use client";
import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import Modal from "@/components/Core/Modals/ModalSeo";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import imageCompression from "browser-image-compression";
import { PIXELUPComponents } from "@/app/config/componentEnums";
import { useComponentId } from "@/hooks/useComponentId";

const ContactForm01BO: React.FC = () => {
  // Obtener los IDs usando hooks en el nivel superior
  const bannerId = useComponentId(
    PIXELUPComponents.CONTACT_FORM_BANNER,
    'NEXT_PUBLIC_CONTACT_FORM_BANNER_ID'
  );
  const bannerImageId = useComponentId(
    PIXELUPComponents.CONTACT_FORM_BANNER_IMG,
    'NEXT_PUBLIC_CONTACT_FORM_BANNER_IMGID'
  );

  const [formData, setFormData] = useState<any>({
    formTitle: "Envíanos un mensaje",
    submitButtonText: "Enviar mensaje",
    showContactInfo: true,
    contactInfoTitle: "Información de contacto",
    email: "contacto@casarenteria.cl",
    phone: "+56 9 7533 0640",
    emailLabelInfo: "Email",
    phoneLabelInfo: "Teléfono"
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [bannerData, setBannerData] = useState<any | null>(null);
  const [mainImageHero, setMainImageHero] = useState<string | null>(null);
  const [isMainImageUploaded, setIsMainImageUploaded] = useState(false);
  
  // States for image cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalFileName, setOriginalFileName] = useState<string>("");

  // Función para cargar la configuración actual
  const fetchContactConfig = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      
      if (!bannerId || !bannerImageId) {
        throw new Error('No se pudieron obtener los IDs necesarios para cargar el banner');
      }

      console.log(`🔍 Obteniendo datos del banner del formulario de contacto con IDs: Banner=${bannerId}, Image=${bannerImageId}`);

      const productTypeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const bannerImage = productTypeResponse.data.bannerImages;
      setBannerData(bannerImage);
      
      // Intentar extraer la configuración del JSON en landingText
      let extractedConfig = {
        formTitle: "Envíanos un mensaje",
        submitButtonText: "Enviar mensaje",
        showContactInfo: true,
        contactInfoTitle: "Información de contacto",
        email: "contacto@casarenteria.cl",
        phone: "+56 9 7533 0640",
        emailLabelInfo: "Email",
        phoneLabelInfo: "Teléfono"
      };

      try {
        if (
          bannerImage[0].landingText &&
          bannerImage[0].landingText.trim().startsWith("{")
        ) {
          const parsedConfig = JSON.parse(bannerImage[0].landingText);
          if (parsedConfig && typeof parsedConfig === "object") {
            extractedConfig = parsedConfig;
          }
        }
      } catch (error) {
        console.error("Error al parsear la configuración JSON:", error);
      }

      setFormData(extractedConfig);

      // Establecer la imagen si existe
      if (bannerImage[0]?.mainImage?.url) {
        setMainImageHero(bannerImage[0].mainImage.url);
      }
    } catch (error) {
      console.error("Error al cargar la configuración del formulario de contacto:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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
        maxSizeMB: 1, // Ajusta el tamaño máximo permitido
        maxWidthOrHeight: 1900, // Ajusta las dimensiones máximas permitidas
        useWebWorker: true,
        initialQuality: 0.9, // Ajusta la calidad inicial para mantener mejor calidad visual
      };
      const compressedFile = await imageCompression(
        croppedImage as File,
        options
      );
      const base64 = await convertToBase64(compressedFile);

      const imageInfo = {
        name: "contactFormIMG",
        type: compressedFile.type,
        size: compressedFile.size,
        data: base64,
      };
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        mainImage: imageInfo,
      }));
      setMainImageHero(base64);
      setIsModalOpen(false);
      setIsMainImageUploaded(true);
    } catch (error) {
      console.error("Error al recortar/comprimir la imagen:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = getCookie("AdminTokenAuth");
      
      if (!bannerId || !bannerImageId) {
        throw new Error('No se pudieron obtener los IDs necesarios para actualizar el banner');
      }

      console.log(`🔄 Actualizando banner del formulario de contacto con IDs: Banner=${bannerId}, Image=${bannerImageId}`);

      // Crear un objeto de datos actualizado
      const updatedData: any = {
        title: "Configuración del Formulario de Contacto",
        landingText: JSON.stringify(formData),
        buttonText: formData.submitButtonText || "Enviar mensaje",
        buttonLink: "/contacto",
        mainImageLink: "https://pixelup.cl/default-contact.jpg",
        orderNumber: 1,
      };

      // Si hay una imagen nueva, agregarla al objeto
      if (isMainImageUploaded && formData.mainImage) {
        updatedData.mainImage = formData.mainImage;
      }

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

      toast.success("Configuración guardada exitosamente");
      fetchContactConfig(); // Recargar los datos
      setIsMainImageUploaded(false); // Resetear el estado de la imagen
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      toast.error("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Configuración del Formulario de Contacto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">


          {/* Sección del Formulario */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Formulario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Formulario
                </label>
                <input
                  type="text"
                  name="formTitle"
                  value={formData.formTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Título del formulario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto del Botón de Envío
                </label>
                <input
                  type="text"
                  name="submitButtonText"
                  value={formData.submitButtonText}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Texto del botón"
                />
              </div>

              
            </div>

            
          </div>

          {/* Sección de Información de Contacto */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Información de Contacto</h2>
            <div className="space-y-4">
              <div className="mb-4">
                <label className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">
                    Mostrar información de contacto
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, showContactInfo: !formData.showContactInfo})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.showContactInfo ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.showContactInfo ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
              
              {formData.showContactInfo && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título de la Sección
                    </label>
                    <input
                      type="text"
                      name="contactInfoTitle"
                      value={formData.contactInfoTitle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Título de la sección de información"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de Contacto
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Email de contacto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono de Contacto
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Teléfono de contacto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Etiqueta Email (Info)
                      </label>
                      <input
                        type="text"
                        name="emailLabelInfo"
                        value={formData.emailLabelInfo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Etiqueta para mostrar el email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Etiqueta Teléfono (Info)
                      </label>
                      <input
                        type="text"
                        name="phoneLabelInfo"
                        value={formData.phoneLabelInfo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Etiqueta para mostrar el teléfono"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Carga de imagen */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Imagen del Formulario</h2>
            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-700 mb-2 block">
                  Imagen del formulario
                </label>
                {mainImageHero ? (
                  <div className="flex flex-col gap-2">
                    <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={mainImageHero}
                        alt="Imagen actual"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMainImageHero(null);
                        setIsMainImageUploaded(false);
                      }}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors w-fit"
                    >
                      Cambiar imagen
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                        Seleccionar imagen
                      </p>
                    </div>
                                         <input
                       id="image-upload"
                       type="file"
                       accept="image/*"
                       onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file) {
                           setOriginalFileName(file.name);
                           const reader = new FileReader();
                           reader.onload = () => {
                             setMainImageHero(reader.result as string);
                             setIsModalOpen(true);
                           };
                           reader.readAsDataURL(file);
                         }
                       }}
                       className="hidden"
                     />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* Modal para recortar imagen */}
    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative w-[95%] md:w-[80%] max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Recortar Imagen
              </h2>
            </div>
            <button
              onClick={() => {
                setMainImageHero(null);
                setIsModalOpen(false);
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="relative h-96 w-full">
              <Cropper
                image={mainImageHero || ""}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div className="mt-6 space-y-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoom
                </label>
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCrop}
                  className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Recortar y Continuar
                </button>
                <button
                  onClick={() => {
                    setMainImageHero(null);
                    setIsModalOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default ContactForm01BO;
