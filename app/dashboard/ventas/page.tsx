"use client";

import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import SalesSummary from "@/components/PIXELUP/Dashboard/Ventas/SalesSummary";
import MostSoldProducts from "@/components/PIXELUP/Dashboard/Ventas/MostSoldProducts";
import CompareSales from "@/components/PIXELUP/Dashboard/Ventas/CompareSales";
import PedidosTotales from "@/components/PIXELUP/Dashboard/Ventas/PedidosTotales";
import VentasMensuales from "@/components/PIXELUP/Dashboard/Ventas/VentasMensuales";
import VentasTotalesAnuales from "@/components/PIXELUP/Dashboard/Ventas/VentasTotalesAnuales";
import ProductosMasVendidos from "@/components/PIXELUP/Dashboard/Ventas/ProductosMasVendidos";

function StatsPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Meses de 0 a 11, por eso se suma 1
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const defaultStartDate = `${currentYear}-${String(currentMonth).padStart(
    2,
    "0"
  )}-01`;
  const defaultEndDate = `${currentYear}-${String(currentMonth).padStart(
    2,
    "0"
  )}-${new Date(currentYear, currentMonth, 0).getDate()}`; // Último día del mes

  const previousStartDate = `${previousMonthYear}-${String(
    previousMonth
  ).padStart(2, "0")}-01`;
  const previousEndDate = `${previousMonthYear}-${String(
    previousMonth
  ).padStart(2, "0")}-${new Date(
    previousMonthYear,
    previousMonth,
    0
  ).getDate()}`; // Último día del mes anterior

  const [salesSummary, setSalesSummary] = useState(null);
  const [mostSoldProducts, setMostSoldProducts] = useState([]);
  const [currentSalesData, setCurrentSalesData] = useState({
    totalSales: 0,
    totalQuantity: 0,
  });
  const [previousSalesData, setPreviousSalesData] = useState({
    totalSales: 0,
    totalQuantity: 0,
  });
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [startDateProducts, setStartDateProducts] = useState(defaultStartDate);
  const [endDateProducts, setEndDateProducts] = useState(defaultEndDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [currencyCodeId, setCurrencyCodeId] = useState(null);

  const fetchCurrencyCode = async (token: any) => {
    try {
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
        return currencyResponse.data.currencyCodes[0].id;
      }
    } catch (error) {
      console.error("Error fetching currency code:", error);
    }
    return null;
  };

  const fetchSalesSummary = async () => {
    try {
      const token = getCookie("AdminTokenAuth"); // Obtén el token de las cookies

      // Obtén el currencyCodeId si no está ya en el estado
      const currentCurrencyCodeId =
        currencyCodeId || (await fetchCurrencyCode(token));
      setCurrencyCodeId(currentCurrencyCodeId);

      if (!currentCurrencyCodeId) {
        throw new Error("Currency code ID not found");
      }

      // Configuración de la solicitud
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Construye la URL con las fechas
      const url = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/sales-summary?statusCode=PAYMENT_COMPLETED&startDate=${startDate}&endDate=${endDate}&currencyCodeId=${currentCurrencyCodeId}&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`;

      // Realiza la solicitud GET
      const response = await axios.get(url, config);

      // Maneja la respuesta
      console.log("Sales Summary Data:", response.data.sales);
      setSalesSummary(response.data.sales); // Guarda los datos en el estado
    } catch (error) {
      console.error("Error fetching sales summary:", error);
    }
  };

  const fetchMostSoldProducts = async (startDate: any, endDate: any) => {
    try {
      const token = getCookie("AdminTokenAuth"); // Obtén el token de las cookies

      // Configuración de la solicitud
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Construye la URL con las fechas y orden por defecto
      const url = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/most-selled-products?startDate=${startDate}&endDate=${endDate}&currencyCodeId=${currencyCodeId}&orderBy=amount&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`;

      // Realiza la solicitud GET
      const response = await axios.get(url, config);

      const products = response.data.products;
      setMostSoldProducts(products);
    } catch (error) {
      console.error("Error fetching most sold products:", error);
      return { totalSales: 0, totalQuantity: 0 };
    }
  };

  useEffect(() => {
    if (currencyCodeId) {
      fetchSalesSummary();
      fetchMostSoldProducts(startDateProducts, endDateProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, currencyCodeId, startDateProducts, endDateProducts]); // Agrega startDate, endDate y currencyCodeId como dependencias

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = getCookie("AdminTokenAuth"); // Obtén el token de las cookies
      const currencyId = await fetchCurrencyCode(token);
      setCurrencyCodeId(currencyId);
    };

    fetchInitialData();
  }, []); // Ejecuta solo al montar el componente

  return (
    <div className="mx-10">
      {" "}
      <div className="max-w-7xl mx-auto  py-10  ">
        <div className=" flex items-center justify-center gap-4 ">
          <VentasTotalesAnuales />
          <PedidosTotales />
        </div>
        <div className="mt-4">
          <VentasMensuales />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="col-span-2">
            <CompareSales />
          </div>
          <div>
            <ProductosMasVendidos />
          </div>
        </div>

        <MostSoldProducts
          salesData={mostSoldProducts}
          startDateProducts={startDateProducts}
          endDateProducts={endDateProducts}
          setStartDateProducts={setStartDateProducts}
          setEndDateProducts={setEndDateProducts}
          fetchMostSoldProducts={() =>
            fetchMostSoldProducts(startDateProducts, endDateProducts)
          }
        />

        <SalesSummary
          salesData={salesSummary}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>
    </div>
  );
}

export default StatsPage;
