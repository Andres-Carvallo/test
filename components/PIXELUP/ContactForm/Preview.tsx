"use client";
import React from "react";

const ContactFormPreview = () => {
     return (
     <div>
       {/* Formulario y Foto */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-start gap-6 grid-cols-1 md:grid-cols-2 md:gap-8">
            {/* Formulario */}
            <div className="rounded-lg bg-white p-4 shadow-lg md:p-6">
              <h2 className="mb-4 text-xl md:text-2xl font-bold text-gray-800">
                Envíanos un mensaje
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  <div className="w-full bg-gray-100 border border-gray-300 px-3 py-2 text-sm rounded-md">
                    [Campo de texto]
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </label>
                  <div className="w-full bg-gray-100 border border-gray-300 px-3 py-2 text-sm rounded-md">
                    [Campo de email]
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Asunto
                  </label>
                  <div className="w-full bg-gray-100 border border-gray-300 px-3 py-2 text-sm rounded-md">
                    [Campo de texto]
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Mensaje
                  </label>
                  <div className="w-full bg-gray-100 border border-gray-300 px-3 py-2 text-sm rounded-md h-20">
                    [Área de texto]
                  </div>
                </div>

                <button className="w-full rounded-md px-4 py-2 font-medium text-sm bg-primary text-white">
                  Enviar mensaje
                </button>
              </div>
            </div>

            {/* Foto */}
            <div className="hidden md:block">
              <div className="w-full rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 shadow-xl h-[400px] flex items-center justify-center">
                <span className="text-gray-500">Imagen de contacto</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información de Contacto (Opcional) */}
      <section className="pb-8 md:pb-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-lg bg-white p-4 shadow-lg md:p-6">
            <h3 className="mb-4 text-center text-lg md:text-xl font-bold text-gray-800">
              Información de contacto
            </h3>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 md:gap-6">
              <div className="flex items-center rounded-lg p-3 md:p-4 bg-primary/10">
                <div className="mr-3 flex-shrink-0 text-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-800">Email</h4>
                  <p className="text-xs text-gray-600">contacto@ejemplo.cl</p>
                </div>
              </div>

              <div className="flex items-center rounded-lg p-3 md:p-4 bg-primary/10">
                <div className="mr-3 flex-shrink-0 text-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-800">Teléfono</h4>
                  <p className="text-xs text-gray-600">+56 9 1234 5678</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactFormPreview;
