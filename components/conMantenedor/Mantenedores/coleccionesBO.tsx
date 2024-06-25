/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, ChangeEvent } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getCookie } from "cookies-next";
import axios from "axios";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";

function Colecciones() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
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
  const [imageModified, setImageModified] = useState<boolean>(false); // Nuevo estado

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
        setImageModified(true); // Marcar la imagen como modificada
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setImage(null); // Limpiar la imagen seleccionada
    setFormDataColeccion({ ...formDataColeccion, mainImage: null });
    setImageModified(false); // Resetear la modificación de imagen
  };

  const handleProductChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedProduct(null);
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        selectedOption,
      ]);
    }
  };

  const handleRemoveProduct = (productToRemove: any) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.filter(
        (product) => product.value !== productToRemove.value
      )
    );
  };

  useEffect(() => {
    fetchProducts();
    fetchCollections();
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
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
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

  const formatOptionLabel = ({ value, label, previewImageUrl }: any) => (
    <div className="flex items-center">
      <img
        src={previewImageUrl}
        alt={label}
        className="w-8 h-8 object-cover rounded mr-2"
      />
      <div>
        <span>{label}</span>
      </div>
    </div>
  );

  const availableProducts = productos.filter(
    (product) =>
      !selectedProducts.some((selected) => selected.value === product.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formDataColeccion,
      products: selectedProducts.map((product) => ({
        id: product.value,
      })),
    };

    if (!imageModified) {
      delete data.mainImage; // Eliminar la imagen si no ha sido modificada
    }

    const token = getCookie("AdminTokenAuth");

    try {
      if (isEditing && editingCollectionId) {
        // Actualizar la colección existente
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
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full  pointer-events-auto flex`}
          >
            <div
              className="shadow flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
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
                <span className="font-medium">
                  Coleccion actualizada con exito!
                </span>
              </div>
            </div>
          </div>
        ));

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
        setSelectedProducts([]);
        setIsEditing(false);
        setEditingCollectionId(null);
        setImageModified(false); // Resetear la modificación de imagen
      } else {
        // Crear nueva colección
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
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full  pointer-events-auto flex`}
          >
            <div
              className="shadow flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
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
                <span className="font-medium">Coleccion creada con exito!</span>
              </div>
            </div>
          </div>
        ));
      }

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
      setSelectedProducts([]);
      setSelectedProduct([]);
      setIsEditing(false);
      setEditingCollectionId(null);
      setImageModified(false);
      fetchCollections();
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
      fetchCollections(); // Vuelve a cargar las colecciones después de eliminar una
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

      const selectedProductsFromApi = collection.products.map(
        (product: any) => ({
          value: product.id,
          label: product.name,
          previewImageUrl: product.previewImageUrl,
        })
      );

      setFormDataColeccion({
        bannerTitle: collection.bannerTitle,
        bannerText: collection.bannerText,
        title: collection.title,
        landingText: "pixelup",
        mainImage: {
          name: collection.mainImageUrl.split("/").pop(),
          type: "image/jpeg", // Ajusta esto según el tipo de imagen que esperes
          size, // Aquí estamos configurando el tamaño de la imagen
          data: mainImageBase64,
        },
      });
      console.log("NombreFoto:", formDataColeccion);

      setMainImageColeccion(mainImageBase64);
      setSelectedProducts(selectedProductsFromApi);
      setEditingCollectionId(collectionID);
      setIsEditing(true);
      setImageModified(false); // Resetear la modificación de imagen
    } catch (error) {
      console.error("Error editing collection:", error);
      // Manejo de errores
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
    setSelectedProducts([]);
    setIsEditing(false);
    setEditingCollectionId(null);
    setImageModified(false); // Resetear la modificación de imagen
  };

  const imageUrlToBase64 = async (
    url: string
  ): Promise<{ base64String: any; size: any }> => {
    // function implementation
    try {
      // Obtener el blob de la imagen
      const response = await axios.get(url, { responseType: "blob" });
      const blob = response.data;

      // Obtener el tamaño del blob
      const size = blob.size;

      // Convertir blob a base64
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
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

    // Ajustar la hora a la zona horaria de Chile (GMT-4)
    const timezoneOffset = -4 * 60; // -4 horas en minutos
    const adjustedDate = new Date(date.getTime() + timezoneOffset * 60 * 1000);

    const day = adjustedDate.getDate().toString().padStart(2, "0");
    const month = (adjustedDate.getMonth() + 1).toString().padStart(2, "0"); // Los meses son 0-indexados
    const year = adjustedDate.getFullYear();
    const hours = adjustedDate.getHours().toString().padStart(2, "0");
    const minutes = adjustedDate.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <section>
      <Breadcrumb pageName="Colecciones" />
      <div className="shadow-md  rounded-lg p-4 bg-white my-6 overflow-x-auto">
        <h2 className="mb-8 text-center text-2xl font-bold text-dark md:mb-12 lg:text-3xl uppercase">
          Colecciones Creadas
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Foto
              </th>
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
                className="px-6 hidden py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                <td className="px-6 py-4 md:whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <img
                      src={collection.mainImageUrl}
                      alt=""
                      className="w-20"
                    />
                  </div>
                </td>
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
                <td className="px-6 py-4 md:whitespace-nowrap hidden">
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

      <div className="shadow-md  rounded-lg p-4 bg-white my-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-dark md:mb-12 lg:text-3xl uppercase">
          {isEditing ? "Editar Colección" : "Crear Colección"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mt-4">
            <h3 className="font-normal text-primary">
              Nombre Colección <span className="text-primary">*</span>
            </h3>
            <input
              id="title"
              name="title"
              value={formDataColeccion.title}
              onChange={handleChange}
              placeholder="Ingresa nombre de la colección..."
              className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
              style={{ borderRadius: "var(--radius)" }}
            />
          </label>
          <label className="block mt-4">
            <h3 className="font-normal text-primary">
              Título Banner <span className="text-primary">*</span>
            </h3>
            <input
              id="bannerTitle"
              name="bannerTitle"
              value={formDataColeccion.bannerTitle}
              onChange={handleChange}
              placeholder="Ingresa título del banner..."
              className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
              style={{ borderRadius: "var(--radius)" }}
            />
          </label>

          <label className="block mt-4">
            <h3 className="font-normal text-primary">
              Texto Banner <span className="text-primary">*</span>
            </h3>
            <input
              id="bannerText"
              name="bannerText"
              value={formDataColeccion.bannerText}
              onChange={handleChange}
              placeholder="Ingresa texto del banner..."
              className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
              style={{ borderRadius: "var(--radius)" }}
            />
          </label>

          <div>
            <input
              type="file"
              accept="image/*"
              id="mainImage"
              className="hidden"
              onChange={(e) =>
                handleImageChange(e, setMainImageColeccion, "mainImage")
              }
            />
            {mainImageColeccion ? (
              <div>
                <h3 className="font-normal text-primary">
                  Foto <span className="text-primary">*</span>
                </h3>
                <div className="relative mt-2 h-[150px] rounded-lg object-contain overflow-hidden">
                  <img
                    src={mainImageColeccion}
                    alt="Main Image"
                    className="w-full"
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 m-1 text-xs"
                    onClick={() => handleClearImage(setMainImageColeccion)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
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
                <h3 className="font-normal text-primary">
                  Foto <span className="text-primary">*</span>
                </h3>
                <label
                  htmlFor="mainImage"
                  className="border-primary shadow flex mt-3 flex-col bg-white justify-center items-center pt-5 pb-6 border border-dashed cursor-pointer w-full z-10"
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

          <div className="mt-8">
            <label
              htmlFor="product"
              className="block"
            >
              <h3 className="font-normal text-primary">Producto:</h3>
              <Select
                id="product"
                value={selectedProduct}
                onChange={handleProductChange}
                options={availableProducts.map((producto) => ({
                  value: producto.id,
                  label: producto.name,
                  previewImageUrl: producto.previewImageUrl,
                }))}
                formatOptionLabel={formatOptionLabel}
                className="shadow block w-full mt-2"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "var(--radius)",
                  }),
                }}
                isClearable
              />
            </label>
          </div>

          <div className="mt-8">
            <h3 className="text-primary font-normal">
              Productos seleccionados:
            </h3>
            {selectedProducts.length === 0 ? (
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
                    No hay productos seleccionados.
                  </span>{" "}
                  Se debe seleccionar productos para poder mostrarlos en la
                  colección.
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {selectedProducts.map((product) => (
                  <div
                    key={product.value}
                    className="shadow flex items-center space-x-2 mt-2 border p-2"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    <img
                      src={product.previewImageUrl}
                      alt={product.label}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span>{product.label}</span>
                    <button
                      onClick={() => handleRemoveProduct(product)}
                      className="shadow ml-auto bg-primary text-secondary hover:text-primary hover:bg-secondary p-2 flex items-center justify-center"
                      style={{ borderRadius: "var(--radius)" }}
                      title="Eliminar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="submit"
              className="shadow bg-primary hover:bg-secondary w-full uppercase text-secondary hover:text-primary font-bold py-2 px-4 rounded flex-wrap mt-6"
              style={{ borderRadius: "var(--radius)" }}
            >
              {isEditing ? "Actualizar Colección" : "Crear Colección"}
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

export default Colecciones;
