# Corrección de Rutas de API - Componente SEO

## Problema Identificado

El error `403 Forbidden` con mensaje "Invalid authentication token" se debía a que el script de generación de componentes estaba usando rutas de API incorrectas.

## Error Original

```
POST https://pixelup-ecommerce-api-git-development-pixelups-projects.vercel.app/api/v1/banners
Status: 403 (Forbidden)
Message: "Invalid authentication token"
```

## Solución Implementada

### 1. Cambio de Rutas de API

**Antes:**
```typescript
// Rutas incorrectas
`${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners`
`${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks`
```

**Después:**
```typescript
// Rutas correctas del Back Office
`${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners?siteId=${siteId}`
`${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks?siteId=${siteId}`
```

### 2. Variables de Entorno Correctas

- **API URL**: `NEXT_PUBLIC_API_URL_BO_CLIENTE` (Back Office)
- **Site ID**: `NEXT_PUBLIC_API_URL_SITEID`
- **Token**: `AdminTokenAuth` (cookie)

### 3. Estructura de Headers Correcta

```typescript
{
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}
```

## Funciones Corregidas

### 1. `generarComponenteIndividual`
- ✅ Ruta para banners corregida
- ✅ Ruta para content blocks corregida
- ✅ Ruta para componentes mixtos corregida

### 2. `generarTodosLosPendientes`
- ✅ Ruta para banners corregida
- ✅ Ruta para content blocks corregida

### 3. `generarIdsParaOtroSitio`
- ✅ Ruta para banners corregida
- ✅ Ruta para content blocks corregida

## Ejemplo de Uso Correcto

```typescript
// Ejemplo basado en SEO.tsx
const response = await axios.get(
  `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);
```

## Verificación

Para verificar que las correcciones funcionan:

1. **Generar componente SEO**:
   ```bash
   # Ir a /dashboard/pixelupv1
   # Seleccionar SEO_BANNER
   # Hacer clic en "Generar Componente Individual"
   ```

2. **Verificar en consola**:
   - Debe aparecer: "✅ Banner creado exitosamente con ID: [ID]"
   - No debe aparecer error 403

3. **Verificar en dashboard SEO**:
   - Ir a `/dashboard/SEO`
   - Los campos deben cargar correctamente
   - La imagen debe mostrarse

## Componente SEO Actualizado

El componente `SEO_BANNER` ahora incluye:

- ✅ **Ruta de API correcta** (Back Office)
- ✅ **Imagen base64 por defecto**
- ✅ **Estructura JSON para SEO**
- ✅ **Autenticación correcta**

## Próximos Pasos

1. **Probar la generación** del componente SEO
2. **Verificar que funciona** en el dashboard
3. **Generar otros componentes** usando el sistema corregido
4. **Actualizar documentación** si es necesario
