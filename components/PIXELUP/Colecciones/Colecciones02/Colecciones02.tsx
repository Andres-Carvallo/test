"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

function Colecciones02() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const siteid = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const contentBlockId = process.env.NEXT_PUBLIC_COLECCIONES02_CONTENTBLOCK;

        // Primero, obtener todas las colecciones disponibles
        const collectionsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/collections?pageNumber=1&pageSize=50&siteId=${siteid}`
        );

        const allCollections = collectionsResponse.data.collections;

        // Luego, obtener las colecciones seleccionadas del content block
        const contentBlockResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${siteid}`
        );

        const selectedCollectionIds = contentBlockResponse.data.contentBlock.contentText 
          ? JSON.parse(contentBlockResponse.data.contentBlock.contentText)
          : [];

        // Filtrar y mapear solo las colecciones que existen
        const validCollections = selectedCollectionIds
          .map((collectionId: string) => {
            const collection = allCollections.find((c: any) => c.id === collectionId);
            if (collection) {
              return {
                ...collection,
                buttonText: "Ver Colección"
              };
            }
            return null;
          })
          .filter(Boolean); // Eliminar las colecciones que no existen (null)

        setCollections(validCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) return <div>Cargando colecciones...</div>;
  if (error) return <div>Error al cargar las colecciones</div>;

  // Crear colecciones por defecto si no hay ninguna
  const defaultCollections = collections.length === 0 ? [
    {
      id: 'default-1',
      title: 'Próximamente',
      previewImageUrl: '/img/placeholder.webp',
      bannerText: 'Nuevas colecciones en camino',
      buttonText: 'Próximamente'
    },
    {
      id: 'default-2',
      title: 'Próximamente',
      previewImageUrl: '/img/placeholder.webp',
      bannerText: 'Nuevas colecciones en camino',
      buttonText: 'Próximamente'
    }
  ] : collections;

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm uppercase tracking-wider text-gray-500">
            Descubre
          </span>
          <h2 className="text-3xl md:text-4xl text-gray-800 font-bold mt-2">
            Nuestras Colecciones
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {defaultCollections.map((coleccion) => (
            <div
              key={coleccion.id}
              className="group relative cursor-pointer overflow-hidden rounded bg-white shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row h-[400px] md:h-[250px]">
                <div className="w-full md:w-1/2 h-full relative overflow-hidden">
                  <img
                    src={coleccion.previewImageUrl || "/carr/default.jpg"}
                    alt={coleccion.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center text-center bg-white">
                  <h3 className="text-xl text-gray-800 font-bold mb-3">
                    {coleccion.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {coleccion.bannerText || "Descubre nuestra exclusiva colección"}
                  </p>
                  {coleccion.id.startsWith('default-') ? (
                    <span className="bg-gray-200 text-gray-600 px-6 py-2 rounded text-sm font-bold cursor-not-allowed">
                      {coleccion.buttonText}
                    </span>
                  ) : (
                    <Link 
                      href={`/tienda/colecciones/${slugify(coleccion.title)}`}
                      className="bg-black text-white px-6 py-2 rounded text-sm font-bold hover:bg-[#eea83b] transition-colors hover:text-black"
                    >
                      {coleccion.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            href="/tienda/colecciones"
            className="bg-[#eea83b] font-light text-md text-black hover:scale-105 px-8 py-2 rounded hover:bg-dark-green transition-all inline-block"
          >
            Ver Todas las Colecciones
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Colecciones02;