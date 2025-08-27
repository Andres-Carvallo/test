# Configuración de WhatsApp

## Descripción

La configuración de WhatsApp ahora utiliza el sistema de content-blocks para permitir la gestión dinámica del botón de WhatsApp desde el dashboard. Esto reemplaza la configuración estática anterior que se encontraba en `GlobalConfig.tsx`.

## Características

- ✅ Activación/desactivación del botón de WhatsApp
- ✅ Configuración del número de teléfono
- ✅ Mensaje personalizado
- ✅ Gestión desde el dashboard
- ✅ Validación de datos
- ✅ Vista previa en tiempo real
- ✅ Integración con el sistema de enums de componentes

## Configuración

### Sistema de Enums

La configuración de WhatsApp está integrada en el sistema de enums de componentes en `app/config/componentEnums.ts`:

```typescript
export enum PIXELUPComponents {
  // ... otros componentes
  WHATSAPP_CONFIG = 'WHATSAPP_CONFIG',
}
```

### Inicialización

Para inicializar la configuración de WhatsApp en content-blocks, ejecuta:

```bash
node scripts/initWhatsAppConfig.js
```

Después de ejecutar el script, actualiza el ID generado en `componentEnums.ts`:

```typescript
export const DEVELOPMENT_IDS: Record<string, string> = {
  'WHATSAPP_CONFIG': 'ID_GENERADO_AQUI', // Reemplazar con el ID real
  // ... otros IDs
};
```

## Uso

### En el Dashboard

1. Ve a la página de Usuarios (`/dashboard/usuarios`)
2. Busca la sección "Configuración de WhatsApp"
3. Configura:
   - **Activar botón de WhatsApp**: Toggle para mostrar/ocultar el botón
   - **Número de teléfono**: Número con código de país (ej: +56912345678)
   - **Mensaje personalizado**: Mensaje que aparecerá en WhatsApp

### En el Frontend

El componente `WhatsAppButton` ahora usa automáticamente la configuración de content-blocks:

```tsx
import WhatsAppButton from "@/components/Core/WhatsAppButton/WhatsAppButton";

// El componente se muestra automáticamente si está activo
<WhatsAppButton />
```

### Hook personalizado

También puedes usar el hook `useWhatsAppConfig` para acceder a la configuración:

```tsx
import { useWhatsAppConfig } from "@/hooks/useWhatsAppConfig";

const MyComponent = () => {
  const { config, loading, generateWhatsAppLink } = useWhatsAppConfig();
  
  if (loading) return <div>Cargando...</div>;
  
  return (
    <div>
      {config.isActive && (
        <a href={generateWhatsAppLink()}>
          Contactar por WhatsApp
        </a>
      )}
    </div>
  );
};
```

## Estructura de Datos

La configuración se almacena en content-blocks con la siguiente estructura:

```json
{
  "isActive": false,
  "phoneNumber": "+56912345678",
  "message": "Hola, necesito información sobre sus productos"
}
```

## Migración desde GlobalConfig

Si anteriormente usabas la configuración en `GlobalConfig.tsx`, puedes eliminar estas líneas:

```tsx
// Eliminar de GlobalConfig.tsx
whatsappButton: {
  isActive: true,
  link: process.env.NEXT_PUBLIC_WHATSAPP_LINK || "",
},
```

Y reemplazar el uso de `globalConfig.whatsappButton` por el nuevo sistema de content-blocks.

## Validaciones

- El número de teléfono es requerido cuando WhatsApp está activo
- El número se formatea automáticamente (remueve espacios y caracteres especiales)
- El mensaje se codifica automáticamente para URLs
- Se valida que el enlace de WhatsApp sea válido antes de mostrar el botón

## API Endpoints

### Obtener configuración
```
GET /api/v1/content-blocks/{contentBlockId}?siteId={siteId}
```

### Actualizar configuración
```
PUT /api/v1/content-blocks/{contentBlockId}?siteId={siteId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Configuración de WhatsApp",
  "contentText": "{\"isActive\":true,\"phoneNumber\":\"+56912345678\",\"message\":\"Hola\"}",
  "type": "whatsapp-config",
  "isActive": true
}
```

## Integración con Enums

### Obtener ID del componente
```typescript
import { getComponentIdByEnvironment, PIXELUPComponents } from "@/app/config/componentEnums";

const whatsappId = getComponentIdByEnvironment(PIXELUPComponents.WHATSAPP_CONFIG);
```

### Obtener datos por defecto
```typescript
import { getPIXELUPComponentDefaultData } from "@/app/config/componentEnums";

const defaultData = getPIXELUPComponentDefaultData(PIXELUPComponents.WHATSAPP_CONFIG);
```

## Troubleshooting

### El botón no aparece
1. Verifica que `isActive` sea `true` en la configuración
2. Asegúrate de que el número de teléfono esté configurado
3. Revisa la consola del navegador para errores
4. Verifica que el ID en `componentEnums.ts` sea correcto

### Error al cargar configuración
1. Verifica que el content-block exista
2. Ejecuta el script de inicialización si es necesario
3. Asegúrate de que el ID en el enum sea correcto

### Error al guardar
1. Verifica que tengas permisos de administrador
2. Asegúrate de que el token de autenticación sea válido
3. Revisa que el número de teléfono tenga el formato correcto

### ID no encontrado
Si el ID del componente no está configurado en `componentEnums.ts`, verás `PENDING_ID`. Ejecuta el script de inicialización y actualiza el ID generado en el archivo de enums.
