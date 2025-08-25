"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Termino {
  id: string;
  titulo: string;
  contenido: string;
  subterminos?: Termino[];
}

interface TerminosData {
  titulo: string;
  bajada: string;
  terminos: Termino[];
}

const TerminosVisual: React.FC = () => {
  const [terminosData, setTerminosData] = useState<TerminosData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  useEffect(() => {
    fetchTerminosData();
  }, []);

  const fetchTerminosData = async () => {
    try {
      const contentBlockId = process.env.NEXT_PUBLIC_TERMINOS_CONTENTBLOCK;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      const data = response.data.contentBlock;
      let terminosConfig;
      try {
        const fullConfig = JSON.parse(data.contentText || '{}');
        terminosConfig = fullConfig.terminosCondiciones || { 
          titulo: "Términos y Condiciones", 
          bajada: "Gestiona los términos y condiciones de tu sitio web",
          terminos: [] 
        };
      } catch {
        terminosConfig = { 
          titulo: "Términos y Condiciones", 
          bajada: "Gestiona los términos y condiciones de tu sitio web",
          terminos: [] 
        };
      }

      setTerminosData(terminosConfig);
      if (terminosConfig.terminos.length > 0) {
        setActiveSection(terminosConfig.terminos[0].id);
      }
    } catch (error) {
      console.error("Error al obtener los términos y condiciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTermino = (termino: Termino, index: number, level: number = 0) => {
    const numero = level === 0 ? `${index + 1}` : `${index + 1}.${level}`;
    
    return (
      <div key={termino.id} className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
          <span className="bg-primary text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 mb-2 sm:mb-0 self-start">
            {numero}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 break-words">
              {termino.titulo}
            </h3>
            <div 
              className="text-gray-700 leading-relaxed prose prose-sm sm:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: termino.contenido }}
            />
            
            {termino.subterminos && termino.subterminos.length > 0 && (
              <div className="mt-4 sm:mt-6 ml-2 sm:ml-6 border-l-2 border-gray-200 pl-3 sm:pl-6">
                {termino.subterminos.map((subtermino, subIndex) => 
                  renderTermino(subtermino, subIndex, level + 1)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const scrollToSection = (terminoId: string) => {
    setActiveSection(terminoId);
    setShowMobileMenu(false);
    const element = document.getElementById(terminoId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!terminosData || terminosData.terminos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 px-4">
        <p>No hay términos y condiciones disponibles.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Botón de menú móvil y tablet */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="w-full bg-primary text-white px-4 py-3 rounded-lg flex items-center justify-between"
        >
          <span className="font-medium">Índice de Términos</span>
          <svg 
            className={`w-5 h-5 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Menú móvil desplegable */}
        {showMobileMenu && (
          <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <nav className="space-y-2">
              {terminosData.terminos.map((termino, index) => (
                <div key={termino.id}>
                  <button
                    onClick={() => scrollToSection(termino.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      activeSection === termino.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{index + 1}</span>
                      <span className="truncate">{termino.titulo}</span>
                    </div>
                  </button>
                  
                  {/* Subtérminos */}
                  {termino.subterminos && termino.subterminos.length > 0 && (
                    <div className="ml-4 mt-2 space-y-1">
                      {termino.subterminos.map((subtermino, subIndex) => (
                        <button
                          key={subtermino.id}
                          onClick={() => scrollToSection(subtermino.id)}
                          className={`w-full text-left p-2 rounded-md transition-colors text-sm ${
                            activeSection === subtermino.id
                              ? 'bg-primary/20 text-primary'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">{index + 1}.{subIndex + 1}</span>
                            <span className="truncate">{subtermino.titulo}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Índice lateral - oculto en móvil y tablet */}
        <div className="hidden md:block md:col-span-1">
          <div className="sticky top-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Índice
            </h2>
            <nav className="space-y-2">
              {terminosData.terminos.map((termino, index) => (
                <div key={termino.id}>
                  <button
                    onClick={() => scrollToSection(termino.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      activeSection === termino.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{index + 1}</span>
                      <span className="truncate">{termino.titulo}</span>
                    </div>
                  </button>
                  
                  {/* Subtérminos */}
                  {termino.subterminos && termino.subterminos.length > 0 && (
                    <div className="ml-4 mt-2 space-y-1">
                      {termino.subterminos.map((subtermino, subIndex) => (
                        <button
                          key={subtermino.id}
                          onClick={() => scrollToSection(subtermino.id)}
                          className={`w-full text-left p-2 rounded-md transition-colors text-sm ${
                            activeSection === subtermino.id
                              ? 'bg-primary/20 text-primary'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">{index + 1}.{subIndex + 1}</span>
                            <span className="truncate">{subtermino.titulo}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 break-words">
              {terminosData.titulo}
            </h1>
            
            {terminosData.bajada && (
              <div className="mb-6 sm:mb-8">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {terminosData.bajada}
                </p>
              </div>
            )}
            
            <div className="space-y-6 sm:space-y-8">
              {terminosData.terminos.map((termino, index) => (
                <div key={termino.id} id={termino.id}>
                  {renderTermino(termino, index)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminosVisual; 