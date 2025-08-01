import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { availableComponents, ComponentConfig } from '@/app/config/availableComponents';

interface UseDynamicComponentsOptions {
  page: 'home' | 'about';
  type: 'front' | 'back';
}

export const useDynamicComponents = ({ page, type }: UseDynamicComponentsOptions) => {
  const [components, setComponents] = useState<ComponentConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filtrar componentes según la página y tipo
    const filteredComponents = availableComponents.filter(component => {
      if (page === 'home' && !component.showInHome) return false;
      if (page === 'about' && !component.showInAbout) return false;
      return true;
    });

    setComponents(filteredComponents);
    setLoading(false);
  }, [page]);

  const renderComponent = (componentId: string, props?: Record<string, any>) => {
    const component = components.find(comp => comp.id === componentId);
    
    if (!component) {
      console.error(`❌ Componente no encontrado: ${componentId}`);
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> Componente "{componentId}" no encontrado
        </div>
      );
    }

    const importFunction = type === 'front' ? component.frontComponent : component.backComponent;
    
    if (!importFunction) {
      console.error(`❌ Función de importación no disponible para: ${componentId} (${type})`);
      return (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <strong>Advertencia:</strong> Función de importación no disponible para "{componentId}" ({type})
        </div>
      );
    }

    const DynamicComponent = dynamic(
      () => {
        console.log(`🔄 Iniciando carga dinámica de: ${componentId} (${type})`);
        return importFunction()
          .then((module) => {
            console.log(`✅ Componente cargado exitosamente: ${componentId}`);
            return module.default || module;
          })
          .catch((error: any) => {
            console.error(`❌ Error al cargar componente ${componentId}:`, error);
            throw new Error(`Error al cargar componente ${componentId}: ${error.message}`);
          });
      },
      { 
        ssr: false, 
        loading: () => (
          <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <strong>Cargando:</strong> {component.title}...
          </div>
        ) 
      }
    );

    return <DynamicComponent {...props} />;
  };

  const getComponentById = (componentId: string) => {
    return components.find(comp => comp.id === componentId);
  };

  return {
    components,
    loading,
    renderComponent,
    getComponentById,
  };
}; 