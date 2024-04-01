import axios from "axios";

export const obtenerProductos = async (
  SiteId: any,
  PageNumber: any,
  PageSize: any
) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products?siteId=${SiteId}&pageNumber=${PageNumber}&pageSize=${PageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario: " + error);
    throw error;
  }
};
