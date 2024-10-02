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
  product: any;
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
      <div className="container mx-auto p-4">
        <div className="mt-10 p-4 ">
          <h1 className="text-4xl uppercase font-extrabold mb-2 text-center">
            Tienda Pixelup
          </h1>

          {/* Texto explicativo */}
          <p className="mb-8 text-[14px] text-gray-700 text-center max-w-2xl leading-5 mx-auto">
            En esta sección encontrarás una amplia gama de servicios
            profesionales para potenciar o solucionar problemas en tu
            emprendimiento o PYME. Estos servicios pueden ser canjeados por
            PixelCoins o pagados con dinero.
          </p>
        </div>

        {/* Campo de búsqueda */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Buscar por nombre o empresa"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-md w-80"
          />
        </div>

        {/* Filtro de categorías */}
        <div className="flex flex-wrap justify-center space-x-2 mb-6">
          <button
            className={`px-6 py-2 rounded-full text-sm ${
              selectedCategories.length === 0
                ? "bg-rosa text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={handleShowAll}
          >
            Todos
          </button>
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.id}
                className={`px-6 py-2 rounded-full text-sm ${
                  selectedCategories.includes(category.id)
                    ? "bg-rosa text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </button>
            ))
          ) : (
            <p>No se encontraron categorías.</p>
          )}
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredExchanges.map((exchange) => (
            <div
              key={exchange.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Imagen principal tipo banner */}
              <div className="relative">
                {exchange.mainImageUrl ? (
                  <img
                    src={exchange.mainImageUrl}
                    alt={exchange.name}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-300 flex items-center justify-center">
                    <p className="text-gray-500">Imagen no disponible</p>
                  </div>
                )}

                {/* Imagen de la compañía en formato circular */}
                {exchange.companyImageUrl ? (
                  <img
                    src={exchange.companyImageUrl}
                    alt={exchange.companyName}
                    className="absolute bg-white -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                    <p className="text-gray-500">Imagen no disponible</p>
                  </div>
                )}
              </div>

              {/* Información del canje */}
              <div className="p-6 pt-16">
                <h1 className="text-xl font-bold mb-4 text-center">
                  {exchange.name || "Nombre no disponible"}
                </h1>

                {/* Créditos, Stock y Precio */}
                <div className="flex justify-around mb-4 bg-gray-100 p-4 rounded-lg">
                  <div className="text-center">
                    <h2 className="text-sm font-bold text-rosa">
                      {exchange.creditAmount !== undefined
                        ? exchange.creditAmount.toLocaleString("es-CL")
                        : "N/A"}
                    </h2>
                    <p className="text-gray-700 text-xs">PixelCoins</p>
                  </div>
                  <div className="text-center">
                    <h2 className=" font-bold text-gray-700 text-sm">
                      {exchange.stock > 0 ? exchange.stock : "Agotado"}
                    </h2>
                    <p className="text-gray-700 text-xs">Stock</p>
                  </div>
                  {exchange.product?.productPricings &&
                  exchange.product.productPricings.length > 0 ? (
                    <div className="text-center">
                      <h2 className=" font-bold text-rosa text-sm">
                        $
                        {exchange.product.productPricings[0].amount.toLocaleString(
                          "es-CL"
                        )}
                      </h2>
                      <p className="text-gray-700 text-xs">Precio CLP</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h2 className="text-lg font-bold text-gray-500">N/A</h2>
                      <p className="text-gray-700">Precio no disponible</p>
                    </div>
                  )}
                </div>
                {/* Descripción y botón */}
                <ReactQuill
                  value={exchange.description}
                  readOnly={true}
                  theme="bubble"
                  className="text-gray-700 mt-2 min-h-52"
                />
                {/* Botón para ver detalles */}
                <Link href={`/dashboard/tienda-pixelup/${exchange.id}`}>
                  <button className="bg-primary w-full hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-md mt-4 hover:scale-105 duration-300 transition-all">
                    Ver Detalle
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Botones de paginación */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 bg-gray-300 rounded-md ${
              pageNumber === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={pageNumber === 1}
          >
            Anterior
          </button>

          <span className="text-gray-700">
            Página {pageNumber} de {totalPages}
          </span>

          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, totalPages))
            }
            className={`px-4 py-2 bg-gray-300 rounded-md ${
              pageNumber === totalPages ? "opacity-50 cursor-not-allowed" : ""
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
