import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { enabled } = await request.json();
    
    // Ruta al archivo .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    
    // Leer el archivo .env actual
    let envContent = fs.readFileSync(envPath, 'utf-8');
    
    // Actualizar la variable MAINTENANCE_MODE
    envContent = envContent.replace(
      /MAINTENANCE_MODE=.*/,
      `MAINTENANCE_MODE=${enabled}`
    );
    
    // Escribir los cambios
    fs.writeFileSync(envPath, envContent);
    
    // Actualizar la variable de entorno en tiempo de ejecución
    process.env.MAINTENANCE_MODE = String(enabled);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar el modo mantenimiento' },
      { status: 500 }
    );
  }
} 