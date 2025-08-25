"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

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

const TerminosCondiciones: React.FC = () => {
  const [terminosData, setTerminosData] = useState<TerminosData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>("");

  const token = getCookie("AdminTokenAuth");

  useEffect(() => {
    fetchTerminosData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTerminosData = async () => {
    try {
      const contentBlockId = process.env.NEXT_PUBLIC_TERMINOS_CONTENTBLOCK;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.contentBlock;
      let terminosConfig;
      try {
        // Intentar obtener la sección de términos y condiciones del JSON
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
      toast.error("Error al obtener los términos y condiciones.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!terminosData) return;

    try {
      const contentBlockId = process.env.NEXT_PUBLIC_TERMINOS_CONTENTBLOCK;
      
      // Primero obtener el contenido actual para preservar otras secciones
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const currentData = response.data.contentBlock;
      let currentConfig;
      try {
        currentConfig = JSON.parse(currentData.contentText || '{}');
      } catch {
        currentConfig = {};
      }

      // Actualizar solo la sección de términos y condiciones
      const updatedConfig = {
        ...currentConfig,
        terminosCondiciones: terminosData
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title: "terminos-condiciones",
          contentText: JSON.stringify(updatedConfig),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Términos y condiciones guardados exitosamente.");
    } catch (error) {
      console.error("Error al guardar los términos y condiciones:", error);
      toast.error("Error al guardar los términos y condiciones.");
    }
  };

  const addTermino = () => {
    if (!terminosData) return;

    const newId = `termino-${Date.now()}`;
    const newTermino: Termino = {
      id: newId,
      titulo: "Nuevo Término",
      contenido: "Contenido del nuevo término...",
      subterminos: []
    };

    setTerminosData({
      ...terminosData,
      terminos: [...terminosData.terminos, newTermino]
    });
  };

  const addSubtermino = (terminoId: string) => {
    if (!terminosData) return;

    const newSubId = `subtermino-${Date.now()}`;
    const newSubtermino: Termino = {
      id: newSubId,
      titulo: "Nuevo Subtérmino",
      contenido: "Contenido del nuevo subtérmino..."
    };

    const updatedTerminos = terminosData.terminos.map(termino => {
      if (termino.id === terminoId) {
        return {
          ...termino,
          subterminos: [...(termino.subterminos || []), newSubtermino]
        };
      }
      return termino;
    });

    setTerminosData({
      ...terminosData,
      terminos: updatedTerminos
    });
  };

  const updateTermino = (terminoId: string, field: 'titulo' | 'contenido', value: string) => {
    if (!terminosData) return;

    const updateTerminoRecursive = (terminos: Termino[]): Termino[] => {
      return terminos.map(termino => {
        if (termino.id === terminoId) {
          return { ...termino, [field]: value };
        }
        if (termino.subterminos) {
          return {
            ...termino,
            subterminos: updateTerminoRecursive(termino.subterminos)
          };
        }
        return termino;
      });
    };

    setTerminosData({
      ...terminosData,
      terminos: updateTerminoRecursive(terminosData.terminos)
    });
  };

  const deleteTermino = (terminoId: string) => {
    if (!terminosData) return;

    const deleteTerminoRecursive = (terminos: Termino[]): Termino[] => {
      return terminos.filter(termino => {
        if (termino.id === terminoId) {
          return false;
        }
        if (termino.subterminos) {
          termino.subterminos = deleteTerminoRecursive(termino.subterminos);
        }
        return true;
      });
    };

    setTerminosData({
      ...terminosData,
      terminos: deleteTerminoRecursive(terminosData.terminos)
    });
  };

  const renderTermino = (termino: Termino, index: number, level: number = 0) => {
    const numero = level === 0 ? `${index + 1}` : `${index + 1}.${level}`;
    
    return (
      <div key={termino.id} className="mb-4 sm:mb-6 border border-gray-200 rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="bg-primary text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
              {numero}
            </span>
            <input
              type="text"
              value={termino.titulo}
              onChange={(e) => updateTermino(termino.id, 'titulo', e.target.value)}
              className="text-base sm:text-lg font-semibold text-gray-800 border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 flex-1 min-w-0"
              placeholder="Título del término..."
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:space-x-2">
            {level === 0 && (
              <button
                onClick={() => addSubtermino(termino.id)}
                className="px-2 py-1 sm:px-3 bg-green-500 text-white rounded text-xs sm:text-sm hover:bg-green-600 transition-colors"
              >
                + Subtérmino
              </button>
            )}
            <button
              onClick={() => deleteTermino(termino.id)}
              className="px-2 py-1 sm:px-3 bg-red-500 text-white rounded text-xs sm:text-sm hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
        
        <textarea
          value={termino.contenido}
          onChange={(e) => updateTermino(termino.id, 'contenido', e.target.value)}
          className="w-full h-24 sm:h-32 p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base resize-y"
          placeholder="Contenido del término..."
        />

        {termino.subterminos && termino.subterminos.length > 0 && (
          <div className="mt-3 sm:mt-4 ml-2 sm:ml-6 border-l-2 border-gray-200 pl-3 sm:pl-4">
            {termino.subterminos.map((subtermino, subIndex) => 
              renderTermino(subtermino, subIndex, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Términos y Condiciones
        </h2>
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base font-medium"
        >
          Guardar Cambios
        </button>
      </div>

      {terminosData ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Principal:
              </label>
              <input
                type="text"
                value={terminosData.titulo}
                onChange={(e) => setTerminosData({...terminosData, titulo: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                placeholder="Título de los términos y condiciones..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bajada:
              </label>
              <textarea
                value={terminosData.bajada}
                onChange={(e) => setTerminosData({...terminosData, bajada: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base resize-y"
                rows={3}
                placeholder="Descripción o párrafo introductorio de los términos y condiciones..."
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                  Términos ({terminosData.terminos.length})
                </h3>
                <button
                  onClick={addTermino}
                  className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base font-medium"
                >
                  + Agregar Término
                </button>
              </div>

              {terminosData.terminos.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <p className="text-sm sm:text-base">No hay términos configurados.</p>
                  <p className="text-xs sm:text-sm mt-1">Haz clic en &quot;Agregar Término&quot; para comenzar.</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {terminosData.terminos.map((termino, index) => 
                    renderTermino(termino, index)
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <p className="text-sm sm:text-base">Error al cargar los términos y condiciones.</p>
        </div>
      )}
    </div>
  );
};

export default TerminosCondiciones; 