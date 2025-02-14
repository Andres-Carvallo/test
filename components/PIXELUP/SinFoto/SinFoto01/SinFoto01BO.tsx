"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Importar estilos para ReactQuill

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function SinFoto01BO() {
  const [loading, setLoading] = useState(false);

  const [welcomeData, setWelcomeData] = useState({
    title: "",
    contentText: "",
  });

  const fetchWelcomeBanner = async () => {
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = `${process.env.NEXT_PUBLIC_SINFOTO01_CONTENTBLOCK}`;

      const Token = getCookie("AdminTokenAuth");
      const productTypeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const bannerImage = productTypeResponse.data.contentBlock;
      setWelcomeData(bannerImage);
    } catch (error) {
      console.error("Error al obtener los datos del banner:", error);
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  const handleChangeWelcome = (value: string, name: string) => {
    setWelcomeData({
      ...welcomeData,
      [name]: value,
    });
  };

  const handleSubmitWelcomeBanner = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      setLoading(true); // Mostrar el indicador de carga
      const bannerId = `${process.env.NEXT_PUBLIC_SINFOTO01_CONTENTBLOCK}`;
      // Enviar los datos al endpoint
      const token = getCookie("AdminTokenAuth");
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title: welcomeData.title,
          contentText: welcomeData.contentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Limpiar el formulario después de enviar los datos
      setWelcomeData({
        title: "",
        contentText: "",
      });
      console.log("Datos enviados con éxito:", welcomeData);
      fetchWelcomeBanner();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  useEffect(() => {
    fetchWelcomeBanner();
  }, []);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* bienvenida */}
        <div className="">
          <div className=" mt-2">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-center text-7xl md:text-8xl font-semibold text-dark mb-2 font-brush">
                Hola
              </h2>
              {/* Renderizando el título con HTML */}
              <div
                className="text-center text-3xl font-semibold text-primary sm:text-4xl"
                dangerouslySetInnerHTML={{ __html: welcomeData?.title }}
              />
              <div className="mt-4">
                {/* Renderizando el contenido con HTML */}
                <p
                  className="mt-4 text-center text-lg text-dark"
                  dangerouslySetInnerHTML={{ __html: welcomeData?.contentText }}
                />
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmitWelcomeBanner}
            className="mx-auto mt-8"
          >
            {/* Editor de título con ReactQuill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <ReactQuill
                value={welcomeData.title}
                onChange={(value) => handleChangeWelcome(value, "title")}
                className="mt-1 h-auto bg-white"
                modules={modules}
              />
            </div>

            {/* Contenido con ReactQuill */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido
              </label>
              <ReactQuill
                value={welcomeData.contentText}
                onChange={(value) => handleChangeWelcome(value, "contentText")}
                className="mt-1 h-auto bg-white"
                modules={modules}
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="shadow bg-primary hover:bg-secondary w-full uppercase text-secondary hover:text-primary  font-bold py-2 px-4 rounded flex-wrap mt-6"
            >
              <svg
                aria-hidden="true"
                role="status"
                className={`inline w-4 h-4 me-3 text-white animate-spin ${
                  loading ? "block" : "hidden"
                }`}
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              {loading ? "Loading..." : "Actualizar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SinFoto01BO;