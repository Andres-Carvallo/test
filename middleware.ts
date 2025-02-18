import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getMaintenanceStatus } from './app/components/MaintenancePage';

export async function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const path = request.nextUrl.pathname;
  
  // Permitir acceso al dashboard, admin, página de mantenimiento y .env.local
  const isAllowedRoute = path.startsWith('/dashboard') || 
                        path.startsWith('/admin') || 
                        path === '/mantenimiento' ||
                        path.startsWith('/.env.local');
  
  // Verificar el estado de mantenimiento desde el content block
  const { isEnabled } = await getMaintenanceStatus();
  
  // Si está en modo mantenimiento y no es una ruta permitida
  if (isEnabled && !isAllowedRoute) {
    // Crear una nueva URL para la redirección
    const maintenanceUrl = new URL('/mantenimiento', request.url);
    return NextResponse.redirect(maintenanceUrl);
  }
  
  return NextResponse.next();
}

// Configurar las rutas que serán afectadas por el middleware
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /api (rutas API)
     * 2. /_next (archivos Next.js)
     * 3. /static (si tienes una carpeta static)
     */
    '/((?!api|_next|static|favicon.ico).*)',
  ],
}; 