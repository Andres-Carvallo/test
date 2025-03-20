import { MetadataRoute } from "next";
import { mainMenuConfig } from "./config/menulinks";
import axios from "axios";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://pixelup.cl";
const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
const apiUrl = process.env.NEXT_PUBLIC_API_URL_CLIENTE;

if (!siteId || !apiUrl) {
  console.error('Error: Variables de entorno necesarias no están definidas');
}

interface Collection {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

interface Product {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

async function getCollections(): Promise<Collection[]> {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/collections?pageNumber=1&pageSize=50&siteId=${siteId}`
    );
    return (response.data.collections || []).filter((collection: Collection) => collection.slug);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/products?pageNumber=1&pageSize=50&siteId=${siteId}`
    );
    return (response.data.products || []).filter((product: Product) => product.slug);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Obtener colecciones y productos
    const collections = await getCollections();
    const products = await getProducts();

    // Rutas base del menú
    const menuRoutes = mainMenuConfig.links
      .filter(link => link.isVisible)
      .map(link => ({
        url: `${siteUrl}${link.path}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: link.path === "/" ? 1 : 0.8,
      }));

    // Rutas de colecciones
    const collectionRoutes = collections.map(collection => ({
      url: `${siteUrl}/tienda/colecciones/${collection.slug}`,
      lastModified: collection.updatedAt || collection.createdAt ? new Date(collection.updatedAt || collection.createdAt!) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Rutas de productos
    const productRoutes = products.map(product => ({
      url: `${siteUrl}/tienda/productos/${product.slug}`,
      lastModified: product.updatedAt || product.createdAt ? new Date(product.updatedAt || product.createdAt!) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    // Rutas adicionales de la tienda
    const additionalStoreRoutes = [
      {
        url: `${siteUrl}/tienda/categorias`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${siteUrl}/tienda/ofertas`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${siteUrl}/tienda/nuevos`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${siteUrl}/tienda/mas-vendidos`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
    ];

    // Combinar todas las rutas
    const allRoutes = [
      ...menuRoutes,
      ...collectionRoutes,
      ...productRoutes,
      ...additionalStoreRoutes,
    ];

    // Asegurarnos de que no haya URLs duplicadas
    const uniqueRoutes = Array.from(new Set(allRoutes.map(route => route.url)))
      .map(url => allRoutes.find(route => route.url === url)!);

    return uniqueRoutes;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // En caso de error, retornar al menos las rutas básicas
    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${siteUrl}/tienda`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
    ];
  }
} 