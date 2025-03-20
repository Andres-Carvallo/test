const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: '.env' });

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
const apiUrl = process.env.NEXT_PUBLIC_API_URL_CLIENTE;

if (!siteUrl || !siteId || !apiUrl) {
  console.error('Error: Variables de entorno necesarias no están definidas en .env.local');
  process.exit(1);
}

// Importar la configuración del menú
const menulinksPath = path.join(process.cwd(), 'app', 'config', 'menulinks.tsx');
const menulinksContent = fs.readFileSync(menulinksPath, 'utf8');

// Extraer las rutas del menú usando regex
const menuLinksRegex = /links:\s*\[([\s\S]*?)\]/;
const menuLinksMatch = menulinksContent.match(menuLinksRegex);
const menuLinksContent = menuLinksMatch ? menuLinksMatch[1] : '';

// Extraer las rutas individuales
const routeRegex = /path:\s*"([^"]+)"/g;
const routes = [];
let match;
while ((match = routeRegex.exec(menuLinksContent)) !== null) {
  routes.push(match[1]);
}

// Convertir las rutas al formato del sitemap
const baseRoutes = routes.map(route => ({
  url: route,
  priority: route === '/' ? '1.0' : '0.8',
  changefreq: route === '/' ? 'daily' : 'weekly'
}));

async function getCollections() {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/collections?pageNumber=1&pageSize=50&siteId=${siteId}`
    );
    return (response.data.collections || []).filter(collection => collection.slug);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

async function getProducts() {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/products?pageNumber=1&pageSize=50&siteId=${siteId}`
    );
    return (response.data.products || []).filter(product => product.slug);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function generateSitemap() {
  try {
    const collections = await getCollections();
    const products = await getProducts();

    // Generar URLs para colecciones
    const collectionUrls = collections.map(collection => ({
      url: `/tienda/colecciones/${collection.slug}`,
      lastmod: collection.updatedAt || collection.createdAt || new Date().toISOString(),
      priority: '0.7',
      changefreq: 'weekly'
    }));

    // Generar URLs para productos
    const productUrls = products.map(product => ({
      url: `/tienda/productos/${product.slug}`,
      lastmod: product.updatedAt || product.createdAt || new Date().toISOString(),
      priority: '0.8',
      changefreq: 'daily'
    }));

    // Combinar todas las URLs
    const allUrls = [
      ...baseRoutes,
      ...collectionUrls,
      ...productUrls
    ];

    // Generar el XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${siteUrl}${url}</loc>
    <lastmod>${lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Escribir el archivo
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    
    // Eliminar el archivo sitemap-0.xml si existe
    const sitemap0Path = path.join(process.cwd(), 'public', 'sitemap-0.xml');
    if (fs.existsSync(sitemap0Path)) {
      fs.unlinkSync(sitemap0Path);
    }
    
    console.log('sitemap.xml generado exitosamente');

  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Generar un sitemap básico en caso de error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, basicSitemap);
    console.log('sitemap.xml básico generado debido a un error');
  }
}

generateSitemap(); 