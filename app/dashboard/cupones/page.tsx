"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import { obtenerCuponesBO } from "@/app/utils/obtenerCuponesBO";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

function CuponForm() {
  const [currencyCode, setCurrencyCode] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("FIXED_AMOUNT");
  const [amount, setAmount] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [hasFreeShipping, setHasFreeShipping] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingCuponId, setEditingCuponId] = useState<string | null>(null); // Track editing cupon ID

  const [codeError, setCodeError] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [percentageError, setPercentageError] = useState<string>("");
  const [expirationDateError, setExpirationDateError] = useState<string>("");
  const [typeError, setTypeError] = useState<string>("");
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCode(value);

    if (value.trim() === "") {
      setCodeError("El código no puede estar vacío");
    } else {
      setCodeError("");
    }
  };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(value);

    if (isNaN(value) || value <= 0) {
      setAmountError("Ingrese un monto válido mayor que cero");
    } else {
      setAmountError("");
    }
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPercentage(value);

    if (isNaN(value) || value <= 0 || value > 100) {
      setPercentageError("Ingrese un porcentaje válido entre 0 y 100");
    } else {
      setPercentageError("");
    }
  };

  const handleExpirationDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setExpirationDate(value);

    const today = new Date();
    const selectedDate = new Date(value);

    if (value === "" || selectedDate < today) {
      setExpirationDateError("Seleccione una fecha de expiración válida");
    } else {
      setExpirationDateError("");
    }
  };

  useEffect(() => {
    fetchCupones();
  }, []);

  const fetchCupones = async () => {
    try {
      const PageNumber = 1;
      const PageSize = 50;

      const token = getCookie("AdminTokenAuth");

      const data = await obtenerCuponesBO(PageNumber, PageSize, token);
      setCupones(data.discountCoupons);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error as Error);
    }
  };
  const formatDateToChileanTime = (isoDateString: string) => {
    const date = new Date(isoDateString);

    // Ajustar la hora a la zona horaria de Chile (GMT-4)
    const timezoneOffset = -4 * 60; // -4 horas en minutos
    const adjustedDate = new Date(date.getTime() + timezoneOffset * 60 * 1000);

    const day = adjustedDate.getDate().toString().padStart(2, "0");
    const month = (adjustedDate.getMonth() + 1).toString().padStart(2, "0"); // Los meses son 0-indexados
    const year = adjustedDate.getFullYear();
    const hours = adjustedDate.getHours().toString().padStart(2, "0");
    const minutes = adjustedDate.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (code.trim() === "") {
      setCodeError("El código no puede estar vacío");
      return;
    }

    if (type !== "FIXED_AMOUNT" && type !== "PERCENTAGE") {
      setTypeError("Selecciona un tipo de descuento válido");
      return;
    }

    if (type === "FIXED_AMOUNT" && (isNaN(amount) || amount <= 0)) {
      setAmountError("Ingrese un monto válido mayor que cero");
      return;
    }

    if (
      type === "PERCENTAGE" &&
      (isNaN(percentage) || percentage <= 0 || percentage > 100)
    ) {
      setPercentageError("Ingrese un porcentaje válido entre 0 y 100");
      return;
    }
    try {
      const token = getCookie("AdminTokenAuth");
      const currencyResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const currencyCode = currencyResponse.data.currencyCodes[0].id;

      const cupon: {
        code: string;
        description: string;
        type: string;
        amount: number | null;
        percentage: number | null;
        hasFreeShipping: boolean;
        statusCode: string;
        expirationDate: string | null;
        currencyCodeId: string; // Add this line
      } = {
        code,
        description: "pixelup cupon",
        type,
        amount: type === "FIXED_AMOUNT" ? amount : null,
        percentage: type === "PERCENTAGE" ? percentage : null,
        hasFreeShipping,
        statusCode: "ACTIVE",
        expirationDate: expirationDate ? expirationDate : null,
        currencyCodeId: currencyCode, // Use correct property name
      };

      if (type === "FIXED_AMOUNT") {
        cupon.currencyCodeId = currencyCode; // Use correct property name
      }

      if (editingCuponId) {
        // Update existing cupon if editing
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/discount-coupons/${editingCuponId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          cupon,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Cupón actualizado");
      } else {
        // Create new cupon if not editing
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/discount-coupons?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          cupon,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Cupón creado");
      }

      fetchCupones();
      resetForm();
    } catch (error) {
      console.error("Error creating/editing cupon:", error);
    }
  };

  const handleEdit = async (cupon: any) => {
    try {
      const token = getCookie("AdminTokenAuth");

      // Realizar la solicitud GET para obtener el detalle del cupón
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/discount-coupons/${cupon.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Extraer los datos del cupón del cuerpo de la respuesta
      const cuponDetail = response.data.discountCoupon;

      // Rellenar el formulario con los datos del cupón obtenidos
      setEditingCuponId(cupon.id);
      setCode(cuponDetail.code);
      setDescription(cuponDetail.description);
      setType(cuponDetail.type);
      setAmount(cuponDetail.amount || 0);
      setPercentage(cuponDetail.percentage || 0);
      setHasFreeShipping(cuponDetail.hasFreeShipping);

      // Manejar la fecha de expiración
      const expirationDateISO = cuponDetail.expirationDate; // "2024-06-20T00:00:00.000Z"
      const expirationDateOnly = expirationDateISO.split("T")[0]; // "2024-06-20"
      setExpirationDate(expirationDateOnly);

      // Determinar el tipo de descuento
      if (cuponDetail.percentage !== 0) {
        setType("PERCENTAGE");
        setPercentage(cuponDetail.percentage);
      } else {
        setType("FIXED_AMOUNT");
        setAmount(cuponDetail.amount || 0);
      }
    } catch (error) {
      console.error("Error obteniendo detalle del cupón:", error);
    }
  };

  const handleDelete = async (couponId: any) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/discount-coupons/${couponId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cupón eliminado:", response.data);
      fetchCupones();
    } catch (error) {
      console.error("Error eliminando cupón:", error);
    }
  };

  const resetForm = () => {
    setEditingCuponId(null);
    setCode("");
    setDescription("");
    setType("FIXED_AMOUNT");
    setAmount(0);
    setPercentage(0);
    setHasFreeShipping(false);
    setExpirationDate("");
  };

  return (
    <section className=" mx-10 py-10">
      <Breadcrumb pageName="Cupones" />
      <div
        className=" p-4 bg-white my-6 overflow-x-auto shadow-md"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-sm flex gap-2 font-medium border-b pb-2 mb-6 ">
          <div>Cupones Activos</div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Codigo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Fecha Vigencia
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
                Envío Gratis
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
            {cupones?.map((cupon: any) => (
              <tr key={cupon.id}>
                <td className="px-6 py-4 md:whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cupon.code}</div>
                </td>
                <td className="px-6 py-4 md:whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">
                    {formatDateToChileanTime(cupon.creationDate)}
                  </div>
                  <div className="text-sm text-gray-900">
                    {formatDateToChileanTime(cupon.expirationDate)}
                  </div>
                </td>
                <td className="px-6 py-4 md:whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">
                    {" "}
                    {cupon.amount === 0
                      ? `${cupon.percentage}%`
                      : `$ ${cupon.amount}`}
                  </div>
                </td>
                <td className="px-6 py-4 md:whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {cupon.hasFreeShipping === true ? "Si" : "No"}
                  </div>
                </td>

                <td className="px-6 py-4 md:whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(cupon)}
                    className="bg-primary hover:bg-dark text-secondary hover:bg-secondary hover:text-primary font-bold py-2 px-4 rounded"
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
                    onClick={() => handleDelete(cupon.id)}
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
      <div className="p-4 bg-white">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="code"
              className="block"
            >
              <h3 className="font-normal text-primary">Code:</h3>

              <input
                type="text"
                id="code"
                value={code}
                onChange={handleCodeChange}
                placeholder="Enter code..."
                className="shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                style={{ borderRadius: "var(--radius)" }}
                required
              />
            </label>
            {codeError && <p className="text-red-500">{codeError}</p>}
          </div>
          <div className="hidden">
            <label
              htmlFor="description"
              className="block"
            >
              <h3 className="font-normal text-primary">Descripción:</h3>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description..."
                className="shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                style={{ borderRadius: "var(--radius)" }}
                required
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block"
            >
              <h3 className="font-normal text-primary">Tipo de descuento:</h3>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-white shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                style={{ borderRadius: "var(--radius)" }}
              >
                <option value="FIXED_AMOUNT">Monto Fijo</option>
                <option value="PERCENTAGE">Porcentaje</option>
              </select>
            </label>
          </div>
          {type === "FIXED_AMOUNT" && (
            <div>
              <label
                htmlFor="amount"
                className="block"
              >
                <h3 className="font-normal text-primary">Monto:</h3>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount..."
                  className="shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                  style={{ borderRadius: "var(--radius)" }}
                  required
                />
              </label>
              {amountError && <p className="text-red-500">{amountError}</p>}
            </div>
          )}
          {type === "PERCENTAGE" && (
            <div>
              <label
                htmlFor="percentage"
                className="block"
              >
                <h3 className="font-normal text-primary">Porcentaje:</h3>
                <input
                  type="number"
                  id="percentage"
                  value={percentage}
                  onChange={handlePercentageChange}
                  placeholder="Enter percentage..."
                  className="shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                  style={{ borderRadius: "var(--radius)" }}
                  required
                />
                {percentageError && (
                  <p className="text-red-500">{percentageError}</p>
                )}
              </label>
            </div>
          )}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasFreeShipping"
              checked={hasFreeShipping}
              onChange={(e) => setHasFreeShipping(e.target.checked)}
              className="mr-2"
            />
            <label
              htmlFor="hasFreeShipping"
              className="uppercase"
            >
              Tiene envío gratis
            </label>
          </div>
          <div>
            <label
              htmlFor="expirationDate"
              className="block"
            >
              <h3 className="font-normal text-primary">Fecha de expiración:</h3>
              <input
                type="date"
                id="expirationDate"
                value={expirationDate}
                onChange={handleExpirationDateChange}
                className="shadow py-3 block w-full border border-dark/50 p-1 mt-2"
                style={{ borderRadius: "var(--radius)" }}
              />
              {expirationDateError && (
                <p className="text-red-500">{expirationDateError}</p>
              )}
            </label>
          </div>
          <div className="flex justify-between gap-4">
            <button
              onClick={handleSubmit}
              className="w-full shadow bg-primary uppercase text-secondary hover:bg-secondary hover:text-primary font-bold py-2 px-4 rounded flex-wrap"
            >
              {editingCuponId ? "Actualizar Cupon" : "Crear Cupon"}
            </button>

            {editingCuponId ? (
              <button
                onClick={() => {
                  setEditingCuponId(null);
                  setCode("");
                  setDescription("");
                  setType("FIXED_AMOUNT");
                  setAmount(0);
                  setPercentage(0);
                  setHasFreeShipping(false);
                  setExpirationDate(""); // o cualquier otro estado que tenga influencia en la edición
                  // Otros acciones para cancelar la edición, como resetear formularios, etc.
                }}
                className="w-full shadow bg-secondary uppercase text-primary hover:bg-primary hover:text-secondary font-bold py-2 px-4 rounded flex-wrap"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}

export default CuponForm;
