/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";

const InicioDashboard = () => {
  const [iframeError, setIframeError] = useState(false);
  const isDevelopment = process.env.NODE_ENV === "development";
  const targetUrl = isDevelopment
    ? "https://www.development.pixelup.cl/"
    : "https://www.pixelup.cl/";

  const handleIframeError = () => {
    setIframeError(true);
  };

  const openInNewWindow = () => {
    window.open(targetUrl, "_blank");
  };

  if (iframeError) {
    return (
      <>
        <title>PixelUP - Dashboard</title>
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="text-center max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No se pudo cargar el contenido en esta ventana
            </h2>
            <p className="text-gray-600 mb-6">
              Por razones de seguridad, el contenido debe abrirse en una nueva
              ventana.
            </p>
            <button
              onClick={openInNewWindow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Abrir en nueva ventana
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-full h-screen">
      <title>PixelUP - Dashboard</title>
      <iframe
        src="https://welcome-client-git-development-pixelups-projects.vercel.app/home-clientes-dashboard"
        className="w-full h-full border-0"
        onError={handleIframeError}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default InicioDashboard;
