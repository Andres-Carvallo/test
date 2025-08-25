# Sistema de Enums para Componentes - Guía de Migración

## Resumen

Este documento describe el nuevo sistema de enums que reemplaza las variables de entorno para la gestión de componentes. El sistema proporciona datos por defecto estructurados para cada componente, mejorando la consistencia y facilitando el desarrollo.

## Arquitectura del Sistema

### 1. Enums de Componentes

El sistema define dos enums principales:

- **PIXELUPComponents**: Para componentes específicos de PIXELUP
- **CoreComponents**: Para componentes core del sistema

### 2. Tipos de Componentes

Cada componente puede ser de tres tipos:

- **banner**: Componentes que requieren un banner con imágenes
- **contentBlock**: Componentes que requieren contenido de texto
- **mixed**: Componentes que requieren tanto banner como contentBlock

### 3. Estructura de Datos

```typescript
interface ComponentData {
  id: string;
  defaultData?: any;
  type: 'banner' | 'contentBlock' | 'mixed';
}
```

## Archivos del Sistema

### 1. Configuración Principal
- `config/componentEnums.ts`: Definición de enums y datos por defecto
- `hooks/useComponentEnums.tsx`: Hooks personalizados para usar el sistema

### 2. Scripts Actualizados
- `app/dashboard/pixelupv1/page.tsx`: Script mejorado con soporte para enums

## Migración de Componentes

### Paso 1: Importar las Dependencias

```typescript
import { 
  PIXELUPComponents, 
  getPIXELUPComponentId,
  getPIXELUPComponentDefaultData 
} from "@/config/componentEnums";
import { usePIXELUPComponent } from "@/hooks/useComponentEnums";
```

### Paso 2: Reemplazar Variables de Entorno

**Antes:**
```typescript
const bannerId = process.env.NEXT_PUBLIC_BANNERPRINCIPAL01_ID;
```

**Después:**
```typescript
// Opción 1: Usando hook (recomendado)
const componentData = usePIXELUPComponent(PIXELUPComponents.BANNER_PRINCIPAL_01);
const bannerId = componentData.id;

// Opción 2: Usando función directa
const bannerId = getPIXELUPComponentId(PIXELUPComponents.BANNER_PRINCIPAL_01);
```

### Paso 3: Usar Datos por Defecto

```typescript
// Obtener datos por defecto
const defaultData = componentData.defaultData;

// Usar en caso de error o datos faltantes
if (!response.data.banner) {
  const fallbackData = {
    title: defaultData.title,
    landingText: defaultData.landingText,
    buttonText: defaultData.buttonText,
    buttonLink: defaultData.buttonLink,
    mainImageLink: defaultData.mainImageLink
  };
  // Usar fallbackData...
}
```

## Ejemplo de Migración Completa

### Componente Original (BannerPrincipal01.tsx)

```typescript
// Antes
const fetchBannerHome = async () => {
  const bannerId = process.env.NEXT_PUBLIC_BANNERPRINCIPAL01_ID;
  const response = await axios.get(`/api/v1/banners/${bannerId}`);
  setBannerData(response.data.banner);
};
```

### Componente Migrado (BannerPrincipal01_Migrated.tsx)

```typescript
// Después
const componentData = usePIXELUPComponent(PIXELUPComponents.BANNER_PRINCIPAL_01);

const fetchBannerHome = async () => {
  try {
    const bannerId = componentData.id;
    const response = await axios.get(`/api/v1/banners/${bannerId}`);
    
    if (!response.data.banner || !response.data.banner.images) {
      // Usar datos por defecto del enum
      const defaultBannerData = {
        images: [{
          mainImage: { url: componentData.defaultData.mainImageLink },
          title: componentData.defaultData.title,
          landingText: componentData.defaultData.landingText,
          buttonLink: componentData.defaultData.buttonLink,
          buttonText: componentData.defaultData.buttonText,
          mainImageLink: componentData.defaultData.mainImageLink
        }]
      };
      setBannerData(defaultBannerData);
    } else {
      setBannerData(response.data.banner);
    }
  } catch (error) {
    // En caso de error, usar datos por defecto
    console.log("Usando datos por defecto del enum");
    // ... implementar fallback
  }
};
```

## Script de Generación Mejorado

El script `pixelupv1` ahora incluye dos modos:

### 1. Sistema de Enums (Recomendado)
- Selecciona componentes desde una lista desplegable
- Genera automáticamente con datos por defecto estructurados
- Muestra información del componente seleccionado

### 2. Sistema Legacy
- Mantiene compatibilidad con variables de entorno
- Mapea automáticamente a enums cuando es posible
- Muestra qué variables están mapeadas

## Hooks Disponibles

### usePIXELUPComponent(component)
Obtiene datos completos de un componente PIXELUP.

```typescript
const componentData = usePIXELUPComponent(PIXELUPComponents.BANNER_PRINCIPAL_01);
// Retorna: { data, id, defaultData, isBanner, isContentBlock, isMixed, type }
```

### useCoreComponent(component)
Obtiene datos completos de un componente Core.

```typescript
const componentData = useCoreComponent(CoreComponents.POPUP_BANNER);
```

### useComponentsByType(type)
Obtiene todos los componentes de un tipo específico.

```typescript
const bannerComponents = useComponentsByType('banner');
const contentBlockComponents = useComponentsByType('contentBlock');
const mixedComponents = useComponentsByType('mixed');
```

### useComponentStats()
Obtiene estadísticas de todos los componentes.

```typescript
const stats = useComponentStats();
// Retorna información sobre total de componentes, distribución por tipo, etc.
```

## Mapeo de Variables de Entorno

El sistema incluye un mapeo automático de variables de entorno a enums:

```typescript
// Variables de entorno mapeadas automáticamente
'NEXT_PUBLIC_BANNERPRINCIPAL01_ID' → PIXELUPComponents.BANNER_PRINCIPAL_01
'NEXT_PUBLIC_POPUP_BANNER_ID' → CoreComponents.POPUP_BANNER
// ... etc
```

## Ventajas del Nuevo Sistema

### 1. Consistencia
- Datos por defecto estructurados para cada componente
- Tipos TypeScript bien definidos
- Validación automática de tipos

### 2. Mantenibilidad
- Centralización de configuración
- Fácil actualización de datos por defecto
- Documentación integrada

### 3. Desarrollo
- Autocompletado en IDEs
- Detección de errores en tiempo de compilación
- Refactoring seguro

### 4. Fallbacks Robustos
- Datos por defecto cuando la API falla
- Mejor experiencia de usuario
- Debugging más fácil

## Migración Gradual

El sistema permite migración gradual:

1. **Fase 1**: Usar enums en nuevos componentes
2. **Fase 2**: Migrar componentes existentes uno por uno
3. **Fase 3**: Eliminar variables de entorno obsoletas

### Compatibilidad

- Los componentes existentes siguen funcionando
- El mapeo automático facilita la transición
- No hay breaking changes inmediatos

## Debugging y Desarrollo

### Información de Debug (Solo en desarrollo)

```typescript
{process.env.NODE_ENV === 'development' && (
  <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
    <p><strong>Componente:</strong> {PIXELUPComponents.BANNER_PRINCIPAL_01}</p>
    <p><strong>ID:</strong> {componentData.id}</p>
    <p><strong>Tipo:</strong> {componentData.type}</p>
  </div>
)}
```

### Logs Útiles

```typescript
console.log("Datos del componente:", componentData);
console.log("Datos por defecto:", componentData.defaultData);
console.log("¿Es banner?", componentData.isBanner);
```

## Próximos Pasos

1. **Migrar componentes críticos** usando el ejemplo proporcionado
2. **Actualizar documentación** de componentes específicos
3. **Implementar tests** para el sistema de enums
4. **Optimizar performance** si es necesario
5. **Considerar internacionalización** de datos por defecto

## Soporte

Para preguntas o problemas con la migración:

1. Revisar este documento
2. Consultar los ejemplos en `BannerPrincipal01_Migrated.tsx`
3. Usar los hooks de debugging disponibles
4. Verificar el mapeo de variables en `componentEnums.ts`
