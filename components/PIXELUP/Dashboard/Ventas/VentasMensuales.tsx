import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loader from "@/components/common/Loader";

interface Sale {
  amount: number;
}

const VentasMensuales: React.FC = () => {
  const token = getCookie("AdminTokenAuth") as string;
  const [currentMonthSales, setCurrentMonthSales] = useState<number | null>(
    null
  );
  const [previousMonthSales, setPreviousMonthSales] = useState<number | null>(
    null
  );
  const [currencyCodeId, setCurrencyCodeId] = useState<string | null>(null);

  const fetchCurrencyCode = async (token: string): Promise<string | null> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const currencyCodes = response.data.currencyCodes;
      const clpCode = currencyCodes.find((code: any) => code.code === "CLP");
      return clpCode ? clpCode.id : null;
    } catch (error) {
      console.error("Error fetching currency code:", error);
      return null;
    }
  };

  const fetchSalesSummary = async (
    startDate: string,
    endDate: string,
    setter: (value: number) => void
  ) => {
    try {
      const currentCurrencyCodeId =
        currencyCodeId || (await fetchCurrencyCode(token));
      if (!currentCurrencyCodeId) throw new Error("Currency code ID not found");
      setCurrencyCodeId(currentCurrencyCodeId);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/sales-summary?startDate=${startDate}&endDate=${endDate}&statusCode=PAYMENT_COMPLETED&currencyCodeId=${currentCurrencyCodeId}`;
      const response = await axios.get(url, config);

      const sales: Sale[] = response.data.sales;
      const totalAmount = sales.reduce(
        (sum: number, sale: Sale) => sum + sale.amount,
        0
      );
      setter(totalAmount);
    } catch (error) {
      console.error("Error fetching sales summary:", error);
    }
  };

  useEffect(() => {
    const fetchAllSalesData = async () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)
        .toISOString()
        .split("T")[0];
      const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0)
        .toISOString()
        .split("T")[0];
      const startOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1)
        .toISOString()
        .split("T")[0];
      const endOfPreviousMonth = new Date(currentYear, currentMonth, 0)
        .toISOString()
        .split("T")[0];

      await fetchSalesSummary(
        startOfCurrentMonth,
        endOfCurrentMonth,
        setCurrentMonthSales
      );
      await fetchSalesSummary(
        startOfPreviousMonth,
        endOfPreviousMonth,
        setPreviousMonthSales
      );
    };

    fetchAllSalesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currencyCodeId]);

  const calculatePercentageChange = (
    current: number,
    previous: number
  ): number => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };

  const percentageChange =
    currentMonthSales !== null && previousMonthSales !== null
      ? calculatePercentageChange(currentMonthSales, previousMonthSales)
      : null;

  return (
    <div className="flex flex-col h-60 items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md">
      {currentMonthSales !== null ? (
        <>
          <dt className="text-2xl font-extrabold text-green-700">
            {currentMonthSales.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </dt>
          <dd className="font-light text-gray-500 dark:text-gray-400">
            Venta del Mes
          </dd>
          <dt className="text-xl font-extrabold text-green-700 mt-4">
            {previousMonthSales?.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </dt>
          <dd className="font-light text-md text-gray-500 dark:text-gray-400">
            Venta del Mes Anterior
          </dd>
          <dt className="mb-2 text-xl font-extrabold mt-4">
            {percentageChange !== null ? (
              <p
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
              </p>
            ) : (
              <Loader />
            )}
          </dt>
          <dd className="font-light text-md text-gray-500 dark:text-gray-400">
            Porcentaje de Cambio
          </dd>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default VentasMensuales;
