"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useEffect, useState } from "react";
import { useAPI } from "@/app/Context/ProductTypeContext";
import { obtenerZonasRepartosBO } from "@/app/utils/obtenerZonasRepartosBO";
import { getCookie } from "cookies-next";
import axios from "axios";

interface Zone {
  id: string;
  name: string;
  description: string;
  amount: number;
  communes: any[];
}
interface ZoneData {
  id: string;
  currencyCodeId: string;
  name: string;
  description: string;
  amount: number;
  statusCode: string;
  communes: { id: string; name: string }[];
}

function ZonasRepartos() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [zonas, setZonas] = useState<Zone[]>([]);
  const { addToCartHandler, products, setProducts } = useAPI();
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState<{ id: any }[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [selectedCommunes, setSelectedCommunes] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [zoneData, setZoneData] = useState({
    id: null,
    currencyCodeId: "",
    name: "",
    description: "",
    amount: 0,
    statusCode: "ACTIVE",
    communes: [],
  });
  useEffect(() => {
    const fetchCurrencyCode = async () => {
      try {
        const token = getCookie("tokenAuth");
        const currencyResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const currencyCodeId = currencyResponse.data.currencyCodes[0].id;
        setZoneData((prevData) => ({
          ...prevData,
          currencyCodeId: currencyCodeId,
        }));
      } catch (error) {
        console.error("Error fetching currency code:", error);
      }
    };

    fetchCurrencyCode();
  }, []);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = getCookie("tokenAuth");
      let response;
      // Obtener currencyCodeId
      const currencyResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const currencyCodeId = currencyResponse.data.currencyCodes[0].id;
      // Actualizar el estado con currencyCodeId
      setZoneData((prevData) => ({
        ...prevData,
        currencyCodeId: currencyCodeId,
      }));
      if (isEditing) {
        // Si está editando, usar PUT en lugar de POST
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/shipping-zones/${zoneData.id}`,
          {
            id: zoneData.id,
            currencyCodeId: currencyCodeId, // Usar el currencyCodeId actualizado
            name: zoneData.name,
            description: zoneData.description,
            amount: parseInt(zoneData.amount.toString()),
            statusCode: zoneData.statusCode,
            communes: selectedCommunes.map((commune) => ({ id: commune.id })),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/shipping-zones`,
          {
            currencyCodeId: currencyCodeId, // Usar el currencyCodeId actualizado
            name: zoneData.name,
            description: zoneData.description,
            amount: parseInt(zoneData.amount.toString()),
            statusCode: zoneData.statusCode,
            communes: selectedCommunes.map((commune) => ({ id: commune.id })),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      console.log(
        isEditing ? "Zona actualizada:" : "Zona creada:",
        response.data
      );
      fetchZonas();
      setIsEditing(false);
      setZoneData({
        id: null,
        currencyCodeId: "",
        name: "",
        description: "",
        amount: 0,
        statusCode: "ACTIVE",
        communes: [],
      });
      setSelectedCommunes([]); // También puedes vaciar cualquier otro estado relacionado con los campos del formulario
      setSelectedRegion("");

      // Aquí puedes manejar la respuesta según sea necesario
    } catch (error) {
      console.error(
        "Error al",
        isEditing ? "actualizar" : "crear",
        "la zona:",
        error
      );
      // Aquí puedes manejar el error según sea necesario
    }
  };

  const fetchZonas = async () => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const PageNumber = 1;
      const PageSize = 50;

      const token = getCookie("tokenAuth");

      const data = await obtenerZonasRepartosBO(PageNumber, PageSize, token);
      setZonas(data.shippingZones);
      setLoading(false); // set loading to false after successful data fetch
    } catch (error) {
      setLoading(false); // set loading to false in case of error
      setError(error as Error); // set error state if an error occurs
    }
  };

  const fetchRegions = async () => {
    try {
      const Pais = "CL";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/countries/${Pais}/regions`
      );
      setRegions(response.data.regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const fetchCommunes = async (regionId: any) => {
    try {
      const token = getCookie("tokenAuth");
      const Pais = "CL";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/countries/${Pais}/regions/${regionId}/communes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCommunes(response.data.communes);
    } catch (error) {
      console.error("Error fetching communes:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setZoneData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedCommune(""); // Reset selected commune when region changes
    if (regionId) {
      fetchCommunes(regionId);
    } else {
      setCommunes([]); // Reset communes if no region is selected
    }
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const communeId = e.target.value;
    setSelectedCommune(communeId);
  };

  const addCommune = () => {
    if (selectedCommune) {
      const selectedCommuneObj = communes.find(
        (commune) => commune.id === selectedCommune
      );
      if (selectedCommuneObj) {
        // Check if selectedCommuneObj is not undefined
        // Check if the commune is already selected
        const isCommuneAlreadySelected = selectedCommunes.some(
          (c: { id: string; name: string }) => c.id === selectedCommuneObj.id
        );
        if (!isCommuneAlreadySelected) {
          setSelectedCommunes((prevCommunes) => [
            ...prevCommunes,
            selectedCommuneObj,
          ]);
        }
      }
    }
  };
  const removeCommune = (communeId: string) => {
    setSelectedCommunes((prevCommunes) =>
      prevCommunes.filter((commune) => commune.id !== communeId)
    );
  };

  useEffect(() => {
    fetchRegions();
    fetchZonas();
  }, []);

  const handleEdit = async (zone: any) => {
    try {
      const token = getCookie("tokenAuth");
      const currencyResponse = await axios.get<{
        currencyCodes: { id: string }[];
      }>(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const currencyCodeId = currencyResponse.data.currencyCodes[0].id;
      setIsEditing(true);
      setZoneData({
        id: zone.id,
        currencyCodeId: currencyCodeId, // Ensure currencyCodeId is fetched correctly
        name: zone.name,
        description: zone.description,
        amount: zone.amount,
        statusCode: zone.statusCode, // Add statusCode if it's part of your data structure
        communes: zone.communes.map((commune: any) => ({
          id: commune.id,
          name: commune.name,
        })),
      });
      setSelectedCommunes(zone.communes); // Use zone.communes instead of zoneData.communes
    } catch (error) {
      console.error("Error editing zone:", error);
      // Handle error appropriately, such as setting an error state
    }
  };

  const handleDelete = async (zoneId: string) => {
    try {
      const token = getCookie("tokenAuth");
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/shipping-zones/${zoneId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Zona eliminada:", response.data);
      fetchZonas(); // Vuelve a cargar las zonas después de eliminar una
      setIsEditing(false);
      setZoneData({
        id: null,
        currencyCodeId: "",
        name: "",
        description: "",
        amount: 0,
        statusCode: "ACTIVE",
        communes: [],
      });
      setSelectedCommunes([]); // También puedes vaciar cualquier otro estado relacionado con los campos del formulario
      setSelectedRegion("");
    } catch (error) {
      console.error("Error al eliminar la zona:", error);
    }
  };
  return (
    <section>
      <Breadcrumb pageName="Zonas de Repartos" />
      <div className="border border-dashed border-dark/50 rounded-lg p-4 bg-white my-6 overflow-x-auto">
        <h2 className="mb-8 text-center text-2xl font-bold text-dark md:mb-12 lg:text-3xl uppercase">
          Zonas Activas
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Descripción
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Monto
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Comunas
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Editar / Eliminar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {zonas.map((zone) => (
              <tr key={zone.id}>
                <td className="px-6 py-4 md:whitespace-nowrap">
                  <div className="text-sm text-gray-900">{zone.name}</div>
                </td>
                <td className="px-6 py-4 md:whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">
                    {zone.description}
                  </div>
                </td>
                <td className="px-6 py-4 md:whitespace-nowrap">
                  <div className="text-sm text-gray-900">{zone.amount}</div>
                </td>
                <td className="px-6 py-4 md:whitespace-nowrap">
                  <ul className="text-sm text-gray-900">
                    {zone.communes.map((commune) => (
                      <li key={commune.id}>{commune.name} </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 md:whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(zone)}
                    className="bg-primary hover:bg-dark text-dark hover:text-primary font-bold py-2 px-4 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(zone.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border border-dashed border-dark/50 rounded-lg p-4 bg-white my-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-dark md:mb-12 lg:text-3xl uppercase">
          {isEditing ? "Editar Zona de Reparto" : "Crear Zona de Reparto"}
        </h2>
        <div>
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false); // Cambiar isEditing a false al hacer clic en el botón
                setZoneData({
                  id: null,
                  currencyCodeId: "",
                  name: "",
                  description: "",
                  amount: 0,
                  statusCode: "ACTIVE",
                  communes: [],
                }); // Restablecer los datos de la zona
                setSelectedCommunes([]); // Restablecer las comunas seleccionadas
              }}
              className="bg-dark w-full uppercase text-primary hover:bg-primary hover:text-dark  font-bold py-2 px-4 rounded flex-wrap mt-4"
            >
              Cancelar Edición
            </button>
          )}
        </div>
        <div>
          <label className="block mt-4">
            <span className="font-bold uppercase">Nombre Zona</span>
            <input
              type="text"
              id="ZoneName"
              name="name"
              onChange={handleChange}
              value={zoneData.name}
              placeholder="Ingresa nombre de nueva Zona...."
              className="block w-full rounded-md  border-dark/50 border p-1 mt-1"
            />
          </label>
          <label className="block mt-4">
            <span className="font-bold uppercase">Descripción Zona </span>
            <textarea
              id="ZoneDescription"
              name="description"
              value={zoneData.description}
              onChange={handleChange}
              placeholder="Ingresa descripción de nueva Zona...."
              className="block w-full rounded-md  border-dark/50 border p-1 mt-1"
            ></textarea>
          </label>
          <label className="block mt-4">
            <span className="font-bold uppercase">Monto Zona</span>
            <input
              type="number"
              id="ZoneAmount"
              name="amount"
              value={zoneData.amount}
              onChange={handleChange}
              placeholder="Ingresa Precio de nueva Zona...."
              className="block w-full rounded-md  border-dark/50 border p-1 mt-1"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label
            htmlFor="region"
            className="block mt-4"
          >
            <span className="font-bold uppercase">Región </span>
            <select
              id="region"
              value={selectedRegion}
              onChange={(event) => {
                handleRegionChange(event);
              }}
              className="block w-full rounded-md text-sm  border-dark/50 border p-2 mt-1 bg-white"
            >
              <option>Selecciona Región</option>
              {regions.map((region: any) => (
                <option
                  key={region.id}
                  value={region.id}
                >
                  {region.name}
                </option>
              ))}
            </select>
          </label>
          <label
            htmlFor="commune"
            className="block mt-4"
          >
            <span className="font-bold uppercase">Comuna </span>
            <select
              id="commune"
              value={selectedCommune}
              onChange={(event) => {
                handleCommuneChange(event);
              }}
              disabled={!selectedRegion}
              className="block w-full rounded-md text-sm border-dark/50 border p-2 mt-1 bg-white"
            >
              <option>Selecciona Comuna</option>
              {communes.map((commune: any) => (
                <option
                  key={commune.id}
                  value={commune.id}
                >
                  {commune.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4">
          <button
            onClick={addCommune}
            className="bg-primary uppercase text-dark hover:bg-dark hover:text-white  font-bold py-2 px-4 rounded flex-wrap"
          >
            Agregar Comuna
          </button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 uppercase py-4">
            Comunas Seleccionadas:
          </h3>
          <div>
            {/* Aquí puedes mostrar las comunas seleccionadas */}
            {/* Por ejemplo, puedes mapear un array de las comunas seleccionadas y mostrarlas */}
            {/* Ejemplo: */}
            {selectedCommunes.map((commune) => (
              <div
                key={commune.id}
                className="inline-block mr-2 mb-2 p-2 border border-dashed border-dark rounded-lg"
              >
                <div className="flex">
                  <p className="font-bold uppercase text-md">{commune.name}</p>
                  <button
                    onClick={() => removeCommune(commune.id)}
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="bg-primary w-full uppercase text-dark hover:bg-dark hover:text-white  font-bold py-2 px-4 rounded flex-wrap"
          >
            {isEditing ? "Actualizar Zona" : "Crear Zona"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ZonasRepartos;
