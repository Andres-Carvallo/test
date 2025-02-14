import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loader from "@/components/common/Loader-t";

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

        // Construye la URL con las fechas y orden por defecto
        const url = `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/most-selled-products?startDate=${startDate}&endDate=${endDate}&currencyCodeId=${currentCurrencyCodeId}&orderBy=${orderBy}&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`;

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

        setMostSoldProducts(sortedProducts.slice(0, 10)); // Limitar a los primeros 5 productos
      } catch (error) {
        console.error("Error fetching most sold products:", error);
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

  return (
    <div className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black">
      {mostSoldProducts !== null ? (
        <>
          <div className="text-sm font-medium border-b pb-2 mb-6">
            Productos más Vendidos
          </div>
          <div className="flex justify-center mb-4">
            <button
              className={`mr-2 px-4 py-2 rounded text-[13px] ${
                sortOrder === "amount"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSortOrder("amount")}
            >
              Ordenar por Monto
            </button>
            <button
              className={`px-4 py-2 rounded text-[13px] ${
                sortOrder === "quantity"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSortOrder("quantity")}
            >
              Ordenar por Cantidad
            </button>
          </div>
          <dd className="font-light text-black dark:text-gray-400 w-full h-96 overflow-y-auto">
            <ul>
              {mostSoldProducts.map((product) => (
                <li
                  key={product.productId}
                  className="flex items-center mb-1 text-left border-b pb-1"
                >
                  <div>
                    <p className="text-lg font-semibold">
                      {product.productName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cantidad: {product.quantity}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total:{" "}
                      {product.amount.toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </dd>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ProductosMasVendidos;
