import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";

interface Product {
  productId: string;
  productName: string;
  productImageUrl: string | null;
  amount: number;
  quantity: number;
}

interface MostSoldProductsProps {
  salesData: Product[];
  startDateProducts: string;
  endDateProducts: string;
  setStartDateProducts: (date: string) => void;
  setEndDateProducts: (date: string) => void;
  fetchMostSoldProducts: (
    startDate: string,
    endDate: string,
    orderBy: string
  ) => void;
}

const MostSoldProducts: React.FC<MostSoldProductsProps> = ({
  salesData,
  startDateProducts,
  endDateProducts,
  setStartDateProducts,
  setEndDateProducts,
  fetchMostSoldProducts,
}) => {
  const [orderBy, setOrderBy] = useState<string>("amount"); // can be 'amount' or 'quantity'
  const [filteredData, setFilteredData] = useState<Product[]>([]);

  useEffect(() => {
    fetchMostSoldProducts(startDateProducts, endDateProducts, orderBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDateProducts, endDateProducts, orderBy]);

  useEffect(() => {
    if (salesData && salesData.length > 0) {
      const aggregatedData = salesData.reduce((acc, item) => {
        const existingProduct = acc.find(
          (product) => product.productId === item.productId
        );
        if (existingProduct) {
          existingProduct.quantity += item.quantity;
          existingProduct.amount += item.amount;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, [] as Product[]);

      const sorted = [...aggregatedData].sort((a, b) => {
        if (orderBy === "amount") {
          return b.amount - a.amount;
        } else {
          return b.quantity - a.quantity;
        }
      });

      setFilteredData(sorted);
    } else {
      setFilteredData([]); // Reset filtered data if no salesData
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesData]);

  return (
    <div className="p-6 rounded shadow border m-4">
      <h2 className="text-xl font-bold mb-4">Most Sold Products</h2>
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium">Start Date</label>
          <input
            type="date"
            value={startDateProducts}
            onChange={(e) => setStartDateProducts(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">End Date</label>
          <input
            type="date"
            value={endDateProducts}
            onChange={(e) => setEndDateProducts(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring p-2 border focus:ring-opacity-50 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Order By</label>
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="mt-1 block p-2 w-full border-gray-300 bg-white border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-400"
          >
            <option value="amount">Amount</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>
      </div>
      {filteredData.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 border-b">Product Name</th>
              <th className="py-2 border-b">Quantity Sold</th>
              <th className="py-2 border-b">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((product, index) => (
              <tr
                key={index}
                className="text-center"
              >
                <td className="py-2 border-b">{product.productName}</td>
                <td className="py-2 border-b">{product.quantity}</td>
                <td className="py-2 border-b">${product.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay productos en este rango de fechas.</p>
      )}
    </div>
  );
};

export default MostSoldProducts;
