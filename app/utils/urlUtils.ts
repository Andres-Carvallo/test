/**
 * Función para obtener la URL base con fallback inteligente
 * Funciona para todos los clientes sin hardcodear dominios específicos
 */
export function getBaseUrl(): string {
  // Si NEXT_PUBLIC_BASE_URL está definido, usarlo (prioridad máxima)
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
 * Función más robusta para obtener la URL base
 * Incluye múltiples estrategias de fallback
 */
export function getRobustBaseUrl(): string {
  console.log('🔧 [getRobustBaseUrl] Iniciando búsqueda de URL base...');
  
  // Estrategia 1: NEXT_PUBLIC_BASE_URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    console.log('✅ [getRobustBaseUrl] Usando NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Estrategia 2: VERCEL_URL
  if (process.env.VERCEL_URL) {
    const vercelUrl = `https://${process.env.VERCEL_URL}`;
    console.log('✅ [getRobustBaseUrl] Usando VERCEL_URL:', vercelUrl);
    return vercelUrl;
  }
  
  // Estrategia 3: NODE_ENV development
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ [getRobustBaseUrl] Usando localhost para desarrollo');
    return 'http://localhost:3000';
  }
  
  // Estrategia 4: Intentar obtener del request headers (si está disponible)
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.origin;
    console.log('✅ [getRobustBaseUrl] Usando window.location.origin:', currentUrl);
    return currentUrl;
  }
  
  // Estrategia 5: Fallback hardcodeado temporal
  console.log('⚠️ [getRobustBaseUrl] Usando fallback hardcodeado');
  return 'https://dev-ecommerce.pixelup.cl';
}

/**
 * Función para obtener la URL base de manera más robusta
 * Incluye logs para debugging en Vercel
 */
export function getBaseUrlWithLogs(): string {
  console.log('🔧 [getBaseUrl] NODE_ENV:', process.env.NODE_ENV);
  console.log('🔧 [getBaseUrl] NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
  console.log('🔧 [getBaseUrl] VERCEL_URL:', process.env.VERCEL_URL);
  
  const baseUrl = getBaseUrl();
  console.log('🔧 [getBaseUrl] Resultado final:', baseUrl);
  
  // Verificar que la URL sea absoluta
  if (!baseUrl.startsWith('http')) {
    console.error('❌ [getBaseUrl] ERROR: La URL no es absoluta:', baseUrl);
  } else {
    console.log('✅ [getBaseUrl] URL es absoluta:', baseUrl);
  }
  
  return baseUrl;
}

/**
 * Función para construir URLs canónicas
 */
export function getCanonicalUrl(path: string = ''): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${baseUrl}${cleanPath}`;
  
  console.log('🔧 [getCanonicalUrl] Base URL:', baseUrl);
  console.log('🔧 [getCanonicalUrl] Path:', path);
  console.log('🔧 [getCanonicalUrl] Clean path:', cleanPath);
  console.log('🔧 [getCanonicalUrl] URL canónica final:', canonicalUrl);
  
  return canonicalUrl;
}
