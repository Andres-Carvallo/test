# Componente SEO_BANNER - Ejemplo de Uso

## Configuración Actualizada

El componente `SEO_BANNER` ha sido actualizado para incluir:

1. **Estructura JSON específica para SEO**
2. **Imagen base64 por defecto**
3. **Datos optimizados para SEO**

## Estructura del Componente

```typescript
[PIXELUPComponents.SEO_BANNER]: {
  id: PIXELUPComponents.SEO_BANNER,
  type: 'banner',
  jsonStructure: 'seo',
  envVariable: 'NEXT_PUBLIC_SEO_BANNER_ID',
  defaultData: {
    title: 'Optimización SEO - PixelUp',
    landingText: JSON.stringify({
      title: 'Optimización SEO - PixelUp',
      description: 'Descubre nuestras estrategias de optimización para buscadores que mejorarán el posicionamiento de tu sitio web en Google y otros motores de búsqueda.',
      keywords: 'seo, optimización, posicionamiento, google, marketing digital',
      url: '/seo',
      imageAlt: 'Servicios de SEO y optimización web'
    } as SeoConfig),
    buttonText: 'seo, optimización, posicionamiento, google, marketing digital',
    buttonLink: '/seo',
    mainImageLink: 'https://pixelup.cl/default-seo.jpg',
    mainImage: {
      name: "pixelup-seo-default.png",
      type: "image/png",
      size: 95,
      data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    }
  }
}
```

## Campos del Componente

### `title`
- **Propósito**: Título principal de la página
- **Ejemplo**: "Optimización SEO - PixelUp"
- **Recomendación**: 50-60 caracteres

### `landingText` (JSON estructurado)
- **Propósito**: Contiene toda la información SEO estructurada
- **Estructura**:
  ```typescript
  {
    title: string;        // Título de la página
    description: string;  // Meta description
    keywords: string;     // Palabras clave
    url: string;         // URL de la página
    imageAlt: string;    // Texto alternativo de la imagen
  }
  ```

### `buttonText`
- **Propósito**: Palabras clave separadas por comas
- **Ejemplo**: "seo, optimización, posicionamiento, google, marketing digital"
- **Recomendación**: 3-5 keywords relevantes

### `buttonLink`
- **Propósito**: URL de la página
- **Ejemplo**: "/seo"

### `mainImage`
- **Propósito**: Imagen base64 por defecto
- **Estructura**:
  ```typescript
  {
    name: string;     // Nombre del archivo
    type: string;     // Tipo MIME
    size: number;     // Tamaño en bytes
    data: string;     // Base64 completo
  }
  ```

## Uso en el Componente SEO.tsx

El componente `SEO.tsx` utiliza estos campos de la siguiente manera:

```typescript
// En el formulario
const [formDataHero, setFormDataHero] = useState<any>({
  title: "",           // ← Se mapea a title
  landingText: "",     // ← Se mapea a description en el JSON
  buttonLink: "",      // ← Se mapea a buttonLink
  buttonText: "",      // ← Se mapea a keywords en el JSON
});

// En el componente de imagen
const [updatedBannerData, setUpdatedBannerData] = useState({
  // ... otros campos
  mainImage: {         // ← Se mapea a mainImage
    name: "",
    type: "",
    size: null,
    data: "",
  },
});
```

## Generación del Componente

Para generar el componente SEO con la nueva estructura:

1. **Usar el script de generación**:
   ```typescript
   // En app/dashboard/pixelupv1/page.tsx
   const componentData = getPIXELUPComponentData(PIXELUPComponents.SEO_BANNER);
   ```

2. **El sistema automáticamente**:
   - Incluye la imagen base64 por defecto
   - Estructura el JSON para SEO
   - Aplica las mejores prácticas de SEO

## Prueba del Componente

Para probar el componente actualizado:

1. **Generar el ID**:
   ```bash
   # Usar el script de generación
   npm run generate-seo-component
   ```

2. **Verificar la estructura**:
   - El `landingText` debe contener JSON válido
   - La imagen base64 debe estar presente
   - Los campos SEO deben estar optimizados

3. **Validar en el dashboard**:
   - Ir a `/dashboard/SEO`
   - Verificar que los campos se cargan correctamente
   - Comprobar que la imagen se muestra

## Mejoras Implementadas

✅ **Estructura JSON específica para SEO**
✅ **Imagen base64 por defecto incluida**
✅ **Datos optimizados para SEO**
✅ **Integración con el sistema de enums**
✅ **Compatibilidad con el componente SEO.tsx existente**

## Próximos Pasos

1. **Generar el ID del componente** usando el script
2. **Probar en el dashboard** de SEO
3. **Validar la estructura** JSON generada
4. **Optimizar las keywords** según necesidades específicas
