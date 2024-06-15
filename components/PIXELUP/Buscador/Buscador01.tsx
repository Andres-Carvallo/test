"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { obtenerProductos } from "@/app/utils/obtenerProductos";

const BuscadorModal = ({ onClose }: { onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const handleResultClick = (id: string) => {
    router.push(`/tienda/productos/${id}`);
    onClose();
  };

  useEffect(() => {
    if (query.trim() === "") {
      setResultados([]);
      return;
    }

    const fetchProductos = async () => {
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
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };
    fetchProductos();
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const modalContent = document.querySelector(".modalBuscador");
    if (modalContent && !modalContent.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      id="modal"
      className="fixed inset-0 flex items-center justify-center bg-foreground/50  z-50"
    >
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 w-full max-w-md modalBuscador" style={{ borderRadius: 'var(--radius)' }}>
          <div className="flex justify-end">
            <button onClick={onClose}>&times;</button>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full p-2 border border-gray-300  mb-4"
            style={{ borderRadius: 'var(--radius)' }}
          />
          {loading && <div className="mt-4">Cargando...</div>}
          {error && (
            <div className="mt-4 text-red-500">Error: {error.message}</div>
          )}
<ul className="w-full mt-4 space-y-2">
  {resultados.map((producto: any) => (
    <li
      key={producto.id}
      onClick={() => handleResultClick(producto.id)}
      className="p-4 border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors flex items-center space-x-4"
      style={{ borderRadius: 'var(--radius)' }}
    >
      <img
        src={producto.previewImageUrl}
        alt={producto.name}
        className="w-24 h-24 object-cover rounded" // Imagen fija con borde redondeado
      />
      <div className="flex flex-col">
        <span className="text-blue-600 font-semibold">{producto.name}</span>
        <span className="text-lg font-bold text-gray-900">
          {producto.hasVariations
            ? `$ ${producto.pricingRanges[0].minimumAmount.toLocaleString('es-CL')} - $ ${producto.pricingRanges[0].maximumAmount.toLocaleString('es-CL')}`
            : `$ ${producto.pricings[0].amount.toLocaleString('es-CL')}`}
        </span>
      </div>
    </li>
  ))}
</ul>

        </div>
      </div>
    </div>
  );
};

const Buscador = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="relative mt-2">
      <button onClick={handleOpenModal}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192.904 192.904"
          width="20px"
          className="cursor-pointer fill-primary hover:fill-secondary ml-8"
        >
          <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z" />
        </svg>
      </button>
      {modalVisible && <BuscadorModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Buscador;
