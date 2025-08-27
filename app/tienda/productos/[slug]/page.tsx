
import React from "react";
import { notFound } from "next/navigation";
import { slugify } from "@/app/utils/slugify";
import BannerTienda01 from "@/components/PIXELUP/BannerTienda/BannerTienda01/BannerTienda01";
import ProductDetailClient from "./ProductDetailClient";
import { getBaseUrl, getBaseUrlWithLogs, getCanonicalUrl, getRobustBaseUrl } from "@/app/utils/urlUtils";

export async function generateMetadata({ params }: any) {
  const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";

  try {
    // Obtener todos los productos
    const productsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products?siteId=${siteId}&pageNumber=1&pageSize=1000`,
      { next: { revalidate: 60 } }
    );

    if (!productsRes.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await productsRes.json();

    // Encontrar el producto por slug
    const product = products.products.find(
      (p: any) => slugify(p.name) === params.slug
    );

    if (!product) {
      return {
        title: "Producto no encontrado",
        description: "No se encontró el producto solicitado.",
      };
    }

    // Generar URL canónica de manera más explícita
    const baseUrl = getRobustBaseUrl();
    const productPath = `/tienda/productos/${params.slug}`;
    const canonicalUrl = `${baseUrl}${productPath}`;
    
    console.log('🔧 [product-metadata] Base URL:', baseUrl);
    console.log('🔧 [product-metadata] Product path:', productPath);
    console.log('🔧 [product-metadata] URL canónica generada:', canonicalUrl);
    console.log('🔧 [product-metadata] ¿Es URL absoluta?', canonicalUrl.startsWith('http'));
    
    // Crear una descripción más atractiva y específica para el producto
    let seoDescription = "Descubre este increíble producto en nuestra tienda.";
    
    if (product.description) {
      let cleanDescription = product.description;
      
      // Intentar parsear JSON si la descripción está en formato JSON
      try {
        const parsedDesc = JSON.parse(product.description);
        if (parsedDesc.content) {
          cleanDescription = parsedDesc.content;
        }
      } catch (e) {
        // Si no es JSON válido, usar la descripción tal como está
        cleanDescription = product.description;
      }
      
      // Limpiar HTML tags
      cleanDescription = cleanDescription.replace(/(<([^>]+)>)/gi, "").trim();
      
      // Crear una descripción que incluya el nombre del producto y la descripción
      const productName = product.name || '';
      const description = cleanDescription.length > 120 ? cleanDescription.substring(0, 120) + '...' : cleanDescription;
      
      seoDescription = `${productName} - ${description}`.substring(0, 160);
    }
    
    console.log(`🔧 [product-metadata] Meta description para ${product.name}:`, seoDescription);
    
    const keywords = seoDescription
      ? seoDescription.split(/\s+/).slice(0, 10).join(", ")
      : "";

    const metadata = {
      title: product.name,
      description: seoDescription,
      keywords: keywords,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title: product.name,
        description: seoDescription,
        type: 'website',
        url: canonicalUrl,
        siteName: process.env.NEXT_PUBLIC_NOMBRE_TIENDA,
        images: [
          {
            url: product.mainImageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: seoDescription,
        images: [product.mainImageUrl],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
    
    console.log('🔧 [product-metadata] Metadata completo:', JSON.stringify(metadata, null, 2));
    
    return metadata;
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "Error cargando el producto",
    };
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}&pageNumber=1&pageSize=1000`
    );
    const data = await res.json();

    return data.products.map((product: any) => ({
      slug: slugify(product.name),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

async function DetalleProductos({ params }: { params: { slug: string } }) {
  const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
  try {
    // Obtener todos los productos
    const productsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products?siteId=${siteId}&pageNumber=1&pageSize=1000`,
      {
        next: {
          tags: ["products"],
          revalidate: 0,
        },
      }
    );

    if (!productsRes.ok) {
      notFound();
    }

    const products = await productsRes.json();

    // Encontrar el producto por slug
    const product = products.products.find(
      (p: any) => slugify(p.name) === params.slug
    );

    if (!product) {
      notFound();
    }

    // Crear la descripción SEO para el párrafo visible
    let seoDescription = "Descubre este increíble producto en nuestra tienda.";
    
    if (product.description) {
      let cleanDescription = product.description;
      
      // Intentar parsear JSON si la descripción está en formato JSON
      try {
        const parsedDesc = JSON.parse(product.description);
        if (parsedDesc.content) {
          cleanDescription = parsedDesc.content;
        }
      } catch (e) {
        // Si no es JSON válido, usar la descripción tal como está
        cleanDescription = product.description;
      }
      
      // Limpiar HTML tags
      cleanDescription = cleanDescription.replace(/(<([^>]+)>)/gi, "").trim();
      
      // Crear una descripción que incluya el nombre del producto y la descripción
      const productName = product.name || '';
      const description = cleanDescription.length > 120 ? cleanDescription.substring(0, 120) + '...' : cleanDescription;
      
      seoDescription = `${productName} - ${description}`.substring(0, 160);
    }

    // Obtener los detalles completos del producto incluyendo atributos
    const productData = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${product.id}/skus?siteId=${siteId}`,
      {
        next: {
          tags: ["products", `product-${product.id}`],
          revalidate: 0,
        },
      }
    ).then((res) => res.json());

    // Obtener atributos y precios para cada SKU
    if (productData.code === 0) {
      const skusWithAttributesAndPrices = await Promise.all(
        productData.skus.map(async (sku: any) => {
          // Obtener atributos
          const attributesResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${product.id}/skus/${sku.id}/attributes?siteId=${siteId}`
          );
          const attributesData = await attributesResponse.json();

          // Obtener precios
          const pricingsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${product.id}/skus/${sku.id}/pricings?siteId=${siteId}`
          );
          const pricingsData = await pricingsResponse.json();

          return {
            ...sku,
            description: sku.description, // Asegurar que se incluya la descripción larga
            additionalData1: sku.additionalData1, // Asegurar que se incluya la descripción corta
            attributes:
              attributesData.code === 0
                ? attributesData.skuAttributes.map((attr: any) => ({
                    label: attr.attribute.name,
                    value: attr.value,
                  }))
                : [],
            pricings: pricingsData.code === 0 ? pricingsData.skuPricings : [],
          };
        })
      );

      productData.skus = skusWithAttributesAndPrices;
    }

    return (
      <>
        {/* Párrafo SEO visible para Google - debe coincidir con la meta description */}
        <div className="sr-only">
          <p>{seoDescription}</p>
        </div>

        {/* 
          <div>
            <BannerTienda01 />
          </div>
         
        */}

        <div className="mx-auto">
          <ProductDetailClient productData={productData} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}

export default DetalleProductos;
