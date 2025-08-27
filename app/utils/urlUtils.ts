/**
 * Función para obtener la URL base con fallback inteligente
 * Funciona para todos los clientes sin hardcodear dominios específicos
 */
export function getBaseUrl(): string {
  // Si NEXT_PUBLIC_BASE_URL está definido, usarlo
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Si estamos en desarrollo, usar localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Si estamos en producción, usar VERCEL_URL si está disponible
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback genérico para casos extremos
  return 'https://example.com';
}

/**
 * Función para construir URLs canónicas
 */
export function getCanonicalUrl(path: string = ''): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
