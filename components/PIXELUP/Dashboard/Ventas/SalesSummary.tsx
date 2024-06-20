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
}

const SalesSummary: React.FC<SalesSummaryProps> = ({ salesData }) => {
  const [startDate, setStartDate] = useState<string>("2024-04-01");
  const [endDate, setEndDate] = useState<string>("2024-04-30");
  const [filteredData, setFilteredData] = useState<SalesDataItem[]>([]);

  useEffect(() => {
    if (salesData && salesData.length > 0) {
      const filtered = salesData.filter((item) => {
        const date = new Date(item.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
      setFilteredData(filtered);
    }
  }, [startDate, endDate, salesData]);

  const chartOptions = {
    title: {
      text: "Sales Summary",
    },
    tooltip: {},
    xAxis: {
      type: "category",
      data: filteredData.map((item) => item.date),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: filteredData.map((item) => item.amount),
        type: "line",
        itemStyle: {
          color: "#FF0000", // Cambia el color de la línea aquí
        },
      },
    ],
  };

  return (
    <div className=" p-6 rounded shadow border m-4">
      <h2 className="text-xl font-bold mb-4">Sales Summary</h2>
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring p-2 border focus:ring-opacity-50 focus:ring-primary"
          />
        </div>
      </div>
      {filteredData.length > 0 ? (
        <ReactECharts option={chartOptions} />
      ) : (
        <p>No data available for the selected date range.</p>
      )}
    </div>
  );
};

export default SalesSummary;
