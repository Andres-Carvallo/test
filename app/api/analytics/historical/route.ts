import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Reemplazar \\n con \n
  },
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const days = url.searchParams.get("days") || "30"; // Obtener el parámetro de días (por defecto 30)

    const dateRanges = [
      {
        startDate: `${days}daysAgo`,
        endDate: "today",
      },
    ];

    // Ejecutar el reporte con el rango de fechas dinámico
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: dateRanges,
      dimensions: [
        { name: "city" }, // Ciudad
        { name: "deviceCategory" }, // Dispositivo (mobile, desktop, tablet)
      ],
      metrics: [
        { name: "activeUsers" }, // Usuarios activos (históricos)
        { name: "totalUsers" }, // Total de usuarios
      ],
    });

    // Devolver la respuesta procesada
    return NextResponse.json(response);
  } catch (error: any) {
    console.error(
      "Error while fetching historical data from Google Analytics API:",
      error.message
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
