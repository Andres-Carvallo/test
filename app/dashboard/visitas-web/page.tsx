"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Loader from "@/components/common/Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsRow {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

interface AnalyticsData {
  rows: AnalyticsRow[];
}

const StatsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/analytics");
        console.log(response.data); // Imprime los datos en la consola del navegador
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return <Loader />;

  const labels = data.rows.map((row) =>
    format(
      new Date(
        row.dimensionValues[0].value.replace(
          /(\d{4})(\d{2})(\d{2})/,
          "$1-$2-$3"
        )
      ),
      "yyyy-MM-dd"
    )
  );

  const sessionsData = data.rows.map((row) =>
    Number(row.metricValues[1]?.value || 0)
  );
  const activeUsersData = data.rows.map((row) =>
    Number(row.metricValues[0]?.value || 0)
  );
  const newUsersData = data.rows.map((row) =>
    Number(row.metricValues[2]?.value || 0)
  );
  const avgSessionDurationData = data.rows.map(
    (row) => Number(row.metricValues[3]?.value || 0) / 60
  ); // Convertimos a minutos
  const bounceRateData = data.rows.map(
    (row) => Number(row.metricValues[4]?.value || 0) * 100
  ); // Convertimos a porcentaje

  const cityData = data.rows.map(
    (row) => row.dimensionValues[1]?.value || "Unknown"
  );
  const deviceData = data.rows.map(
    (row) => row.dimensionValues[2]?.value || "Unknown"
  );

  // Agregar console.log para ver los datos de activeUsersData

  // Calcular total de usuarios activos de la última semana
  const totalActiveUsersWeek = activeUsersData
    .slice(-7)
    .reduce((a, b) => a + b, 0);

  // Calcular promedio de duración de la sesión en minutos para el mes
  const avgSessionDuration = (
    avgSessionDurationData.reduce((a, b) => a + b, 0) /
    avgSessionDurationData.length
  ).toFixed(2);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Sessions",
        data: sessionsData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Active Users",
        data: activeUsersData,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: "New Users",
        data: newUsersData,
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Bounce Rate", "Other"],
    datasets: [
      {
        data: [
          bounceRateData.reduce((a, b) => a + b, 0) / bounceRateData.length,
          100 -
            bounceRateData.reduce((a, b) => a + b, 0) / bounceRateData.length,
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for city chart
  const cityCounts = cityData.reduce((acc, city) => {
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cityChartData = {
    labels: Object.keys(cityCounts),
    datasets: [
      {
        label: "Users by City",
        data: Object.values(cityCounts),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for device chart
  const deviceCounts = deviceData.reduce((acc, device) => {
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceChartData = {
    labels: Object.keys(deviceCounts),
    datasets: [
      {
        label: "Users by Device",
        data: Object.values(deviceCounts),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-medium">Active Users (Last 7 Days)</h3>
          <p className="text-2xl font-bold">{totalActiveUsersWeek}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-medium">Sessions</h3>
          <p className="text-gray-600 mb-2 text-xs">
            Refleja el número total de sesiones realizadas en tu sitio web el
            día más reciente.
          </p>
          <p className="text-2xl font-bold">
            {sessionsData[sessionsData.length - 1]}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center col-span-1">
          <h3 className="text-lg font-medium">Avg. Session Duration</h3>
          <p className="text-2xl font-bold">{avgSessionDuration} min</p>
          <p className="text-gray-600 mb-2 text-xs">
            Duración promedio de las sesiones en tu sitio web durante el mes.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-medium">New Users</h3>
          <p className="text-gray-600 mb-2 text-xs">
            Refleja el número total de nuevos usuarios que visitaron tu sitio
            web el día más reciente.
          </p>
          <p className="text-2xl font-bold">
            {newUsersData[newUsersData.length - 1]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">New Users</h2>
          <Bar data={barChartData} />
          <p className="text-gray-600 mb-2 text-xs">
            <strong>Usuarios Nuevos:</strong> Usuarios que visitan tu sitio web
            por primera vez.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users by City</h2>
          <Bar data={cityChartData} />
          <p className="text-gray-600 mb-2 text-xs">
            Este gráfico muestra la distribución de tus usuarios por ciudad.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users by Device</h2>
          <Bar data={deviceChartData} />
          <p className="text-gray-600 mb-2 text-xs">
            Este gráfico muestra la distribución de tus usuarios por tipo de
            dispositivo (por ejemplo, escritorio, móvil).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Active Users & Sessions
          </h2>
          <Line data={lineChartData} />
          <p className="text-gray-600 mb-2 text-xs">
            <strong>Usuarios Activos:</strong> Usuarios que han interactuado con
            tu sitio web.
            <br />
            <strong>Sesiones:</strong> Un período de tiempo en el que un usuario
            interactúa con tu sitio web. Una nueva sesión comienza cuando un
            usuario no ha estado activo en tu sitio durante 30 minutos o más.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center col-span-1">
          <h3 className="text-lg font-medium">Bounce Rate</h3>
          <Pie data={pieChartData} />
          <p className="text-gray-600 mb-2 text-xs">
            <strong>Tasa de Rebote:</strong> Porcentaje de visitantes que
            abandonan tu sitio web después de ver solo una página. Un alto
            porcentaje puede indicar que los usuarios no encuentran lo que
            buscan en tu sitio web.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
