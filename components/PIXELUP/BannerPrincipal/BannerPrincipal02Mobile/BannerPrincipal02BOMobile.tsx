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
import Modal from "@/components/Core/Modals/ModalSeo";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import imageCompression from "browser-image-compression";

interface MobileBannerImage {
  id: string;
  title: string;
  landingText: string;
  buttonLink: string;
  buttonText: string;
  mainImageLink: string;
  orderNumber: number;
  mainImage?: any;
}

const BannerPrincipal02BOMobile: React.FC = () => {
  const [mobileFileName, setMobileFileName] = useState<string | null>(null);
  const [isMobileMainImageUploaded, setIsMobileMainImageUploaded] =
    useState(false);
  const [isAddingMobileImage, setIsAddingMobileImage] =
    useState<boolean>(false);
  const mobileFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isMobilePreviewImageUploaded, setIsMobilePreviewImageUploaded] =
    useState(false);
  const [mobileBannerData, setMobileBannerData] = useState<MobileBannerImage[]>(
    []
  );
  const [currentMobileIndex, setCurrentMobileIndex] = useState<number>(0);
  const [mobileFormData, setMobileFormData] = useState<MobileBannerImage>({
    id: "",
    title: "fbmjoyas.cl",
    landingText: "fbmjoyas.cl",
    buttonLink: "",
    buttonText: "fbmjoyas.cl",
    mainImageLink: "fbmjoyas.cl",
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
  const [mobileMainImage, setMobileMainImage] = useState<string | null>(null);

  const [mobileCrop, setMobileCrop] = useState({ x: 0, y: 0 });
  const [mobileZoom, setMobileZoom] = useState(1);
  const [croppedMobileAreaPixels, setCroppedMobileAreaPixels] =
    useState<any>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const fetchMobileBannerData = async () => {
    try {
      setLoading(true);
      setSkeletonLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_BANNERPRINCIPAL02MOBILE_ID}`;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMobileBannerData(response.data.bannerImages);
      if (response.data.bannerImages.length > 0) {
        const initialImage = response.data.bannerImages[0];
        setMobileFileName(initialImage.mainImage.name);
        setMobileFormData({
          id: initialImage.id,
          title: "fbmjoyas.cl",
          landingText: "fbmjoyas.cl",
          buttonLink: initialImage.buttonLink,
          buttonText: "fbmjoyas.cl",
          mainImageLink: "fbmjoyas.cl",
          orderNumber: initialImage.orderNumber,
          mainImage: initialImage.mainImage,
        });
        setMobileMainImage(
          initialImage.mainImage.url || initialImage.mainImage.data
        );
      }
    } catch (error) {
      console.error("Error al obtener los datos del banner:", error);
    } finally {
      setLoading(false);
      setSkeletonLoading(false);
    }
  };

  useEffect(() => {
    fetchMobileBannerData();
  }, []);

  const handleMobileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMobileFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setMobileMainImage(result);
        setIsMobileMainImageUploaded(true);
        setIsMobileModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAddImageClick = () => {
    if (isAddingMobileImage) {
      // Si ya estamos en el estado de agregar, cancela la operación y restaura los valores originales
      setMobileFormData({
        id: mobileBannerData[currentMobileIndex]?.id || "",
        title: mobileBannerData[currentMobileIndex]?.title || "",
        landingText: mobileBannerData[currentMobileIndex]?.landingText || "",
        buttonLink: mobileBannerData[currentMobileIndex]?.buttonLink || "",
        buttonText: mobileBannerData[currentMobileIndex]?.buttonText || "",
        mainImageLink:
          mobileBannerData[currentMobileIndex]?.mainImageLink || "",
        orderNumber: mobileBannerData[currentMobileIndex]?.orderNumber || 1,
        mainImage: mobileBannerData[currentMobileIndex]?.mainImage || {
          url: "",
          name: "",
          type: "",
          size: null,
          data: "",
        },
      });
      setMobileMainImage(
        mobileBannerData[currentMobileIndex]?.mainImage?.url ||
          mobileBannerData[currentMobileIndex]?.mainImage?.data ||
          null
      );
      setIsAddingMobileImage(false);
      setIsMobileMainImageUploaded(false);
    } else {
      // Si no estamos agregando, iniciar el proceso de agregar una nueva imagen
      setMobileFormData({
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
      setMobileMainImage(null);
      setIsAddingMobileImage(true);
      mobileFileInputRef.current?.click();
      setIsMobileMainImageUploaded(false);
    }
  };
  const handleNextImage = async () => {
    setSkeletonLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200)); // Simulación de retardo para la carga
    const nextIndex = (currentMobileIndex + 1) % mobileBannerData.length; // Calcular el siguiente índice
    setCurrentMobileIndex(nextIndex);
    const nextImage = mobileBannerData[nextIndex];
    setMobileFormData(nextImage);
    setMobileMainImage(nextImage.mainImage.url || nextImage.mainImage.data);
    setIsMobileMainImageUploaded(false); // Restablecer el estado de la imagen cargada
    setSkeletonLoading(false);
  };
  const handlePrevImage = async () => {
    setSkeletonLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200)); // Simulación de retardo para la carga
    const prevIndex =
      (currentMobileIndex - 1 + mobileBannerData.length) %
      mobileBannerData.length; // Calcular el índice anterior
    setCurrentMobileIndex(prevIndex);
    const prevImage = mobileBannerData[prevIndex];
    setMobileFormData(prevImage);
    setMobileMainImage(prevImage.mainImage.url || prevImage.mainImage.data);
    setIsMobileMainImageUploaded(false); // Restablecer el estado de la imagen cargada
    setSkeletonLoading(false);
  };
  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_BANNERPRINCIPAL02MOBILE_ID}`;

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${mobileFormData.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchMobileBannerData(); // Volver a cargar los datos del banner después de borrar
    } catch (error) {
      console.error("Error al borrar la imagen del banner:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMobileFormData({ ...mobileFormData, [name]: value });
  };
  const handleClearMobileImage = () => {
    setMobileMainImage(
      mobileFormData.mainImage.url || mobileFormData.mainImage.data
    );
    setIsMobileMainImageUploaded(false); // Restablecer el estado de la imagen
  };

  const handleMobileCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedMobileAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleMobileCrop = async () => {
    if (!mobileMainImage) return;

    try {
      const croppedImage = await getCroppedImg(
        mobileMainImage,
        croppedMobileAreaPixels
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
        name: mobileFileName,
        type: compressedFile.type,
        size: compressedFile.size,
        data: base64,
      };

      setMobileFormData((prevMobileFormData) => ({
        ...prevMobileFormData,
        mainImage: imageInfo,
      }));
      setMobileMainImage(base64);
      setIsMobileModalOpen(false);
      setIsMobileMainImageUploaded(true);
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

  const formatUrl = (url: string): string => {
    if (!url) return '';
    
    try {
      // Intenta crear un objeto URL para validar
      new URL(url);
      return url; // Si es una URL válida, la devuelve tal cual
    } catch {
      // Si no es una URL válida, aplicamos el formato
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      if (url.startsWith('www.')) {
        return `https://${url}`;
      }
      return `https://www.${url}`;
    }
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const bannerId = `${process.env.NEXT_PUBLIC_BANNERPRINCIPAL02MOBILE_ID}`;

      // Formateamos la URL justo antes de enviar
      const formattedButtonLink = formatUrl(mobileFormData.buttonLink);

      const dataToSend = {
        title: "fbmjoyas.cl",
        landingText: "fbmjoyas.cl",
        buttonLink: formattedButtonLink, // Usamos la URL formateada
        buttonText: "fbmjoyas.cl",
        mainImageLink: "fbmjoyas.cl",
        orderNumber: mobileFormData.orderNumber,
        ...(isMobileMainImageUploaded && {
          mainImage: mobileFormData.mainImage,
        }),
      };

      if (isAddingMobileImage) {
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
        setIsAddingMobileImage(false);
      } else {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${mobileFormData.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      fetchMobileBannerData();
    } catch (error) {
      console.error("Error al actualizar el banner:", error);
    } finally {
      setLoading(false);
    }
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
      id="banner-mobile"
      className="w-full"
    >
      {skeletonLoading ? (
        <SkeletonLoader />
      ) : (
        <div className=" h-[300px] relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-0 before:z-10 flex justify-center items-center">
          <img
            src={mobileMainImage || mobileFormData.mainImage.url}
            alt="Banner Image"
            className="w-full h-full object-cover max-w-[1000px]"
          />

          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white p-6">
            {/* 
    Si decides mostrar el título y texto nuevamente, puedes descomentar esto 
    <h2 className="text-2xl font-semibold mb-2">{mobileFormData.title}</h2>
    <p className="text-md text-center text-gray-200">
      {mobileFormData.landingText}
    </p> 
    */}
          </div>
        </div>
      )}

      <div className="flex justify-center mt-4">
        {mobileBannerData.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${
              index === currentMobileIndex ? "bg-dark" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4 items-center mt-4">
        {mobileBannerData.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Anterior
            </button>
            <button
              onClick={handleNextImage}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Siguiente
            </button>
          </>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleAddImageClick}
          className={`shadow w-full uppercase text-white font-bold py-2 px-4 rounded flex-wrap ${
            isAddingMobileImage
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isAddingMobileImage ? "Cancelar" : "Agregar Banner"}
        </button>

        {mobileBannerData.length > 1 && (
          <button
            type="button"
            onClick={handleDeleteImage}
            className="shadow bg-red-600 hover:bg-red-700 w-full uppercase text-white font-bold py-2 px-4 rounded flex-wrap ml-4"
          >
            Borrar Imagen
          </button>
        )}
      </div>

      <form
        onSubmit={handleMobileSubmit}
        className="px-4 mx-auto mt-8"
      >
        <div>
          <h3 className="font-normal text-primary">
            Link de destino <span className="text-primary">*</span>
          </h3>
          <input
            type="text"
            name="buttonLink"
            value={mobileFormData.buttonLink}
            onChange={handleMobileChange}
            className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300 rounded-md"
            placeholder="Ejemplo: pixelup.cl o https://www.pixelup.cl/"
          />
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            id="mobileMainImage"
            className="hidden"
            ref={mobileFileInputRef}
            onChange={handleMobileImageChange}
          />
          {isMobileMainImageUploaded ? (
            <div className="flex flex-col items-center mt-3 relative">
              <h4 className="font-normal text-primary text-center text-slate-600 w-full">
                Tu fotografía{" "}
                <span className="text-dark">
                  {" "}
                  {mobileFormData.mainImage.name}
                </span>{" "}
                ya ha sido cargada. <br /> Actualiza para ver los cambios.
              </h4>
              <button
                className="bg-red-500 gap-4 flex item-center justify-center px-4 py-2 hover:bg-red-700 text-white rounded-full text-xs mt-4"
                onClick={handleClearMobileImage}
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
                htmlFor="mobileMainImage"
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
            : isAddingMobileImage
            ? "Crear Banner"
            : "Actualizar"}
        </button>
      </form>

      {isMobileModalOpen && (
        <Modal
          showModal={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
        >
          <div className="relative h-96 w-full">
            <p>modal</p>
            <Cropper
              image={mobileMainImage || ""}
              crop={mobileCrop}
              zoom={mobileZoom}
              aspect={1080 / 400} /*  0.8/1 */
              onCropChange={setMobileCrop}
              onZoomChange={setMobileZoom}
              onCropComplete={handleMobileCropComplete}
            />
            <div className="controls"></div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="w-full py-6">
              <input
                type="range"
                value={mobileZoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setMobileZoom(parseFloat(e.target.value));
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
                  setMobileMainImage(null);
                  setIsMobileMainImageUploaded(false);
                  setIsMobileModalOpen(false);
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

export default BannerPrincipal02BOMobile;
