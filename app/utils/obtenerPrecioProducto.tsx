import axios from "axios";

export async function obtenerPrecioProducto(
  productId: string,
  SiteId: string
): Promise<number | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${productId}/pricings?siteId=${SiteId}`
    );
    const { productPricings } = response.data;
    // Verifica si hay al menos un precio de producto disponible
    if (productPricings.length > 0) {
      // Tomamos el primer precio disponible
      const { unitPrice } = productPricings[0];
      return unitPrice;
    } else {
      // Si no hay precios disponibles, devolvemos null
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el precio del producto:", error);
    return null;
  }
}
