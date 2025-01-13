import React from "react";
import Colecciones from "@/components/conMantenedor/colecciones";
import { getCollections, getCollectionById } from "@/app/utils/colecciones";
import { slugify } from "@/app/utils/slugify";

async function fetchPriceForProduct(productId: string, skuId: string) {
  const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/pricings?siteId=${siteId}`,
    { next: { tags: ["products"] } }
  );
  const data = await res.json();
  return data;
}

async function fetchStockForProduct(productId: string, skuId: string) {
  const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/inventories?siteId=${siteId}`,
    { next: { tags: ["products"] } }
  );
  const data = await res.json();
  if (data.code === 0 && data.skuInventories.length > 0) {
    return data.skuInventories.reduce(
      (acc: number, inventory: any) => acc + inventory.quantity,
      0
    );
  }
  return 0;
}

async function getPriceForVariableProduct(product: any) {
  const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${product.id}/skus?siteId=${siteId}`,
    { next: { tags: ["products"] } }
  );
  const data = await res.json();

  if (data && data.skus && data.skus.length > 0) {
    const prices = await Promise.all(
      data.skus.map(async (sku: any) => {
        const priceData = await fetchPriceForProduct(product.id, sku.id);
        return priceData?.skuPricings?.[0]?.unitPrice || null;
      })
    );

    const validPrices = prices.filter(
      (price): price is number => price !== null
    );
    if (validPrices.length > 0) {
      return {
        minimumAmount: Math.min(...validPrices),
        maximumAmount: Math.max(...validPrices),
      };
    }
  }
  return { minimumAmount: null, maximumAmount: null };
}

export default async function DetalleColeccion({
  params,
}: {
  params: { slug: string };
}) {
  try {
    // Obtener todas las colecciones
    const { collections } = await getCollections();

    // Encontrar la colección que coincida con el slug
    const collectionFound = collections.find(
      (col: any) => slugify(col.title) === params.slug
    );

    if (!collectionFound) {
      throw new Error("Collection not found");
    }

    // Obtener el detalle de la colección
    const { collection } = await getCollectionById(collectionFound.id);

    // Filtrar productos activos y obtener precios y stock
    const activeProducts = collection.products.filter(
      (product: any) => product.statusCode === "ACTIVE"
    );

    const productsWithDetails = await Promise.all(
      activeProducts.map(async (product: any) => {
        let stock = null;
        if (!product.hasVariations && product.skuId) {
          stock = await fetchStockForProduct(product.id, product.skuId);
        }

        if (product.hasVariations) {
          const pricingRanges = await getPriceForVariableProduct(product);
          return { ...product, pricingRanges: [pricingRanges], stock };
        } else {
          const priceData = await fetchPriceForProduct(
            product.id,
            product.skuId
          );
          const price = priceData?.skuPricings?.[0]?.unitPrice || null;
          return { ...product, pricings: [{ amount: price }], stock };
        }
      })
    );

    return (
      <section>
        <Colecciones
          collection={collection}
          collectionProducts={productsWithDetails}
        />
      </section>
    );
  } catch (error) {
    console.error("Error loading collection:", error);
    return (
      <section className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Error al cargar la colección
          </h2>
          <p>Por favor, intenta nuevamente más tarde.</p>
        </div>
      </section>
    );
  }
}
