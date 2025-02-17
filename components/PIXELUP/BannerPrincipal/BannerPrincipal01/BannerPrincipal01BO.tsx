/* eslint-disable @next/next/no-img-element */
import React, {
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Modal from "@/components/Core/Modals/ModalSeo"; // Asegúrate de importar el modal
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import imageCompression from "browser-image-compression";

interface BannerImage {
  id: string;
  title: string;
  landingText: string;
  buttonLink: string;
  buttonText: string;
  mainImageLink: string;
  orderNumber: number;
  mainImage?: any;
}

interface ButtonTextData {
  price: string;
  value: string;
  show: boolean;
}

// Agregar la interfaz DisplayConfig
interface DisplayConfig {
  text: string;
  showPrice: boolean;
  showValue: boolean;
  showScheduleButton: boolean;
  showDetailsButton: boolean;
}

// Modificar la interfaz BannerData
interface BannerData {
  images: BannerImage[];
}

const BannerPrincipal01BO: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  const [isMainImageUploaded, setIsMainImageUploaded] = useState(false);
  const [isAddingImage, setIsAddingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);
  const [bannerData, setBannerData] = useState<BannerImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [formData, setFormData] = useState<BannerImage>({
    id: "",
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
  const [loading, setLoading] = useState<boolean>(true);
  const [skeletonLoading, setSkeletonLoading] = useState<boolean>(true);
  const [mainImage, setMainImage] = useState<string | null>(null);

  // States for image cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [buttonTextData, setButtonTextData] = useState<ButtonTextData>({
    price: "",
    value: "",
    show: true,
  });

  const [showControlPanel, setShowControlPanel] = useState(true);

  // Agregar estado para la configuración de visualización
  const [displayConfig, setDisplayConfig] = useState<DisplayConfig>({
    text: "",
    showPrice: true,
    showValue: true,
    showScheduleButton: true,
    showDetailsButton: true,
  });

  const parseButtonTextData = (buttonText: string): ButtonTextData => {
    try {
      return JSON.parse(buttonText);
    } catch {
      return { price: buttonText, value: "", show: true };
    }
  };

  const fetchBannerHome = async () => {
    try {
      setLoading(true);
      setSkeletonLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_BANNERPRINCIPAL01_ID}`;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setBannerData(response.data.bannerImages);
      if (response.data.bannerImages.length > 0) {
        const initialImage = response.data.bannerImages[0];

        // Parsear buttonText
        const parsedButtonText = parseButtonTextData(initialImage.buttonText);
        setButtonTextData(parsedButtonText);

        // Parsear landingText
        const parsedLandingText = parseDisplayConfig(initialImage.landingText);
        setDisplayConfig(parsedLandingText);

        setFormData({
          id: initialImage.id,
          title: initialImage.title,
          landingText: initialImage.landingText,
          buttonLink: initialImage.buttonLink,
          buttonText: initialImage.buttonText,
          mainImageLink: initialImage.mainImageLink || "",
          orderNumber: initialImage.orderNumber,
          mainImage: initialImage.mainImage,
        });
        setMainImage(initialImage.mainImage.url || initialImage.mainImage.data);
      }
    } catch (error) {
      console.error("Error al obtener los datos del banner:", error);
    } finally {
      setLoading(false);
      setSkeletonLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name); // Almacena el nombre del archivo
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setMainImage(result);
        setIsMainImageUploaded(true); // Indicar que una nueva imagen ha sido cargada
        setIsModalOpen(true); // Open modal for cropping
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
    if (!mainImage) return;

    try {
      const croppedImage = await getCroppedImg(mainImage, croppedAreaPixels);
      if (!croppedImage) {
        console.error("Error al recortar la imagen: croppedImage es null");
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1900,
        useWebWorker: true,
        initialQuality: 0.95,
      };
      const compressedFile = await imageCompression(
        croppedImage as File,
        options
      );
      const base64 = await convertToBase64(compressedFile);

      const imageInfo = {
        name: fileName, // Usa el nombre del archivo almacenado
        type: compressedFile.type,
        size: compressedFile.size,
        data: base64,
      };

      setFormData((prevFormData) => ({
        ...prevFormData,
        mainImage: imageInfo,
      }));
      setMainImage(base64);
      setIsModalOpen(false);
      setIsMainImageUploaded(true);
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

  const handleClearImage = () => {
    setMainImage(formData.mainImage.url || formData.mainImage.data);
    setIsMainImageUploaded(false); // Reiniciar el estado
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_BANNERPRINCIPAL01_ID}`;

      // Asegurarse de que mainImageLink tenga un valor por defecto si está vacío
      const mainImageLink = formData.mainImageLink || "#";

      // Crear el nuevo objeto landingText
      const newLandingText = JSON.stringify({
        text: displayConfig.text,
        showPrice: displayConfig.showPrice,
        showValue: displayConfig.showValue,
        showScheduleButton: displayConfig.showScheduleButton,
        showDetailsButton: displayConfig.showDetailsButton,
      });

      // Crear el nuevo objeto buttonText
      const newButtonText = JSON.stringify({
        price: buttonTextData.price,
        value: buttonTextData.value,
        show: buttonTextData.show,
      });

      const dataToSend = {
        title: formData.title,
        landingText: newLandingText,
        buttonText: newButtonText,
        buttonLink: formData.buttonLink,
        mainImageLink: mainImageLink, // Usar el valor con el fallback
        orderNumber: formData.orderNumber,
        ...(isMainImageUploaded && { mainImage: formData.mainImage }),
      };

      if (isAddingImage) {
        // Crear nueva imagen
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsAddingImage(false);
      } else {
        // Actualizar imagen existente
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${formData.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          dataToSend,
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

      const bannerId = `${process.env.NEXT_PUBLIC_BANNERPRINCIPAL01_ID}`;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${formData.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
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

  const handleNextImage = async () => {
    setSkeletonLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nextIndex = (currentIndex + 1) % bannerData.length;
    const nextImage = bannerData[nextIndex];

    // Cargar la configuración del siguiente banner
    const nextConfig = parseDisplayConfig(nextImage.landingText);
    setDisplayConfig(nextConfig);

    setCurrentIndex(nextIndex);
    setFormData({
      ...nextImage,
      mainImageLink: nextImage.mainImageLink || "",
    });
    setMainImage(nextImage.mainImage.url || nextImage.mainImage.data);
    setIsMainImageUploaded(false);
    setSkeletonLoading(false);
  };

  const handlePrevImage = async () => {
    setSkeletonLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const prevIndex =
      (currentIndex - 1 + bannerData.length) % bannerData.length;
    const prevImage = bannerData[prevIndex];

    // Cargar la configuración del banner anterior
    const prevConfig = parseDisplayConfig(prevImage.landingText);
    setDisplayConfig(prevConfig);

    setCurrentIndex(prevIndex);
    setFormData({
      ...prevImage,
      mainImageLink: prevImage.mainImageLink || "",
    });
    setMainImage(prevImage.mainImage.url || prevImage.mainImage.data);
    setIsMainImageUploaded(false);
    setSkeletonLoading(false);
  };
  const handleAddImageClick = () => {
    if (isAddingImage) {
      // Si ya estamos en el estado de agregar, esto cancela la operación
      setFormData({
        id: bannerData[currentIndex]?.id || "",
        title: bannerData[currentIndex]?.title || "",
        landingText: bannerData[currentIndex]?.landingText || "",
        buttonLink: bannerData[currentIndex]?.buttonLink || "",
        buttonText: bannerData[currentIndex]?.buttonText || "",
        mainImageLink: bannerData[currentIndex]?.mainImageLink || "",
        orderNumber: bannerData[currentIndex]?.orderNumber || 1,
        mainImage: bannerData[currentIndex]?.mainImage || {
          url: "",
          name: "",
          type: "",
          size: null,
          data: "",
        },
      });
      setMainImage(
        bannerData[currentIndex]?.mainImage?.url ||
          bannerData[currentIndex]?.mainImage?.data ||
          null
      );
      setIsAddingImage(false);
      setIsMainImageUploaded(false);
    } else {
      // Inicializar con valores por defecto para el nuevo banner
      const initialLandingText = JSON.stringify({
        text: "",
        showPrice: true,
        showValue: true,
        showScheduleButton: true,
        showDetailsButton: true,
      });

      const initialButtonText = JSON.stringify({
        price: "",
        value: "",
        show: true,
      });

      setFormData({
        id: "",
        title: "",
        landingText: initialLandingText,
        buttonLink: "",
        buttonText: initialButtonText,
        mainImageLink: "#", // Establecer un valor por defecto
        orderNumber: 1,
        mainImage: {
          url: "",
          name: "",
          type: "",
          size: null,
          data: "",
        },
      });

      // Establecer la configuración inicial de visualización
      setDisplayConfig({
        text: "",
        showPrice: true,
        showValue: true,
        showScheduleButton: true,
        showDetailsButton: true,
      });

      // Establecer la configuración inicial del botón
      setButtonTextData({
        price: "",
        value: "",
        show: true,
      });

      setMainImage(null);
      setIsAddingImage(true);
      fileInputRef.current?.click();
      setIsMainImageUploaded(false);
    }
  };

  const handleButtonTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setButtonTextData((prev) => {
      const newData = { ...prev, [name]: value };
      // Actualizar formData.buttonText con el nuevo JSON
      setFormData((prevForm) => ({
        ...prevForm,
        buttonText: JSON.stringify(newData),
      }));
      return newData;
    });
  };

  const SkeletonLoader = () => (
    <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-30 before:z-10">
      <div className="absolute inset-0 w-full h-full bg-gray-100 animate-pulse" />
      <div className="min-h-[300px] relative z-20 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
        <div className="w-1/2 h-6 bg-gray-500 animate-pulse mb-2 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-500 animate-pulse rounded"></div>
      </div>
    </div>
  );

  // Modificar la función parseDisplayConfig
  const parseDisplayConfig = (landingText: string): DisplayConfig => {
    try {
      // Si es un string JSON, intentar parsearlo
      if (typeof landingText === "string") {
        let parsed = JSON.parse(landingText);

        // Si el texto también es un JSON anidado, parsearlo también
        if (typeof parsed.text === "string" && parsed.text.startsWith("{")) {
          const nestedParsed = JSON.parse(parsed.text);
          parsed = {
            ...parsed,
            text: nestedParsed.text || "",
          };
        }

        return {
          text: parsed.text || "",
          showPrice: parsed.showPrice ?? true,
          showValue: parsed.showValue ?? true,
          showScheduleButton: parsed.showScheduleButton ?? true,
          showDetailsButton: parsed.showDetailsButton ?? true,
        };
      }
      return {
        text: landingText,
        showPrice: true,
        showValue: true,
        showScheduleButton: true,
        showDetailsButton: true,
      };
    } catch {
      return {
        text: landingText,
        showPrice: true,
        showValue: true,
        showScheduleButton: true,
        showDetailsButton: true,
      };
    }
  };

  // Modificar la función updateDisplayConfig
  const updateDisplayConfig = async (updates: Partial<DisplayConfig>) => {
    try {
      // Actualizar el estado local inmediatamente
      const newDisplayConfig = { ...displayConfig, ...updates };
      setDisplayConfig(newDisplayConfig);

      // Si estamos en modo de creación (isAddingImage es true),
      // solo actualizamos el estado local y el formData
      if (isAddingImage) {
        const newLandingText = JSON.stringify({
          text: newDisplayConfig.text,
          showPrice: newDisplayConfig.showPrice,
          showValue: newDisplayConfig.showValue,
          showScheduleButton: newDisplayConfig.showScheduleButton,
          showDetailsButton: newDisplayConfig.showDetailsButton,
        });

        setFormData((prev) => ({
          ...prev,
          landingText: newLandingText,
        }));

        return; // No hacemos la llamada al API si estamos creando
      }

      // Si estamos editando, continuamos con la actualización en el servidor
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_BANNERPRINCIPAL01_ID}`;

      // Obtener la configuración actual del banner específico
      const currentBannerImage = bannerData[currentIndex];
      const currentConfig = parseDisplayConfig(currentBannerImage.landingText);

      // Crear el nuevo objeto landingText manteniendo el texto actual
      const newLandingText = JSON.stringify({
        text: currentConfig.text,
        showPrice: newDisplayConfig.showPrice,
        showValue: newDisplayConfig.showValue,
        showScheduleButton: newDisplayConfig.showScheduleButton,
        showDetailsButton: newDisplayConfig.showDetailsButton,
      });

      // Preparar datos para enviar
      const dataToSend = {
        title: formData.title,
        landingText: newLandingText,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        mainImageLink: formData.mainImageLink,
        orderNumber: formData.orderNumber,
      };

      // Enviar actualización al servidor
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${formData.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Actualizar el estado local de formData
      setFormData((prev) => ({
        ...prev,
        landingText: newLandingText,
      }));

      // Actualizar el estado local de bannerData
      setBannerData((prev) =>
        prev.map((image, index) =>
          index === currentIndex
            ? { ...image, landingText: newLandingText }
            : image
        )
      );
    } catch (error) {
      console.error("Error al actualizar la configuración:", error);
    }
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
    <div className="relative">
      {/* Resto del contenido del BO */}
      <section
        id="banner"
        className="w-full"
      >
        {skeletonLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={mainImage || formData.mainImage.url}
                alt="Banner Image"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-4">
              <div className="flex flex-col justify-center h-full max-w-2xl items-start text-left">
                <span className="text-[#81C4BA] text-sm uppercase tracking-widest mb-4">
                  {formData.buttonLink}
                </span>
                <h2 className="text-5xl md:text-7xl text-white font-light mb-6 leading-tight">
                  {formData.title}
                </h2>
                <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
                  {displayConfig.text}
                </p>

                {/* Mostrar precio y valor según la configuración */}
                {buttonTextData.show &&
                  (displayConfig.showPrice || displayConfig.showValue) && (
                    <div className="flex items-center gap-4 mb-8">
                      {displayConfig.showPrice && (
                        <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded text-sm">
                          {buttonTextData.price}
                        </span>
                      )}
                      {displayConfig.showValue && (
                        <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded text-sm">
                          {buttonTextData.value}
                        </span>
                      )}
                    </div>
                  )}

                {/* Mostrar botones según la configuración */}
                <div className="flex flex-wrap gap-4">
                  {displayConfig.showScheduleButton && (
                    <div className="bg-[#5B488E] text-white px-8 py-4 rounded hover:bg-[#1B9C84] transition-all">
                      Agenda tu hora
                    </div>
                  )}
                  {displayConfig.showDetailsButton && (
                    <div className="bg-white/10 text-white border-2 border-white px-8 py-4 rounded hover:bg-white/20 transition-all backdrop-blur-sm">
                      Ver detalles
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              {bannerData.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded transition-colors ${
                    index === currentIndex
                      ? "w-16 bg-white"
                      : "w-8 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            {bannerData.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center z-10">
                <button
                  onClick={handlePrevImage}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleAddImageClick}
            className={`shadow w-full uppercase text-white font-bold py-2 px-4 rounded flex-wrap ${
              isAddingImage
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isAddingImage ? "Cancelar" : "Agregar Banner"}
          </button>

          {bannerData.length > 1 && (
            <button
              type="button"
              onClick={handleDeleteImage}
              className="shadow bg-red-600 hover:bg-red-700 w-full uppercase text-white font-bold py-2 px-4 rounded flex-wrap ml-4"
            >
              Borrar Imagen
            </button>
          )}
        </div>
        {/* Panel de control de visibilidad */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-medium mb-4">
            Controles de visualización
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Mostrar precio</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={displayConfig.showPrice}
                  onChange={(e) =>
                    updateDisplayConfig({ showPrice: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Mostrar valor</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={displayConfig.showValue}
                  onChange={(e) =>
                    updateDisplayConfig({ showValue: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                Mostrar botón &quot;Agenda tu hora&quot;
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={displayConfig.showScheduleButton}
                  onChange={(e) =>
                    updateDisplayConfig({
                      showScheduleButton: e.target.checked,
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                Mostrar botón &quot;Ver detalles&quot;
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={displayConfig.showDetailsButton}
                  onChange={(e) =>
                    updateDisplayConfig({ showDetailsButton: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-4 mx-auto mt-8"
        >
          <h3 className="font-normal text-primary">
            Epígrafe <span className="text-primary">*</span>
          </h3>
          <input
            type="text"
            name="buttonLink"
            value={formData.buttonLink}
            onChange={handleChange}
            className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300 rounded-md"
            placeholder="Epígrafe"
          />
          <h3 className="font-normal text-primary">
            Título <span className="text-primary">*</span>
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
            value={displayConfig.text}
            onChange={(e) => {
              const newText = e.target.value;
              setDisplayConfig((prev) => ({
                ...prev,
                text: newText,
              }));

              // Actualizar formData con el nuevo JSON
              setFormData((prev) => ({
                ...prev,
                landingText: JSON.stringify({
                  text: newText,
                  showPrice: displayConfig.showPrice,
                  showValue: displayConfig.showValue,
                  showScheduleButton: displayConfig.showScheduleButton,
                  showDetailsButton: displayConfig.showDetailsButton,
                }),
              }));
            }}
            className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300 rounded-md"
            placeholder="Landing Text"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-normal text-primary">
                Texto precio <span className="text-primary">*</span>
              </h3>
              <input
                type="text"
                name="price"
                value={buttonTextData.price}
                onChange={handleButtonTextChange}
                className="shadow block w-full px-4 py-3 mb-4 mt-2 border border-gray-300 rounded-md"
                placeholder="Desde $"
              />
            </div>
            <div>
              <h3 className="font-normal text-primary">
                Texto Valor <span className="text-primary">*</span>
              </h3>
              <input
                type="text"
                name="value"
                value={buttonTextData.value}
                onChange={handleButtonTextChange}
                className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300 rounded-md"
                placeholder="x tiempo aprox."
              />
            </div>
          </div>
          {/*           <h3 className="font-normal text-primary">
            Link Botón (Ver detalles) <span className="text-primary">*</span>
          </h3>
          <div className="relative">
            <input
              type="text"
              name="mainImageLink"
              value={formData.mainImageLink.replace(/^https?:\/\/(www\.)?/, '')}
              onChange={(e) => {
                let value = e.target.value.trim();
                
                // Eliminar cualquier http:// o https:// existente
                value = value.replace(/^https?:\/\/(www\.)?/, '');
                
                // Agregar https://www. si el valor no está vacío
                if (value) {
                  value = `https://www.${value}`;
                }
                
                setFormData(prev => ({
                  ...prev,
                  mainImageLink: value
                }));
              }}
              className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Ej: google.cl o www.google.cl"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se agregará automáticamente https://www.
            </p>
          </div> */}
          <div>
            <input
              type="file"
              accept="image/*"
              id="mainImage"
              className="hidden"
              ref={fileInputRef} // Asigna la referencia al input
              onChange={handleImageChange}
            />
            {isMainImageUploaded ? (
              <div className="flex flex-col items-center mt-3 relative">
                <h4 className="font-normal text-primary text-center text-slate-600 w-full">
                  Tu fotografía{" "}
                  <span className="text-dark"> {formData.mainImage.name}</span>{" "}
                  ya ha sido cargada.
                  <br /> Actualiza para ver los cambios.
                </h4>

                <button
                  className="bg-red-500 gap-4 flex item-center justify-center px-4 py-2 hover:bg-red-700 text-white rounded-full   text-xs mt-4"
                  onClick={handleClearImage}
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
                  Foto <span className="text-primary">*</span>
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
                      <span className="font-semibold">Subir Imagen</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG o Webp (1800x400px)
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
              ? "Crear Banner"
              : "Actualizar"}
          </button>
        </form>
        {isModalOpen && (
          <Modal
            showModal={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <div className="relative h-96 w-full">
              <Cropper
                image={mainImage || ""} // Asegurar que se pasa una cadena no nula
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
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

              <div className="flex justify-between w-full gap-2">
                <button
                  onClick={handleCrop}
                  className="bg-primary text-[13px] md:text-[16px] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Recortar y Subir
                </button>
                <button
                  onClick={() => {
                    setMainImage(null);
                    setIsMainImageUploaded(false);
                    setIsModalOpen(false);
                  }}
                  className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-[13px] md:text-[16px]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </Modal>
        )}
      </section>
    </div>
  );
};

export default BannerPrincipal01BO;
