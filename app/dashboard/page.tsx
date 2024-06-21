/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import GoogleAnalyticsData from "@/components/PIXELUP/Dashboard/Analitycs/Google";
import MostSoldProducts from "@/components/PIXELUP/Dashboard/Ventas/MostSoldProducts";
import SalesSummary from "@/components/PIXELUP/Dashboard/Ventas/SalesSummary";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

const StatsDashboard = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Meses de 0 a 11, por eso se suma 1
  const defaultStartDate = `${currentYear}-${String(currentMonth).padStart(
    2,
    "0"
  )}-01`;
  const defaultEndDate = `${currentYear}-${String(currentMonth).padStart(
    2,
    "0"
  )}-${new Date(currentYear, currentMonth, 0).getDate()}`; // Último día del mes

  const [salesSummary, setSalesSummary] = useState(null);
  const [mostSoldProducts, setMostSoldProducts] = useState([]);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [startDateProducts, setStartDateProducts] = useState(defaultStartDate);
  const [endDateProducts, setEndDateProducts] = useState(defaultEndDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [currencyCodeId, setCurrencyCodeId] = useState(null);

  const fetchCurrencyCode = async (token: any) => {
    try {
      const currencyResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE`,
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
      const url = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/sales-summary?statusCode=PAYMENT_COMPLETED&startDate=${startDate}&endDate=${endDate}&currencyCodeId=${currentCurrencyCodeId}`;

      // Realiza la solicitud GET
      const response = await axios.get(url, config);

      // Maneja la respuesta
      console.log("Sales Summary Data:", response.data.sales);
      setSalesSummary(response.data.sales); // Guarda los datos en el estado
    } catch (error) {
      console.error("Error fetching sales summary:", error);
    }
  };

  const fetchMostSoldProducts = async () => {
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
      const url = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/most-selled-products?startDate=${startDateProducts}&endDate=${endDateProducts}&currencyCodeId=${currencyCodeId}&orderBy=amount`;

      // Realiza la solicitud GET
      const response = await axios.get(url, config);

      // Maneja la respuesta
      console.log("Most Sold Products Data:", response.data.products);
      setMostSoldProducts(response.data.products); // Guarda los datos en el estado
    } catch (error) {
      console.error("Error fetching most sold products:", error);
    }
  };

  useEffect(() => {
    if (currencyCodeId) {
      fetchSalesSummary();
      fetchMostSoldProducts();
    }
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
    <div className="text-gray-600 body-font">
      <Breadcrumb pageName="Dashboard" />
      <div className="container px-5 py-4 mx-auto">
        <SalesSummary
          salesData={salesSummary}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <MostSoldProducts
          salesData={mostSoldProducts}
          startDateProducts={startDateProducts}
          endDateProducts={endDateProducts}
          setStartDateProducts={setStartDateProducts}
          setEndDateProducts={setEndDateProducts}
          fetchMostSoldProducts={fetchMostSoldProducts}
        />
        <GoogleAnalyticsData />
      </div>
    </div>
  );
};

export default StatsDashboard;
