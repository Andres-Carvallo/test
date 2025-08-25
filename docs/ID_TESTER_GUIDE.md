# Guía del Probador de IDs

## Resumen

El **Probador de IDs** es una herramienta integrada en el dashboard que permite verificar si los IDs de componentes existen en el sistema como banners o content blocks. Es especialmente útil para validar IDs antes de usarlos en otros componentes.

## Funcionalidades

### 🧪 **Probar IDs Manuales**
- Ingresa IDs específicos para verificar su existencia
- Soporta múltiples IDs separados por comas o saltos de línea
- Detecta automáticamente si es un banner o content block

### 🎯 **Probar IDs Generados**
- Prueba automáticamente todos los IDs generados en la sesión actual
- Útil para validar que los componentes se crearon correctamente

### 📊 **Resultados Detallados**
- Muestra el estado de cada ID (exitoso, no encontrado, error)
- Incluye detalles completos del componente encontrado
- Resumen estadístico de los resultados

## Cómo Usar

### 1. **Probar IDs Manuales**

```bash
# 1. Ir a /dashboard/pixelupv1
# 2. Bajar hasta la sección "🧪 Probador de IDs"
# 3. Ingresar los IDs en el textarea:

64f8a1b2c3d4e5f6a7b8c9d0
64f8a1b2c3d4e5f6a7b8c9d1
64f8a1b2c3d4e5f6a7b8c9d2

# 4. Hacer clic en "🧪 Probar IDs"
```

### 2. **Probar IDs Generados**

```bash
# 1. Generar algunos componentes primero
# 2. Hacer clic en "🎯 Probar IDs Generados"
# 3. El sistema probará automáticamente todos los IDs generados
```

## Tipos de Respuesta

### ✅ **Exitoso**
```json
{
  "id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "type": "banner",
  "status": "success",
  "message": "✅ Banner encontrado: Mi Banner SEO",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Mi Banner SEO",
    "landingText": "Descripción del banner",
    "buttonText": "Ver más",
    "buttonLink": "/seo",
    "mainImageLink": "https://...",
    "siteId": "12345"
  }
}
```

### ❌ **No Encontrado**
```json
{
  "id": "64f8a1b2c3d4e5f6a7b8c9d9",
  "type": "banner",
  "status": "not-found",
  "message": "❌ ID no encontrado como banner ni content block",
  "error": {
    "message": "ID no existe en el sistema"
  }
}
```

### ⚠️ **Error**
```json
{
  "id": "invalid-id",
  "type": "banner",
  "status": "error",
  "message": "❌ Error al verificar el ID",
  "error": {
    "status": 400,
    "message": "ID inválido"
  }
}
```

## Endpoints Utilizados

### **Banners**
```typescript
GET ${NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${id}?siteId=${siteId}
Headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### **Content Blocks**
```typescript
GET ${NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${id}?siteId=${siteId}
Headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Casos de Uso

### 1. **Validar IDs Antes de Usar**
```bash
# Antes de usar un ID en el componente SEO
# 1. Probar el ID para asegurar que existe
# 2. Verificar que es del tipo correcto (banner)
# 3. Revisar los datos del componente
```

### 2. **Debugging de Componentes**
```bash
# Si un componente no funciona
# 1. Probar el ID para ver si existe
# 2. Verificar los datos del componente
# 3. Identificar problemas en la estructura
```

### 3. **Migración de IDs**
```bash
# Al migrar de variables de entorno a enums
# 1. Probar los IDs antiguos
# 2. Generar nuevos IDs
# 3. Probar los nuevos IDs
# 4. Comparar resultados
```

## Flujo de Verificación

### **Paso 1: Probar como Banner**
```typescript
try {
  const bannerResponse = await axios.get(`/api/v1/banners/${id}?siteId=${siteId}`);
  if (bannerResponse.data.banner) {
    return { status: 'success', type: 'banner', data: bannerResponse.data.banner };
  }
} catch (error) {
  // Continuar al siguiente paso
}
```

### **Paso 2: Probar como Content Block**
```typescript
try {
  const contentBlockResponse = await axios.get(`/api/v1/content-blocks/${id}?siteId=${siteId}`);
  if (contentBlockResponse.data.contentBlock) {
    return { status: 'success', type: 'contentBlock', data: contentBlockResponse.data.contentBlock };
  }
} catch (error) {
  // Continuar al siguiente paso
}
```

### **Paso 3: ID No Encontrado**
```typescript
return { 
  status: 'not-found', 
  type: 'banner', 
  message: '❌ ID no encontrado como banner ni content block' 
};
```

## Ventajas del Probador

### ✅ **Validación Temprana**
- Detecta problemas antes de usar los IDs
- Evita errores en componentes dependientes
- Ahorra tiempo de debugging

### ✅ **Información Detallada**
- Muestra datos completos del componente
- Identifica el tipo correcto (banner/content block)
- Proporciona contexto para debugging

### ✅ **Fácil de Usar**
- Interfaz intuitiva
- Soporte para múltiples IDs
- Resultados visuales claros

### ✅ **Integración Completa**
- Usa la misma autenticación que el resto del sistema
- Compatible con múltiples sitios
- Logs detallados en consola

## Ejemplos de Uso

### **Ejemplo 1: Validar ID de SEO**
```bash
# 1. Generar componente SEO_BANNER
# 2. Copiar el ID generado
# 3. Probar el ID en el probador
# 4. Verificar que es un banner con datos SEO
```

### **Ejemplo 2: Debugging de Error**
```bash
# 1. Si el componente SEO no carga
# 2. Probar el ID en el probador
# 3. Si no existe, regenerar el componente
# 4. Si existe, revisar los datos
```

### **Ejemplo 3: Migración Masiva**
```bash
# 1. Generar todos los componentes pendientes
# 2. Usar "Probar IDs Generados"
# 3. Verificar que todos existen
# 4. Copiar los IDs válidos a los enums
```

## Próximos Pasos

1. **Generar componentes** usando el sistema de enums
2. **Probar los IDs** generados para validar
3. **Usar los IDs válidos** en otros componentes
4. **Migrar gradualmente** al nuevo sistema
