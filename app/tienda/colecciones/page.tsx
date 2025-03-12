"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

function Colecciones06() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCollections, setTotalCollections] = useState(0);

  // Excluir las colecciones que no queremos mostrar (igual que en Navbar)
  const excludedIds = `${process.env.NEXT_PUBLIC_BANNER_NAVBAR}`;

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const siteid = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/collections?pageNumber=1&pageSize=50&siteId=${siteid}`
        );
        
        // Filtrar colecciones excluyendo IDs específicos y ordenar alfabéticamente
        const allFilteredCollections = response.data.collections
          .filter((collection: any) => !excludedIds.includes(collection.id))
          .sort((a: any, b: any) => a.title.localeCompare(b.title));

        // Mostrar todas las colecciones en lugar de solo 4
        setCollections(allFilteredCollections);
        
        setTotalCollections(allFilteredCollections.length);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="group relative overflow-hidden rounded bg-white shadow-sm"
            >
              <div className="flex flex-col md:flex-row h-[400px] md:h-[250px]">
                <div className="w-full md:w-1/2 h-full relative overflow-hidden bg-gray-200 animate-pulse">
                </div>
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center text-center bg-white">
                  <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-3"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-6"></div>
                  <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return <div>Error al cargar las colecciones</div>;

  return (
    
    <div className="py-16 px-4">
      <title>Colecciones</title>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-gray-800 font-bold">
            Nuestras Colecciones
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((coleccion) => (
            <div
              key={coleccion.id}
              className="group relative cursor-pointer overflow-hidden rounded bg-white shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row h-[400px] md:h-[250px]">
                <div className="w-full md:w-1/2 h-full relative overflow-hidden">
                  <img
                    src={coleccion.previewImageUrl || "/carr/default.jpg"} // Usa una imagen por defecto si no hay imagen
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
                  <Link 
                    href={`/tienda/colecciones/${slugify(coleccion.title)}`}
                    className="bg-black text-white px-6 py-2 rounded text-sm font-bold hover:bg-[#eea83b] transition-colors hover:text-black"
                  >
                    Ver Colección
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Colecciones06;
