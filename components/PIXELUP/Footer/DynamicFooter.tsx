"use client";
import dynamic from "next/dynamic";
import { useFooterConfig } from "@/hooks/useFooterConfig";

// Importaciones dinámicas de las plantillas de footer
const Footer01 = dynamic(() => import("./Footer01/Footer01"), { ssr: true });
const Footer02 = dynamic(() => import("./Footer02/Footer02"), { ssr: true });
const Footer03 = dynamic(() => import("./Footer03/Footer03"), { ssr: true });
const Footer04 = dynamic(() => import("./Footer04/Footer04"), { ssr: true });

export default function DynamicFooter() {
  const { config, loading, error } = useFooterConfig();

  if (loading) {
    return (
      <footer className="bg-gray-800 flex items-center justify-center w-full">
        <div className="max-w-7xl w-full mx-auto py-16 px-6 sm:px-8 lg:py-20 lg:px-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </footer>
    );
  }

  if (error) {
    console.error("Error loading footer config:", error);
    // Fallback al Footer01 por defecto
    return <Footer01 />;
  }

  // Renderizar el footer según la plantilla seleccionada
  // Cada componente Footer usa su propio hook useFooterConfig internamente
  switch (config.selectedTemplate) {
    case "Footer01":
      return <Footer01 />;
    case "Footer02":
      return <Footer02 />;
    case "Footer03":
      return <Footer03 />;
    case "Footer04":
      return <Footer04 />;
    default:
      return <Footer01 />;
  }
}
