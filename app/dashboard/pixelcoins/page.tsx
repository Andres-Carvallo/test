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

  useEffect(() => {
    const fetchCreditsAndMovements = async () => {
      try {
        const token = getCookie("AdminTokenAuth");
        const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

        // Fetch credit summaries
        const creditResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/credits?siteId=${siteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCreditSummaries(creditResponse.data.creditSummaries);

        // Fetch credit movements
        const movementsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/credits/movements?pageNumber=1&pageSize=50&siteId=${siteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCreditMovements(movementsResponse.data.creditMovements);
      } catch (error) {
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
    <div className="min-h-screen">
      <section className="max-w-[85%] mx-auto p-6 mt-20 bg-white rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Mis PixelCoins</h1>
        {loading ? (
          <p>Cargando información...</p>
        ) : (
          <div>
            {creditSummaries.length > 0 && (
              <div className="mt-6">
                {creditSummaries.map((summary) => (
                  <div
                    key={summary.customerId}
                    className="bg-white p-6 rounded-lg border shadow-md mb-4"
                  >
                    <h2 className="text-xl font-bold mb-2">
                      Resumen de PixelCoins
                    </h2>

                    <p>
                      <strong>Saldo de PixelCoins:</strong>{" "}
                      {formatCLP(summary.creditsBalance)}
                    </p>
                    <p>
                      <strong>Créditos por Expirar:</strong>{" "}
                      {formatCLP(summary.creditsAboutToExpire)}
                    </p>
                    <p>
                      <strong>Fecha de Expiración más cercana:</strong>{" "}
                      {new Date(
                        summary.nearestExpirationDate
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Última Actualización:</strong>{" "}
                      {new Date(summary.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {creditMovements.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">
                  Movimientos de Créditos
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border">Tipo</th>
                        <th className="px-4 py-2 border">Descripción</th>
                        <th className="px-4 py-2 border">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {creditMovements.map((movement) => (
                        <tr
                          key={movement.id}
                          className="text-center"
                        >
                          <td className="px-4 py-2 border">{movement.type}</td>
                          <td className="px-4 py-2 border">
                            {movement.description}
                          </td>
                          <td className="px-4 py-2 border">
                            {formatCLP(movement.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CreditChecker;
