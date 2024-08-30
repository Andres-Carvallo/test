/* eslint-disable @next/next/no-img-element */
import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import toast, { Toaster } from "react-hot-toast";

interface CrearUsuarioFormProps {
  onClose: () => void;
  fetchData: any;
}

const CrearUsuarioForm: React.FC<CrearUsuarioFormProps> = ({
  onClose,
  fetchData,
}) => {
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    avatarImage: {
      name: "",
      type: "",
      size: null,
      data: "",
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = String(getCookie("AdminTokenAuth"));
      const newUser = {
        ...formData,
        statusCode: "ACTIVE", // Define el valor del statusCode como desees
        roleId: "ad944aa1-8fae-47e9-90b8-048a04cf86c1", // Asume que el ID del rol está fijo o proviene de otra fuente
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/users?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        newUser,
        config
      );
      console.log("Usuario creado con éxito:", response.data);
      fetchData();
      toast.success("Usuario creado con éxito!");
      onClose(); // Cierra el formulario al crear un usuario
    } catch (error) {
      console.log(error);
      toast.error("Error al crear el usuario.");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto"
      >
        <div className="mb-4">
          <label
            htmlFor="firstname"
            className="block text-sm font-medium text-secondary"
          >
            Nombre*
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="lastname"
            className="block text-sm font-medium text-secondary"
          >
            Apellido*
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-secondary"
          >
            Correo electrónico*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <h1 className="text-secondary text-left">Avatar</h1>
        <div className="my-2">
          <div className="flex justify-center">
            <input
              type="file"
              accept="image/*"
              id="avatarImage"
              className="hidden"
              onChange={(e) =>
                handleImageChange(e, setAvatarImage, "avatarImage")
              }
            />
            {avatarImage ? (
              <div className="text-center">
                <div className="flex justify-center mt-2">
                  <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden">
                    <img
                      src={avatarImage}
                      alt="Main Image"
                      className="object-cover w-full h-full"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 m-1 text-xs"
                      onClick={() => handleClearImage(setAvatarImage)}
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
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mt-2">
                  <label
                    htmlFor="avatarImage"
                    className="text-center flex flex-col bg-white justify-center items-center border border-dashed border-dark/50 rounded-lg cursor-pointer w-[150px] h-[150px]"
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
                        <span className="font-semibold">Subir Imagen</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG o Webp (800x800px)
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Aquí puedes agregar más campos del formulario si es necesario */}
        <div className="mb-4">
          <button
            type="submit"
            className="mt-8 w-full py-2 px-4 border border-transparent font-bold uppercase rounded-md shadow-sm text-black hover:text-secondary bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            Crear Usuario
          </button>
        </div>
      </form>
    </>
  );
};

export default CrearUsuarioForm;
