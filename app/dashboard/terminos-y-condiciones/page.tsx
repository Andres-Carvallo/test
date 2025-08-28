"use client";
import React from "react";
import TerminosCondiciones from "@/components/Core/TerminosCondiciones/TerminosCondiciones";

export default function TerminosCondicionesPage() {
  return (
    <>
    <title>Términos y Condiciones</title>
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600">
            Gestiona los términos y condiciones de tu sitio web
          </p>
        </div>
        
        <TerminosCondiciones />
      </div>
    </div>
    </>
  );
} 