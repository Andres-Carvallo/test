import React, { useState } from "react";

const CompararVentas: React.FC = () => {
  const [startDate1, setStartDate1] = useState("");
  const [endDate1, setEndDate1] = useState("");
  const [startDate2, setStartDate2] = useState("");
  const [endDate2, setEndDate2] = useState("");
  const [salesMonth1, setSalesMonth1] = useState<number | null>(null);
  const [salesMonth2, setSalesMonth2] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);

  return (
    <div className="rounded-sm border w-full border-stroke bg-white py-6 px-8 shadow-default dark:border-black dark:bg-black">
      <title>Comparar Ventas</title>
      <section className="dark:bg-gray-900">
        <div className="text-sm font-medium border-b pb-2">
          Comparar Ciclos de Venta
        </div>
        <div className="max-w-screen-xl px-4 py-8 mx-auto text-center  lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Fecha Inicio 1
              </label>
              <input
                type="date"
                value={startDate1}
                onChange={(e) => setStartDate1(e.target.value)}
                className="mt-1 block text-[14px] w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Fecha Fin 1
              </label>
              <input
                type="date"
                value={endDate1}
                onChange={(e) => setEndDate1(e.target.value)}
                className="mt-1 block text-[14px] w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Fecha Inicio 2
              </label>
              <input
                type="date"
                value={startDate2}
                onChange={(e) => setStartDate2(e.target.value)}
                className="mt-1 block w-full text-[14px] border-gray-300 rounded-md shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Fecha Fin 2
              </label>
              <input
                type="date"
                value={endDate2}
                onChange={(e) => setEndDate2(e.target.value)}
                className="mt-1 block w-full text-[14px] border-gray-300 rounded-md shadow-sm p-2 border focus:ring focus:ring-opacity-50 focus:ring-primary"
              />
            </div>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto text-gray-900 dark:text-white">
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md">
              <dt className="mb-2 text-xl font-extrabold">
                {salesMonth1 !== null ? (
                  salesMonth1.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })
                ) : (
                  <span className="text-gray-400 text-[14px] font-light ">
                    No hay data para fechas selecionadas
                  </span>
                )}
              </dt>
              <dd className="font-light text-gray-700 ">
                Ventas del Primer Mes
              </dd>
            </div>
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md">
              <dt className="mb-2 text-xl font-extrabold">
                {salesMonth2 !== null ? (
                  salesMonth2.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })
                ) : (
                  <span className="text-gray-400 text-[14px] font-light ">
                    No hay data para fechas selecionadas
                  </span>
                )}
              </dt>
              <dd className="font-light text-gray-700 dark:text-gray-700">
                Ventas del Segundo Mes
              </dd>
            </div>
          </dl>
          {percentageChange !== null && (
            <div className="mt-4 text-xl font-extrabold">
              Cambio porcentual:{" "}
              <span
                className={
                  percentageChange > 0 ? "text-green-700" : "text-red-500"
                }
              >
                {percentageChange.toFixed(2)}%
                {percentageChange > 0 ? (
                  <span className="ml-2">▲</span>
                ) : (
                  <span className="ml-2">▼</span>
                )}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CompararVentas;
