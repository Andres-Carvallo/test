// components/FreeShippingOption.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

const FreeShippingOption: React.FC<any> = ({}) => {
  const [freeShippingOption, setFreeShippingOption] = useState<{
    id: string;
    value: string | null;
  } | null>(null);
  const [newValue, setNewValue] = useState<string>("");

  const token = getCookie("AdminTokenAuth");

  useEffect(() => {
    const fetchOption = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/options?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filtrar la opción de "FREE_SHIPPING_MINIMUM_AMOUNT"
        const option = response.data.options.find(
          (opt: any) => opt.code === "FREE_SHIPPING_MINIMUM_AMOUNT"
        );

        if (option) {
          setFreeShippingOption({
            id: option.id,
            value: option.value || "", // Si el valor es null, lo establece como una cadena vacía
          });
          setNewValue(option.value || "");
        }
      } catch (error) {
        console.error("Error fetching free shipping option:", error);
        toast.error("Error al obtener la opción de envío gratis.");
      }
    };

    fetchOption();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value);
  };

  const handleUpdate = async () => {
    if (!freeShippingOption) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/options/${freeShippingOption.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          value: newValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Valor de envío gratis actualizado exitosamente.");
      setFreeShippingOption((prev) => ({
        id: prev ? prev.id : "",
        value: newValue,
      }));
    } catch (error) {
      console.error("Error updating free shipping option:", error);
      toast.error("Error al actualizar la opción de envío gratis.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Editar Monto de Envío Gratis</h2>
      {freeShippingOption ? (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Monto mínimo para envío gratis:
          </label>
          <input
            type="number"
            value={newValue}
            onChange={handleValueChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Ingresa el monto mínimo para envío gratis"
          />
          <button
            onClick={handleUpdate}
            className="mt-4 bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded"
          >
            Actualizar
          </button>
        </div>
      ) : (
        <p>Cargando información...</p>
      )}
    </div>
  );
};

export default FreeShippingOption;
