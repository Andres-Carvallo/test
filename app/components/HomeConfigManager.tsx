"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HomeConfig } from "@/app/utils/homeConfig";

interface ComponentConfig {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
}

interface HomeConfigManagerProps {
  availableComponents: ComponentConfig[];
  config: HomeConfig;
  onConfigChange: (config: HomeConfig) => void;
  onSave: () => void;
  onReset: () => void;
  loading?: boolean;
}

// Componente de vista previa
function ComponentPreview({
  component,
  onClose,
  onAdd,
}: {
  component: ComponentConfig;
  onClose: () => void;
  onAdd: () => void;
}) {
  const [previewComponent, setPreviewComponent] =
    useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(true);

  // Mapeo de componentes a sus respectivos componentes de vista previa
  const getPreviewComponent = async (componentId: string) => {
    try {
      setLoading(true);

      // Importaciones dinámicas para los componentes de vista previa
      const componentMap: { [key: string]: () => Promise<any> } = {
        marqueeTOP: () =>
          import("@/components/PIXELUP/Marquee/MarqueeTop/Marquee"),
        bannerPrincipal01: () =>
          import(
            "@/components/PIXELUP/BannerPrincipal/BannerPrincipal01/BannerPrincipal01"
          ),
        destacadosCat: () =>
          import("@/components/PIXELUP/Destacados/DestacadosCat/DestacadosCat"),
        testimonios03: () =>
          import(
            "@/components/PIXELUP/Testimonios/Testimonios03/Testimonios03"
          ),
        testimonios: () =>
          import(
            "@/components/PIXELUP/Testimonios/Testimonios01/Testimonios01"
          ),
        testimonios04: () =>
          import(
            "@/components/PIXELUP/Testimonios/Testimonios04/Testimonios04"
          ),
        sinFoto04: () =>
          import("@/components/PIXELUP/SinFoto/SinFoto04/SinFoto04"),
        colecciones01: () =>
          import(
            "@/components/PIXELUP/Colecciones/Colecciones01/Colecciones01"
          ),
        colecciones02: () =>
          import(
            "@/components/PIXELUP/Colecciones/Colecciones02/Colecciones02"
          ),
        galeria02: () =>
          import("@/components/PIXELUP/Galeria/Galeria02/Galeria02"),
        nosotros01: () =>
          import("@/components/PIXELUP/Nosotros/Nosotros01/Nosotros01"),
        sinFoto06: () =>
          import("@/components/PIXELUP/SinFoto/SinFoto06/SinFoto06"),
        sinFoto07: () =>
          import("@/components/PIXELUP/SinFoto/SinFoto07/SinFoto07"),
        ubicacion02: () =>
          import("@/components/PIXELUP/Ubicacion/Ubicacion02/Ubicacion02"),
        servicios01: () =>
          import("@/components/PIXELUP/Servicios/Servicios01/Servicios01"),
        servicios02: () =>
          import("@/components/PIXELUP/Servicios/Servicios02/Servicios02"),
        servicios03: () =>
          import("@/components/PIXELUP/Servicios/Servicios03/Servicios03"),
        servicios04: () =>
          import("@/components/PIXELUP/Servicios/Servicios04/Servicios04"),
        galeria: () =>
          import("@/components/PIXELUP/Galeria/Galeria01/Galeria01"),
        sinFoto: () =>
          import("@/components/PIXELUP/SinFoto/SinFoto05/SinFoto05"),
        sinFoto02: () =>
          import("@/components/PIXELUP/SinFoto/SinFoto02/SinFoto02"),
        hero06: () => import("@/components/PIXELUP/Hero/Hero06/Hero06"),
        materiales: () =>
          import("@/components/PIXELUP/SinFoto/Materiales/Materiales"),
        logosCarrusel: () =>
          import("@/components/PIXELUP/Marcas/LogosCarrusel/LogosCarrusel"),
        hero07: () => import("@/components/PIXELUP/Hero/Hero07/Hero07"),
        hero08: () => import("@/components/PIXELUP/Hero/Hero08/Hero08"),
        hero09: () => import("@/components/PIXELUP/Hero/Hero09/Hero09"),
        bannerPrincipal02: () =>
          import(
            "@/components/PIXELUP/BannerPrincipal/BannerPrincipal02/BannerPrincipal02"
          ),
        hero01: () => import("@/components/PIXELUP/Hero/Hero01/Hero01"),
        hero02: () => import("@/components/PIXELUP/Hero/Hero02/Hero02"),
        hero03: () => import("@/components/PIXELUP/Hero/Hero03/Hero03"),
        hero04: () => import("@/components/PIXELUP/Hero/Hero04/Hero04"),
        hero05: () => import("@/components/PIXELUP/Hero/Hero05/Hero05"),
        sinFoto01: () =>
          import("@/components/PIXELUP/SinFoto/SinFoto01/SinFoto01"),
        sinFoto03: () =>
          import("@/components/PIXELUP/SinFoto/SinFoto03/SinFoto03"),
        categoria01: () =>
          import("@/components/PIXELUP/Categorias/Categoria01/Categoria01"),
        categoria02: () =>
          import("@/components/PIXELUP/Categorias/Categoria02/Categoria02"),
        categoria03: () =>
          import("@/components/PIXELUP/Categorias/Categoria03/Categoria03"),
        categoria04: () =>
          import("@/components/PIXELUP/Categorias/Categoria04/Categoria04"),
        categoria05: () =>
          import("@/components/PIXELUP/Categorias/Categoria05/Categoria05"),
        categoria06: () =>
          import("@/components/PIXELUP/Categorias/Categoria06/Categoria06"),
        categoria07: () =>
          import("@/components/PIXELUP/Categorias/Categoria07/Categoria07"),
        feedInstagram: () =>
          import("@/components/PIXELUP/FeedInstagram/FeedInstagram"),
        parallax: () => import("@/components/PIXELUP/Parallax/Parallax"),
      };

      const importFunction = componentMap[componentId];
      if (importFunction) {
        try {
          const importedModule = await importFunction();
          const Component = importedModule.default;
          setPreviewComponent(<Component />);
        } catch (importError) {
          console.warn(
            `No se pudo cargar la vista previa para ${componentId}:`,
            importError
          );
          setPreviewComponent(
            <div className="text-center py-8 text-gray-500">
              <p>Vista previa no disponible para este componente</p>
              <p className="text-sm mt-2">
                Puedes agregarlo directamente para ver cómo se ve en tu página
              </p>
            </div>
          );
        }
      } else {
        setPreviewComponent(
          <div className="text-center py-8 text-gray-500">
            <p>Vista previa no disponible para este componente</p>
            <p className="text-sm mt-2">
              Puedes agregarlo directamente para ver cómo se ve en tu página
            </p>
          </div>
        );
      }
    } catch (error) {
      console.error("Error al cargar vista previa:", error);
      setPreviewComponent(
        <div className="text-center py-8 text-gray-500">
          <p>Error al cargar la vista previa</p>
          <p className="text-sm mt-2">
            Puedes agregarlo directamente para ver cómo se ve en tu página
          </p>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPreviewComponent(component.id);
  }, [component.id]);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Banners: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
      Hero: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
        </svg>
      ),
      Categorías: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.89l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      ),
      Productos: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
      Servicios: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.89l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      ),
      Social: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
      Multimedia: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
      Contenido: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
        </svg>
      ),
      Información: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
      Marcas: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
      Efectos: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    };
    return icons[category] || (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {getCategoryIcon(component.category || "")}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {component.title}
                </h2>
                {component.category && (
                  <p className="text-sm text-gray-600">{component.category}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {component.description && (
            <p className="text-gray-600 mt-3">{component.description}</p>
          )}
        </div>

        {/* Contenido - Vista previa */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando vista previa...</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Vista Previa
                </h3>
                <p className="text-sm text-gray-600">
                  Así se verá este componente en tu página de inicio
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {previewComponent}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancelar
            </button>
            <div className="flex gap-3">
              <button
                onClick={onAdd}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Agregar Componente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal para componentes inactivos
function InactiveComponentsModal({
  isOpen,
  onClose,
  inactiveComponents,
  onActivateComponent,
}: {
  isOpen: boolean;
  onClose: () => void;
  inactiveComponents: ComponentConfig[];
  onActivateComponent: (componentId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewComponent, setPreviewComponent] =
    useState<ComponentConfig | null>(null);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Banners: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
      Hero: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
        </svg>
      ),
      Categorías: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.89l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      ),
      Productos: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
      Servicios: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.89l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      ),
      Social: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
      Multimedia: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
      Contenido: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
        </svg>
      ),
      Información: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
      Marcas: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
      Efectos: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    };
    return icons[category] || (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    );
  };

  // Obtener categorías únicas
  const categories = Array.from(
    new Set(
      inactiveComponents
        .map((comp) => comp.category)
        .filter(Boolean) as string[]
    )
  );

  // Filtrar componentes por búsqueda y categoría
  const filteredComponents = inactiveComponents.filter((component) => {
    const matchesSearch =
      component.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (component.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    const matchesCategory =
      selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Agrupar por categoría
  const groupedComponents = filteredComponents.reduce((acc, component) => {
    const category = component.category || "Sin Categoría";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as { [key: string]: ComponentConfig[] });

  const handlePreview = (component: ComponentConfig) => {
    setPreviewComponent(component);
  };

  const handleAddDirect = (componentId: string) => {
    onActivateComponent(componentId);
    onClose();
  };

  const handleAddFromPreview = () => {
    if (previewComponent) {
      onActivateComponent(previewComponent.id);
      setPreviewComponent(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Agregar Componentes
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Buscador */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar componentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de categorías */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCategory === "all"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todas las categorías
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span>{category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto p-6">
            {Object.keys(groupedComponents).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="font-medium">No se encontraron componentes</p>
                <p className="text-sm">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedComponents).map(
                  ([category, components]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <span>{category}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({components.length})
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {components.map((component) => (
                          <div
                            key={component.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {component.title}
                                </h4>
                                {component.description && (
                                  <p className="text-sm text-gray-600">
                                    {component.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePreview(component)}
                                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center justify-center gap-1"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                Vista Previa
                              </button>
                              <button
                                onClick={() => handleAddDirect(component.id)}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                                Agregar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {filteredComponents.length} de {inactiveComponents.length}{" "}
                componentes disponibles
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de vista previa */}
      {previewComponent && (
        <ComponentPreview
          component={previewComponent}
          onClose={() => setPreviewComponent(null)}
          onAdd={handleAddFromPreview}
        />
      )}
    </>
  );
}

// Componente Sortable para elementos activos (solo drag and drop)
function SortableComponent({
  component,
  index,
  onMove,
  onToggle,
  totalItems = 0,
}: {
  component: ComponentConfig;
  index: number;
  onMove: (direction: "up" | "down") => void;
  onToggle: (activate: boolean) => void;
  totalItems?: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Banners: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
      Hero: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
        </svg>
      ),
      Categorías: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.89l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      ),
      Productos: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
      Servicios: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.89l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      ),
      Social: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
      Multimedia: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
      Contenido: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
        </svg>
      ),
      Información: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
      Marcas: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
      Efectos: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    };
    return icons[category] || (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`component-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${
        isDragging ? "dragging" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center drag-handle"
          >
            <span className="text-blue-600 font-semibold text-sm">
              {index + 1}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900">{component.title}</h4>
              {component.category && (
                <span className="category-badge flex items-center gap-1">
                  {getCategoryIcon(component.category)}
                  <span>{component.category}</span>
                </span>
              )}
            </div>
            {component.description && (
              <p className="text-sm text-gray-600">{component.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onMove("up")}
            disabled={index === 0}
            className="action-button p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 tooltip"
            data-tooltip="Mover arriba"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            onClick={() => onMove("down")}
            disabled={index === totalItems - 1}
            className="action-button p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 tooltip"
            data-tooltip="Mover abajo"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => onToggle(false)}
            className="action-button p-1 text-red-400 hover:text-red-600 tooltip"
            data-tooltip="Desactivar componente"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomeConfigManager({
  availableComponents,
  config,
  onConfigChange,
  onSave,
  onReset,
  loading = false,
}: HomeConfigManagerProps) {
  const [activeComponents, setActiveComponents] = useState<ComponentConfig[]>(
    []
  );
  const [inactiveComponents, setInactiveComponents] = useState<
    ComponentConfig[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Separar componentes activos e inactivos
  useEffect(() => {
    const active = availableComponents.filter((comp) =>
      config.visibleComponents.includes(comp.id)
    );
    const inactive = availableComponents.filter(
      (comp) => !config.visibleComponents.includes(comp.id)
    );

    // Ordenar activos según el orden de la configuración
    const orderedActive = config.order
      .map((id) => active.find((comp) => comp.id === id))
      .filter(Boolean) as ComponentConfig[];

    setActiveComponents(orderedActive);
    setInactiveComponents(inactive);
  }, [config, availableComponents]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const activeIndex = activeComponents.findIndex(
        (comp) => comp.id === active.id
      );
      const overIndex = activeComponents.findIndex(
        (comp) => comp.id === over.id
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        // Reordenar dentro de la lista activa
        const newActive = arrayMove(activeComponents, activeIndex, overIndex);
        setActiveComponents(newActive);

        const newOrder = newActive.map((comp) => comp.id);
        const newVisibleComponents = newOrder;

        onConfigChange({
          visibleComponents: newVisibleComponents,
          order: newOrder,
        });
      }
    }
  };

  const toggleComponent = (componentId: string, activate: boolean) => {
    if (activate) {
      // Activar componente
      const component = inactiveComponents.find(
        (comp) => comp.id === componentId
      );
      if (component) {
        const newInactive = inactiveComponents.filter(
          (comp) => comp.id !== componentId
        );
        const newActive = [...activeComponents, component];

        setInactiveComponents(newInactive);
        setActiveComponents(newActive);

        const newOrder = newActive.map((comp) => comp.id);
        const newVisibleComponents = newOrder;

        onConfigChange({
          visibleComponents: newVisibleComponents,
          order: newOrder,
        });
      }
    } else {
      // Desactivar componente
      const component = activeComponents.find(
        (comp) => comp.id === componentId
      );
      if (component) {
        const newActive = activeComponents.filter(
          (comp) => comp.id !== componentId
        );
        const newInactive = [...inactiveComponents, component];

        setActiveComponents(newActive);
        setInactiveComponents(newInactive);

        const newOrder = newActive.map((comp) => comp.id);
        const newVisibleComponents = newOrder;

        onConfigChange({
          visibleComponents: newVisibleComponents,
          order: newOrder,
        });
      }
    }
  };

  const moveComponent = (componentId: string, direction: "up" | "down") => {
    const currentIndex = activeComponents.findIndex(
      (comp) => comp.id === componentId
    );
    if (currentIndex === -1) return;

    const newActive = Array.from(activeComponents);

    if (direction === "up" && currentIndex > 0) {
      [newActive[currentIndex], newActive[currentIndex - 1]] = [
        newActive[currentIndex - 1],
        newActive[currentIndex],
      ];
    } else if (direction === "down" && currentIndex < newActive.length - 1) {
      [newActive[currentIndex], newActive[currentIndex + 1]] = [
        newActive[currentIndex + 1],
        newActive[currentIndex],
      ];
    } else {
      return;
    }

    setActiveComponents(newActive);

    const newOrder = newActive.map((comp) => comp.id);
    const newVisibleComponents = newOrder;

    onConfigChange({
      visibleComponents: newVisibleComponents,
      order: newOrder,
    });
  };

  const getActiveComponent = () => {
    if (!activeId) return null;
    return activeComponents.find((comp) => comp.id === activeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Configuración del Home
          </h2>
          <p className="text-gray-600 mt-1">
            Arrastra y suelta para reordenar los componentes activos
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            disabled={loading}
            className="action-button bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 font-medium flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Restaurar
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="action-button bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 component-card">
          <div className="text-2xl font-bold text-blue-600">
            {activeComponents.length}
          </div>
          <div className="text-sm text-gray-600">Componentes Activos</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 component-card">
          <div className="text-2xl font-bold text-gray-600">
            {inactiveComponents.length}
          </div>
          <div className="text-sm text-gray-600">Componentes Inactivos</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 component-card">
          <div className="text-2xl font-bold text-green-600">
            {availableComponents.length}
          </div>
          <div className="text-sm text-gray-600">Total Disponibles</div>
        </div>
      </div>

      {/* Componentes Activos */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Componentes Activos
                <span className="component-counter">
                  {activeComponents.length}
                </span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Estos componentes se mostrarán en el home en el orden
                especificado
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Agregar Componentes
            </button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="p-4 space-y-2 min-h-[200px] custom-scrollbar">
            <SortableContext
              items={activeComponents.map((comp) => comp.id)}
              strategy={verticalListSortingStrategy}
            >
              {activeComponents.map((component, index) => (
                <SortableComponent
                  key={component.id}
                  component={component}
                  index={index}
                  onMove={(direction) => moveComponent(component.id, direction)}
                  onToggle={(activate) =>
                    toggleComponent(component.id, activate)
                  }
                  totalItems={activeComponents.length}
                />
              ))}
            </SortableContext>

            {activeComponents.length === 0 && (
              <div className="empty-state text-center py-8 text-gray-500 rounded-lg">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="font-medium">No hay componentes activos</p>
                <p className="text-sm">
                  Haz clic en &quot;Agregar Componentes&quot; para comenzar
                </p>
              </div>
            )}
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="component-card bg-white border border-gray-200 rounded-lg p-4 shadow-lg opacity-90">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      📦
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {getActiveComponent()?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {getActiveComponent()?.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modal para componentes inactivos */}
      <InactiveComponentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inactiveComponents={inactiveComponents}
        onActivateComponent={(componentId) =>
          toggleComponent(componentId, true)
        }
      />
    </div>
  );
}
