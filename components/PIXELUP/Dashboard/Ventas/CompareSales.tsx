import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

const CompararVentas: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const defaultStartDate2 = `${currentYear}-${String(currentMonth).padStart(
    2,
    "0"
  )}-01`;
  const defaultEndDate2 = `${currentYear}-${String(currentMonth).padStart(
    2,
    "0"
  )}-${new Date(currentYear, currentMonth, 0).getDate()}`;

  const defaultStartDate1 = `${previousMonthYear}-${String(
    previousMonth
  ).padStart(2, "0")}-01`;
  const defaultEndDate1 = `${previousMonthYear}-${String(
    previousMonth
  ).padStart(2, "0")}-${new Date(
    previousMonthYear,
    previousMonth,
    0
  ).getDate()}`;

  const [startDate1, setStartDate1] = useState<string>(defaultStartDate1);
  const [endDate1, setEndDate1] = useState<string>(defaultEndDate1);
  const [startDate2, setStartDate2] = useState<string>(defaultStartDate2);
  const [endDate2, setEndDate2] = useState<string>(defaultEndDate2);
  const [salesMonth1, setSalesMonth1] = useState<number | null>(null);
  const [salesMonth2, setSalesMonth2] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [currencyCodeId, setCurrencyCodeId] = useState<string | null>(null);

  // Fetch currency code ID once on mount
  useEffect(() => {
    const fetchCurrencyCode = async () => {
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

        if (
          currencyResponse.data &&
          currencyResponse.data.currencyCodes &&
          currencyResponse.data.currencyCodes.length > 0
        ) {
          setCurrencyCodeId(currencyResponse.data.currencyCodes[0].id);
        } else {
          console.error("Currency code ID not found.");
        }
      } catch (error) {
        console.error("Error fetching currency code:", error);
      }
    };

    fetchCurrencyCode();
  }, []);

  const fetchSalesData = async (startDate: string, endDate: string) => {
    if (!currencyCodeId) {
      console.error("Currency code ID is required");
      return null;
    }

    if (!startDate || !endDate) {
      console.error("Both start date and end date are required");
      return null;
    }

    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/sales-summary?statusCode=PAYMENT_COMPLETED&startDate=${startDate}&endDate=${endDate}&currencyCodeId=${currencyCodeId}&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Sales Data Response:", response.data);

      // Calcula la suma total de ventas en el periodo
      const totalSales = response.data.sales.reduce(
        (total: number, sale: { amount: number }) => total + sale.amount,
        0
      );

      return totalSales;
    } catch (error) {
      console.error("Error fetching sales data:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const sales1 = await fetchSalesData(startDate1, endDate1);
      const sales2 = await fetchSalesData(startDate2, endDate2);

      setSalesMonth1(sales1);
      setSalesMonth2(sales2);

      if (sales1 !== null && sales2 !== null) {
        if (sales1 === 0) {
          // Maneja el caso donde las ventas del primer mes son 0
          setPercentageChange(sales2 > 0 ? 100 : 0); // Si sales2 es mayor que 0, es un 100% de incremento, sino 0%
        } else {
          const change = ((sales2 - sales1) / sales1) * 100;
          setPercentageChange(change);
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate1, endDate1, startDate2, endDate2, currencyCodeId]);

  return (
    <div className="rounded border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black">
      <title>Ventas</title>
      <section className="dark:bg-gray-900">
        <div className="text-sm font-medium border-b pb-2">
          Comparar Ciclos de Venta
        </div>
        <div className="max-w-screen-xl px-4 py-4 mx-auto text-center lg:px-6">
          <div className="grid grid-cols-1 gap-4 mb-4">
            {/* Fecha 1 y Caja de Resultado */}
            <div className="border rounded p-4 shadow grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Fecha Inicio 1
                </label>
                <input
                  type="date"
                  value={startDate1}
                  onChange={(e) => setStartDate1(e.target.value)}
                  className="mt-1 block text-[14px] w-full border-gray-300 rounded shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Fecha Fin 1
                </label>
                <input
                  type="date"
                  value={endDate1}
                  onChange={(e) => setEndDate1(e.target.value)}
                  className="mt-1 block text-[14px] w-full border-gray-300 rounded shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center  p-2  ">
              <dt className="mb-2 text-xl font-extrabold">
                {salesMonth1 !== null ? (
                  salesMonth1.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })
                ) : (
                  <span className="text-gray-400 text-[14px] font-light ">
                    No hay data para fechas seleccionadas
                  </span>
                )}
              </dt>
              <dd className="font-light text-gray-700 ">
                Ventas del Primer Periodo
              </dd>
            </div>

            {/* Fecha 2 y Caja de Resultado */}
            <div className="border rounded p-4 shadow grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Fecha Inicio 2
                </label>
                <input
                  type="date"
                  value={startDate2}
                  onChange={(e) => setStartDate2(e.target.value)}
                  className="mt-1 block w-full text-[14px] border-gray-300 rounded shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Fecha Fin 2
                </label>
                <input
                  type="date"
                  value={endDate2}
                  onChange={(e) => setEndDate2(e.target.value)}
                  className="mt-1 block w-full text-[14px] border-gray-300 rounded shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-1">
              <dt className="mb-2 text-xl font-extrabold">
                {salesMonth2 !== null ? (
                  salesMonth2.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })
                ) : (
                  <span className="text-gray-400 text-[14px] font-light ">
                    No hay data para fechas seleccionadas
                  </span>
                )}
              </dt>
              <dd className="font-light text-gray-700 dark:text-gray-700">
                Ventas del Segundo Periodo
              </dd>
            </div>
          </div>

          {percentageChange !== null && (
            <div className="text-xl font-extrabold mt-6">
              Cambio porcentual:{" "}
              <span
                className={
                  percentageChange > 0 ? "text-green-700" : "text-red-500"
                }
              >
                {percentageChange.toFixed(2)}%
                {percentageChange > 0 ? (
                  <span className="ml-2">▲</span>
                ) : (
                  <span className="ml-2">▼</span>
                )}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CompararVentas;
