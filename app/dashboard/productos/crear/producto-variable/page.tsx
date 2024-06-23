/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useAPI } from "@/app/Context/ProductTypeContext";
import Select from "react-select";
import GalleryUpload from "@/components/Products/ImgUpload/GalleryUploadV2";
import { getCookie } from "cookies-next";
import axios from "axios";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import VariablesPage from "./VariablesSection";
import ImageUploader from "../producto-simple/ImageUploader";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TabCategory from "@/components/Products/Category/TabCategory";

interface ImageData {
  name: string;
  type: string;
  size: number;
  data: string;
}

const CrearProductoVariable: React.FC = () => {
  const [skuImages, setSkuImages] = useState<any[]>([]);
  const fetchImages = async (productId: any, skuId: any) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data, "skuImagesvariable");
      if (data.code === 0) {
        // Extracción del stock de la primera skuInventory, si existe
        setSkuImages(data.skuImages);
      } else {
        console.error(
          "Error al obtener el stock de la variación:",
          data.message
        );
        return null; // En caso de error, devuelve null
      }
    } catch (error) {
      console.error("Error al obtener el stock de la variación:", error);
      return null; // En caso de error, devuelve null
    }
  };
  const fetchProducTypes = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
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
    }
  };
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [initialMainImage, setInitialMainImage] = useState(null);
  const [initialPreviewImage, setInitialPreviewImage] = useState(null);
  const [isMainImageUploaded, setIsMainImageUploaded] = useState(false);
  const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [skuIdBase, setSkuIdBase] = useState(null);
  const { productType, setProductType } = useAPI();
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);

  const [hasFeaturedBaseSku, setHasFeaturedBaseSku] = useState(false);

  const [formData, setFormData] = useState({
    productTypes: [],
    name: "",
    description: "",
    statusCode: "ACTIVE",
    enabledForDelivery: false,
    enabledForWithdrawal: false,
    hasVariations: true,
    hasFeaturedBaseSku: false,
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
  const [thumbnails, setThumbnails] = useState([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<ImageData[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [measures, setMeasures] = useState<Measures>({
    length: null,
    width: null,
    height: null,
    weight: null,
  });
  const productTypeOptions = productType.map(
    (producto: { id: string; name: string }) => ({
      value: producto.id,
      label: producto.name,
    })
  );

  interface Measures {
    length: number | null;
    width: number | null;
    height: number | null;
    weight: number | null;
  }
  const [openModalId, setOpenModalId] = useState(null);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const token = getCookie("AdminTokenAuth");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const productData = response.data.product;
        console.log(productData, "productData");
        const selectedProductTypes = productData.productTypes.map(
          (productType: any) => ({
            value: productType.id,
            label: productType.name,
          })
        );

        setSelectedProductTypes(selectedProductTypes);

        setFormData({
          ...formData,
          name: productData.name,
          description: productData.description,
          enabledForDelivery: productData.enabledForDelivery,
          enabledForWithdrawal: productData.enabledForWithdrawal,
          hasVariations: true,
          productTypes: selectedProductTypes,
          previewImage: {
            ...formData.previewImage,
            data: productData.previewImageUrl,
          },
          mainImage: {
            ...formData.mainImage,
            data: productData.mainImageUrl,
          },
          measures: productData.measures || {
            // Verifica si measures está definido
            length: null,
            width: null,
            height: null,
            weight: null,
          },
        });
        setMeasures({
          length: productData.measures ? productData.measures.length : null,
          width: productData.measures ? productData.measures.width : null,
          height: productData.measures ? productData.measures.height : null,
          weight: productData.measures ? productData.measures.weight : null,
        });

        setMainImage(productData.mainImageUrl);
        setPreviewImage(productData.previewImageUrl);
        setInitialMainImage(productData.mainImageUrl);
        setInitialPreviewImage(productData.previewImageUrl);
      } catch (error) {
        console.error("Error al obtener los datos del producto:", error);
        setIsEditMode(false);
        const newURL = window.location.pathname;
        router.replace(newURL);
      }
    };

    if (isEditMode && productId) {
      fetchProductData();
    }
  }, [productId]);

  const fetchData = async () => {
    try {
      const token = getCookie("AdminTokenAuth");

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
    }
  };

  type FormDataKeys = keyof typeof formData;

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

  const handleClearImage = (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setImage(null);
  };

  const handleImageGalleryChange = (images: ImageData[]) => {
    setSelectedImages(images);
  };

  const handleImageRemove = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleInputMeasuresChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setMeasures((prevMeasures) => ({
      ...prevMeasures,
      [name]: parseFloat(value) || null,
    }));
  };

  const handleCancel = () => {
    handleClearImage(setMainImage);
    handleClearImage(setPreviewImage);
    setProductId(null);
    setThumbnails([]);
    setIsEditMode(false);
    setFormData({
      productTypes: [],
      name: "",
      description: "",
      statusCode: "ACTIVE",
      enabledForDelivery: false,
      enabledForWithdrawal: false,
      hasVariations: true,
      hasFeaturedBaseSku: false,
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
    router.replace("/dashboard/productos/crear/producto-variable");
  };
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = getCookie("AdminTokenAuth");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const responseData = await response.json();
        if (responseData.code === 0) {
          setSkuIdBase(responseData.product.skuId);
        } else {
          console.error(
            "Error fetching product details:",
            responseData.message
          );
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const uploadImage = async (
    name: string,
    type: string,
    size: number,
    data: string,
    productId: string,
    skuId: string
  ) => {
    const token = getCookie("AdminTokenAuth");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mainImage: {
            name,
            type,
            size,
            data,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }
    return response.json();
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!formData.name || !formData.description) {
      console.error(
        "El nombre y la descripción del producto son obligatorios."
      );
      return;
    }

    try {
      const token = getCookie("AdminTokenAuth");

      const dataToSubmit = {
        ...formData,
        productTypes: selectedProductTypes.map((type: any) => ({
          id: type.value,
          name: type.label,
        })),
        measures: formData.enabledForDelivery ? measures : undefined,
        mainImage: isMainImageUploaded ? formData.mainImage : undefined,
        previewImage: isPreviewImageUploaded
          ? formData.previewImage
          : undefined,
      };
      dataToSubmit.hasFeaturedBaseSku = false;

      if (!formData.enabledForDelivery) {
        delete dataToSubmit.measures;
      }

      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}`
        : `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData, "wtf");

        const { product } = responseData;
        const { id, skuId: sku } = product;
        for (const image of selectedImages) {
          await uploadImage(
            image.name,
            `image/${image.type}`,
            image.size,
            image.data,
            id,
            sku
          );
        }

        if (id && sku) {
          console.log(`El ID del producto es: ${id}`);
          console.log(`El ID del SKU es: ${sku}`);

          fetchData();
          const searchParams = new URLSearchParams(window.location.search);
          const idVariable = searchParams.get("productVariableId");
          if (idVariable !== id) {
            searchParams.set("productVariableId", id);
            const newURL = `${
              window.location.pathname
            }?${searchParams.toString()}`;
            router.replace(newURL);
          }
        } else {
          console.log("No se pudo obtener el ID del producto");
        }

        alert("Todas las imágenes se cargaron correctamente!");
      } else {
        console.error("Error al enviar la solicitud:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const id = searchParams.get("productVariableId");
    if (id) {
      setProductId(id);
      console.log(`El ID del producto es: ${id}`);
      setIsEditMode(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, []);

  const customStyles = {
    control: (base: any) => ({
      ...base,
      height: 45,
      minHeight: 45,
    }),
  };
  function handleOpenModal(modalId: any) {
    setOpenModalId(modalId);
  }
  const handleCloseModal = () => {
    setOpenModalId(null);
  };
  return (
    <>
      <Breadcrumb pageName="Crear producto" />
      <div className="grid grid-cols-1 md:grid-cols-4 px-4">
        {/* Columna principal */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col pb-8 ">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="nombreProducto"
                  className="font-normal text-primary"
                >
                  Nombre Producto Base
                </label>
                <input
                  className="shadow py-3 block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
                  type="text"
                  name="nombreProducto"
                  id="nombreProducto"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                />
              </div>
              <div>
                <div>
                  <label className="font-normal text-primary">
                    Categoría de Producto Base
                  </label>

                  <Select
                    options={productTypeOptions}
                    isMulti
                    value={formData.productTypes}
                    onChange={(selectedOptions: any) => {
                      setFormData({
                        ...formData,
                        productTypes: selectedOptions,
                      });
                      setSelectedProductTypes(selectedOptions);
                    }}
                    className="mt-2"
                    styles={customStyles}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label className="font-normal text-primary ">
                Tipo de entrega
              </label>

              <div
                className="flex flex-wrap py-2 px-4 my-2 gap-4"
                style={{ borderRadius: "var(--radius)" }}
              >
                <label
                  className="block  cursor-pointer"
                  htmlFor="habilitarDespacho"
                >
                  <div
                    className="shadow flex gap-4 items-center bg-primary hover:bg-secondary p-2 text-secondary hover:text-primary font-medium "
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    Habilitar Despacho
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      name="habilitarDespacho"
                      id="habilitarDespacho"
                      checked={formData.enabledForDelivery}
                      onChange={(event) => {
                        const checked = event.target.checked;

                        setFormData({
                          ...formData,
                          enabledForDelivery: checked,
                          measures: checked
                            ? formData.measures || {
                                length: null,
                                width: null,
                                height: null,
                                weight: null,
                              }
                            : {
                                length: null,
                                width: null,
                                height: null,
                                weight: null,
                              },
                        });
                      }}
                    />
                  </div>
                </label>
                <div
                  className="shadow flex gap-4 items-center bg-primary hover:bg-secondary p-2 text-secondary hover:text-primary font-medium "
                  style={{ borderRadius: "var(--radius)" }}
                >
                  <label
                    className="block cursor-pointer"
                    htmlFor="habilitarRetiro"
                  >
                    Habilitar Retiro
                  </label>
                  <input
                    type="checkbox"
                    name="habilitarRetiro"
                    className="cursor-pointer"
                    id="habilitarRetiro"
                    checked={formData.enabledForWithdrawal}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        enabledForWithdrawal: event.target.checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label
                htmlFor="descripcion"
                className="font-normal text-primary"
              >
                Descripción Producto Base
              </label>
              <textarea
                className="shadow block p-2 mt-2 py-3 w-full text-sm text-dark bg-white border border-dark/30 focus:ring-primary focus:border-primary"
                style={{ borderRadius: "var(--radius)" }}
                name="descripcion"
                id="descripcion"
                value={formData.description}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-8">
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
                    <label className="font-normal text-primary">
                      Imagen Principal
                    </label>

                    <div
                      className="shadow relative mt-2 h-[150px] object-contain overflow-hidden"
                      style={{ borderRadius: "var(--radius)" }}
                    >
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
                    <label className="font-normal text-primary">
                      Imagen Principal
                    </label>
                    <label
                      htmlFor="mainImage"
                      className="shadow flex mt-2 flex-col bg-white justify-center items-center pt-5 pb-6 border border-dashed border-primary cursor-pointer w-full z-10"
                      style={{ borderRadius: "var(--radius)" }}
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
                    <label className="font-normal text-primary">
                      Imagen Secundaria
                    </label>
                    <div
                      className="shadow relative mt-2 h-[150px] object-contain overflow-hidden"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <img
                        src={previewImage}
                        alt="Preview Image"
                        className="w-full"
                      />
                      <button
                        className="absolute top-0 right-0  bg-red-500 hover:bg-red-700 text-white rounded-full p-1 m-1 text-xs"
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
                    <label className="font-normal text-primary">
                      Imagen Secundaria
                    </label>
                    <label
                      htmlFor="previewImage"
                      className="shadow flex flex-col mt-2 bg-white justify-center items-center pt-5 pb-6 border border-dashed border-primary cursor-pointer w-full z-10"
                      style={{ borderRadius: "var(--radius)" }}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="flex space-x-4 overflow-x-auto p-4">
                {isEditMode ? (
                  <ImageUploader
                    productId={productId}
                    skuId={skuIdBase}
                    skuImages={skuImages}
                    fetchImages={fetchImages}
                  />
                ) : (
                  <GalleryUpload
                    selectedImages={selectedImages}
                    handleImageGalleryChange={handleImageGalleryChange}
                    handleImageRemove={handleImageRemove}
                  />
                )}
              </div>
              <div>
                <label htmlFor="medidas">
                  <div className=" flex gap-2">
                    <label className="font-normal text-primary">
                      Medidas Delivery
                    </label>
                    <button onClick={() => setShowForm(!showForm)}>
                      {showForm ? (
                        <span className="bg-primary text-secondary p-1 text-xs">
                          Ocultar
                        </span>
                      ) : (
                        <span className="bg-primary text-secondary p-1 text-xs">
                          Mostrar
                        </span>
                      )}
                    </button>
                  </div>
                </label>
                {showForm &&
                  (formData.enabledForDelivery ? (
                    <div className="mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div className="">
                          <label
                            htmlFor="largo"
                            className="text-xs"
                          >
                            Largo (cm.)
                          </label>
                          <input
                            type="number"
                            name="length"
                            className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
                            value={measures.length || ""}
                            onChange={handleInputMeasuresChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="ancho"
                            className="text-xs"
                          >
                            Ancho (cm.)
                          </label>
                          <input
                            type="number"
                            name="width"
                            className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
                            value={measures.width || ""}
                            onChange={handleInputMeasuresChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div>
                          <label
                            htmlFor="alto"
                            className="text-xs"
                          >
                            Alto (cm.)
                          </label>
                          <input
                            type="number"
                            name="height"
                            className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
                            value={measures.height || ""}
                            onChange={handleInputMeasuresChange}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="peso"
                            className="text-xs"
                          >
                            Peso (kg.)
                          </label>
                          <input
                            type="number"
                            name="weight"
                            className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
                            value={measures.weight || ""}
                            onChange={handleInputMeasuresChange}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{ borderRadius: "var(--radius)" }}
                      className="shadow mt-4 flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
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
                        <span className="font-semibold">
                          Habilitar despacho.
                        </span>{" "}
                        Se debe seleccionar la opcion para poder mostrar las
                        medidas.
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <button
              className="shadow bg-primary text-secondary hover:bg-secondary hover:text-primary px-4 py-2 mt-4"
              style={{ borderRadius: "var(--radius)" }}
              onClick={handleSubmit}
            >
              {isEditMode ? "Guardar Cambios" : "Crear Producto Base"}
            </button>
            {isEditMode ? (
              <button
                onClick={handleCancel}
                className="bg-red-700 text-white px-4 py-2 rounded mt-4 ml-4"
              >
                Cancelar Edicion
              </button>
            ) : null}

            <VariablesPage
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              productId={productId}
              skuId={skuIdBase}
              skuImages={skuImages}
              fetchImages={fetchImages}
              selectedImages={selectedImages}
              handleImageGalleryChange={handleImageGalleryChange}
              handleImageRemove={handleImageRemove}
            />
          </div>
        </div>
        {/* FIN COL PRINCIPAL */}
        <div className="md:col-span-1 border-l mt-2 ml-4 pl-4 ">
          {/* Contenido de la barra lateral */}
          <div
            className="bg-white border border-dashed border-gray-600 p-4 mb-4 hidden lg:block sticky top-24"
            style={{ borderRadius: "var(--radius)" }}
          >
            <h1 className="mb-4 text-bold border-b border-dark uppercase">
              {isEditMode ? "Editar Producto" : "Publicar"}
            </h1>
            <h3>
              Estado:{" "}
              <span className="text-dark font-bold pl-2">
                {isEditMode ? "Publicado" : "Borrador"}
              </span>
            </h3>

            <div className="flex justify-between mt-4 flex-col gap-2">
              <div className="hidden">
                <button
                  className="shadow block w-full text-left py-2 px-4 bg-black text-secondary hover:bg-secondary hover:text-primary"
                  style={{ borderRadius: "var(--radius)" }}
                  type="button"
                >
                  {isEditMode ? "Actualizar Borrador" : "Guardar Borrador"}
                </button>
              </div>
              <div>
                <button
                  className="shadow block w-full text-left py-2 px-4 bg-black text-secondary hover:bg-secondary hover:text-primary"
                  style={{ borderRadius: "var(--radius)" }}
                  type="button"
                  onClick={handleSubmit}
                >
                  {isEditMode ? "Actualizar Producto" : "Publicar Producto"}
                </button>
              </div>
              <div className="space-y-2">
                <hr className="my-4" />
                <button
                  type="button"
                  id="createCategories"
                  onClick={() => handleOpenModal("createCategoriesModal")}
                  className="shadow block w-full text-left py-2 px-4 bg-black text-secondary hover:bg-secondary hover:text-primary"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  Crear Categoría
                </button>
                <button
                  type="button"
                  id="createAttribute"
                  onClick={() => handleOpenModal("createAttributeModal")}
                  className="shadow block w-full text-left py-2 px-4 bg-black text-secondary hover:bg-secondary hover:text-primary"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  Crear Atributo
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
          fetchData={fetchProducTypes}
        />
      </div>

      {/* MODALS */}
    </>
  );
};

export default CrearProductoVariable;
