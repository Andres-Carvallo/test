import React from "react";
import TerminosVisual from "@/components/Core/TerminosCondiciones/TerminosVisual";
import { title } from "process";

export default function TerminosCondicionesPage() {
  return (
    <>
    <title>Términos y Condiciones</title>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl  font-bold mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-xl md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Conoce nuestros términos legales y políticas para garantizar una experiencia transparente y segura.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        

        {/* Términos y Condiciones Section */}
        <div>
          
          <TerminosVisual />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ¿Tienes alguna pregunta?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Si no encuentras la respuesta que buscas en nuestras preguntas frecuentes o términos, no dudes en contactarnos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP_LINK}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Contactar Soporte
              </a>
             
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 