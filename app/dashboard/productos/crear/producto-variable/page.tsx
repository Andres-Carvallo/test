/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useAPI } from "@/app/Context/ProductTypeContext";
import Select from "react-select";
import GalleryUpload from "@/components/Products/ImgUpload/GalleryUpload";
import { getCookie } from "cookies-next";
import axios from "axios";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import VariablesPage from "./VariablesSection";
import ImageUpload from "./ImageUpload";

const CrearProductoVariable: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [initialMainImage, setInitialMainImage] = useState(null);
  const [initialPreviewImage, setInitialPreviewImage] = useState(null);
  const [isMainImageUploaded, setIsMainImageUploaded] = useState(false);
  const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const { productType, setProductType } = useAPI();
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [formData, setFormData] = useState({
    productTypes: [],
    name: "",
    description: "",
    statusCode: "ACTIVE",
    enabledForDelivery: false,
    enabledForWithdrawal: false,
    hasVariations: true,
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

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState([]);
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

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const token = getCookie("tokenAuth");
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

  const handleImageGalleryChange = (newImages: any) => {
    setSelectedImages(newImages);
  };

  const handleImageRemove = (index: any) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
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
    setIsEditMode(false);
    setFormData({
      productTypes: [],
      name: "",
      description: "",
      statusCode: "ACTIVE",
      enabledForDelivery: false,
      enabledForWithdrawal: false,
      hasVariations: true,
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
  };
  const fetchProductDetails = async (idVariable: any) => {
    const token = getCookie("tokenAuth");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${idVariable}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.json();
    if (responseData.code === 0) {
      return {
        productId: responseData.product.id,
        skuId: responseData.product.skuId,
      };
    } else {
      console.error("Error fetching product details:", responseData.message);
      return null;
    }
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
      const token = getCookie("tokenAuth");

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
        console.log(responseData);

        if (isEditMode) {
          const productId: string = responseData.product.id;
          const searchParams = new URLSearchParams(window.location.search);
          const idVariable = searchParams.get("productVariableId");
          const productDetails = await fetchProductDetails(idVariable);

          if (productDetails) {
            const { productId, skuId } = productDetails;

            // Aquí puedes integrar cualquier lógica adicional si es necesario

            console.log(`El ID del producto es: ${productId}`);
            console.log(`El ID del SKU es: ${skuId}`);
          }

          // Actualizar la URL si es necesario
          fetchData();

          if (idVariable !== productId) {
            searchParams.set("productVariableId", productId);
            const newURL = `${
              window.location.pathname
            }?${searchParams.toString()}`;
            router.replace(newURL);
          }
        } else {
          const { product } = responseData;
          const { id, skuId: sku } = product;

          if (id && sku) {
            console.log(`El ID del producto es: ${id}`);
            console.log(`El ID del SKU es: ${sku}`);

            // Actualizar la URL si es necesario
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
        }
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

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label htmlFor="nombreProducto">Nombre Producto Base</label>
          <input
            className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
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
            <label className="">Categoría de Producto Base</label>
            <Select
              options={productTypeOptions}
              isMulti
              value={formData.productTypes}
              onChange={(selectedOptions: any) => {
                setFormData({ ...formData, productTypes: selectedOptions });
                setSelectedProductTypes(selectedOptions);
              }}
              className="mt-2"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between py-2 px-4 my-2 gap-4 border w-full">
        <label
          className="block  cursor-pointer"
          htmlFor="habilitarDespacho"
        >
          <div className="flex gap-4 items-center bg-primary p-2 rounded-xl text-black font-medium hover:bg-primary/30 ">
            Habilitar Despacho
            <input
              type="checkbox"
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
                    : { length: null, width: null, height: null, weight: null },
                });
              }}
            />
          </div>
        </label>
        <div className="flex gap-4 items-center">
          <label
            className="block"
            htmlFor="habilitarRetiro"
          >
            Habilitar Retiro
          </label>
          <input
            type="checkbox"
            name="habilitarRetiro"
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
      <div>
        <label htmlFor="descripcion">Descripción Producto Base</label>
        <textarea
          className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
          name="descripcion"
          id="descripcion"
          value={formData.description}
          onChange={(event) =>
            setFormData({ ...formData, description: event.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <input
            type="file"
            accept="image/*"
            id="mainImage"
            className="hidden"
            onChange={(e) => handleImageChange(e, setMainImage, "mainImage")}
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

        <div className="mt-2">
          <h1 className="mb-2">Galería</h1>
          <GalleryUpload
            selectedImages={selectedImages}
            handleImageGalleryChange={handleImageGalleryChange}
            handleImageRemove={handleImageRemove}
          />
        </div>
      </div>

      <label htmlFor="medidas">
        <div className="mt-2 flex gap-2">
          <h3>Medidas Delivery</h3>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? (
              <span className="bg-primary p-1 text-xs">Ocultar</span>
            ) : (
              <span className="bg-primary p-1 text-xs">Mostrar</span>
            )}
          </button>
        </div>
      </label>

      {showForm && formData.enabledForDelivery && (
        <div className="mt-2">
          <div className="mt-2">
            <label htmlFor="largo">Largo</label>
            <input
              type="number"
              name="length"
              className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
              value={measures.length || ""}
              onChange={handleInputMeasuresChange}
            />
          </div>
          <div>
            <label htmlFor="ancho">Ancho</label>
            <input
              type="number"
              name="width"
              className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
              value={measures.width || ""}
              onChange={handleInputMeasuresChange}
            />
          </div>
          <div>
            <label htmlFor="alto">Alto</label>
            <input
              type="number"
              name="height"
              className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
              value={measures.height || ""}
              onChange={handleInputMeasuresChange}
            />
          </div>
          <div>
            <label htmlFor="peso">Peso</label>
            <input
              type="number"
              name="weight"
              className="block p-2 mt-2 w-full text-sm text-dark bg-white rounded-md border border-dark/30 focus:ring-primary focus:border-primary"
              value={measures.weight || ""}
              onChange={handleInputMeasuresChange}
            />
          </div>
        </div>
      )}

      <button
        className="bg-primary text-white px-4 py-2 rounded mt-4"
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
      />
    </div>
  );
};

export default CrearProductoVariable;
