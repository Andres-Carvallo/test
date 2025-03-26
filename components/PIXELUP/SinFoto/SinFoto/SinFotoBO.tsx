"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loader from "@/components/common/Loader-t";

// Definir interfaces para el tipado
interface BoxContent {
  title: string;
  contentText: string;
}

interface ContentData {
  epigrafe: string;
  titulo: string;
  contenido: string;
  box1: BoxContent;
  box2: BoxContent;
  box3: BoxContent;
}

interface ApiResponse {
  code: number;
  message: string;
  contentBlock: {
    title: string;
    contentText: string;
  };
}

const SinFotoBO: React.FC = () => {
  const ContentBlockId = process.env.NEXT_PUBLIC_SINFOTO_CONTENTBLOCK || "";
  const [loading, setLoading] = useState<boolean>(true);
  const [showPreview, setShowPreview] = useState(false);

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<ContentData>({
    epigrafe: "",
    titulo: "",
    contenido: "",
    box1: { title: "", contentText: "" },
    box2: { title: "", contentText: "" },
    box3: { title: "", contentText: "" },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${ContentBlockId}?siteId=${siteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 0 && response.data.contentBlock) {
        try {
          // Intentar parsear el contentText como JSON
          const parsedData = JSON.parse(response.data.contentBlock.contentText);
          setFormData(parsedData);
        } catch (error) {
          console.error("Error al parsear JSON:", error);
          // Si hay error al parsear, mantener los valores por defecto
        }
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = getCookie("AdminTokenAuth");
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${ContentBlockId}?siteId=${siteId}`,
        {
          title: "SinFoto Content",
          contentText: JSON.stringify(formData),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 0) {
        // Revalidar el cache del cliente
        await fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: `/api/v1/content-blocks/${ContentBlockId}`,
          }),
        });

        await fetchData();
      }
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof ContentData | keyof BoxContent,
    value: string,
    boxIndex?: number
  ) => {
    if (boxIndex !== undefined) {
      // Actualizar datos de un box específico
      const boxKey = `box${boxIndex + 1}` as keyof ContentData;
      const boxData = formData[boxKey] as BoxContent;
      setFormData((prev) => ({
        ...prev,
        [boxKey]: {
          ...boxData,
          [field as keyof BoxContent]: value,
        },
      }));
    } else {
      // Actualizar datos principales
      setFormData((prev) => ({
        ...prev,
        [field as keyof ContentData]: value,
      }));
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold mb-2 sm:mb-0">Sección SinFoto</h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200"
          >
            {showPreview ? "Ocultar Vista Previa" : "Mostrar Vista Previa"}
          </button>
        </div>

        {/* Vista previa */}
        {showPreview && (
          <div className="mb-8 overflow-x-auto">
            <h3 className="font-medium text-gray-700 mb-4">Vista Previa:</h3>
            <section id="propuesta-valor" className="pt-16 pb-8">
              <div className="mx-auto px-4 md:px-8 max-w-7xl text-center">
                <h2 className="text-xl md:text-3xl font-lora font-light text-[#10375d] mb-2">
                  {formData.epigrafe}
                </h2>
                <p className="text-lg italic font-lora text-[#10375d] mb-8 max-w-3xl mx-auto">
                  {formData.contenido}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[formData.box1, formData.box2, formData.box3].map((box, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center relative p-4"
                    >
                      <div className="mb-3">
                        <svg
                          className="w-8 h-8 text-[#10375d] stroke-current"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          {index === 0 && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-star"
                            >
                              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                            </svg>
                          )}
                          {index === 1 && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-trending-up"
                            >
                              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                              <polyline points="16 7 22 7 22 13" />
                            </svg>
                          )}
                          {index === 2 && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-truck"
                            >
                              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                              <path d="M15 18H9" />
                              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                              <circle cx="17" cy="18" r="2" />
                              <circle cx="7" cy="18" r="2" />
                            </svg>
                          )}
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-[#ca2b63] mb-2 font-lora">
                        {box.title}
                      </h3>
                      <p className="text-sm text-[#10375d] leading-relaxed max-w-xs">
                        {box.contentText}
                      </p>
                      {index < 2 && (
                        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-[#ca2b63] opacity-30 -mx-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Formulario de edición */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Epígrafe
              </label>
              <input
                type="text"
                value={formData.epigrafe}
                onChange={(e) => handleChange("epigrafe", e.target.value)}
                className="mt-1 block w-full bg-gray-50 py-2 px-4 rounded-md border-gray-300 shadow-sm"
                placeholder="Texto del epígrafe"
              />
            </div>
{/*             <div>
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 py-2 px-4 shadow-sm"
                placeholder="Título principal"
              />
            </div> */}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Texto Principal
            </label>
            <textarea
              value={formData.contenido}
              onChange={(e) => handleChange("contenido", e.target.value)}
              className="mt-1 bg-gray-50 py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
              placeholder="Texto principal de la sección"
            />
          </div>

          {/* Boxes Forms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((boxNum) => {
              const boxKey = `box${boxNum}` as keyof ContentData;
              const boxData = formData[boxKey] as BoxContent;
              return (
                <div key={boxNum} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Box {boxNum}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Título
                      </label>
                      <input
                        type="text"
                        value={boxData.title}
                        onChange={(e) => handleChange("title", e.target.value, boxNum - 1)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white py-2 px-4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contenido
                      </label>
                      <textarea
                        value={boxData.contentText}
                        onChange={(e) => handleChange("contentText", e.target.value, boxNum - 1)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white py-2 px-4"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80 transition-colors"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar Sección"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default SinFotoBO;
