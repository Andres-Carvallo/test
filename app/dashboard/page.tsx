"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import GoogleAnalyticsData from "@/components/PIXELUP/Dashboard/Analitycs/Google";
import MostSoldProducts from "@/components/PIXELUP/Dashboard/Ventas/MostSoldProducts";
import SalesSummary from "@/components/PIXELUP/Dashboard/Ventas/SalesSummary";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

const StatsDashboard = () => {
  const [salesSummary, setSalesSummary] = useState(null);

  const fetchSalesSummary = async () => {
    try {
      const token = getCookie("AdminTokenAuth"); // Obtén el token de las cookies

      // Configuración de la solicitud
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Realiza la solicitud GET
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/reports/sales-summary?statusCode=PAYMENT_COMPLETED&startDate=2024-04-01&endDate=2024-05-31&currencyCodeId=8ccc1abd-b35b-45ff-b814-b7c78fff3594`,
        config
      );

      // Maneja la respuesta
      console.log("Sales Summary Data:", response.data.sales);
      setSalesSummary(response.data.sales); // Guarda los datos en el estado
    } catch (error) {
      console.error("Error fetching sales summary:", error);
    }
  };

  useEffect(() => {
    fetchSalesSummary();
  }, []);

  const salesData = [
    {
      id: 1,
      date: "2024-04-01",
      name: "Product 1",
      quantity: 10,
      amount: 1000,
    },
    {
      id: 1,
      date: "2024-04-01",
      name: "Product 1",
      quantity: 15,
      amount: 2000,
    },
    { id: 2, date: "2024-04-01", name: "Product 2", quantity: 5, amount: 150 },
    { id: 3, date: "2024-04-02", name: "Product 3", quantity: 25, amount: 250 },
    { id: 2, date: "2024-04-02", name: "Product 2", quantity: 8, amount: 300 },
    {
      id: 1,
      date: "2024-04-02",
      name: "Product 1",
      quantity: 20,
      amount: 5000,
    },
    { id: 2, date: "2024-04-07", name: "Product 2", quantity: 30, amount: 80 },
    { id: 3, date: "2024-04-08", name: "Product 3", quantity: 12, amount: 120 },
    { id: 3, date: "2024-04-09", name: "Product 3", quantity: 22, amount: 220 },
    { id: 2, date: "2024-04-10", name: "Product 2", quantity: 18, amount: 180 },
    // Agrega más datos según sea necesario
  ];
  return (
    <div className="text-gray-600 body-font">
      <Breadcrumb pageName="Dashboard" />
      <div className="container px-5 py-4 mx-auto">
        <SalesSummary salesData={salesSummary} />
        <MostSoldProducts salesData={salesData} />
        <GoogleAnalyticsData />
      </div>
    </div>
  );
};

export default StatsDashboard;
