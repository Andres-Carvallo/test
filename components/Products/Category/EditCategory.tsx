/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useAPI } from "@/app/Context/ProductTypeContext";

interface EditCategoryProps {
  handleCloseModal: any;
  fetchData: any;
}

const EditCategory: React.FC<EditCategoryProps> = ({
  handleCloseModal,
  fetchData,
}) => {
  const { productType, setProductType } = useAPI();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    previewImage: "",
    previewImageName: "",
    previewImageType: "",
    previewImageSize: 0,
    imageLoaded: false,
    base64Data: "",
  });

  useEffect(() => {
    const selectedCategory = productType.find(
      (cat: any) => cat.id === selectedCategoryId
    );

    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name,
        description: selectedCategory.description,
        previewImage: selectedCategory.previewImageUrl,
        previewImageName: "",
        previewImageType: "",
        previewImageSize: 0,
        imageLoaded: true,
        base64Data: "",
      });
    }
  }, [selectedCategoryId, productType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result?.toString().split(",")[1];

        setFormData((prevFormData) => ({
          ...prevFormData,
          previewImage: reader.result as string,
          previewImageName: file.name,
          previewImageType: file.type,
          previewImageSize: file.size,
          imageLoaded: true,
          base64Data: base64Data || "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      previewImage: "",
      previewImageName: "",
      previewImageType: "",
      previewImageSize: 0,
      imageLoaded: false,
      base64Data: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const authToken = getCookie("AdminTokenAuth");
    const categoryIdToUpdate = selectedCategoryId;

    const requestData = {
      name: formData.name,
      description: formData.description,
      statusCode: "ACTIVE",
      ...(formData.base64Data
        ? {
            previewImage: {
              name: formData.previewImageName,
              type: formData.previewImageType,
              size: formData.previewImageSize,
              data: `data:${formData.previewImageType};base64,${formData.base64Data}`,
            },
          }
        : {}),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/product-types/${categoryIdToUpdate}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar los datos.");
      }

      console.log("Datos enviados correctamente:", requestData);

      setFormData({
        name: "",
        description: "",
        previewImage: "",
        previewImageName: "",
        previewImageType: "",
        previewImageSize: 0,
        imageLoaded: false,
        base64Data: "",
      });

      const updatedCategories = productType.map((category: any) =>
        category.id === categoryIdToUpdate
          ? { ...category, ...requestData }
          : category
      );
      setProductType(updatedCategories);
      setSelectedCategoryId("");
      handleCloseModal();
      fetchData(); // Llamamos a fetchData después de enviar el formulario
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(e.target.value);
  };

  const handleDeleteCategory = async () => {
    try {
      // Realizar la llamada a la API para eliminar la categoría
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/product-types/${selectedCategoryId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("AdminTokenAuth")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la categoría.");
      }

      // Actualizar el estado y la lista de categorías después de eliminar la categoría
      const updatedCategories = productType.filter(
        (category: any) => category.id !== selectedCategoryId
      );
      setProductType(updatedCategories);
      setSelectedCategoryId("");
      handleCloseModal();
      fetchData(); // Llamamos a fetchData después de eliminar la categoría
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="shadow-md  rounded-lg p-4 bg-white my-6 overflow-x-auto">
      <div className="relative w-full bg-white rounded-lg sm:p-5">
        <div>
          <div className="pb-4 mb-4 rounded-t border-b sm:mb-5">
            <h3 className="text-lg font-semibold text-gray-900">
              Editar Categoría
            </h3>
          </div>
          <div className="mb-4">
            <label htmlFor="categorySelect">Seleccionar Categoría:</label>
            <select
              id="categorySelect"
              value={selectedCategoryId}
              onChange={handleChangeSelect}
              className="block w-full border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
            >
              <option value="">Seleccionar...</option>
              {productType.map((category: any) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4">
              <div>
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Nombre Categoría"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full min-h-52 p-2.5 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Descripción Categoría"
                  />
                </div>
                <div className="flex flex-col justify-center mt-6 items-center w-full relative border border-dashed border-gray-300 rounded-lg p-5">
                  {formData.imageLoaded ? (
                    <div className="w-full h-40 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 overflow-hidden rounded-lg ">
                          <img
                            src={formData.previewImage}
                            alt="Preview"
                            className="w-full  object-cover rounded-lg"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute top-0 right-0 m-2 text-red-600  bg-white rounded-xl p-2"
                          onClick={handleRemoveImage}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="previewImage"
                      className="cursor-pointer"
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
                          <span className="font-semibold uppercase">
                            Click para Cargar Foto
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG o GIF (MAX. 1MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        id="previewImage"
                        name="previewImage"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4 flex justify-between ">
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-primary hover:bg-secondary text-white hover:text-primary font-medium rounded-lg px-5 py-2.5"
                >
                  Guardar Cambios
                </button>
                <button
                  data-modal-toggle="createProductModal"
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-red-800 hover:bg-secondary text-white hover:text-primary font-medium rounded-lg px-5 py-2.5"
                >
                  Cancelar
                </button>
              </div>
              <button
                onClick={handleDeleteCategory}
                className="bg-red-800 text-white font-medium rounded-lg px-5 py-2.5"
              >
                Eliminar Categoría
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
