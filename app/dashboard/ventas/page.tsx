"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";

// Componente Skeleton mejorado
const SkeletonComponent = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl ${className}`}
  >
    <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
  </div>
);

const SalesSummary = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/SalesSummary"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse">
        <SkeletonComponent className="h-[400px]" />
      </div>
    ),
  }
);

const MostSoldProducts = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/MostSoldProducts"),
  {
    loading: () => (
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse">
        <SkeletonComponent className="h-[300px]" />
      </div>
    ),
  }
);

const CompareSales = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/CompareSales"),
  {
    loading: () => (
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse">
        <SkeletonComponent className="h-[250px]" />
      </div>
    ),
  }
);

const PedidosTotales = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/PedidosTotales"),
  {
    loading: () => (
      <div className="w-full p-6 bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse">
        <SkeletonComponent className="h-[120px]" />
      </div>
    ),
  }
);

const VentasMensuales = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/VentasMensuales"),
  {
    loading: () => (
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse">
        <SkeletonComponent className="h-[300px]" />
      </div>
    ),
  }
);

const VentasTotalesAnuales = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/VentasTotalesAnuales"),
  {
    loading: () => (
      <div className="w-full p-6 bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse">
        <SkeletonComponent className="h-[120px]" />
      </div>
    ),
  }
);

const ProductosMasVendidos = dynamic(
  () => import("@/components/Core/Dashboard/Ventas/ProductosMasVendidos"),
  {
    loading: () => (
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse">
        <SkeletonComponent className="h-[250px]" />
      </div>
    ),
  }
);

// Tipos para el plan de suscripción
type PlanType = "inicia" | "avanzado" | "pro" | "none";

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

  // Estados para verificación de plan
  const [currentPlan, setCurrentPlan] = useState<PlanType>("none");
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  // Función para verificar el plan de suscripción
  const checkSubscriptionPlan = async () => {
    try {
      setSubscriptionLoading(true);
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/subscriptions?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Buscar suscripciones activas
      const activeSubscriptions = response.data.subscriptions.filter(
        (sub: any) =>
          sub.statusCode === "ACTIVE" || sub.statusCode === "EXPIRED"
      );

      // Determinar el plan actual
      let planType: PlanType = "none";
      if (activeSubscriptions.length > 0) {
        const subscription = activeSubscriptions[0]; // Tomar la primera suscripción activa
        const planName = subscription.name.toLowerCase();

        if (planName.includes("pro")) {
          planType = "pro";
        } else if (planName.includes("avanzado")) {
          planType = "avanzado";
        } else if (planName.includes("inicia")) {
          planType = "inicia";
        }
      }

      setCurrentPlan(planType);
    } catch (error) {
      console.error("Error verificando plan de suscripción:", error);
      setCurrentPlan("none");
    } finally {
      setSubscriptionLoading(false);
    }
  };

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
      const token = getCookie("AdminTokenAuth");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/most-selled-products?statusCode=PAYMENT_COMPLETED&startDate=${startDate}&endDate=${endDate}&currencyCodeId=${currencyCodeId}&orderBy=amount&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`;

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
    checkSubscriptionPlan(); // Verificar el plan al cargar el componente
  }, []); // Ejecuta solo al montar el componente

  // Función para renderizar mensaje de restricción según el plan
  const renderPlanRestrictionMessage = (
    requiredPlan: PlanType,
    featureName: string
  ) => {
    if (subscriptionLoading) return null;

    const planHierarchy = { inicia: 1, avanzado: 2, pro: 3, none: 0 };
    const currentPlanLevel = planHierarchy[currentPlan];
    const requiredPlanLevel = planHierarchy[requiredPlan];

    if (currentPlanLevel < requiredPlanLevel) {
      return (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm text-red-700">
                <p className="font-medium text-base mb-1">
                  Funcionalidad Restringida
                </p>
                <p>
                  {featureName} es exclusivo del Plan{" "}
                  {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}{" "}
                  y superiores. Puedes actualizar tu plan en la sección{" "}
                  <a
                    href="/dashboard/suscripciones/estado"
                    rel="noopener noreferrer"
                    className="underline font-medium text-red-800 hover:text-red-900 transition-colors"
                  >
                    Suscripción.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-6 mb-8 rounded-r-xl shadow-lg animate-slide-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error de Carga
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* MÉTRICAS PRINCIPALES - Plan Inicia (siempre visible) */}
        <div className="animate-fade-in ">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Métricas Principales
            </h2>
            <p className="text-gray-600">
              Resumen ejecutivo de tu rendimiento comercial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primera fila: Ventas Totales y Total de Pedidos */}
            <VentasTotalesAnuales />
            <PedidosTotales />

            {/* Segunda fila: Métricas mensuales */}
            <VentasMensuales />
          </div>
        </div>

        {/* TOP PRODUCTOS - Visible para Plan Pro y Avanzado */}
        {(currentPlan === "avanzado" || currentPlan === "pro") && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full text-sm font-medium mb-4">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Top Productos del Año
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Productos Más Vendidos
              </h2>
              <p className="text-gray-600">
                Los productos estrella de tu negocio
              </p>
            </div>

            <div className="transform hover:scale-105 transition-all duration-300">
              <ProductosMasVendidos />
            </div>
          </div>
        )}

        {/* DASHBOARD PLAN PRO - Análisis Avanzado de Comparación */}
        {currentPlan === "pro" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium mb-4">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Plan Pro - Análisis Comparativo
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Comparación de Períodos
              </h2>
              <p className="text-gray-600">
                Herramientas profesionales para comparar rendimiento
              </p>
            </div>

            <div className="transform hover:scale-105 transition-all duration-300">
              <CompareSales />
            </div>
          </div>
        )}

        {renderPlanRestrictionMessage(
          "pro",
          "Análisis Avanzado de Comparación de Períodos"
        )}

        {/* DASHBOARD PLAN AVANZADO - Reportes Detallados a Todo el Ancho */}
        {(currentPlan === "avanzado" || currentPlan === "pro") && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium mb-4">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Plan Avanzado - Reportes Detallados
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Análisis Profundo
              </h2>
              <p className="text-gray-600">
                Información detallada sobre productos y tendencias de venta
              </p>
            </div>

            <div className="space-y-8">
              <div className="transform hover:scale-105 transition-all duration-300">
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
              </div>

              <div className="transform hover:scale-105 transition-all duration-300">
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
        )}

        {renderPlanRestrictionMessage(
          "avanzado",
          "Reportes Detallados de Productos y Resumen de Ventas"
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}

export default StatsPage;
