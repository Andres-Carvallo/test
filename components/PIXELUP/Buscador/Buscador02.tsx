/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { obtenerProductos } from "@/app/utils/obtenerProductos";

const Buscador = () => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleResultClick = (id: string) => {
    router.push(`/tienda/productos/${id}`);
    handleModalClose();
  };

  useEffect(() => {
    const fetchProductos = async () => {
      if (query.trim() === "") {
        setResultados([]);
        setShowResults(false);
        return;
      }

      try {
        setLoading(true);
        const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        const PageNumber = 1;
        const PageSize = 50;

        const data = await obtenerProductos(SiteId, PageNumber, PageSize);
        const filteredResultados = data.products.filter((producto: any) =>
          producto.name.toLowerCase().includes(query.toLowerCase())
        );
        setResultados(filteredResultados);
        setShowResults(true);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };
    fetchProductos();
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleModalClose();
      }
    };

    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleModalClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapePress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [modalRef]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setShowResults(false); // Ocultar resultados
    setQuery(""); // Borrar el filtro de búsqueda
  };

  return (
    <div className="w-full">
      <div className="relative pt-2">
        <button onClick={handleModalOpen}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-0"
            ref={modalRef}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Buscar productos</h2>
              <button
                onClick={handleModalClose}
                className="text-dark"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos"
              className="w-full p-2 pl-7 border text-xs border-gray-300 mb-4"
              style={{ borderRadius: "var(--radius)" }}
              onFocus={() => query.trim() !== "" && setShowResults(true)}
            />
            {loading && (
              <div className="flex justify-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            {error && <div>Error: {error.message}</div>}
            {showResults && isModalOpen && resultados.length > 0 && (
              <div
                className="min-h-fit w-full max-h-[400px] overflow-y-auto bg-background border border-gray-300 p-4 shadow-md z-10"
                style={{ borderRadius: "var(--radius)" }}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resultados.map((producto: any) => (
                      <tr
                        key={producto.id}
                        onClick={() => handleResultClick(producto.id)}
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <td className="px-4 py-2">
                          <img
                            src={producto.mainImageUrl}
                            alt={producto.name}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                        </td>
                        <td className="px-4 py-2">{producto.name}</td>
                        <td className="px-4 py-2">
                          {producto.hasVariations
                            ? `$ ${producto.pricingRanges[0].minimumAmount.toLocaleString(
                                "es-CL"
                              )} - $ ${producto.pricingRanges[0].maximumAmount.toLocaleString(
                                "es-CL"
                              )}`
                            : `$ ${producto.pricings[0].amount.toLocaleString(
                                "es-CL"
                              )}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Buscador;
