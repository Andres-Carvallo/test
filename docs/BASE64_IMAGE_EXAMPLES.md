# Ejemplos de Imágenes Base64 para Componentes Banner

## Estructura de Imagen Base64

Los componentes de tipo `banner` requieren una imagen base64 con esta estructura:

```typescript
interface Base64Image {
  name: string;        // Nombre del archivo
  type: string;        // Tipo MIME (ej: "image/png", "image/jpeg")
  size: number;        // Tamaño en bytes
  data: string;        // Base64 completo con data:image/...;base64,...
}
```

## Ejemplo de Uso en ComponentEnums.ts

```typescript
// Importar utilidades
import { createBase64Image, imageUrlToBase64 } from '@/utils/imageUtils';

// Crear imagen base64 personalizada
const customImage = createBase64Image(
  "mi-banner.png",
  "image/png",
  1024,
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
);

// En la configuración del componente
[PIXELUPComponents.BANNER_PRINCIPAL_01]: {
  id: PIXELUPComponents.BANNER_PRINCIPAL_01,
  type: 'banner',
  jsonStructure: 'bannerPrincipal',
  envVariable: 'NEXT_PUBLIC_BANNERPRINCIPAL01_ID',
  defaultData: {
    title: 'Banner Principal 01',
    landingText: JSON.stringify({...}),
    buttonText: 'Ver más',
    buttonLink: '#',
    mainImageLink: 'https://pixelup.cl/default-banner.jpg',
    mainImage: customImage  // ← Imagen base64 personalizada
  }
}
```

## Conversión de URL a Base64

```typescript
// Convertir URL de imagen a base64
const convertUrlToBase64 = async (imageUrl: string) => {
  try {
    const base64Image = await imageUrlToBase64(imageUrl);
    console.log('Imagen convertida:', base64Image);
    return base64Image;
  } catch (error) {
    console.error('Error al convertir imagen:', error);
    return null;
  }
};

// Uso
const bannerImage = await convertUrlToBase64('https://ejemplo.com/imagen.jpg');
```

## Conversión de Archivo a Base64

```typescript
// En un componente React
const handleFileUpload = async (file: File) => {
  try {
    const base64Data = await fileToBase64(file);
    const base64Image = createBase64Image(
      file.name,
      file.type,
      file.size,
      base64Data
    );
    console.log('Archivo convertido:', base64Image);
  } catch (error) {
    console.error('Error al convertir archivo:', error);
  }
};
```

## Imagen por Defecto

El sistema incluye automáticamente una imagen por defecto (1x1 pixel transparente) si no se especifica una:

```typescript
// Imagen por defecto incluida automáticamente
const DEFAULT_BASE64_IMAGE = {
  name: "pixelup-default.png",
  type: "image/png",
  size: 95,
  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
};
```

## Actualización Automática en el Script

El script de generación automáticamente incluye la imagen base64 en todos los componentes banner:

```typescript
// En app/dashboard/pixelupv1/page.tsx
import { ensureBannerHasImage } from '@/utils/imageUtils';

// El script automáticamente agrega la imagen si no existe
const bannerData = ensureBannerHasImage({
  ...componentData.defaultData,
  siteId: siteId
});
```

## Recomendaciones

1. **Tamaño de imagen**: Mantén las imágenes pequeñas (< 1MB) para evitar problemas de rendimiento
2. **Formato**: Usa PNG para transparencia, JPEG para fotos
3. **Optimización**: Comprime las imágenes antes de convertir a base64
4. **Fallback**: Siempre incluye una imagen por defecto para evitar errores

## Herramientas Útiles

- **Compresión online**: TinyPNG, Compressor.io
- **Conversión de formato**: Convertio, CloudConvert
- **Generación de placeholders**: Placeholder.com, Lorem Picsum
