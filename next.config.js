/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
  },
  // ... resto de tu configuración
}

module.exports = nextConfig 