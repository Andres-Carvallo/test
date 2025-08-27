import { useMemo } from 'react';
import { 
  PIXELUPComponents, 
  CoreComponents,
  getPIXELUPComponentId, 
  getCoreComponentId,
  getPIXELUPComponentData,
  getCoreComponentData
} from '../app/config/componentEnums';

/**
 * Hook personalizado para obtener el ID de un componente con fallback a variables de entorno
 * @param component - El componente del enum (PIXELUP o Core)
 * @param envVariable - La variable de entorno como fallback
 * @returns El ID del componente o string vacío si no se encuentra
 */
export const useComponentId = (
  component: PIXELUPComponents | CoreComponents, 
  envVariable: string
): string => {
  return useMemo(() => {
    try {
      console.log(`🔍 [useComponentId] Recibido component: ${component}, tipo: ${typeof component}`);
      
      // Intentar obtener el ID del enum
      let enumId: string;
      
      if (component in PIXELUPComponents) {
        console.log(`✅ [useComponentId] Componente encontrado en PIXELUPComponents`);
        enumId = getPIXELUPComponentId(component as PIXELUPComponents);
      } else {
        console.log(`⚠️ [useComponentId] Componente NO encontrado en PIXELUPComponents, buscando en CoreComponents`);
        enumId = getCoreComponentId(component as CoreComponents);
      }
      
      // Si el ID del enum es un UUID válido (ya fue reemplazado), usarlo directamente
      if (enumId && enumId.length === 36 && enumId.includes('-')) {
        console.log(`✅ [useComponentId] Usando ID del enum para ${component}: ${enumId}`);
        return enumId;
      }
      
      // Si el ID del enum es una referencia al enum mismo (necesita ser reemplazado), usar fallback
      if (enumId === component || enumId === `PIXELUPComponents.${component}` || enumId === `CoreComponents.${component}`) {
        // Usar la variable de entorno como fallback
        const envId = process.env[envVariable];
        if (envId) {
          console.log(`⚠️ [useComponentId] Usando variable de entorno como fallback para ${component}: ${envId}`);
          return envId;
        }
        console.error(`❌ [useComponentId] No se encontró ID para ${component} en variable de entorno`);
        return '';
      }
      
      // Si no hay ninguno, mostrar error
      console.error(`❌ [useComponentId] No se encontró ID para ${component} ni en enum ni en variable de entorno`);
      return '';
    } catch (error) {
      console.error(`[useComponentId] Error obteniendo ID para ${component}:`, error);
      // Fallback a variable de entorno
      const envId = process.env[envVariable];
      if (envId) {
        console.log(`⚠️ [useComponentId] Fallback a variable de entorno para ${component}: ${envId}`);
        return envId;
      }
      return '';
    }
  }, [component, envVariable]);
};

/**
 * Hook para obtener el ID de imagen hija de un componente
 * @param component - El componente del enum (PIXELUP o Core)
 * @returns El ID de la imagen hija o string vacío si no se encuentra
 */
export const useComponentImageId = (
  component: PIXELUPComponents | CoreComponents
): string => {
  return useMemo(() => {
    try {
      // Obtener los datos del componente
      let componentData: any;
      
      if (component in PIXELUPComponents) {
        componentData = getPIXELUPComponentData(component as PIXELUPComponents);
      } else {
        componentData = getCoreComponentData(component as CoreComponents);
      }
      
      // Si el componente no necesita imagen hija, retornar vacío
      if (!componentData?.needsImage || !componentData?.imageEnvVariable) {
        console.log(`ℹ️ [useComponentImageId] Componente ${component} no necesita imagen hija`);
        return '';
      }
      
      // Usar la variable de entorno de la imagen hija
      const imageEnvId = process.env[componentData.imageEnvVariable];
      if (imageEnvId) {
        console.log(`✅ [useComponentImageId] Usando ID de imagen hija para ${component}: ${imageEnvId}`);
        return imageEnvId;
      }
      
      console.error(`❌ [useComponentImageId] No se encontró ID de imagen hija para ${component} en variable de entorno ${componentData.imageEnvVariable}`);
      return '';
    } catch (error) {
      console.error(`[useComponentImageId] Error obteniendo ID de imagen hija para ${component}:`, error);
      return '';
    }
  }, [component]);
};

/**
 * Hook para obtener múltiples IDs de componentes
 * @param components - Array de objetos con component y envVariable
 * @returns Objeto con los IDs obtenidos
 */
export const useMultipleComponentIds = (
  components: Array<{ component: PIXELUPComponents | CoreComponents; envVariable: string }>
): Record<string, string> => {
  return useMemo(() => {
    const ids: Record<string, string> = {};
    
    components.forEach(({ component, envVariable }) => {
      ids[component] = useComponentId(component, envVariable);
    });
    
    return ids;
  }, [components]);
};
