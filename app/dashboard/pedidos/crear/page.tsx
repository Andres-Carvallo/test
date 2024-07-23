"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { obtenerProductosBO } from "@/app/utils/obtenerProductosBO";
import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  hasVariations: boolean;
}

interface Variation {
  id: string;
  description: string;
}

interface Region {
  id: string;
  name: string;
}

interface Commune {
  id: string;
  name: string;
}

interface Order {
  currencyCodeId: string;
  deliveryTypeId: string;
  useDifferentShippingAddress: boolean;
  customer: {
    firstname: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    communeId: string;
  };
  shippingInfo?: {
    addressLine1: string;
    addressLine2: string;
    communeId: string;
  };
  items: {
    skuId: string;
    quantity: number;
  }[];
}

interface SelectedItem {
  skuId: string;
  name: string;
  quantity: number;
}

const ManualOrder = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [shippingCommunes, setShippingCommunes] = useState<Commune[]>([]);
  const [order, setOrder] = useState<Order>({
    currencyCodeId: "8ccc1abd-b35b-45ff-b814-b7c78fff3594",
    deliveryTypeId: "157314a8-f3c3-4489-9f1f-b240a3c209b6",
    useDifferentShippingAddress: false,
    customer: {
      firstname: "",
      lastname: "",
      phoneNumber: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      communeId: "",
    },
    shippingInfo: {
      addressLine1: "",
      addressLine2: "",
      communeId: "",
    },
    items: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const token = getCookie("AdminTokenAuth");
      const data = await obtenerProductosBO(1, 50, token as string);
      setProducts(data.products);
    };
    fetchProducts();
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const Pais = "CL";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/countries/${Pais}/regions`
      );
      setRegions(response.data.regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      toast.error("Error al obtener las regiones.");
    }
  };

  const fetchCommunes = async (regionId: string, forShipping = false) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const Pais = "CL";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/countries/${Pais}/regions/${regionId}/communes?hasShippingZones=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (forShipping) {
        setShippingCommunes(response.data.communes);
      } else {
        setCommunes(response.data.communes);
      }
    } catch (error) {
      console.error("Error fetching communes:", error);
      toast.error("Error al obtener las comunas.");
    }
  };

  const handleProductChange = async (productId: string) => {
    const selected = products.find((p) => p.id === productId) || null;
    setSelectedProduct(selected);
    if (selected && selected.hasVariations) {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus?statusCode=ACTIVE&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setVariations(response.data.skus);
    } else {
      setVariations([]);
    }
  };

  const handleAddItem = (skuId: string, name: string) => {
    const existingItem = selectedItems.find((item) => item.skuId === skuId);
    if (!existingItem) {
      setSelectedItems([...selectedItems, { skuId, name, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (skuId: string, quantity: string) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.skuId === skuId ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = getCookie("AdminTokenAuth");

    const orderToSubmit = {
      ...order,
      items: selectedItems.map((item) => ({
        skuId: item.skuId,
        quantity: item.quantity,
      })),
    };

    if (!order.useDifferentShippingAddress) {
      const { shippingInfo, ...orderWithoutShippingInfo } = orderToSubmit;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/orders`,
        orderWithoutShippingInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/orders`,
        orderToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    try {
      toast.success("Order submitted successfully");
    } catch (error) {
      toast.error("Error submitting order");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Create Manual Order</h1>
      <form
        onSubmit={handleOrderSubmit}
        className="space-y-6"
      >
        <section>
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setOrder({
                  ...order,
                  customer: {
                    ...order.customer,
                    firstname: e.target.value,
                  },
                })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setOrder({
                  ...order,
                  customer: {
                    ...order.customer,
                    lastname: e.target.value,
                  },
                })
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setOrder({
                  ...order,
                  customer: {
                    ...order.customer,
                    phoneNumber: e.target.value,
                  },
                })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setOrder({
                  ...order,
                  customer: { ...order.customer, email: e.target.value },
                })
              }
            />
            <input
              type="text"
              placeholder="Address Line 1"
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setOrder({
                  ...order,
                  customer: {
                    ...order.customer,
                    addressLine1: e.target.value,
                  },
                })
              }
            />
            <input
              type="text"
              placeholder="Address Line 2"
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setOrder({
                  ...order,
                  customer: {
                    ...order.customer,
                    addressLine2: e.target.value,
                  },
                })
              }
            />
            <select
              className="border rounded p-2 w-full"
              onChange={(e) => fetchCommunes(e.target.value)}
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option
                  key={region.id}
                  value={region.id}
                >
                  {region.name}
                </option>
              ))}
            </select>
            <select
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setOrder({
                  ...order,
                  customer: { ...order.customer, communeId: e.target.value },
                })
              }
            >
              <option value="">Select Commune</option>
              {communes.map((commune) => (
                <option
                  key={commune.id}
                  value={commune.id}
                >
                  {commune.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={order.useDifferentShippingAddress}
              onChange={(e) =>
                setOrder({
                  ...order,
                  useDifferentShippingAddress: e.target.checked,
                })
              }
            />
            <span>Use different shipping address</span>
          </label>
          {order.useDifferentShippingAddress && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="Shipping Address Line 1"
                className="border rounded p-2 w-full"
                onChange={(e) =>
                  setOrder({
                    ...order,
                    shippingInfo: {
                      ...order.shippingInfo,
                      addressLine1: e.target.value,
                    } as any,
                  })
                }
              />
              <input
                type="text"
                placeholder="Shipping Address Line 2"
                className="border rounded p-2 w-full"
                onChange={(e) =>
                  setOrder({
                    ...order,
                    shippingInfo: {
                      ...order.shippingInfo,
                      addressLine2: e.target.value,
                    } as any,
                  })
                }
              />
              <select
                className="border rounded p-2 w-full"
                onChange={(e) => fetchCommunes(e.target.value, true)}
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option
                    key={region.id}
                    value={region.id}
                  >
                    {region.name}
                  </option>
                ))}
              </select>
              <select
                className="border rounded p-2 w-full"
                onChange={(e) =>
                  setOrder({
                    ...order,
                    shippingInfo: {
                      ...order.shippingInfo,
                      communeId: e.target.value,
                    } as any,
                  })
                }
              >
                <option value="">Select Commune</option>
                {shippingCommunes.map((commune) => (
                  <option
                    key={commune.id}
                    value={commune.id}
                  >
                    {commune.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-2 gap-4">
            <select
              className="border rounded p-2 w-full"
              onChange={(e) => handleProductChange(e.target.value)}
            >
              <option value="">Select a Product</option>
              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              ))}
            </select>
            {selectedProduct && selectedProduct.hasVariations && (
              <select
                className="border rounded p-2 w-full"
                onChange={(e) =>
                  handleAddItem(
                    e.target.value,
                    variations.find((v) => v.id === e.target.value)
                      ?.description || ""
                  )
                }
              >
                <option value="">Select a Variation</option>
                {variations.map((variation) => (
                  <option
                    key={variation.id}
                    value={variation.id}
                  >
                    {variation.description}
                  </option>
                ))}
              </select>
            )}
            {!selectedProduct ||
              (!selectedProduct.hasVariations && (
                <button
                  type="button"
                  className="bg-blue-500 text-white rounded p-2"
                  onClick={() =>
                    handleAddItem(
                      selectedProduct?.id || "",
                      selectedProduct?.name || ""
                    )
                  }
                >
                  Add Product
                </button>
              ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Selected Items</h2>
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <div
                key={item.skuId}
                className="flex items-center space-x-4"
              >
                <span>{item.name}</span>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  className="border rounded p-2 w-20"
                  onChange={(e) =>
                    handleQuantityChange(item.skuId, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          className="bg-green-500 text-white rounded p-2 w-full"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default ManualOrder;
