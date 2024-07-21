import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useAPI } from "@/app/Context/ProductTypeContext";

interface CreateAttributeProps {
  handleCloseModal: any;
  fetchData: any;
}

const CreateAtribute: React.FC<CreateAttributeProps> = ({
  handleCloseModal,
  fetchData,
}) => {
  const token = String(getCookie("AdminTokenAuth"));

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    statusCode: "ACTIVE",
  });

  const { fetchAttributes, attributes, setAttributes, loading, error } =
    useAPI();

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este atributo?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/attributes/${id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchAttributes();
        fetchData();
      } else {
        console.error("Error al eliminar el Atributo:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/attributes?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
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
        handleCloseModal();
        setFormData({
          name: "",
          description: "",
          statusCode: "ACTIVE",
        });
        fetchAttributes();
      } else {
        console.error("Error al crear el Atributo:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  useEffect(() => {
    fetchAttributes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: value,
    }));
  };

  return (
    <div className="relative px-12 flex mt-[10%] justify-center ">
      <div className="relative p-4 grid grid-cols-1 sm:grid-cols-2 max-w-[45vw] min-w-[45vw] bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <div>
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 ">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Crear / Eliminar Atributo
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-1">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      name: event.target.value,
                    }))
                  }
                  name="name"
                  id="name"
                  className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type Atribute name"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Write product description here"
                />
              </div>
            </div>
            <div className="items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                className="bg-primary hover:bg-secondary text-white hover:text-primary font-medium rounded-lg px-5 py-2.5"
              >
                Atributos
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-red-800 hover:bg-secondary text-white hover:text-primary font-medium rounded-lg px-5 py-2.5"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <div className="px-4 bg-white">
          <div className="flex justify-between items-center pb-3 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 ">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white ">
              Atributos
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-primary hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleCloseModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {Array.isArray(attributes) && attributes.length > 0 ? (
              attributes.map((attribute) => (
                <div
                  className="flex justify-between items-center border-b py-1 text-xs"
                  key={attribute.id}
                >
                  <span>{attribute.name}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(attribute.id)}
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p>No attributes found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAtribute;
