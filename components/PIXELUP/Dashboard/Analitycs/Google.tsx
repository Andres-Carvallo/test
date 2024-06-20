import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { getGoogleAnalyticsData } from "@/lib/analytics";

const GoogleAnalyticsData = () => {
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getGoogleAnalyticsData();

      setAnalyticsData(data as any);
    }

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Google Analytics Data</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Date</th>
            <th className="py-2">Sessions</th>
            <th className="py-2">Pageviews</th>
            <th className="py-2">Avg Session Duration</th>
            <th className="py-2">Bounce Rate</th>
          </tr>
        </thead>
        <tbody>
          {analyticsData.map((row, index) => (
            <tr
              key={index}
              className="text-center"
            >
              <td className="py-2">{row[0]}</td>
              <td className="py-2">{row[1]}</td>
              <td className="py-2">{row[2]}</td>
              <td className="py-2">{row[3]}</td>
              <td className="py-2">{row[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GoogleAnalyticsData;
