# Términos y Condiciones

Este módulo proporciona componentes para gestionar y mostrar términos y condiciones y preguntas frecuentes.

## Componentes

### TerminosCondiciones
Panel de administración para gestionar términos y condiciones.

**Ubicación**: `/dashboard/terminos-y-condiciones`

**Características**:
- ✅ Numeración automática (1, 1.1, 1.2, 2, 2.1, etc.)
- ✅ Estructura jerárquica con términos y subtérminos
- ✅ Editor de texto enriquecido
- ✅ Guardado automático en content-block

### TerminosVisual
Componente para mostrar términos y condiciones en el frontend.

**Ubicación**: `/terminos-y-condiciones`

**Características**:
- ✅ Índice lateral con navegación
- ✅ Numeración automática visual
- ✅ Scroll suave entre secciones
- ✅ Diseño responsive

## Estructura del JSON

```json
{
  "terminosCondiciones": {
    "titulo": "Términos y Condiciones",
    "terminos": [
      {
        "id": "termino-1",
        "titulo": "1. Información General",
        "contenido": "Contenido del término...",
        "subterminos": [
          {
            "id": "subtermino-1.1",
            "titulo": "1.1 Definiciones",
            "contenido": "Contenido del subtérmino..."
          }
        ]
      }
    ]
  }
}
```

## Variables de Entorno

```env
NEXT_PUBLIC_TERMINOS_CONTENTBLOCK=tu-content-block-id
```

## Uso

### En el Dashboard (Admin)
```tsx
import { TerminosCondiciones } from '@/components/Core/TerminosCondiciones';

// En tu página de admin
<TerminosCondiciones />
```

### En el Frontend
```tsx
import { TerminosVisual } from '@/components/Core/TerminosCondiciones';

// En tu página pública
<TerminosVisual />
``` 