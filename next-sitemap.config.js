/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://pixelup.cl",
  generateRobotsTxt: true, // Generará un archivo robots.txt
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  outDir: "./public",
  exclude: ["/dashboard/**", "/tienda/mi-cuenta/**"], // Excluir rutas privadas
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/dashboard", "/tienda/mi-cuenta"],
      },
    ],
  },
};

module.exports = config;
