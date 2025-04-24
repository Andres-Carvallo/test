"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";
import { toast } from "react-hot-toast";
import Select from "react-select";

const Colecciones02BO = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Excluir las colecciones que no queremos mostrar
  const excludedIds = `${process.env.NEXT_PUBLIC_BANNER_NAVBAR}`;

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const siteid = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/collections?pageNumber=1&pageSize=50&siteId=${siteid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Filtrar colecciones excluyendo IDs específicos
      const filteredCollections = response.data.collections
        .filter((collection: any) => !excludedIds.includes(collection.id))
        .sort((a: any, b: any) => a.title.localeCompare(b.title));

      setCollections(filteredCollections);

      // Cargar las colecciones seleccionadas guardadas
      const savedCollections = await fetchSavedCollections(filteredCollections);
      setSelectedCollections(savedCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCollections = async (activeCollections: any[]) => {
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

      const savedCollectionIds = response.data.contentBlock.contentText ? JSON.parse(response.data.contentBlock.contentText) : [];
      
      // Filtrar solo las colecciones que aún existen
      const validCollections = savedCollectionIds.filter((id: string) => 
        activeCollections.some(collection => collection.id === id)
      );

      // Tomar solo la primera colección si hay más de una
      const singleCollection = validCollections.length > 0 ? [validCollections[0]] : [];

      // Si hay diferencias entre las colecciones guardadas y la única válida, actualizar el content block
      if (singleCollection.length !== validCollections.length) {
        console.log('Se encontraron colecciones adicionales, actualizando a una sola...');
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${siteId}`,
          {
            title: "colecciones02",
            contentText: JSON.stringify(singleCollection),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Se ha actualizado a una sola colección seleccionada");
      }

      return singleCollection;
    } catch (error) {
      console.error("Error fetching saved collections:", error);
      return [];
    }
  };

  const handleCollectionChange = (selectedOption: any) => {
    if (selectedOption) {
      // Reemplazar la colección seleccionada en lugar de agregar
      setSelectedCollections([selectedOption.value]);
      setSelectedCollection(null);
      setHasChanges(true);
    }
  };

  const handleCollectionToggle = (collectionId: string) => {
    // Si ya está seleccionada, la eliminamos
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections([]);
    } else {
      // Si no está seleccionada, la agregamos (reemplazando cualquier otra)
      setSelectedCollections([collectionId]);
    }
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const token = getCookie("AdminTokenAuth");
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const contentBlockId = process.env.NEXT_PUBLIC_COLECCIONES02_CONTENTBLOCK;

      // Actualizar el content block con las colecciones seleccionadas
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${siteId}`,
        {
          title: "colecciones02",
          contentText: JSON.stringify(selectedCollections),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setHasChanges(false);
      toast.success("Cambios guardados exitosamente");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
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

  const availableCollections = collections.filter(
    (collection) => !selectedCollections.includes(collection.id)
  );

  if (loading) return <div>Cargando colecciones...</div>;
  if (error) return <div>Error al cargar las colecciones</div>;

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Seleccionar Colección para Mostrar
        </h2>
        <p className="text-center mb-8 text-gray-600">
          Selecciona una colección para mostrar en la página principal
        </p>

        <div className="mb-8">
          <Select
            value={selectedCollection}
            onChange={handleCollectionChange}
            options={availableCollections.map((collection) => ({
              value: collection.id,
              label: collection.title,
              previewImageUrl: collection.previewImageUrl || "/carr/default.jpg",
            }))}
            formatOptionLabel={formatOptionLabel}
            className="shadow block w-full"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "var(--radius)",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "var(--radius)",
              }),
              menuList: (base) => ({
                ...base,
                maxHeight: "200px", // Altura para mostrar ~5 elementos
                "::-webkit-scrollbar": {
                  width: "8px",
                  height: "0px",
                },
                "::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "4px",
                },
                "::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "4px",
                },
                "::-webkit-scrollbar-thumb:hover": {
                  background: "#555",
                },
              }),
              option: (base) => ({
                ...base,
                padding: "8px 12px",
              }),
            }}
            placeholder="Buscar y seleccionar colección..."
            isClearable
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections
            .filter((collection) => selectedCollections.includes(collection.id))
            .map((collection) => (
              <div
                key={collection.id}
                className="border rounded-lg overflow-hidden shadow-sm transition-all duration-300 border-primary/20 shadow-primary/20"
              >
                <div className="relative hidden md:block h-48">
                  <img
                    src={collection.previewImageUrl || "/carr/default.jpg"}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                    Colección seleccionada
                  </div>
                  <button
                    onClick={() => handleCollectionToggle(collection.id)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2} 
                      stroke="currentColor" 
                      className="w-5 h-5"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2 md:hidden">
                    <div className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                      Colección seleccionada
                    </div>
                    <button
                      onClick={() => handleCollectionToggle(collection.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="currentColor" 
                        className="w-5 h-5"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{collection.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {collection.bannerText || "Sin descripción"}
                  </p>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Colección seleccionada: {selectedCollections.length}/1
          </p>
          <button
            onClick={handleSaveChanges}
            disabled={!hasChanges || isSaving}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              hasChanges
                ? "bg-primary text-secondary hover:bg-secondary hover:text-primary"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSaving ? "Guardando..." : "Actualizar Cambios"}
          </button>
          {hasChanges && (
            <p className="text-yellow-600 text-sm mt-2">
              * Hay cambios sin guardar
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Colecciones02BO;
