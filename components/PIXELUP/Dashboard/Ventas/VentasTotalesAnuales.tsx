import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loader from "@/components/common/Loader";

interface Sale {
  amount: number;
}

const VentasTotalesAnuales: React.FC = () => {
  const token = getCookie("AdminTokenAuth") as string;
  const [totalYearlySales, setTotalYearlySales] = useState<number | null>(null);
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

  const fetchSalesSummary = async (startDate: string, endDate: string) => {
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
      return sales;
    } catch (error) {
      console.error("Error fetching sales summary:", error);
      return [];
    }
  };

  const fetchAllSalesData = async () => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const startOfYear = `${currentYear}-01-01`;
    const endOfYear = `${currentYear}-12-31`;

    const yearlySales = await fetchSalesSummary(startOfYear, endOfYear);

    const sumAmounts = (sales: Sale[]): number =>
      sales
        .filter((sale) => sale.amount > 0)
        .reduce((sum, sale) => sum + sale.amount, 0);

    setTotalYearlySales(sumAmounts(yearlySales));
  };

  useEffect(() => {
    fetchAllSalesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currencyCodeId]);

  return (
    <div className="flex flex-col h-60 items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md">
      {totalYearlySales !== null ? (
        <>
          <dt className="mb-2 text-xl md:text-4xl font-extrabold">
            {totalYearlySales.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </dt>
          <dd className="font-light text-gray-500 dark:text-gray-400">
            Ventas Totales en el Año
          </dd>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default VentasTotalesAnuales;
