/* eslint-disable jsx-a11y/alt-text */
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
import { useSearchParams, useRouter } from "next/navigation"; // Importar los hooks necesarios
import ImageUploader from "./ImageUploader";
import StarCheckbox from "@/components/PIXELUP/Checkbox/StarCheckbox";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";

const CrearProductoSimple: React.FC = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { productType, setProductType } = useAPI();
  const [openModalId, setOpenModalId] = useState(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [precioNormal, setPrecioNormal] = useState<number | null>(null);
  const [stockQuantity, setStockQuantity] = useState<number | null>(null);
  const [precioOferta, setPrecioOferta] = useState<number | null>(null);
  const [offerPrice, setOfferPrice] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState("");
  const [productId, setProductId] = useState<string | null>(null);
  const [skuId, setSkuId] = useState(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [checkOfferChecked, setCheckOfferChecked] = useState(false);
  const [isMainImageUploaded, setIsMainImageUploaded] = useState(false);
  const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);
  const searchParams = useSearchParams(); // Utilizar useSearchParams para obtener parámetros de búsqueda
  const router = useRouter(); // Utilizar useRouter para redirigir si es necesario
  const [skuImages, setSkuImages] = useState<any[]>([]);
  const [alertStock, setAlertStock] = useState<number | null>(null);

  const [isFeatured, setIsFeatured] = useState(false);

  const handleCheckboxChange = () => {
    setIsFeatured(!isFeatured);
    setFormData((prevFormData) => ({
      ...prevFormData,
      isFeatured: !prevFormData.isFeatured,
    }));
  };

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
  const handleDeleteForm = () => {
    setFormData(() => ({
      productTypes: [],
      name: "",
      description: "",
      statusCode: "ACTIVE",
      enabledForDelivery: false,
      enabledForWithdrawal: false,
      hasVariations: false,
      hasFeaturedBaseSku: false,
      isFeatured: false,
      measures: {
        length: 1,
        width: 1,
        height: 1,
        weight: 1,
      },
      previewImage: {
        name: "pixelup.cl",
        type: "image/png",
        size: 10385,
        data: "aquivaladata",
      },
      mainImage: {
        name: "",
        type: "",
        size: null,
        data: "",
      },
    }));
    setAlertStock(null);
    setCheckOfferChecked(false);
    setMainImage(null);
    setPreviewImage(null);
    setPrecioNormal(null);
    setStockQuantity(null);
    setSelectedImages([]);
    setSkuImages([]);
    setIsEditMode(false);
    router.replace("/dashboard/productos/crear/producto-simple");
  };

  const fetchDestacado = async (productId: any, skuId: any) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.code === 0) {
        setIsFeatured(data.sku.isFeatured);
        // Extracción del stock de la primera skuInventory, si existe
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

  // const fetchOffer = async (productId: any, skuId: any) => {
  //   try {
  //     const token = getCookie("AdminTokenAuth");
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/offers`,

  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     console.log(data, "data offer");
  //     if (data.code === 0) {
  //       // Extracción del stock de la primera skuInventory, si existe
  //       setOfferPrice(data.skuOffers[0].unitPrice);
  //     } else {
  //       console.error(
  //         "Error al obtener el stock de la variación:",
  //         data.message
  //       );
  //       return null; // En caso de error, devuelve null
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener el stock de la variación:", error);
  //     return null; // En caso de error, devuelve null
  //   }
  // };

  // Obtener tipos de producto
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

  const fetchStock = async (productId: any, skuId: any) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/inventories?warehouseId=22a8401d-da05-49a8-958f-9ab93623582c`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data, "datastock");
      if (data.code === 0) {
        // Extracción del stock de la primera skuInventory, si existe
        setStockQuantity(data.skuInventories[0].quantity);

        setAlertStock(data.skuInventories[0].minimumQuantity);
        setCheckOfferChecked(data.skuInventories[0].minimumQuantity !== 0);
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

  const handleDeleteImage = async (
    productId: any,
    skuId: any,
    imageId: any
  ) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const url = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/images/${imageId}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.delete(url, { headers });

      if (response.status === 200) {
        // Eliminar la imagen de la lista de imágenes
        fetchImages(productId, skuId);
      } else {
        console.error("Error al eliminar la imagen:", response.status);
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  const fetchPrice = async (productId: string, skuId: string) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/pricings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.code === 0) {
        // Extracción del precio de la primera skuPricing, si existe
        setPrecioNormal(data.skuPricings[0].unitPrice);
      } else {
        console.error(
          "Error al obtener el precio de la variación:",
          data.message
        );
        return null; // En caso de error, devuelve null
      }
    } catch (error) {
      console.error("Error al obtener el precio de la variación:", error);
      return null; // En caso de error, devuelve null
    }
  };

  useEffect(() => {
    fetchProducTypes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleImageChange = (e: any, setImage: any, imageKey: any) => {
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

  const productTypeOptions = productType.map(
    (producto: { id: string; name: string }) => ({
      value: producto.id,
      label: producto.name,
    })
  );

  const [formData, setFormData] = useState({
    productTypes: [],
    name: "",
    description: "",
    statusCode: "ACTIVE",
    enabledForDelivery: false,
    enabledForWithdrawal: false,
    hasVariations: false,
    hasFeaturedBaseSku: false,
    isFeatured: true,
    measures: {
      length: 1,
      width: 1,
      height: 1,
      weight: 1,
    },
    previewImage: {
      name: "pixelup.cl",
      type: "image/png",
      size: 10385,
      data: "aquivadata",
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
      const token = getCookie("AdminTokenAuth");
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
    skuId: string,
    precioNormal: number
  ) => {
    try {
      const token = getCookie("AdminTokenAuth");
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
        const warehouseId = await getWarehouseId();
        if (!warehouseId) return;

        // Verificar si ya existe un precio para el SKU
        const existingPricingsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/pricings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let method = "POST";
        let pricingUrl = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/pricings`;
        let data = {
          currencyCodeId: currencyCodeId,
          unitPrice: precioNormal,
          warehouseId: warehouseId,
        };

        if (
          existingPricingsResponse.data.skuPricings &&
          existingPricingsResponse.data.skuPricings.length > 0
        ) {
          console.log(
            "existingPricingsResponse existentes:",
            existingPricingsResponse.data
          );
          // Update existing price
          method = "PUT";
          pricingUrl = `${pricingUrl}/${existingPricingsResponse.data.skuPricings[0].id}`;
          // Eliminar warehouseId del payload si es una actualización

          console.log("Actualizando precio existente con URL:", pricingUrl);
        } else {
          console.log("Creando nuevo precio con URL:", pricingUrl);
        }

        const response = await axios({
          method: method,
          url: pricingUrl,
          data: data,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status >= 200 && response.status < 300) {
          console.log("Price added/updated successfully");
        } else {
          console.error("Error adding/updating price:", response.statusText);
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
    quantity: number,
    minimumQuantity: number
  ) => {
    try {
      console.log("Obteniendo warehouseId");
      const warehouseId = await getWarehouseId();
      if (!warehouseId) {
        console.error("No se pudo obtener el warehouseId");
        return;
      }

      const token = getCookie("AdminTokenAuth");
      const stockData: any = {
        warehouseId: warehouseId,
        quantity: quantity,
        minimumQuantity:
          minimumQuantity && checkOfferChecked && alertStock !== null
            ? alertStock
            : 0,
      };

      console.log("Obteniendo inventarios existentes");
      const existingInventories = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/inventories?warehouseId=${warehouseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Inventarios existentes:", existingInventories.data);

      let method = "POST";
      let stockUrl = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/inventories`;

      if (existingInventories.data.skuInventories.length > 0) {
        // Update existing stock
        method = "PUT";
        stockUrl = `${stockUrl}/${existingInventories.data.skuInventories[0].id}`;
        console.log("Actualizando stock existente con URL:", stockUrl);
      } else {
        console.log("Creando nuevo stock con URL:", stockUrl);
      }

      const response = await axios({
        method: method,
        url: stockUrl,
        data: stockData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("Stock añadido/actualizado correctamente");
      } else {
        console.error(
          "Error al añadir/actualizar el stock:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  // Función para agregar una imagen a través de la API
  const addProductImage = async (id: string, skuId: string, image: string) => {
    try {
      const name = image.substring(image.indexOf("/") + 1, image.indexOf(";"));
      const type = image.substring(
        image.indexOf(":") + 1,
        image.indexOf(";base64")
      );
      const size = Math.round(
        (image.length - image.indexOf("base64") - "base64".length) * 0.75
      );

      const formattedImage = {
        mainImage: {
          name: name,
          type: type,
          size: size,
          data: image,
        },
      };
      const token = getCookie("AdminTokenAuth");
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
    setIsLoading(true); // Mostrar el loader

    try {
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}`
        : `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products`;

      const method = isEditMode ? "PUT" : "POST";
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error(
          "Error en la respuesta del servidor:",
          response.statusText
        );
        setIsLoading(false); // Ocultar el loader
        return;
      }

      const responseData = await response.json();
      console.log("Datos de la respuesta:", responseData);

      if (!isEditMode) {
        // Caso de creación
        if (!responseData || !responseData.product) {
          console.error(
            "La respuesta no contiene el objeto 'product' esperado."
          );
          setIsLoading(false); // Ocultar el loader
          return;
        }

        const { product } = responseData;
        const { id, skuId: sku } = product;

        if (id && sku) {
          console.log("Producto creado con ID:", id, "y SKU:", sku);

          if (stockQuantity !== null && alertStock !== null) {
            console.log(
              "Llamando a addProductStock con stockQuantity:",
              stockQuantity
            );
            await addProductStock(id, sku, stockQuantity, alertStock);
          }
          if (precioNormal !== null) {
            console.log("Llamando a addProductPricing");
            await addProductPricing(id, sku, precioNormal);
          }
          for (const image of selectedImages) {
            console.log("Llamando a addProductImage con imagen:", image);
            await addProductImage(id, sku, image);
          }

          toast.success("Producto creado correctamente");

          setProductId(product.id);
          setIsEditMode(true);
          router.replace(`${window.location.pathname}?productId=${id}`);
        } else {
          console.error("Error al crear el producto: ID o SKU no válidos");
        }
      } else {
        // Caso de actualización
        if (responseData.code === 0 && responseData.message === "Success") {
          toast.success("Producto actualizado correctamente");

          if (precioNormal && productId && skuId !== null) {
            console.log("Llamando a addProductPricing");
            await addProductPricing(productId, skuId, precioNormal);
          }

          if (stockQuantity && productId && skuId && alertStock !== null) {
            await addProductStock(productId, skuId, stockQuantity, alertStock);
          }

          for (const image of selectedImages) {
            await addProductImage(
              productId !== null ? productId : "",
              skuId !== null ? skuId : "",
              image
            );
          }

          console.log("Producto actualizado correctamente");
        } else {
          console.error(
            "Error al actualizar el producto:",
            responseData.message
          );
        }
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    } finally {
      setIsLoading(false); // Ocultar el loader al final
    }
  };

  // Efecto para detectar el productId en los parámetros de búsqueda y entrar en modo edición
  useEffect(() => {
    const id = searchParams.get("productId");
    if (id) {
      setProductId(id);
      setIsEditMode(true);
    }
  }, [searchParams]);

  // Efecto para obtener datos del producto si se está en modo edición
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
        fetchStock(productData.id, productData.skuId);
        fetchPrice(productData.id, productData.skuId);
        fetchImages(productData.id, productData.skuId);
        setSkuId(productData.skuId);

        const selectedProductTypes = productData.productTypes.map(
          (productType: any) => ({
            id: productType.id,
            name: productType.name,
          })
        );

        setFormData({
          ...formData,
          name: productData.name,
          description: productData.description,
          enabledForDelivery: productData.enabledForDelivery,
          enabledForWithdrawal: productData.enabledForWithdrawal,
          hasVariations: productData.hasVariations,
          productTypes: selectedProductTypes,
          isFeatured: productData.isFeatured,
          mainImage: isMainImageUploaded ? formData.mainImage : undefined,
          previewImage: isPreviewImageUploaded
            ? formData.previewImage
            : undefined,
          measures: productData.measures || {
            length: null,
            width: null,
            height: null,
            weight: null,
          },
        });

        setIsFeatured(productData.isFeatured); // Asegúrate de actualizar el estado de isFeatured
        setMainImage(productData.mainImageUrl);
        setPreviewImage(productData.previewImageUrl);
      } catch (error) {
        console.error("Error al obtener los datos del producto:", error);
        setIsEditMode(false);
        router.replace(window.location.pathname);
      }
    };

    if (isEditMode && productId) {
      fetchProductData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleImageGalleryChange = (images: any) => {
    setSelectedImages(images);
  };

  const handleImageRemove = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Breadcrumb
        pageName={isEditMode ? "Editar Producto" : "Crear Producto"}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 px-4">
        {/* Columna principal */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col pb-8 ">
          <div className="border border-dashed border-dark/50 rounded-lg p-4 mb-4 block lg:hidden sticky top-24 bg-white z-50">
            <div style={{ borderRadius: "var(--radius)" }}>
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
                    className="shadow block w-full text-left py-2 px-4 bg-primary text-secondary hover:bg-secondary hover:text-primary"
                    style={{ borderRadius: "var(--radius)" }}
                    type="button"
                  >
                    {isEditMode ? "Actualizar Borrador" : "Guardar Borrador"}
                  </button>
                </div>
                <div>
                  <button
                    className="shadow block w-full text-left py-2 px-4 bg-primary text-secondary hover:bg-secondary hover:text-primary"
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
                    className="shadow flex gap-2 w-full text-left py-2 px-4 bg-primary text-secondary hover:bg-secondary hover:text-primary"
                    style={{ borderRadius: "var(--radius)" }}
                  >
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
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>{" "}
                    Categorías
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteForm}
                    style={{ borderRadius: "var(--radius)" }}
                    className="shadow flex gap-2 w-full text-left py-2 px-4 bg-red-800 text-secondary hover:bg-secondary hover:text-primary"
                  >
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
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 2xl:grid-cols-1 gap-2">
            <div
              style={{ borderRadius: "var(--radius)" }}
              className="shadow flex items-center p-4 my-2  text-sm text-blue-800 border border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
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
                <span className="font-semibold">SEO.</span> La información que
                cargues en el Título, Descripción y Fotografía Principal, será
                la que aparecerá en una búsqueda orgánica.
              </div>
            </div>
            <div>
              <label
                htmlFor="nombreProducto"
                className="font-normal "
              >
                Nombre Producto
              </label>
              <input
                className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
                style={{ borderRadius: "var(--radius)" }}
                type="text"
                name="nombreProducto"
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
              />
            </div>
            <div className="">
              <label className="font-normal ">Descripción Producto</label>
              <textarea
                className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
                style={{ borderRadius: "var(--radius)" }}
                name="descripcionProducto"
                cols={30}
                rows={5}
                value={formData.description}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
              ></textarea>
            </div>
            <div className="flex gap-6">
              {" "}
              <div className="my-2 space-x-4 w-[40%]">
                <h3 className="text-md font-bold uppercase mb-2">
                  Disponible para:
                </h3>
                <label htmlFor="enabledForDelivery">Delivery</label>
                <input
                  type="checkbox"
                  id="enabledForDelivery"
                  name="enabledForDelivery"
                  checked={formData.enabledForDelivery}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      [event.target.name]: event.target.checked,
                    })
                  }
                />
                <label htmlFor="enabledForWithdrawal">Retiro</label>
                <input
                  type="checkbox"
                  id="enabledForWithdrawal"
                  name="enabledForWithdrawal"
                  checked={formData.enabledForWithdrawal}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      [event.target.name]: event.target.checked,
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="producotDestacado"
                  className="font-normal "
                >
                  Producto Destacado
                </label>
                <div className="flex">
                  <div className="self-center mx-6">
                    <StarCheckbox
                      isChecked={isFeatured}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div
                    style={{ borderRadius: "var(--radius)" }}
                    className="shadow flex items-center p-4 my-2  text-sm text-blue-800 border border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
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
                      Pincha la estrella para agregar al carrusel de Destacados
                      de tu Home.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div>
              <label className="font-normal ">Categoría</label>
              <Select
                isMulti
                name="Categorías"
                options={productTypeOptions}
                classNamePrefix="Selecciona"
                className="basic-multi-select block mt-2 w-full text-sm text-dark bg-white focus:ring-primary focus:border-primary"
                value={formData.productTypes.map((productType: any) => ({
                  value: productType.id,
                  label: productType.name,
                }))}
                onChange={(selectedOptions) => {
                  const selectedIds = selectedOptions.map((option: any) => ({
                    id: option.value,
                    name: option.label, // Incluye el nombre para que se muestre correctamente en modo edición
                  }));
                  setFormData({
                    ...formData,
                    productTypes: selectedIds,
                  } as any);
                }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 space-y-8">
            <div
              className="shadow border  p-4"
              style={{ borderRadius: "var(--radius)" }}
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-normal ">Precio</label>
                  <input
                    type="number"
                    className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
                    style={{ borderRadius: "var(--radius)" }}
                    value={precioNormal !== null ? precioNormal : ""}
                    onChange={(e) =>
                      setPrecioNormal(parseFloat(e.target.value))
                    }
                    name="precioProducto"
                    required
                  />
                </div>
                <div>
                  <label className="font-normal ">Stock</label>
                  <input
                    type="number"
                    className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
                    style={{ borderRadius: "var(--radius)" }}
                    value={stockQuantity !== null ? stockQuantity : ""}
                    onChange={(e) =>
                      setStockQuantity(parseFloat(e.target.value))
                    }
                    name="precioProducto"
                    required
                  />
                </div>
              </div>
              <div className="flex ">
                <label className="items-center cursor-pointer inline-flex pl-2">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checkOfferChecked}
                    onChange={(e) => setCheckOfferChecked(e.target.checked)}
                  />
                  <div className="relative w-8 h-5 bg-secondary peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Activar Alerta
                  </span>
                </label>
              </div>
            </div>
            <div
              className={`mt-4 bg-primary p-4 text-dark shadow border   ${
                checkOfferChecked ? "" : " hidden"
              }`}
              style={{ borderRadius: "var(--radius)" }}
            >
              <div>
                <label className="font-normal text-white">
                  Recibiras una alerta al alcanzar el stock minimo
                </label>
                <input
                  type="number"
                  className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
                  style={{ borderRadius: "var(--radius)" }}
                  name="AlertadeStock"
                  value={alertStock !== null ? alertStock : ""}
                  onChange={(e) => setAlertStock(parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 mt-8 gap-4">
            <div className="col-span-1">
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
                  <label className="font-normal ">Imagen Principal</label>

                  <div
                    className="shadow relative mt-2 h-[150px] object-contain overflow-hidden bg-center bg-no-repeat bg-cover"
                    style={{
                      borderRadius: "var(--radius)",
                      backgroundImage: `url(${mainImage})`,
                    }}
                  >
                    {/* <img
                      src={mainImage}
                      alt="Main Image"
                      className="w-full"
                    /> */}
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
                  <label className="font-normal ">Imagen Principal</label>
                  <label
                    htmlFor="mainImage"
                    className="shadow flex mt-2 flex-col bg-white justify-center items-center pt-5 pb-6 border border-dashed border-gray-600 cursor-pointer w-full z-10"
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
                        PNG, JPG or Webp (MAX. 1MB)
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>
            <div className="hidden">
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
                  <label className="font-normal ">Imagen Secundaria</label>
                  <div
                    className="relative mt-2 h-[150px] object-contain overflow-hidden"
                    style={{ borderRadius: "var(--radius)" }}
                  >
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
                  <label className="font-normal ">Imagen Secundaria</label>
                  <label
                    htmlFor="previewImage"
                    className="shadow flex flex-col mt-2 bg-white justify-center items-center pt-5 pb-6 border border-dashed border-gray-600 cursor-pointer w-full z-10"
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
            <div className="col-span-3">
              <label className="font-normal text-primary">
                Galeria de imagenes
              </label>

              <div className="flex space-x-4 overflow-x-auto">
                {isEditMode ? (
                  <ImageUploader
                    productId={productId}
                    skuId={skuId}
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
            </div>
          </div>

          {/* <div className="mt-8">
            <TabExtra
              setFormData={setFormData}
              formData={formData}
            />
          </div> */}
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
                  className="shadow flex gap-2 w-full text-left py-2 px-4 bg-black text-secondary hover:bg-secondary hover:text-primary"
                  style={{ borderRadius: "var(--radius)" }}
                >
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
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>{" "}
                  Categorías
                </button>
                <button
                  type="button"
                  onClick={handleDeleteForm}
                  style={{ borderRadius: "var(--radius)" }}
                  className="shadow flex gap-2 w-full text-left py-2 px-4 bg-red-800 text-secondary hover:bg-secondary hover:text-primary"
                >
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  Cancelar
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
      <div
        id="createAttributeModal"
        tabIndex={-1}
        className={`overflow-y-auto overflow-x-hidden p-32 pt-0 fixed top-0 right-0 backdrop-blur-sm bg-[#00000080] left-0 z-50 w-full h-[calc(100%)] ${
          openModalId === "createAttributeModal" ? "" : "hidden"
        }`}
      >
        <CreateAtribute
          handleCloseModal={handleCloseModal}
          fetchData={fetchProducTypes}
        />
      </div>
      {/* MODALS */}
    </>
  );
};

export default CrearProductoSimple;
