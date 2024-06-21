// app/api/analytics/route.js
import { NextResponse } from "next/server";
import { getGoogleAnalyticsData } from "@/lib/analytics";

export async function GET() {
  try {
    const data = await getGoogleAnalyticsData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
