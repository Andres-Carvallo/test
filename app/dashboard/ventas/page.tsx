"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";

// Componente Skeleton simple
const SkeletonComponent = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const SalesSummary = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/SalesSummary"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <SkeletonComponent className="h-[400px]" />
      </div>
    )
  }
);

const MostSoldProducts = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/MostSoldProducts"),
  {
    loading: () => (
      <div className="w-full p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <SkeletonComponent className="h-[300px]" />
      </div>
    )
  }
);

const CompareSales = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/CompareSales"),
  {
    loading: () => (
      <div className="w-full p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <SkeletonComponent className="h-[250px]" />
      </div>
    )
  }
);

const PedidosTotales = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/PedidosTotales"),
  {
    loading: () => (
      <div className="w-full p-4 bg-white rounded-lg shadow-sm animate-pulse">
        <SkeletonComponent className="h-[100px]" />
      </div>
    )
  }
);

const VentasMensuales = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/VentasMensuales"),
  {
    loading: () => (
      <div className="w-full p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <SkeletonComponent className="h-[300px]" />
      </div>
    )
  }
);

const VentasTotalesAnuales = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/VentasTotalesAnuales"),
  {
    loading: () => (
      <div className="w-full p-4 bg-white rounded-lg shadow-sm animate-pulse">
        <SkeletonComponent className="h-[100px]" />
      </div>
    )
  }
);

const ProductosMasVendidos = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/ProductosMasVendidos"),
  {
    loading: () => (
      <div className="w-full p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <SkeletonComponent className="h-[250px]" />
      </div>
    )
  }
);

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrencyCode = async (token: any) => {
    try {
      setError(null);
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
      setError("Error al cargar el código de moneda");
      console.error("Error fetching currency code:", error);
    }
    return null;
  };

  const fetchSalesSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getCookie("AdminTokenAuth");

      const currentCurrencyCodeId =
        currencyCodeId || (await fetchCurrencyCode(token));
      setCurrencyCodeId(currentCurrencyCodeId);

      if (!currentCurrencyCodeId) {
        throw new Error("No se encontró el código de moneda");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/sales-summary?statusCode=PAYMENT_COMPLETED&startDate=${startDate}&endDate=${endDate}&currencyCodeId=${currentCurrencyCodeId}&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`;

      const response = await axios.get(url, config);
      setSalesSummary(response.data.sales);
    } catch (error) {
      setError("Error al cargar el resumen de ventas");
      console.error("Error fetching sales summary:", error);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VentasTotalesAnuales />
          <PedidosTotales />
        </div>

        <div className="bg-gray-50 rounded-lg ">
          <VentasMensuales />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CompareSales />
          </div>
          <div>
            <ProductosMasVendidos />
          </div>
        </div>

        <div className="space-y-6">
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
    </div>
  );
}

export default StatsPage;
