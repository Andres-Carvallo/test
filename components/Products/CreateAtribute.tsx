import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { obtenerAtributos } from "@/app/utils/obtenerAtributos";

interface CreateAttributeProps {
  handleCloseModal: any;
  fetchData: any;
}
interface Attribute {
  id: number;
  name: string;
}

const CreateAtribute: React.FC<CreateAttributeProps> = ({
  handleCloseModal,
  fetchData,
}) => {
  const token = String(getCookie("tokenAuth"));
  const [attributes, setAtributes] = useState<Attribute[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    statusCode: "ACTIVE",
  });

  async function fetchAttributes() {
    try {
      const PageNumber = 1;
      const PageSize = 10;
      const token = getCookie("tokenAuth");
      const data = await obtenerAtributos(token, PageNumber, PageSize);

      setAtributes(data.attributes);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
        setLoading(false);
        console.error("An error occurred:", error.message);
      } else {
        setLoading(false);
        console.error("An unknown error occurred:", error);
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/attributes`,
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
        // El producto se creó exitosamente, puedes hacer alguna acción como cerrar el modal o mostrar un mensaje de éxito
        handleCloseModal();
        setFormData({
          name: "",
          description: "",
          statusCode: "ACTIVE",
        });
        console.log("ok");
        fetchAttributes();
      } else {
        // Si la solicitud no es exitosa, maneja el error según sea necesario
        console.error("Error al crear el Atributo:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  useEffect(() => {
    fetchAttributes();
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
      {/* Modal content */}
      <div className="relative p-4 grid grid-cols-1 sm:grid-cols-2 max-w-[45vw] min-w-[45vw] bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <div>
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 ">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Crear Atributo
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
                className="w-full sm:w-auto justify-center text-white inline-flex bg-secondary hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-secondary dark:focus:ring-primary-800"
              >
                Crear Atributo
              </button>

              <button
                data-modal-toggle="createProductModal"
                type="button"
                onClick={handleCloseModal}
                className="w-full justify-center sm:w-auto text-gray-500 inline-flex items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                <svg
                  className="mr-1 -ml-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
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
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleCloseModal}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {Array.isArray(attributes) &&
            attributes.map((attribute) => (
              <h1
                className="border-b py-1  text-xs"
                key={attribute.id}
              >
                {attribute.name}
              </h1>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CreateAtribute;
