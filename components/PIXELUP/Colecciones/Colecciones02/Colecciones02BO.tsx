"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";
import { toast } from "react-hot-toast";

const Colecciones02BO = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Excluir las colecciones que no queremos mostrar
  const excludedIds = `${process.env.NEXT_PUBLIC_BANNER_NAVBAR}`;

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const siteid = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/collections?pageNumber=1&pageSize=50&siteId=${siteid}`
      );

      // Filtrar colecciones excluyendo IDs específicos
      const filteredCollections = response.data.collections
        .filter((collection: any) => !excludedIds.includes(collection.id))
        .sort((a: any, b: any) => a.title.localeCompare(b.title));

      setCollections(filteredCollections);

      // Cargar las colecciones seleccionadas guardadas
      const savedCollections = await fetchSavedCollections();
      setSelectedCollections(savedCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCollections = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const contentBlockId = process.env.NEXT_PUBLIC_COLECCIONES02_CONTENTBLOCK;
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${siteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.contentBlock.contentText ? JSON.parse(response.data.contentBlock.contentText) : [];
    } catch (error) {
      console.error("Error fetching saved collections:", error);
      return [];
    }
  };

  const handleCollectionToggle = async (collectionId: string) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const contentBlockId = process.env.NEXT_PUBLIC_COLECCIONES02_CONTENTBLOCK;

      let updatedCollections: string[];

      if (selectedCollections.includes(collectionId)) {
        // Remover la colección
        updatedCollections = selectedCollections.filter(id => id !== collectionId);
      } else {
        // Agregar la colección
        if (selectedCollections.length >= 4) {
          toast.error("Solo puedes seleccionar hasta 4 colecciones");
          return;
        }
        updatedCollections = [...selectedCollections, collectionId];
      }

      // Actualizar el content block con las colecciones seleccionadas
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${siteId}`,
        {
          title: "colecciones02",
          contentText: JSON.stringify(updatedCollections),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedCollections(updatedCollections);
    } catch (error) {
      console.error("Error toggling collection:", error);
      toast.error("Error al actualizar la colección");
    }
  };

  if (loading) return <div>Cargando colecciones...</div>;
  if (error) return <div>Error al cargar las colecciones</div>;

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Seleccionar Colecciones para Mostrar
        </h2>
        <p className="text-center mb-8 text-gray-600">
          Selecciona hasta 4 colecciones para mostrar en la página principal
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className={`border rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${
                selectedCollections.includes(collection.id)
                  ? "border-green-500 shadow-green-200"
                  : "border-gray-200 hover:shadow-md"
              }`}
            >
              <div className="relative hidden md:block h-48">
                <img
                  src={collection.previewImageUrl || "/carr/default.jpg"}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
                {selectedCollections.includes(collection.id) && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                    Orden: {selectedCollections.indexOf(collection.id) + 1}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{collection.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {collection.bannerText || "Sin descripción"}
                </p>
                <button
                  onClick={() => handleCollectionToggle(collection.id)}
                  className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
                    selectedCollections.includes(collection.id)
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {selectedCollections.includes(collection.id)
                    ? "Seleccionada"
                    : "Seleccionar"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>
            Colecciones seleccionadas: {selectedCollections.length}/4
          </p>
        </div>
      </div>
    </section>
  );
};

export default Colecciones02BO;
