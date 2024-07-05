import axios from "axios";
import { getCookie } from "cookies-next";

const token = String(getCookie("AdminTokenAuth"));

const getWarehouseId = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/warehouses?pageNumber=1&pageSize=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response.data &&
      response.data.warehouses &&
      response.data.warehouses.length > 0
    ) {
      return response.data.warehouses[0].id; // Devuelve el id del primer almacén
    } else {
      console.error("No se encontraron almacenes.");
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo almacén:", error);
    return null;
  }
};

const getInventoryId = async (id: any, skuId: any, warehouseId: any) => {
  try {
    const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${id}/skus/${skuId}/inventories?siteId=${SiteId}&warehouseId=${warehouseId}`
    );
    if (
      response.data &&
      response.data.skuInventories &&
      response.data.skuInventories.length > 0
    ) {
      return response.data.skuInventories[0].id;
    } else {
      console.error(
        "No se encontraron inventarios para el SKU en el almacén especificado."
      );
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo inventoryId:", error);
    return null;
  }
};

export const handleStockSku = async (
  id: any,
  skuId: any,
  quantity: any,
  minimumQuantity: any
) => {
  try {
    const warehouseId = await getWarehouseId();
    if (!warehouseId) {
      console.error("No warehouse ID found.");
      return;
    }

    const inventoryId = await getInventoryId(id, skuId, warehouseId);

    let response;
    if (inventoryId) {
      // Realizar PUT si existe inventoryId
      response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/inventories/${inventoryId}`,
        {
          warehouseId: warehouseId,
          quantity: quantity,
          minimumQuantity: minimumQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      // Realizar POST si no existe inventoryId
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus/${skuId}/inventories`,
        {
          warehouseId: warehouseId,
          quantity: quantity,
          minimumQuantity: 5,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (response.status >= 200 && response.status < 300) {
      console.log("Stock updated successfully");
    } else {
      console.error("Error updating stock:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending request:", error);
  }
};
