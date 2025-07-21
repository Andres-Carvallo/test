import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

interface Product {
  productId: string;
  productName: string;
  productImageUrl: string | null;
  amount: number;
  quantity: number;
}

const ProductosMasVendidos: React.FC = () => {
  const token = getCookie("AdminTokenAuth") as string;
  const [currencyCodeId, setCurrencyCodeId] = useState<string | null>(null);
  const [mostSoldProducts, setMostSoldProducts] = useState<Product[] | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"amount" | "quantity">("amount");
  const [loading, setLoading] = useState(true);

  const fetchCurrencyCode = async (token: string): Promise<string | null> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/currency-codes?pageNumber=1&pageSize=50&statusCode=ACTIVE&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
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

  useEffect(() => {
    const fetchMostSoldProducts = async (
      startDate: string,
      endDate: string,
      orderBy: "amount" | "quantity"
    ) => {
      try {
        setLoading(true);
        const currentCurrencyCodeId =
          currencyCodeId || (await fetchCurrencyCode(token));
        if (!currentCurrencyCodeId)
          throw new Error("Currency code ID not found");
        setCurrencyCodeId(currentCurrencyCodeId);

        // Configuración de la solicitud
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        // Construye la URL con las fechas, orden Y statusCode para consistencia
        const url = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/most-selled-products?statusCode=PAYMENT_COMPLETED&startDate=${startDate}&endDate=${endDate}&currencyCodeId=${currentCurrencyCodeId}&orderBy=${orderBy}&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`;

        // Realiza la solicitud GET
        const response = await axios.get(url, config);

        const products = response.data.products;

        // Agrupar productos por productId y sumar cantidad y montos
        const groupedProducts: { [key: string]: Product } = {};
        products.forEach((product: Product) => {
          if (groupedProducts[product.productId]) {
            groupedProducts[product.productId].amount += product.amount;
            groupedProducts[product.productId].quantity += product.quantity;
          } else {
            groupedProducts[product.productId] = { ...product };
          }
        });

        const aggregatedProducts = Object.values(groupedProducts);

        // Ordenar los productos según el criterio seleccionado (amount o quantity)
        const sortedProducts = aggregatedProducts.sort(
          (a: Product, b: Product) =>
            orderBy === "amount" ? b.amount - a.amount : b.quantity - a.quantity
        );

        setMostSoldProducts(sortedProducts.slice(0, 10));
      } catch (error) {
        console.error("Error fetching most sold products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllSalesData = async () => {
      const today = new Date();
      const currentYear = today.getFullYear();

      const startOfYear = `${currentYear}-01-01`;
      const endOfYear = `${currentYear}-12-31`;

      await fetchMostSoldProducts(startOfYear, endOfYear, sortOrder);
    };

    fetchAllSalesData();
  }, [token, sortOrder, currencyCodeId]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}°`;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-400 to-amber-500";
      case 1:
        return "from-gray-300 to-gray-400";
      case 2:
        return "from-amber-600 to-orange-600";
      default:
        return "from-blue-400 to-indigo-500";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 px-8 py-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Top Productos</h2>
            <p className="text-gray-600 text-sm">
              Los más vendidos del año {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Controles de ordenamiento */}
        <div className="flex justify-center space-x-4">
          <button
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
              sortOrder === "amount"
                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
            }`}
            onClick={() => setSortOrder("amount")}
          >
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              Por Monto
            </span>
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
              sortOrder === "quantity"
                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
            }`}
            onClick={() => setSortOrder("quantity")}
          >
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              Por Cantidad
            </span>
          </button>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="p-8">
        {mostSoldProducts && mostSoldProducts.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {mostSoldProducts.map((product, index) => (
              <div
                key={product.productId}
                className="group relative bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-102"
              >
                <div className="flex items-center space-x-4">
                  {/* Ranking Badge */}
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${getRankColor(
                      index
                    )} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                  >
                    {typeof getRankIcon(index) === "string" &&
                    getRankIcon(index).length === 2 ? (
                      getRankIcon(index)
                    ) : (
                      <span className="text-sm">{getRankIcon(index)}</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors duration-300">
                      {product.productName}
                    </h3>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium mb-1">
                          Cantidad Vendida
                        </p>
                        <p className="text-xl font-bold text-blue-700">
                          {product.quantity.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                        <p className="text-xs text-green-600 font-medium mb-1">
                          Ingresos Totales
                        </p>
                        <p className="text-xl font-bold text-green-700">
                          {formatCurrency(product.amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="hidden md:block">
                    {index < 3 && (
                      <div className="w-2 h-16 bg-gradient-to-t from-orange-200 to-orange-500 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                    )}
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50/0 to-red-50/0 group-hover:from-orange-50/30 group-hover:to-red-50/30 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-gray-500 text-center">
              No se encontraron productos vendidos en el período actual.
              <br />
              Los datos aparecerán cuando se registren ventas.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #dc2626);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #b91c1c);
        }
      `}</style>
    </div>
  );
};

export default ProductosMasVendidos;
