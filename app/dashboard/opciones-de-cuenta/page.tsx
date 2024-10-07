"use client";
import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import BodegasStarken from "./BodegasStarken";

interface Option {
  id: string;
  code: string;
  description: string;
  value: string;
}

interface FormData {
  description: string;
  value: string;
}

const OptionsComponent = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    description: "pixelup",
    value: "",
  });

  const token = getCookie("AdminTokenAuth");

  const fetchOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/options?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOptions(response.data.options);
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (option: Option) => {
    setEditingOption(option.id);
    setFormData({
      description: option.description,
      value: option.value,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    if (!editingOption) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/options/${editingOption}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          description: formData.description,
          value: formData.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.id === editingOption
            ? {
                ...option,
                description: formData.description,
                value: formData.value,
              }
            : option
        )
      );
      setEditingOption(null);
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
    }
  };

  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-20">
      <h1 className="text-3xl font-bold text-center mb-20 uppercase">
        Opciones de Cuenta
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {options.map((option) => (
          <div
            key={option.id}
            className="p-6 border rounded-lg shadow-lg bg-white"
          >
            {editingOption === option.id ? (
              <div className="space-y-4">
                <p className="text-md text-dark">{option.code}</p>
                <div>
                  <label className="block text-md uppercase font-medium text-gray-700">
                    Valor
                  </label>
                  <input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    className=" block w-full rounded bg-gray-100 border-dark shadow-sm py-4 px-3 mt-4  sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleSaveClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingOption(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-md text-dark">{option.code}</p>

                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-500">Valor:</span>{" "}
                  {option.value}
                </p>
                <button
                  onClick={() => handleEditClick(option)}
                  className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  Editar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <BodegasStarken token={token as string} />
    </div>
  );
};

export default OptionsComponent;
