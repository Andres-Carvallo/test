const { google } = require("googleapis");

const key = require("./path/to/your-service-account-file.json"); // Reemplaza con el path a tu archivo JSON
const scopes = ["https://www.googleapis.com/auth/analytics.readonly"];

const jwt = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  scopes
);

const analytics = google.analytics("v3");

async function getGoogleAnalyticsData() {
  await jwt.authorize();

  const response = await analytics.data.ga.get({
    auth: jwt,
    ids: process.env.GOOGLE_ANALYTICS_STREAM_ID || "",
    "start-date": "30daysAgo",
    "end-date": "today",
    metrics: "ga:sessions,ga:pageviews,ga:avgSessionDuration,ga:bounceRate",
    dimensions: "ga:date",
  });

  return response.data.rows;
}

module.exports = { getGoogleAnalyticsData };
