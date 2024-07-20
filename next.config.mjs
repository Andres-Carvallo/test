/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY, // Disponible tanto en el servidor como en el cliente
    RECAPTCHA_PUBLIC_SITE_KEY: process.env.RECAPTCHA_PUBLIC_SITE_KEY,
  },
  async headers() {
    return [
      {
        source: "/(.*)", // Aplica a todas las rutas
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow", // Cambia esto según tus necesidades
          },
        ],
      },
    ];
  },
};

export default nextConfig;
