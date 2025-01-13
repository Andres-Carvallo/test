/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Importar los estilos de Quill

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Tipos para las categorías y los exchanges (canjes)
interface Category {
  id: string;
  name: string;
  description: string;
  statusCode: string;
}

interface ImageFile {
  name: string;
  type: string;
  size: number;
  data: string; // Base64 encoded data
}

interface Exchange {
  id: string;
  exchangeCategory: {
    id: string;
    name: string;
    description: string;
    statusCode: string;
  };
  companyName: string;
  companyImageUrl: string;
  name: string;
  description: string;
  extendedDescription: string;
  mainImageUrl: string;
  stock: number;
  creditAmount: number;
  statusCode: string;
}

const ExchangesGrid = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [filteredExchanges, setFilteredExchanges] = useState<Exchange[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(4); // Tamaño de la página
  const [totalPages, setTotalPages] = useState(1); // Estado para el número total de páginas

  const token = getCookie("AdminTokenAuth") as string;

  useEffect(() => {
    fetchCategories();
    fetchAllExchanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterAndPaginateExchanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, searchQuery, pageNumber, pageSize, exchanges]);

  // Fetch de todos los exchanges paginados
  const fetchAllExchanges = async () => {
    let allExchanges: Exchange[] = [];
    let currentPage = 1;
    let totalItems = 0;

    try {
      do {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/exchanges?pageNumber=${currentPage}&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const fetchedExchanges = response.data.exchanges;
        totalItems =
          response.data.totalItems || fetchedExchanges.length * currentPage;

        allExchanges = [...allExchanges, ...fetchedExchanges];
        currentPage++;
      } while (allExchanges.length < totalItems);

      setExchanges(allExchanges);
    } catch (error) {
      console.error("Error al obtener los canjes:", error);
    }
  };

  // Fetch de categorías
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/exchange-categories?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}&pageSize=50&pageNumber=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && response.data.exchangeCategories) {
        setCategories(response.data.exchangeCategories);
      } else {
        console.error("No categories found in the response");
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  // Filtrado y paginación local
  const filterAndPaginateExchanges = () => {
    let filtered = exchanges;

    // Filtrar por categorías seleccionadas
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((exchange) =>
        selectedCategories.includes(exchange.exchangeCategory.id)
      );
    }

    // Filtrar por nombre del canje o empresa
    if (searchQuery) {
      filtered = filtered.filter(
        (exchange) =>
          exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exchange.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Actualizar el total de páginas basado en los elementos filtrados
    const totalFilteredItems = filtered.length;
    setTotalPages(Math.ceil(totalFilteredItems / pageSize));

    // Paginar los resultados filtrados
    const startIndex = (pageNumber - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);
    setFilteredExchanges(paginated);
  };

  // Manejo del filtro de categoría
  const handleCategoryClick = (categoryId: string) => {
    setPageNumber(1); // Reiniciar la paginación al aplicar un filtro
    setSelectedCategories(
      (prevCategories) =>
        prevCategories.includes(categoryId)
          ? prevCategories.filter((id) => id !== categoryId) // Si ya está, lo quitamos
          : [...prevCategories, categoryId] // Si no está, lo agregamos
    );
  };

  // Mostrar todas las categorías
  const handleShowAll = () => {
    setPageNumber(1); // Reiniciar la paginación
    setSelectedCategories([]);
  };

  return (
    <>
      <title>Tienda - PixelUp</title>
      {/* Hero Section mejorada */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className=" mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-4 text-center">
            Tienda PixelUp
          </h1>
          <p className="text-lg text-center max-w-2xl mx-auto leading-relaxed opacity-90">
            Descubre servicios profesionales premium para impulsar tu negocio.
            Canjea con PixelCoins o realiza tu compra directamente.
          </p>
        </div>
      </div>

      <div className=" mx-auto px-4 py-12 bg-gray-50">
        {/* Barra de búsqueda mejorada */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Buscar por nombre o empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 border-2 border-gray-200 rounded-full 
                         focus:outline-none focus:border-rosa transition-colors
                         shadow-sm text-gray-700"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
          </div>
        </div>

        {/* Filtros de categoría mejorados */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all
                       ${
                         selectedCategories.length === 0
                           ? "bg-gray-800 text-white shadow-lg shadow-gray-200"
                           : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                       }`}
            onClick={handleShowAll}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all
                         ${
                           selectedCategories.includes(category.id)
                             ? "bg-gray-800 text-white shadow-lg shadow-gray-200"
                             : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                         }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Grid de Cards mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredExchanges.map((exchange) => (
            <div
              key={exchange.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow 
                         overflow-hidden transform hover:-translate-y-1 duration-300"
            >
              <div className="relative">
                <img
                  src={exchange.mainImageUrl}
                  alt={exchange.name}
                  className="w-full h-48 object-cover"
                />
                <img
                  src={exchange.companyImageUrl}
                  alt={exchange.companyName}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2
                           w-16 h-16 rounded-full border-4 border-white bg-white"
                />
              </div>

              <div className="p-6 pt-8">
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                  {exchange.name}
                </h3>
                <p className="text-sm text-center text-gray-600 mb-4">
                  {exchange.companyName}
                </p>

                <div className="prose prose-sm max-w-none">
                  <ReactQuill
                    value={exchange.description}
                    readOnly={true}
                    theme="bubble"
                    className="text-gray-600 min-h-[120px] max-h-[120px] overflow-hidden"
                  />
                </div>

                <Link href={`/dashboard/tienda-pixelup/${exchange.id}`}>
                  <button
                    className="w-full mt-6 bg-gray-800 hover:bg-gray-900 
                                   text-white font-medium py-3 px-4 rounded-lg
                                   transition-all duration-300 transform hover:scale-[1.02]
                                   focus:outline-none focus:ring-2 focus:ring-rosa 
                                   focus:ring-opacity-50"
                  >
                    Ver Detalle
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación mejorada */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 rounded-lg font-medium transition-all
                       ${
                         pageNumber === 1
                           ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                           : "bg-white text-rosa hover:bg-gray-50 border border-gray-200"
                       }`}
            disabled={pageNumber === 1}
          >
            Anterior
          </button>

          <span className="text-gray-700 font-medium">
            Página {pageNumber} de {totalPages}
          </span>

          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, totalPages))
            }
            className={`px-4 py-2 rounded-lg font-medium transition-all
                       ${
                         pageNumber === totalPages
                           ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                           : "bg-white text-rosa hover:bg-gray-50 border border-gray-200"
                       }`}
            disabled={pageNumber === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
};

export default ExchangesGrid;
