
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY, // Disponible tanto en el servidor como en el cliente
    },
  };
  
  export default nextConfig;