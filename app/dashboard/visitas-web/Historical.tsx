import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";

interface AnalyticsRow {
  city: string;
  deviceCategory: string;
  activeUsers: number;
  totalUsers: number;
}

function Historical() {
  const [historicalData, setHistoricalData] = useState<AnalyticsRow[]>([]);
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [uniqueVisits, setUniqueVisits] = useState<number>(0); // Para las visitas únicas
  const [days, setDays] = useState<number>(30); // Default to 30 days
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = async (days: number) => {
    try {
      const response = await axios.get(
        `/api/analytics/historical?days=${days}`
      );
      const rows = response.data.rows.map((row: any) => ({
        city: row.dimensionValues[0].value || "Unknown City",
        deviceCategory: row.dimensionValues[1].value || "Unknown Device",
        activeUsers: Number(row.metricValues[0].value) || 0,
        totalUsers: Number(row.metricValues[1].value) || 0, // Total de usuarios (únicos)
      }));

      // Calcular el total de visitas activas y visitas únicas
      const totalActive = rows.reduce(
        (acc: any, row: any) => acc + row.activeUsers,
        0
      );
      const totalUnique = rows.reduce(
        (acc: any, row: any) => acc + row.totalUsers,
        0
      );

      setTotalVisits(totalActive); // Visitas activas
      setUniqueVisits(totalUnique); // Visitas únicas
      setHistoricalData(rows);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchHistoricalData(days);
  }, [days]);

  if (error) return <div>Error: {error}</div>;

  // Función para agrupar los datos por ciudad
  const processCityData = (data: AnalyticsRow[]) => {
    return data.reduce((acc, row) => {
      if (acc[row.city]) {
        acc[row.city] += row.activeUsers; // Aquí seguimos usando los usuarios activos
      } else {
        acc[row.city] = row.activeUsers;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  // Procesar los datos de la ciudad
  const cityDataProcessed = processCityData(historicalData);
  const cityLabels = Object.keys(cityDataProcessed);
  const cityActiveUsers = Object.values(cityDataProcessed);

  // Procesar los datos para el gráfico de porcentajes por dispositivo
  const deviceData = historicalData.reduce((acc, row) => {
    if (!acc[row.deviceCategory]) {
      acc[row.deviceCategory] = 0;
    }
    acc[row.deviceCategory] += row.activeUsers; // Seguimos usando usuarios activos aquí también
    return acc;
  }, {} as Record<string, number>);

  const deviceLabels = Object.keys(deviceData);
  const deviceActiveUsers = Object.values(deviceData);

  return (
    <div className=" bg-white shadow rounded p-8 w-full">
      {/* Selector de rango de fechas */}
      <div className="my-4 hidden">
        <label>
          Seleccionar rango de fechas:{" "}
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
          </select>
        </label>
      </div>

      {/* Mostrar total de visitas activas y visitas únicas */}

      <div className="grid grid-cols-2 w-full">
        <div style={{ maxWidth: "500px", margin: "auto" }}>
          <h3 className="text-sm text-gray-600 mb-4">
            Usuarios Activos por Ciudad
          </h3>
          <Pie
            data={{
              labels: cityLabels,
              datasets: [
                {
                  label: "Active Users",
                  data: cityActiveUsers,
                  backgroundColor: [
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                  ],
                  borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(54, 162, 235, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>

        <div style={{ maxWidth: "500px", margin: "auto" }}>
          <h3 className="text-sm text-gray-600 mb-4">
            Usuarios Activos por Dispositivo
          </h3>
          <Pie
            data={{
              labels: deviceLabels,
              datasets: [
                {
                  label: "Active Users by Device",
                  data: deviceActiveUsers,
                  backgroundColor: [
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                  ],
                  borderColor: [
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 159, 64, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Historical;
