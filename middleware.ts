import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('MAINTENANCE_MODE:', process.env.MAINTENANCE_MODE);
  console.log('Is maintenance mode?:', process.env.MAINTENANCE_MODE === 'true');
  // Obtener el estado de mantenimiento desde las variables de entorno
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  // Obtener la ruta actual
  const path = request.nextUrl.pathname;
  
  // Permitir acceso al dashboard, admin y a la página de mantenimiento
  const isAllowedRoute = path.startsWith('/dashboard') || 
                        path.startsWith('/admin') || 
                        path === '/mantenimiento' ||
                        path.startsWith('/.env.local');  // Añadir acceso a .env.local
  
  // Si está en modo mantenimiento y no es una ruta permitida
  if (isMaintenanceMode && !isAllowedRoute) {
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