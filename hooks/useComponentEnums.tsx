/**
 * Hook personalizado para el uso de enums de componentes
 * Facilita la migración de variables de entorno a enums
 */

import { useMemo } from 'react';
import {
  PIXELUPComponents,
  CoreComponents,
  PIXELUP_COMPONENT_DATA,
  CORE_COMPONENT_DATA,
  getPIXELUPComponentData,
  getCoreComponentData,
  getPIXELUPComponentId,
  getCoreComponentId,
  getPIXELUPComponentDefaultData,
  getCoreComponentDefaultData,
  isBannerComponent,
  isContentBlockComponent,
  isMixedComponent,
  getComponentsByType,
  envToEnum,
  enumToEnv,
  ENV_TO_ENUM_MAPPING,
  ComponentData
} from '@/config/componentEnums';

/**
 * Hook para obtener datos de un componente PIXELUP
 */
export function usePIXELUPComponent(component: PIXELUPComponents) {
  return useMemo(() => {
    const data = getPIXELUPComponentData(component);
    const id = getPIXELUPComponentId(component);
    const defaultData = getPIXELUPComponentDefaultData(component);
    const isBanner = isBannerComponent(component);
    const isContentBlock = isContentBlockComponent(component);
    const isMixed = isMixedComponent(component);

    return {
      data,
      id,
      defaultData,
      isBanner,
      isContentBlock,
      isMixed,
      type: data.type
    };
  }, [component]);
}

/**
 * Hook para obtener datos de un componente Core
 */
export function useCoreComponent(component: CoreComponents) {
  return useMemo(() => {
    const data = getCoreComponentData(component);
    const id = getCoreComponentId(component);
    const defaultData = getCoreComponentDefaultData(component);
    const isBanner = isBannerComponent(component);
    const isContentBlock = isContentBlockComponent(component);
    const isMixed = isMixedComponent(component);

    return {
      data,
      id,
      defaultData,
      isBanner,
      isContentBlock,
      isMixed,
      type: data.type
    };
  }, [component]);
}

/**
 * Hook para obtener todos los componentes de un tipo específico
 */
export function useComponentsByType(type: 'banner' | 'contentBlock' | 'mixed') {
  return useMemo(() => {
    return getComponentsByType(type);
  }, [type]);
}

/**
 * Hook para migrar variables de entorno a enums
 */
export function useEnvToEnum(envVariable: string) {
  return useMemo(() => {
    return envToEnum(envVariable);
  }, [envVariable]);
}

/**
 * Hook para convertir enums a variables de entorno
 */
export function useEnumToEnv(component: PIXELUPComponents | CoreComponents) {
  return useMemo(() => {
    return enumToEnv(component);
  }, [component]);
}

/**
 * Hook para obtener todos los datos de componentes PIXELUP
 */
export function useAllPIXELUPComponents() {
  return useMemo(() => {
    return PIXELUP_COMPONENT_DATA;
  }, []);
}

/**
 * Hook para obtener todos los datos de componentes Core
 */
export function useAllCoreComponents() {
  return useMemo(() => {
    return CORE_COMPONENT_DATA;
  }, []);
}

/**
 * Hook para obtener el mapeo completo de variables de entorno
 */
export function useEnvMapping() {
  return useMemo(() => {
    return ENV_TO_ENUM_MAPPING;
  }, []);
}

/**
 * Hook para obtener datos de cualquier componente (PIXELUP o Core)
 */
export function useComponent(component: PIXELUPComponents | CoreComponents) {
  return useMemo(() => {
    // Intentar obtener como componente PIXELUP
    if (component in PIXELUP_COMPONENT_DATA) {
      return usePIXELUPComponent(component as PIXELUPComponents);
    }
    
    // Intentar obtener como componente Core
    if (component in CORE_COMPONENT_DATA) {
      return useCoreComponent(component as CoreComponents);
    }
    
    // Si no se encuentra, retornar null
    return null;
  }, [component]);
}

/**
 * Hook para obtener datos de componentes por categoría
 */
export function useComponentsByCategory() {
  return useMemo(() => {
    const categories = {
      banners: getComponentsByType('banner'),
      contentBlocks: getComponentsByType('contentBlock'),
      mixed: getComponentsByType('mixed'),
      all: [...Object.keys(PIXELUP_COMPONENT_DATA), ...Object.keys(CORE_COMPONENT_DATA)]
    };

    return categories;
  }, []);
}

/**
 * Hook para validar si un componente existe
 */
export function useComponentExists(component: string) {
  return useMemo(() => {
    return component in PIXELUP_COMPONENT_DATA || component in CORE_COMPONENT_DATA;
  }, [component]);
}

/**
 * Hook para obtener información de migración
 */
export function useMigrationInfo() {
  return useMemo(() => {
    const totalComponents = Object.keys(PIXELUP_COMPONENT_DATA).length + Object.keys(CORE_COMPONENT_DATA).length;
    const totalEnvVariables = Object.keys(ENV_TO_ENUM_MAPPING).length;
    
    return {
      totalComponents,
      totalEnvVariables,
      migrationProgress: (totalEnvVariables / totalComponents) * 100,
      unmappedComponents: totalComponents - totalEnvVariables
    };
  }, []);
}

/**
 * Hook para obtener datos de componentes con información de migración
 */
export function useComponentWithMigration(component: PIXELUPComponents | CoreComponents) {
  const componentData = useComponent(component);
  const envVariable = useEnumToEnv(component);
  
  return useMemo(() => {
    return {
      ...componentData,
      envVariable,
      isMigrated: !!envVariable,
      needsMigration: !envVariable
    };
  }, [componentData, envVariable]);
}

/**
 * Hook para obtener todos los componentes que necesitan migración
 */
export function useComponentsNeedingMigration() {
  return useMemo(() => {
    const allComponents = [
      ...Object.keys(PIXELUP_COMPONENT_DATA) as PIXELUPComponents[],
      ...Object.keys(CORE_COMPONENT_DATA) as CoreComponents[]
    ];
    
    return allComponents.filter(component => !enumToEnv(component));
  }, []);
}

/**
 * Hook para obtener estadísticas de componentes
 */
export function useComponentStats() {
  return useMemo(() => {
    const pixelupComponents = Object.keys(PIXELUP_COMPONENT_DATA);
    const coreComponents = Object.keys(CORE_COMPONENT_DATA);
    
    const pixelupByType = {
      banner: pixelupComponents.filter(c => isBannerComponent(c as PIXELUPComponents)).length,
      contentBlock: pixelupComponents.filter(c => isContentBlockComponent(c as PIXELUPComponents)).length,
      mixed: pixelupComponents.filter(c => isMixedComponent(c as PIXELUPComponents)).length
    };
    
    const coreByType = {
      banner: coreComponents.filter(c => isBannerComponent(c as CoreComponents)).length,
      contentBlock: coreComponents.filter(c => isContentBlockComponent(c as CoreComponents)).length,
      mixed: coreComponents.filter(c => isMixedComponent(c as CoreComponents)).length
    };
    
    return {
      total: pixelupComponents.length + coreComponents.length,
      pixelup: {
        total: pixelupComponents.length,
        byType: pixelupByType
      },
      core: {
        total: coreComponents.length,
        byType: coreByType
      }
    };
  }, []);
}
