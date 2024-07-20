/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

type Offer = {
  id: any;
  unitPrice: any;
  startDate: any;
  endDate: any;
  currencyCodeId: any;
};

type OfferFormProps = {
  id: string;
  skuId: string;
  fetchVariations: any;
  handleMenuClose: any;
  offerToEdit: any;
  onSave: any;
  unitPrice: string;
  startDate: string;
  endDate: string;
  currencyCodeId: string;
  setUnitPrice: any;
  setStartDate: any;
  setEndDate: any;
  setCurrencyCodeId: any;
};

function OfferForm({
  id,
  skuId,
  fetchVariations,
  handleMenuClose,
  offerToEdit,
  onSave,
  unitPrice,
  startDate,
  endDate,
  currencyCodeId,
  setEndDate,
  setUnitPrice,
  setCurrencyCodeId,
  setStartDate,
}: OfferFormProps) {
  useEffect(() => {
    const fetchCurrencyCode = async () => {
      try {
        const token = getCookie("AdminTokenAuth");
        const currencyResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setCurrencyCodeId(currencyResponse.data.currencyCodes[0].id);
      } catch (error) {
        console.error("Error fetching currency code:", error);
      }
    };

    fetchCurrencyCode();
  }, []);

  useEffect(() => {
    if (offerToEdit) {
      console.log("Offer to edit:", offerToEdit); // Verifica los datos de la oferta a editar
      setUnitPrice(offerToEdit.unitPrice.toString());
      setStartDate(offerToEdit.startDate); // Formatear fecha a "YYYY-MM-DD"
      setEndDate(offerToEdit.endDate); // Formatear fecha a "YYYY-MM-DD"
    } else {
      setUnitPrice("");
      setStartDate("");
      setEndDate("");
    }
  }, [offerToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedOffer: Offer = {
      id: offerToEdit ? offerToEdit.id : null,
      unitPrice: parseFloat(unitPrice),
      startDate,
      endDate,
      currencyCodeId,
    };

    try {
      const token = String(getCookie("AdminTokenAuth"));
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (offerToEdit && offerToEdit.id) {
        // Actualizar oferta existente
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/offers/${offerToEdit.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          updatedOffer,
          config
        );
        console.log("Oferta actualizada con éxito:", response.data);
      } else {
        // Crear nueva oferta
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/offers?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          updatedOffer,
          config
        );
        console.log("Oferta creada con éxito:", response.data);
      }

      fetchVariations();
      onSave(updatedOffer);
      handleMenuClose();
    } catch (error) {
      console.log("Error al guardar la oferta:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md"
    >
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">
          Precio
        </label>
        <input
          type="number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">
          Fecha de Inicio
        </label>
        <input
          type="date"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">
          Fecha de Fin
        </label>
        <input
          type="date"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {offerToEdit ? "Actualizar Oferta" : "Crear Oferta"}
        </button>
      </div>
    </form>
  );
}

export default OfferForm;
