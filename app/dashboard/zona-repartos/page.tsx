"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useEffect, useState } from "react";
import { useAPI } from "@/app/Context/ProductTypeContext";
import { obtenerZonasRepartosBO } from "@/app/utils/obtenerZonasRepartosBO";
import { getCookie } from "cookies-next";
import axios from "axios";
import toast from "react-hot-toast";

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
        const currencyCodeId = currencyResponse.data.currencyCodes[0].id;
        setZoneData((prevData) => ({
          ...prevData,
          currencyCodeId: currencyCodeId,
        }));
      } catch (error) {
        console.error("Error fetching currency code:", error);
        toast.error("Error al obtener el código de moneda.");
      }
    };

    fetchCurrencyCode();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validación básica
    if (!zoneData.name) {
      toast.error("El nombre de la zona es obligatorio.");
      return;
    }
    if (!zoneData.description) {
      toast.error("La descripción de la zona es obligatoria.");
      return;
    }
    if (zoneData.amount <= 1) {
      toast.error("El costo de despacho debe ser mayor que 1.");
      return;
    }
    if (selectedCommunes.length === 0) {
      toast.error("Debe agregar al menos una comuna.");
      return;
    }

    try {
      const token = getCookie("AdminTokenAuth");
      let response;
      const currencyResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
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

      if (isEditing) {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/shipping-zones/${zoneData.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            id: zoneData.id,
            currencyCodeId: currencyCodeId,
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
        toast.success("Zona actualizada exitosamente.");
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/shipping-zones?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            currencyCodeId: currencyCodeId,
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
        toast.success("Zona creada exitosamente.");
      }

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
      setSelectedCommunes([]);
      setSelectedRegion("");
    } catch (error) {
      console.error(
        "Error al",
        isEditing ? "actualizar" : "crear",
        "la zona:",
        error
      );
      toast.error(
        "Error al " + (isEditing ? "actualizar" : "crear") + " la zona."
      );
    }
  };

  const fetchZonas = async () => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const PageNumber = 1;
      const PageSize = 50;

      const token = getCookie("AdminTokenAuth");

      const data = await obtenerZonasRepartosBO(PageNumber, PageSize, token);
      setZonas(data.shippingZones);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error as Error);
      toast.error("Error al obtener las zonas de reparto.");
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
      toast.error("Error al obtener las regiones.");
    }
  };

  const fetchCommunes = async (regionId: any) => {
    try {
      const token = getCookie("AdminTokenAuth");
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
      toast.error("Error al obtener las comunas.");
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
    setSelectedCommune("");
    if (regionId) {
      fetchCommunes(regionId);
    } else {
      setCommunes([]);
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
      const token = getCookie("AdminTokenAuth");
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
        currencyCodeId: currencyCodeId,
        name: zone.name,
        description: zone.description,
        amount: zone.amount,
        statusCode: zone.statusCode,
        communes: zone.communes.map((commune: any) => ({
          id: commune.id,
          name: commune.name,
        })),
      });
      setSelectedCommunes(zone.communes);
    } catch (error) {
      console.error("Error editing zone:", error);
      toast.error("Error al editar la zona.");
    }
  };

  const handleDelete = async (zoneId: string) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/shipping-zones/${zoneId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Zona eliminada:", response.data);
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
      setSelectedCommunes([]);
      setSelectedRegion("");
      toast.success("Zona eliminada exitosamente.");
    } catch (error) {
      console.error("Error al eliminar la zona:", error);
      toast.error("Error al eliminar la zona.");
    }
  };

  return (
    <section className="p-10">
      <Breadcrumb pageName="Zonas de Repartos" />
      <div className="shadow-md  rounded-lg p-4 bg-white my-6 overflow-x-auto">
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Zonas Activas</div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
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
                    className="bg-primary hover:bg-secondary text-secondary hover:text-primary font-bold py-2 px-4 rounded"
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

      <div className="shadow-md  rounded-lg p-4 bg-white my-6">
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>
            {isEditing ? "Editar Zona de Reparto" : "Crear Zona de Reparto"}
          </div>
        </div>
        <div>
          {isEditing && (
            <button
              onClick={() => {
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
                setSelectedCommunes([]);
              }}
              className="bg-dark w-full uppercase text-white hover:bg-primary   font-bold py-2 px-4 rounded flex-wrap mt-4"
            >
              Cancelar Edición
            </button>
          )}
        </div>
        <div>
          <label className="block mt-4">
            <h4 className="font-normal text-primary">
              Nombre Zona<span className="text-primary">*</span>
            </h4>
            <input
              type="text"
              id="ZoneName"
              name="name"
              onChange={handleChange}
              value={zoneData.name}
              placeholder="Ingresa nombre de nueva Zona...."
              className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
              style={{ borderRadius: "var(--radius)" }}
            />
          </label>
          <label className="block mt-4">
            <h3 className="font-normal text-primary">
              Descripción zona <span className="text-primary">*</span>
            </h3>
            <textarea
              id="ZoneDescription"
              name="description"
              value={zoneData.description}
              onChange={handleChange}
              placeholder="Ingresa descripción de nueva Zona...."
              className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
              style={{ borderRadius: "var(--radius)" }}
            ></textarea>
          </label>

          <div
            style={{ borderRadius: "var(--radius)" }}
            className="shadow flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-semibold">Costo de despacho.</span> El costo
              de despacho es para la zona a crear.
            </div>
          </div>

          <label className="block mt-4">
            <h3 className="font-normal text-primary">
              Costo de despacho <span className="text-primary">*</span>
            </h3>
            <input
              type="number"
              id="ZoneAmount"
              name="amount"
              value={zoneData.amount}
              onChange={handleChange}
              placeholder="Ingresa Precio de nueva Zona...."
              className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
              style={{ borderRadius: "var(--radius)" }}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label
            htmlFor="region"
            className="block mt-4"
          >
            <h3 className="font-normal text-primary">
              Región <span className="text-primary">*</span>
            </h3>
            <select
              id="region"
              value={selectedRegion}
              onChange={(event) => {
                handleRegionChange(event);
              }}
              className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
              style={{ borderRadius: "var(--radius)" }}
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
            <h3 className="font-normal text-primary">
              Comuna <span className="text-primary">*</span>
            </h3>
            <select
              id="commune"
              value={selectedCommune}
              onChange={(event) => {
                handleCommuneChange(event);
              }}
              disabled={!selectedRegion}
              className="shadow block w-full px-4 py-3 mt-2 mb-4 border border-gray-300"
              style={{ borderRadius: "var(--radius)" }}
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
            className="shadow bg-primary hover:bg-secondary uppercase text-secondary hover:text-primary font-bold py-2 px-4  flex-wrap"
            style={{ borderRadius: "var(--radius)" }}
          >
            Agregar Comuna
          </button>
        </div>
        <div className="mt-4">
          <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
            <div>Comunas Seleccionadas:</div>
          </div>
          <div>
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
            className="shadow bg-primary hover:bg-secondary w-full uppercase text-secondary hover:text-primary  font-bold py-2 px-4 rounded flex-wrap mt-6"
            style={{ borderRadius: "var(--radius)" }}
          >
            {isEditing ? "Actualizar Zona" : "Crear Zona"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ZonasRepartos;
