/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TabExtra from "@/components/Products/ProductoSimple/TabExtra";
import TabCategory from "@/components/Products/Category/TabCategory";
import CreateAtribute from "@/components/Products/CreateAtribute";
import GalleryUpload from "@/components/Products/ImgUpload/GalleryUpload";
import { useAPI } from "@/app/Context/ProductTypeContext";
import { getCookie } from "cookies-next";
import axios from "axios";
import Select from "react-select";

const token = String(getCookie("tokenAuth"));

const CrearProductoSimple: React.FC = ({}) => {
  const { productType, setProductType } = useAPI();
  const [openModalId, setOpenModalId] = useState(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [precioNormal, setPrecioNormal] = useState<number | null>(null);
  const [stockQuantity, setStockQuantity] = useState<number | null>(null);
  const [precioOferta, setPrecioOferta] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [checkOfferChecked, setCheckOfferChecked] = useState(false);

  const handleCheckOfferChange = () => {
    setCheckOfferChecked(!checkOfferChecked);
  };

  const fetchData = async () => {
    try {
      const token = getCookie("tokenAuth");

      const SiteId = process.env.NEXT_PUBLIC_API_SITEID;
      const PageNumber = 1;
      const PageSize = 100;

      const productTypeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/product-types?siteId=${SiteId}&pageNumber=${PageNumber}&pageSize=${PageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProductType(productTypeResponse.data.productTypes);
    } catch (error) {
      console.error("Error al obtener los tipos de producto:", error);
      // Manejar el error según sea necesario
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Debería ejecutarse solo en el montaje inicial
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        setOpenModalId(null);
      }
    };

    if (openModalId) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openModalId]);

  function handleOpenModal(modalId: any) {
    setOpenModalId(modalId);
  }
  const handleCloseModal = () => {
    setOpenModalId(null);
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    imageKey: string
  ) => {
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

        setFormData((prevFormData) => ({
          ...prevFormData,
          [imageKey]: imageInfo,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setImage(null);
  };

  const productTypeOptions = productType.map(
    (producto: { id: string; name: string }) => ({
      value: producto.id,
      label: producto.name,
    })
  );

  const [formData, setFormData] = useState({
    productTypes: [{}],
    name: "",
    description: "",
    statusCode: "ACTIVE",
    enabledForDelivery: false,
    enabledForWithdrawal: false,
    hasVariations: false,
    measures: {
      length: null,
      width: null,
      height: null,
      weight: null,
    },
    previewImage: {
      name: "",
      type: "",
      size: null,
      data: "",
    },
    mainImage: {
      name: "",
      type: "",
      size: null,
      data: "",
    },
  });

  const getWarehouseId = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/warehouses?pageNumber=1&pageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data &&
        response.data.warehouses &&
        response.data.warehouses.length > 0
      ) {
        return response.data.warehouses[0].id; // Devuelve el id del primer almacén
      } else {
        console.error("No se encontraron almacenes.");
        return null;
      }
    } catch (error) {
      console.error("Error obteniendo almacén:", error);
      return null;
    }
  };

  const addProductPricing = async (
    id: string,
    sku: string,
    precioNormal: number
  ) => {
    try {
      const currencyResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        currencyResponse.data &&
        currencyResponse.data.currencyCodes &&
        currencyResponse.data.currencyCodes.length > 0
      ) {
        const currencyCodeId = currencyResponse.data.currencyCodes[0].id;
        const warehouseId = await getWarehouseId(); // Obtener el warehouseId
        if (!warehouseId) return;

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${sku}/pricings`,
          {
            currencyCodeId: currencyCodeId,
            unitPrice: precioNormal,
            warehouseId: warehouseId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status >= 200 && response.status < 300) {
          console.log("Price added successfully");
        } else {
          console.error("Error adding price:", response.statusText);
        }
      } else {
        console.error("No se encontraron códigos de moneda válidos.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };
  const addProductStock = async (
    id: string,
    skuId: string,
    quantity: number
  ) => {
    try {
      const warehouseId = await getWarehouseId(); // Obtener el warehouseId
      if (!warehouseId) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/inventories`,
        {
          warehouseId: warehouseId,
          quantity: quantity,
          minimumQuantity: 5,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Stock added successfully");
      } else {
        console.error("Error adding stock:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };
  const addProductOffer = async (
    id: string,
    sku: string,
    oferta: number,
    startDate: any,
    endDate: any
  ) => {
    try {
      const currencyResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        currencyResponse.data &&
        currencyResponse.data.currencyCodes &&
        currencyResponse.data.currencyCodes.length > 0
      ) {
        const currencyCodeId = currencyResponse.data.currencyCodes[0].id;
        const formatDate = (date: Date | null): string | null => {
          if (!date) return null;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${sku}/offers`,
          {
            currencyCodeId: currencyCodeId,
            unitPrice: oferta,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status >= 200 && response.status < 300) {
          console.log("Offer added successfully");
        } else {
          console.error("Error adding offer:", response.statusText);
        }
      } else {
        console.error("No se encontraron códigos de moneda válidos.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImageGalleryChange = (images: string[]) => {
    setSelectedImages(images);
  };

  const handleImageRemove = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };
  // Función para agregar una imagen a través de la API
  const addProductImage = async (id: string, skuId: string, image: string) => {
    try {
      // Obtener el nombre de la imagen del archivo base64
      const name = image.substring(image.indexOf("/") + 1, image.indexOf(";"));

      // Obtener el tipo de la imagen del archivo base64
      const type = image.substring(
        image.indexOf(":") + 1,
        image.indexOf(";base64")
      );

      // Obtener el tamaño de la imagen en bytes
      const size = Math.round(
        (image.length - image.indexOf("base64") - "base64".length) * 0.75
      );

      // Formatear la imagen según el formato requerido
      const formattedImage = {
        mainImage: {
          name: name,
          type: type,
          size: size,
          data: image,
        },
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/images`,
        formattedImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Image added successfully");
      } else {
        console.error("Error adding image:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const { product } = responseData;
        const { id, skuId: sku } = product;

        if (id && sku && precioNormal !== null) {
          await addProductPricing(id, sku, precioNormal);
          if (stockQuantity !== null) {
            await addProductStock(id, sku, stockQuantity);
          }
          if (precioOferta !== null) {
            await addProductOffer(id, sku, precioOferta, startDate, endDate);
          }
          for (const image of selectedImages) {
            await addProductImage(id, sku, image);
          }
          console.log("Product created successfully");

          // Resto del código para limpiar el formulario, etc.
          handleClearImage(setMainImage);
          handleClearImage(setPreviewImage);
          setFormData({
            productTypes: [{}],
            name: "",
            description: "",
            statusCode: "ACTIVE",
            enabledForDelivery: false,
            enabledForWithdrawal: false,
            hasVariations: false,
            measures: {
              length: null,
              width: null,
              height: null,
              weight: null,
            },
            previewImage: {
              name: "",
              type: "",
              size: null,
              data: "",
            },
            mainImage: {
              name: "",
              type: "",
              size: null,
              data: "",
            },
          });
        } else {
          console.error("Error: ID or SKU is undefined");
        }
      } else {
        console.error("Error al crear el producto:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Crear Producto Simple" />
      <div className="grid grid-cols-1 md:grid-cols-4 px-4">
        {/* Columna principal */}
        <div className="md:col-span-4 lg:col-span-3  flex flex-col pb-8 ">
          <div className=" border border-dashed border-dark/50 rounded-lg p-4 mb-4 block lg:hidden sticky top-24 bg-white z-50 ">
            <h1 className="mb-4 text-bold border-b border-dark uppercase">
              Publicar
            </h1>
            <h3>
              Estado:{" "}
              <span className="text-dark font-bold pl-2">Publicado</span>
            </h3>
            <h3>
              Fecha Publicación:
              <span className="text-dark font-bold pl-2">12/04/2024</span>
            </h3>
            <div className="flex justify-between mt-4 gap-2">
              <div>
                <button
                  className="block w-full text-left py-2 px-4 bg-dark text-white rounded-xl hover:bg-primary hover:text-dark"
                  type="button"
                >
                  Guardar Borrador
                </button>
              </div>

              <div>
                <button
                  className="block w-full text-left py-2 px-4 bg-primary text-dark rounded-xl hover:bg-dark hover:text-primary"
                  type="button"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                    handleSubmit(event)
                  }
                >
                  Publicar
                </button>
              </div>
              <div>
                <button
                  type="button"
                  id="createCategories"
                  onClick={() => handleOpenModal("createCategoriesModal")}
                  className="block w-full text-left py-2 px-4 bg-dark text-white rounded-xl hover:bg-primary hover:text-dark "
                >
                  Crear Categoría
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-2">
            <div>
              <label htmlFor="nombreProducto">Nombre Producto</label>
              <input
                className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary "
                type="text"
                name="nombreProducto"
                id=""
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
              />
            </div>
            <div>
              <div>
                <label className="">Categoría</label>

                <Select
                  isMulti
                  name="Categorías"
                  options={productTypeOptions}
                  classNamePrefix="Selecciona"
                  className="basic-multi-select block mt-2 w-full text-sm text-dark bg-white rounded-lg focus:ring-primary focus:border-primary "
                  required
                  onChange={(selectedOptions) => {
                    const selectedIds = selectedOptions.map((option: any) => ({
                      id: option.value,
                    }));
                    setFormData({ ...formData, productTypes: selectedIds });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label>Descripción Producto</label>
            <textarea
              className="block p-2.5 mt-2 w-full text-sm text-dark bg-white rounded-lg border border-dark/30 focus:ring-primary focus:border-primary"
              name="descripcionProducto"
              id=""
              cols={30}
              rows={5}
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
            ></textarea>
          </div>
          <div className="mt-4 grid grid-cols-1 space-y-2">
            <div className=" border border-dashed border-dark/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>Precio Normal</label>
                  <input
                    type="number"
                    className="block mb-2 p-2.5 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
                    value={precioNormal !== null ? precioNormal : ""}
                    onChange={(e) =>
                      setPrecioNormal(parseFloat(e.target.value))
                    }
                    name="precioProducto"
                    required
                  />
                  <div className="flex ">
                    <label className="inline-flex items-center cursor-pointer pl-2">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={checkOfferChecked}
                        onChange={handleCheckOfferChange}
                      />
                      <div className="relative w-8 h-5 bg-dark  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-secondary" />
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Programar Rebaja
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <label>Precio Rebajado </label>
                  <input
                    type="number"
                    className="block mb-2 p-2.5 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
                    value={precioOferta !== null ? precioOferta : ""}
                    onChange={(e) =>
                      setPrecioOferta(parseFloat(e.target.value))
                    }
                  />
                  <p className="text-xs flex items-center gap-2">
                    <span>
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
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </span>
                    Lpsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 bg-primary/40 p-4 text-dark rounded-xl   ${
                  checkOfferChecked ? "" : " hidden"
                }`}
              >
                <div className="flex gap-2 p-2">
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="">Inicio Oferta</label>
                    <input
                      type="date"
                      className="block mb-2 p-2.5 mt-2 w-full text-sm text-dark bg-white rounded-lg border border-dark/30 focus:ring-primary focus:border-primary"
                      id="start_date"
                      value={
                        startDate ? startDate.toISOString().split("T")[0] : ""
                      }
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="">Fin Oferta</label>
                    <input
                      type="date"
                      className="block mb-2 p-2.5 mt-2 w-full text-sm text-dark bg-white rounded-lg border border-dark/30 focus:ring-primary focus:border-primary"
                      id="end_date"
                      value={endDate ? endDate.toISOString().split("T")[0] : ""}
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" border border-dashed border-dark/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    className="block mb-2 p-2.5 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
                    value={stockQuantity !== null ? stockQuantity : ""}
                    onChange={(e) =>
                      setStockQuantity(parseFloat(e.target.value))
                    }
                    name="precioProducto"
                    required
                  />
                  <div className="flex ">
                    <label className="inline-flex items-center cursor-pointer pl-2">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="relative w-8 h-5 bg-dark  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-secondary" />
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Activar Alerta
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <label>
                    Alerta Stock{" "}
                    <span className="text-xs font-bold">( Proximamente )</span>{" "}
                  </label>
                  <input
                    type="number"
                    disabled
                    className="block mb-2 p-2.5 mt-2 w-full text-sm text-dark bg-gray-100 rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
                    name=""
                    id=""
                  />
                  <p className="text-xs flex items-center gap-2">
                    <span>
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
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </span>
                    Lpsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 mt-4 gap-4">
            <div>
              <input
                type="file"
                accept="image/*"
                id="mainImage"
                className="hidden"
                onChange={(e) =>
                  handleImageChange(e, setMainImage, "mainImage")
                }
              />
              {mainImage ? (
                <div>
                  <h1>Imagen Principal</h1>
                  <div className="relative mt-2 h-[150px] rounded-lg object-contain overflow-hidden">
                    <img
                      src={mainImage}
                      alt="Main Image"
                      className="w-full"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 m-1 text-xs"
                      onClick={() => handleClearImage(setMainImage)}
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
                  <h1>Imagen Principal</h1>
                  <label
                    htmlFor="mainImage"
                    className="flex mt-2 flex-col bg-white justify-center items-center pt-5 pb-6 border border-dashed border-dark/50 rounded-lg cursor-pointer w-full z-10"
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
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                id="previewImage"
                className="hidden"
                onChange={(e) =>
                  handleImageChange(e, setPreviewImage, "previewImage")
                }
              />
              {previewImage ? (
                <div>
                  <h1>Imagen Secundaria</h1>
                  <div className="relative mt-2 h-[150px] rounded-lg object-contain overflow-hidden">
                    <img
                      src={previewImage}
                      alt="Preview Image"
                      className="w-full"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 m-1 text-xs"
                      onClick={() => handleClearImage(setPreviewImage)}
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
                  <h1>Imagen Secundaria</h1>
                  <label
                    htmlFor="previewImage"
                    className="flex flex-col mt-2 bg-white justify-center items-center pt-5 pb-6 border border-dashed border-dark/50 rounded-lg cursor-pointer w-full z-10"
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
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h1 className="mb-2">Galeria de imagenes</h1>
            <GalleryUpload
              selectedImages={selectedImages}
              handleImageGalleryChange={handleImageGalleryChange}
              handleImageRemove={handleImageRemove}
            />

            {/* Componente ImageUploadForm para cargar imágenes */}
          </div>
          <TabExtra
            setFormData={setFormData}
            formData={formData}
          />
        </div>
        {/* FIN COL PRINCIPAL */}
        <div className="md:col-span-1 border-l mt-2 ml-4 pl-4 ">
          {/* Contenido de la barra lateral */}
          <div className="bg-white border border-dashed border-dark/50 rounded-lg p-4 mb-4 hidden lg:block sticky top-24">
            <h1 className="mb-4 text-bold border-b border-dark uppercase">
              Publicar
            </h1>
            <h3>
              Estado:{" "}
              <span className="text-dark font-bold pl-2">Publicado</span>
            </h3>
            <h3>
              Fecha Publicación:
              <span className="text-dark font-bold pl-2">12/04/2024</span>
            </h3>
            <div className="flex justify-between mt-4 flex-col gap-2">
              <div>
                <button
                  className="block w-full text-left py-2 px-4 bg-dark text-white rounded-xl hover:bg-primary hover:text-dark"
                  type="button"
                >
                  Guardar Borrador
                </button>
              </div>
              <div>
                <button
                  className="block w-full text-left py-2 px-4 bg-primary text-dark rounded-xl hover:bg-dark hover:text-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Publicar
                </button>
              </div>
              <div>
                <hr className="my-4" />
                <button
                  type="button"
                  id="createCategories"
                  onClick={() => handleOpenModal("createCategoriesModal")}
                  className="block w-full text-left py-2 px-4 bg-dark text-white rounded-xl hover:bg-primary hover:text-dark "
                >
                  Crear Categoría
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* FIN COL SIDEBAR */}
      </div>
      {/* MODALS */}
      <div
        id="createCategoriesModal"
        tabIndex={-1}
        className={`overflow-y-auto overflow-x-hidden px-12 pt-12 fixed top-0 right-0 backdrop-blur-sm bg-[#00000080] left-0 z-50 w-full h-[calc(100%)] ${
          openModalId === "createCategoriesModal" ? "" : "hidden"
        }`}
      >
        <TabCategory
          handleCloseModal={handleCloseModal}
          fetchData={fetchData}
        />
      </div>
      <div
        id="createAttributeModal"
        tabIndex={-1}
        className={`overflow-y-auto overflow-x-hidden p-32 pt-0 fixed top-0 right-0 backdrop-blur-sm bg-[#00000080] left-0 z-50 w-full h-[calc(100%)] ${
          openModalId === "createAttributeModal" ? "" : "hidden"
        }`}
      >
        {/*   <CreateAtribute
          handleCloseModal={handleCloseModal}
          fetchData={fetchData}
        />*/}
      </div>
      {/* MODALS */}
    </>
  );
};

export default CrearProductoSimple;
