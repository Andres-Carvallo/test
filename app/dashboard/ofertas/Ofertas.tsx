/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, ChangeEvent } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getCookie } from "cookies-next";
import Link from "next/link";
import axios from "axios";
import Select from "react-select";
import toast from "react-hot-toast";
import { obtenerProductosBO } from "@/app/utils/obtenerProductosBO";

function Ofertas() {
  const [productos, setProductos] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [skus, setSkus] = useState<any[]>([]);
  const [type, setType] = useState("FIXED_AMOUNT");
  const [amount, setAmount] = useState(0);
  const [hasFreeShipping, setHasFreeShipping] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [products, setProducts] = useState([]);

  const [filteredSkus, setFilteredSkus] = useState<any[]>([]);
  const [selectedSku, setSelectedSku] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [collections, setCollections] = useState<any>([]);
  const [mainImageColeccion, setMainImageColeccion] = useState<string | null>(
    null
  );
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(
    null
  );
  const [imageModified, setImageModified] = useState<boolean>(false);

  const [formDataColeccion, setFormDataColeccion] = useState<any>({
    bannerTitle: "",
    bannerText: "",
    title: "",
    landingText: "pixelup",
    mainImage: {
      name: "",
      type: "",
      size: null,
      data: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataColeccion({ ...formDataColeccion, [name]: value });
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
        setFormDataColeccion((prevFormData: any) => ({
          ...prevFormData,
          [imageKey]: imageInfo,
        }));
        setImageModified(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setImage(null);
    setFormDataColeccion({ ...formDataColeccion, mainImage: null });
    setImageModified(false);
  };

  const handleProductChange = (selectedOption: any) => {
    setSelectedProduct(selectedOption);
    if (selectedOption) {
      // Filtrar los SKU relacionados con el producto seleccionado
      const filtered = skus.filter(
        (sku) => sku.productId === selectedOption.value
      );
      setFilteredSkus(filtered);
      setSelectedSku(null); // Resetear la selección de SKU
    } else {
      setFilteredSkus([]);
      setSelectedSku(null);
    }
  };

  const handleSkuChange = (selectedOption: any) => {
    setSelectedSku(selectedOption);
  };

  useEffect(() => {
    fetchProducts();
    fetchCollections();
    fetchProductos();
    fetchSkus();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products?pageNumber=1&pageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProductos(response.data.products);
      console.log("Products:", response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const PageNumber = 1;
      const PageSize = 100;
      const token = getCookie("AdminTokenAuth");

      const data = await obtenerProductosBO(PageNumber, PageSize, token);
      setProducts(data.products);
      console.log(data.products, "data.products");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Ocurrió un error:", error.message);
      } else {
        console.error("Ocurrió un error desconocido:", error);
      }
    }
  };

  const fetchSkus = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/skus`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSkus(response.data.skus);
      console.log("SKUs:", response.data.skus);
    } catch (error) {
      console.error("Error fetching SKUs:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };
  const toggleActionsDropdown = () => {
    setActionsDropdownVisible(!actionsDropdownVisible);
  };

  const fetchCollections = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/collections?pageNumber=1&pageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCollections(response.data.collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const formatOptionLabel = ({ value, label, previewImageUrl, price }: any) => (
    <div className="flex items-center">
      <img
        src={previewImageUrl}
        alt={label}
        className="w-8 h-8 object-cover rounded mr-2"
      />
      <div>
        <span>{label}</span>
      </div>
      <div>
        <span>{price}</span>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formDataColeccion,
      product: selectedProduct ? { id: selectedProduct.value } : null,
      sku: selectedSku ? { id: selectedSku.value } : null,
    };

    if (!imageModified) {
      delete data.mainImage;
    }

    const token = getCookie("AdminTokenAuth");

    try {
      if (isEditing && editingCollectionId) {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/collections/${editingCollectionId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        fetchCollections();
        toast.success("Colección actualizada con éxito!");

        setFormDataColeccion({
          bannerTitle: "",
          bannerText: "",
          title: "",
          landingText: "pixelup",
          mainImage: {
            name: "",
            type: "",
            size: null,
            data: "",
          },
        });
        setMainImageColeccion(null);
        setSelectedProduct(null);
        setSelectedSku(null);
        setIsEditing(false);
        setEditingCollectionId(null);
        setImageModified(false);
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/collections`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Colección creada con éxito!");

        setFormDataColeccion({
          bannerTitle: "",
          bannerText: "",
          title: "",
          landingText: "pixelup",
          mainImage: {
            name: "",
            type: "",
            size: null,
            data: "",
          },
        });
        setSelectedProduct(null);
        setSelectedSku(null);
        setIsEditing(false);
        setEditingCollectionId(null);
        setImageModified(false);
        fetchCollections();
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
  };

  const handleDelete = async (collectionID: string) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/collections/${collectionID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Colección eliminada:", response.data);
      fetchCollections();
    } catch (error) {
      console.error("Error al eliminar la colección:", error);
    }
  };

  const handleEdit = async (collectionID: any) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/collections/${collectionID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const collection = response.data.collection;
      console.log("Detalle:", response.data.collection);

      // Convertir la URL de la imagen en base64 y obtener su tamaño
      const { base64String: mainImageBase64, size } = await imageUrlToBase64(
        collection.mainImageUrl
      );

      const selectedProductFromApi = {
        value: collection.product.id,
        label: collection.product.name,
        previewImageUrl: collection.product.previewImageUrl,
      };

      const selectedSkuFromApi = {
        value: collection.sku.id,
        label: collection.sku.name,
      };

      setFormDataColeccion({
        bannerTitle: collection.bannerTitle,
        bannerText: collection.bannerText,
        title: collection.title,
        landingText: "pixelup",
        mainImage: {
          name: collection.mainImageUrl.split("/").pop(),
          type: "image/jpeg",
          size,
          data: mainImageBase64,
        },
      });

      setMainImageColeccion(mainImageBase64 ?? null);
      setSelectedProduct(selectedProductFromApi);
      setSelectedSku(selectedSkuFromApi);
      setEditingCollectionId(collectionID);
      setIsEditing(true);
      setImageModified(false);
    } catch (error) {
      console.error("Error editing collection:", error);
    }
  };

  const handleCancelEdit = () => {
    setFormDataColeccion({
      bannerTitle: "",
      bannerText: "",
      title: "",
      landingText: "pixelup",
      mainImage: {
        name: "",
        type: "",
        size: null,
        data: "",
      },
    });
    setMainImageColeccion(null);
    setSelectedProduct(null);
    setSelectedSku(null);
    setIsEditing(false);
    setEditingCollectionId(null);
    setImageModified(false);
  };

  const imageUrlToBase64 = async (
    url: string
  ): Promise<{ base64String: any; size: any }> => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blob = response.data;

      const size = blob.size;

      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      return { base64String, size };
    } catch (error) {
      console.error("Error converting image URL to base64:", error);
      return { base64String: null, size: null };
    }
  };

  const formatDateToChileanTime = (isoDateString: string) => {
    const date = new Date(isoDateString);

    const timezoneOffset = -4 * 60;
    const adjustedDate = new Date(date.getTime() + timezoneOffset * 60 * 1000);

    const day = adjustedDate.getDate().toString().padStart(2, "0");
    const month = (adjustedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = adjustedDate.getFullYear();
    const hours = adjustedDate.getHours().toString().padStart(2, "0");
    const minutes = adjustedDate.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const fetchProductosEnOferta = async (
    productId: string,
    skuId: string
  ): Promise<boolean> => {
    try {
      //const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products?siteId=586b6573-f223-44bd-849a-caac59c4999a&pageNumber=1&pageSize=50&hasOffers=true`

        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json",
        //   },
        // }
      );
      const data = await response.json();
      console.log("fetchHasOfferForVariation", data);
      return data.code === 0 && data.offer ? true : false;
    } catch (error) {
      console.error("Error al obtener el skuOffers de la variación:", error);
      return false;
    }
  };
  return (
    <section>
      <Breadcrumb pageName="Colecciones" />
      <div className="shadow-md border border-primary rounded-lg p-4 bg-white my-6 overflow-x-auto">
        <h2 className="mb-8 text-center text-2xl font-bold text-dark md:mb-12 lg:text-3xl uppercase">
          Ofertas Creadas
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Colección
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Titulo Colección
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                BannerText
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha Creación
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Editar / Eliminar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collections.map((collection: any) => (
              <tr key={collection.id}>
                <td className="px-6 py-4 md:whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">
                    {collection.title}
                  </div>
                </td>
                <td className="px-6 py-4 md:whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">
                    {collection.bannerTitle}
                  </div>
                </td>
                <td className="px-6 py-4 md:whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {collection.bannerText}
                  </div>
                </td>
                <td className="px-6 py-4 md:whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDateToChileanTime(collection.creationDate)}
                  </div>
                </td>

                <td className="px-6 py-4 md:whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(collection.id)}
                    className="bg-primary hover:bg-secondary text-secondary hover:text-primary font-bold py-2 px-4 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <form className="flex items-center">
              <label
                htmlFor="simple-search"
                className="sr-only"
              >
                Search
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search"
                  required
                />
              </div>
            </form>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                id="actionsDropdownButton"
                onClick={toggleActionsDropdown}
                className="w-full hidden md:w-auto  items-center justify-center py-2 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                <svg
                  className="-ml-1 mr-1.5 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
                Actions
              </button>
              <div
                id="actionsDropdown"
                className={`z-10 ${
                  actionsDropdownVisible ? "block" : "hidden"
                } w-44 bg-white rounded absolute top-16 right-20 divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
              >
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="actionsDropdownButton"
                >
                  <li>
                    <a
                      href="#"
                      className="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Mass Edit
                    </a>
                  </li>
                </ul>
                <div className="py-1">
                  <a
                    href="#"
                    className="block py-2 px-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Delete all
                  </a>
                </div>
              </div>
              <button
                id="filterDropdownButton"
                onClick={toggleFilterDropdown}
                className="w-full md:w-auto flex items-center justify-center py-2 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-4 w-4 mr-2 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                Filter
                <svg
                  className="-mr-1 ml-1.5 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
              </button>
              <div
                id="filterDropdown"
                className={`z-10 ${
                  filterDropdownVisible ? "block" : "hidden"
                } w-48 p-3 absolute top-16 right-0 bg-white rounded-lg shadow dark:bg-gray-700`}
              >
                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Choose brand
                </h6>
                <ul
                  className="space-y-2 text-sm"
                  aria-labelledby="filterDropdownButton"
                >
                  <li className="flex items-center">
                    <input
                      id="apple"
                      type="checkbox"
                      checked={true}
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="apple"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Apple (56)
                    </label>
                  </li>
                  <li className="flex items-center">
                    <input
                      id="fitbit"
                      type="checkbox"
                      checked={true}
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="fitbit"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Microsoft (16)
                    </label>
                  </li>
                  <li className="flex items-center">
                    <input
                      id="razor"
                      type="checkbox"
                      checked={true}
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="razor"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Razor (49)
                    </label>
                  </li>
                  <li className="flex items-center">
                    <input
                      id="nikon"
                      type="checkbox"
                      checked={true}
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="nikon"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Nikon (12)
                    </label>
                  </li>
                  <li className="flex items-center">
                    <input
                      id="benq"
                      type="checkbox"
                      checked={true}
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="benq"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      BenQ (74)
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-2 py-3 min-w-20"
                ></th>
                <th
                  scope="col"
                  className="px-2 py-3"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-2 py-3"
                >
                  Categorias
                </th>
                <th
                  scope="col"
                  className="px-2 py-3"
                >
                  Precio
                </th>
                <th
                  scope="col"
                  className="px-2 py-3"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-2 py-3"
                >
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any, index: number) => (
                <tr
                  key={index}
                  className="border-b dark:border-gray-700"
                >
                  {/* Detalles de cada producto */}

                  <td className="px-2 py-3 flex items-center justify-center align-middle">
                    <img
                      src={product.previewImageUrl}
                      alt="User"
                      className="rounded-full h-9 w-9 object-cover"
                    />
                  </td>
                  <td className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {product.name}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex justify-left flex-wrap gap-2  max-w-sm mx-auto  text-sm">
                      {product.productTypes.map((category: any) => (
                        <button
                          key={category.id}
                          className="px-2 py-1 rounded bg-gray-200/50 text-gray-700 hover:bg-gray-300"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </td>

                  <td className="px-2 py-3">{product.price}</td>
                  <td className="px-2 py-3">
                    {product.hasOffer ? (
                      <span className="text-green-500 font-semibold">
                        En Oferta
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold">
                        Sin Oferta
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-3 flex items-center justify-end">
                    <Link
                      href={`/dashboard/ofertas/${product.id}`}
                      className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-800"
                    >
                      Crear oferta
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <nav
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span className="font-semibold text-gray-900 dark:text-white">
              1-10
            </span>
            of
            <span className="font-semibold text-gray-900 dark:text-white">
              1000
            </span>
          </span>
          <ul className="inline-flex items-stretch -space-x-px">
            <li>
              <a
                href="#"
                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                2
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-current="page"
                className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                3
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                ...
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                100
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="shadow-md border border-primary rounded-lg p-4 bg-white my-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-dark md:mb-12 lg:text-3xl uppercase">
          {isEditing ? "Editar Oferta" : "Crear Oferta"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="type"
              className="block"
            >
              <h3 className="font-normal text-primary">Tipo de descuento:</h3>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-white shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                style={{ borderRadius: "var(--radius)" }}
              >
                <option value="FIXED_AMOUNT">Monto Fijo</option>
                <option value="PERCENTAGE">Porcentaje</option>
              </select>
            </label>
          </div>
          {type === "FIXED_AMOUNT" && (
            <div>
              <label
                htmlFor="amount"
                className="block"
              >
                <h3 className="font-normal text-primary mt-2">Monto:</h3>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  placeholder="Enter amount..."
                  className="shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                  style={{ borderRadius: "var(--radius)" }}
                  required
                />
              </label>
            </div>
          )}
          {type === "PERCENTAGE" && (
            <div>
              <label
                htmlFor="percentage"
                className="block"
              >
                <h3 className="font-normal text-primary mt-2">Porcentaje:</h3>
                <input
                  type="number"
                  id="percentage"
                  value={percentage}
                  onChange={(e) => setPercentage(parseFloat(e.target.value))}
                  placeholder="Enter percentage..."
                  className="shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                  style={{ borderRadius: "var(--radius)" }}
                  required
                />
              </label>
            </div>
          )}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasFreeShipping"
              checked={hasFreeShipping}
              onChange={(e) => setHasFreeShipping(e.target.checked)}
              className="mr-2 mt-2"
            />
            <label
              htmlFor="hasFreeShipping"
              className="uppercase mt-2"
            >
              Envío gratis
            </label>
          </div>
          <div>
            <label
              htmlFor="expirationDate"
              className="block mt-2"
            >
              <h3 className="font-normal text-primary">Fecha de inicio:</h3>
              <input
                type="date"
                id="creationDate"
                value={creationDate}
                onChange={(e) => setCreationDate(e.target.value)}
                className="shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                style={{ borderRadius: "var(--radius)" }}
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="expirationDate"
              className="block mt-2"
            >
              <h3 className="font-normal text-primary">Fecha de expiración:</h3>
              <input
                type="date"
                id="expirationDate"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                style={{ borderRadius: "var(--radius)" }}
              />
            </label>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="submit"
              className="shadow bg-primary hover:bg-secondary w-full uppercase text-secondary hover:text-primary font-bold py-2 px-4 rounded flex-wrap mt-6"
              style={{ borderRadius: "var(--radius)" }}
            >
              {isEditing ? "Actualizar Oferta" : "Crear Oferta"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="shadow bg-gray-300 hover:bg-gray-400 w-full uppercase text-black hover:text-white font-bold py-2 px-4 rounded flex-wrap mt-6 ml-4"
                style={{ borderRadius: "var(--radius)" }}
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default Ofertas;
