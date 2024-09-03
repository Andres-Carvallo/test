import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "tailwindcss/tailwind.css";

// Cargar echarts-for-react dinámicamente porque no se puede renderizar en el servidor
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

interface SalesDataItem {
  id: number;
  date: string;
  amount: number;
}

interface SalesSummaryProps {
  salesData: SalesDataItem[] | null;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({
  salesData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [filteredData, setFilteredData] = useState<SalesDataItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (salesData && salesData.length > 0) {
      const filtered = salesData.filter((item) => {
        const date = new Date(item.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
      setFilteredData(filtered);

      // Calcular la suma de los montos filtrados
      const total = filtered.reduce((sum, item) => sum + item.amount, 0);
      setTotalAmount(total);
    }
  }, [startDate, endDate, salesData]);

  const chartOptions = {
    title: {
      text: "Detalle Ventas",
    },
    tooltip: {
      formatter: function (params: any) {
        // Formatea el tooltip para mostrar el valor con el símbolo de $
        return `${params.name}: $${params.value.toLocaleString()}`;
      },
    },
    xAxis: {
      type: "category",
      data: filteredData.map((item) => {
        // Formatea la fecha a "día/mes/año"
        const date = new Date(item.date);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }),
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: function (value: any) {
          // Formatea el eje Y para mostrar los valores con el símbolo de $
          return `$${value.toLocaleString()}`;
        },
      },
    },
    series: [
      {
        data: filteredData.map((item) => item.amount),
        type: "line",
        itemStyle: {
          color: "#242D33", // Cambia el color de la línea aquí
        },
      },
    ],
  };

  console.log(filteredData, "algo"),
    useEffect(() => {
      if (salesData && salesData.length > 0 && startDate && endDate) {
        const filtered = salesData.filter((item) => {
          const date = new Date(item.date);
          return date >= new Date(startDate) && date <= new Date(endDate);
        });
        setFilteredData(filtered);

        // Calcular la suma de los montos filtrados
        const total = filtered.reduce((sum, item) => sum + item.amount, 0);
        setTotalAmount(total);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Este useEffect se ejecuta solo al montar el componente

  return (
    <div className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black mt-4">
      <div className="text-sm font-medium border-b pb-2 mb-6">
        Detalle Ventas por rango de fechas
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Fecha Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring p-2 border focus:ring-opacity-50 focus:ring-primary"
          />
        </div>
      </div>
      {filteredData.length > 0 ? (
        <>
          <p className="text-md  font-medium  pb-4 md:pb-2  text-center md:text-end">
            Monto ventas totales:{" "}
            {totalAmount.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </p>
          <ReactECharts option={chartOptions} />
        </>
      ) : (
        <p>No data available for the selected date range.</p>
      )}
    </div>
  );
};

export default SalesSummary;
