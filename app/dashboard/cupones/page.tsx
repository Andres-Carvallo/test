"use client";
import React, { useState, useEffect } from "react";
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

  const fetchCupones = async () => {
    try {
      const PageNumber = 1;
      const PageSize = 50;

      const token = getCookie("tokenAuth");

      const data = await obtenerCuponesBO(PageNumber, PageSize, token);
      setCupones(data.discountCoupons);
      console.log(data, "data");
      setLoading(false); // set loading to false after successful data fetch
    } catch (error) {
      setLoading(false); // set loading to false in case of error
      setError(error as Error); // set error state if an error occurs
    }
  };
  useEffect(() => {
    fetchCupones();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = getCookie("tokenAuth");
      // Obtener currencyCode
      const currencyResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const currencyCode = currencyResponse.data.currencyCodes[0].id;
      // Crear el objeto cupón
      const cupon = {
        code,
        description,
        type,
        amount: type === "FIXED_AMOUNT" ? amount : null,
        percentage: type === "PERCENTAGE" ? percentage : null,
        hasFreeShipping,
        statusCode: "ACTIVE",
        expirationDate: expirationDate ? expirationDate : null,
      };

      if (type === "FIXED_AMOUNT") {
        currencyCodeId: currencyCode;
      }

      // Enviar el objeto cupón a la API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/discount-coupons`,
        cupon,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchCupones();
      console.log("Cupón creado:", response.data);
    } catch (error) {
      console.error("Error creating cupon:", error);
    }
  };

  const handleDelete = async (couponId: any) => {
    try {
      const token = getCookie("tokenAuth");
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/discount-coupons/${couponId}`,
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

  return (
    <section>
      <Breadcrumb pageName="Zonas de Repartos" />
      <div className="border border-dashed border-dark/50 rounded-lg p-4 bg-white my-6 overflow-x-auto">
        <h2 className="mb-8 text-center text-2xl font-bold text-dark md:mb-12 lg:text-3xl uppercase">
          Cupones Activos
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
                Fecha
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
                Estado
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
                    {cupon.creationDate}
                  </div>
                  <div className="text-sm text-gray-900">
                    {cupon.expirationDate}
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
                    {cupon.status_code}
                  </div>
                </td>

                <td className="px-6 py-4 md:whitespace-nowrap space-x-2">
                  <button
                    //onClick={() => handleEdit(cupon)}
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
      <div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="code"
              className="block"
            >
              <span className="font-bold uppercase">Code:</span>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code..."
                className="block w-full rounded-md border border-dark/50 p-1 mt-1"
                required
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block"
            >
              <span className="font-bold uppercase">Description:</span>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description..."
                className="block w-full rounded-md border border-dark/50 p-1 mt-1"
                required
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block"
            >
              <span className="font-bold uppercase">Type:</span>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="block w-full rounded-md border border-dark/50 p-2 mt-1 bg-white"
              >
                <option value="FIXED_AMOUNT">Fixed Amount</option>
                <option value="PERCENTAGE">Percentage</option>
              </select>
            </label>
          </div>
          {type === "FIXED_AMOUNT" && (
            <div>
              <label
                htmlFor="amount"
                className="block"
              >
                <span className="font-bold uppercase">Amount:</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  placeholder="Enter amount..."
                  className="block w-full rounded-md border border-dark/50 p-1 mt-1"
                  required
                />
              </label>
            </div>
          )}
          {type === "PERCENTAGE" && (
            <div>
              <label
                htmlFor="percentage"
                className="block"
              >
                <span className="font-bold uppercase">Percentage:</span>
                <input
                  type="number"
                  id="percentage"
                  value={percentage}
                  onChange={(e) => setPercentage(parseFloat(e.target.value))}
                  placeholder="Enter percentage..."
                  className="block w-full rounded-md border border-dark/50 p-1 mt-1"
                  required
                />
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
              Has Free Shipping
            </label>
          </div>
          <div>
            <label
              htmlFor="expirationDate"
              className="block"
            >
              <span className="font-bold uppercase">Expiration Date:</span>
              <input
                type="date"
                id="expirationDate"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="block w-full rounded-md border border-dark/50 p-1 mt-1"
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-primary uppercase text-dark hover:bg-dark hover:text-white font-bold py-2 px-4 rounded flex-wrap"
          >
            Create Cupon
          </button>
        </form>
      </div>
    </section>
  );
}

export default CuponForm;
