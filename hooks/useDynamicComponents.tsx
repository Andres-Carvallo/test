import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ComponentConfig, getComponentsForPage } from '@/app/config/availableComponents';

interface UseDynamicComponentsOptions {
  page: 'home' | 'about';
  type: 'front' | 'back';
}

export const useDynamicComponents = ({ page, type }: UseDynamicComponentsOptions) => {
  const pageComponents = useMemo(() => {
    return getComponentsForPage(page);
  }, [page]);

  const renderComponent = (componentId: string, props?: Record<string, any>) => {
    const component = pageComponents.find(comp => comp.id === componentId);
    
    if (!component) {
      console.warn(`Componente no encontrado: ${componentId}`);
      return (
        <div className="p-4 border border-yellow-200 bg-yellow-50 rounded">
          <p className="text-yellow-600">Componente {componentId} no disponible</p>
        </div>
      );
    }

    const componentPath = type === 'front' ? component.frontComponent : component.backComponent;
    
    if (!componentPath) {
      console.warn(`Ruta no definida para componente ${componentId}`);
      return (
        <div className="p-4 border border-yellow-200 bg-yellow-50 rounded">
          <p className="text-yellow-600">Ruta no definida para {componentId}</p>
        </div>
      );
    }

    try {
      const DynamicComponent = dynamic(
        () => import(componentPath)
          .then((module) => {
            if (module.default) {
              return module;
            } else {
              throw new Error(`Componente ${componentId} no tiene exportación por defecto`);
            }
          })
          .catch((error) => {
            console.warn(`Error al cargar componente ${componentId} desde ${componentPath}:`, error);
            return Promise.resolve({
              default: () => (
                <div className="p-4 border border-red-200 bg-red-50 rounded">
                  <p className="text-red-600">Error: Componente {componentId} no encontrado</p>
                  <p className="text-xs text-red-500 mt-1">Ruta: {componentPath}</p>
                </div>
              )
            });
          }),
        {
          ssr: false,
          loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
        }
      );

      return <DynamicComponent {...props} />;
    } catch (error) {
      console.error(`Error renderizando componente ${componentId}:`, error);
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded">
          <p className="text-red-600">Error al renderizar {componentId}</p>
        </div>
      );
    }
  };

  const getComponentProps = (componentId: string) => {
    const component = pageComponents.find(comp => comp.id === componentId);
    return component?.props || {};
  };

  return {
    renderComponent,
    getComponentProps,
    availableComponentIds: pageComponents.map(comp => comp.id)
  };
}; 