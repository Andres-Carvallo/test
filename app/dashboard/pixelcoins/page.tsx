"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

interface CreditSummary {
  customerId: string;
  creditsBalance: number;
  creditsAboutToExpire: number;
  nearestExpirationDate: string;
  lastUpdated: string;
}

interface CreditMovement {
  id: string;
  type: string;
  amount: number;
  description: string;
  creationDate: string;
  project?: {
    id: string;
    name: string;
  };
}

const CreditChecker = () => {
  const [creditSummaries, setCreditSummaries] = useState<CreditSummary[]>([]);
  const [creditMovements, setCreditMovements] = useState<CreditMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreditsAndMovements = async () => {
      try {
        const token = getCookie("AdminTokenAuth");
        const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

        const [creditResponse, movementsResponse] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/credits?siteId=${siteId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/credits/movements?pageNumber=1&pageSize=50&siteId=${siteId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        setCreditSummaries(creditResponse.data.creditSummaries || []);
        setCreditMovements(movementsResponse.data.creditMovements || []);
      } catch (error) {
        setError("Error fetching credits or movements.");
        console.error("Error fetching credits or movements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditsAndMovements();
  }, []);

  const formatCLP = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  return (
    <div className="min-h-screen ">
      <title>PixelCoins</title>
      <section className="mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Mis PixelCoins</h1>
        
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-600">Cargando información...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Sección de Resumen */}
            {creditSummaries.length > 0 && (
              <div>
                
                {creditSummaries.map((summary) => (
                  <div
                    key={summary.customerId}
                    className="bg-white p-8 rounded-xl shadow-md"
                  >
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Resumen de PixelCoins
                </h2>
                    {summary.creditsBalance === 0 ? (
                      <div className="flex items-center p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 border border-yellow-400">
                        <svg
                          className="flex-shrink-0 inline w-4 h-4 me-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <div>
                          Aquí verás el detalle de tus{" "}
                          <span className="font-bold">PixelCoins</span> cuando
                          recibas la primera carga.
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 p-6 rounded-xl bg-gray-50 hover:scale-105 transition-all duration-300 border border-gray-200 shadow-sm">
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-700 mb-3">Balance Actual</h3>
                              <p className="text-3xl font-bold text-primary">
                                {formatCLP(summary.creditsBalance)}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-600">Última Actualización</h3>
                              <p className="text-gray-800 mt-1">
                                {new Date(summary.lastUpdated).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 p-6 rounded-xl bg-gray-50 hover:scale-105 transition-all duration-300 border border-gray-200 shadow-sm">
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-700 mb-3">Información de Expiración</h3>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Créditos por Expirar</p>
                                  <p className="text-2xl font-semibold text-red-600 mt-1">
                                    {formatCLP(summary.creditsAboutToExpire)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Fecha de Expiración más cercana</p>
                                  <p className="text-gray-800 mt-1">
                                    {new Date(summary.nearestExpirationDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Sección de Movimientos */}
            {creditMovements.length > 0 && (
              <div className="bg-white p-4 md:p-8 rounded-xl shadow-md">
                <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
                  Historial de Movimientos
                </h2>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tipo</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Descripción</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {creditMovements.map((movement) => (
                        <tr
                          key={movement.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">{movement.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {movement.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 text-right font-medium">
                            {formatCLP(movement.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {creditSummaries.length === 0 && (
              <div className="bg-white p-8 rounded-xl shadow-md">
                <p className="text-gray-600">No hay resúmenes de créditos disponibles.</p>
              </div>
            )}

            {creditMovements.length === 0 && (
              <div className="bg-white p-8 rounded-xl shadow-md">
                <p className="text-gray-600">No hay movimientos de créditos disponibles.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CreditChecker;
