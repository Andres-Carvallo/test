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

  const router = useRouter();
  const inputRef = useRef<HTMLDivElement>(null);

  const handleResultClick = (id: string) => {
    router.push(`/tienda/productos/${id}`);
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
        const PageSize = 8;

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
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef]);

  return (
    <div className="w-full md:max-w-[143px]" ref={inputRef}>
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos"
          className="w-full p-2 pl-7 border text-xs border-gray-300"
          style={{ borderRadius: "var(--radius)" }}
          onFocus={() => query.trim() !== "" && setShowResults(true)}
        />
      </div>
      {loading && (
        <div className="absolute top-[50vh] left-1/2 translate-x-[-50%] translate-y-[-50%] ">
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
      {showResults && resultados.length > 0 && (
        <div
          className="absolute top-24 right-10 min-h-fit w-fit max-w-[97%] overflow-x-auto bg-background border border-gray-300 p-4 shadow-md z-10"
          style={{ borderRadius: "var(--radius)", zIndex: 9999 }}
        >
          <div className="flex flex-wrap justify-center w-full">
            {resultados.map((producto: any) => (
              <div
                key={producto.id}
                onClick={() => handleResultClick(producto.id)}
                className="w-fit m-2 p-3 flex gap-4 border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
                style={{ borderRadius: "var(--radius)" }}
              >
                <img
                  src={producto.previewImageUrl}
                  alt={producto.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-primary text-[14px] uppercase">
                    {producto.name}
                  </span>
                  <span className="text-[14px] font-bold text-black">
                    {producto.hasVariations
                      ? `$ ${producto.pricingRanges[0].minimumAmount.toLocaleString(
                          "es-CL"
                        )} - $ ${producto.pricingRanges[0].maximumAmount.toLocaleString(
                          "es-CL"
                        )}`
                      : `$ ${producto.pricings[0].amount.toLocaleString(
                          "es-CL"
                        )}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Buscador;
