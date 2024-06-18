/* eslint-disable @next/next/no-img-element */

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/common/Loader";

interface Order {
  totals: any;
  id: string;
  correlative: string;
  paymentMethod: string | null;
  statusCode: string;
  creationDate: string;
  customer: {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    commune: {
      name: string;
      region: {
        name: string;
      };
    };
  };
  shippingInfo: {
    addressLine1: string;
    addressLine2: string;
    commune: {
      name: string;
      region: {
        name: string;
      };
    };
  };
  items: {
    id: string;
    unitPrice: number;
    quantity: number;
    sku: {
      previewImageUrl: string;
      product: {
        name: string;
      };
    };
  }[];
  paymentInfo: {
    amount: number;
    authorizationCode: string;
    cardDigits: string;
  };
}

const OrderReceipt: React.FC = () => {
  const { id } = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";

      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/orders/${id}?siteId=${siteId}`
        )
        .then((response) => {
          const data = response.data;
          console.log(data); // Verificar los datos recibidos
          if (data.code === 0) {
            setOrder(data.order);
          } else {
            setError(data.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err); // Verificar el error
          setError("Failed to fetch order details");
          setLoading(false);
        });
    }
  }, [id]);

  function getStatusCodeText(statusCode: string) {
    switch (statusCode) {
      case "PAYMENT_COMPLETED":
        return "Pagado";
      case "PAYMENT_PENDING":
        return "Pendiente de pago";
      case "PAYMENT_FAILED":
        return "Pago fallido";
      default:
        return "Estado desconocido";
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="text-center">Order not found</div>;
  }

  return (
    <div className=" mx-auto flex w-full justify-center items-center  bg-gradient-to-r from-primary/90 from-10% via-primary/60 via-30% to-primary/90 to-90%">
      <div
        className="max-w-6xl mx-auto px-10 bg-white shadow-md rounded-md my-20 py-10"
        id="order-receipt"
      >
        <h1 className="text-3xl font-bold text-center text-primary">
          Detalle de tu Orden
        </h1>
        <p className="text-center mb-12">Gracias por comprar con nostros!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="border p-4 rounded-md ">
            <h2 className="text-lg font-semibold mb-4">Order Info</h2>

            <p>
              <strong>Creation Date:</strong>{" "}
              {new Date(order.creationDate).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {getStatusCodeText(order.statusCode)}
            </p>
            {order.paymentMethod && (
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
            )}
          </div>
          <div className="border p-4 rounded-md ">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <p>
              <strong>Name:</strong> {order.customer.firstname}{" "}
              {order.customer.lastname}
            </p>
            <p>
              <strong>Email:</strong> {order.customer.email}
            </p>
            <p>
              <strong>Phone number:</strong> {order.customer.phoneNumber}
            </p>
          </div>
          <div className="border p-4 rounded-md ">
            <h2 className="text-lg font-semibold mb-4">Address</h2>
            <p>
              <strong>Shipping Address:</strong>{" "}
              {order.shippingInfo.addressLine1},{" "}
              {order.shippingInfo.addressLine2}
            </p>
            <p>
              <strong>Commune:</strong> {order.shippingInfo.commune.name},{" "}
              {order.shippingInfo.commune.region.name}
            </p>
          </div>
        </div>

        <div className="border p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Items in your Shopping Cart
          </h2>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4"
            >
              <div className="flex items-center">
                <img
                  src={item.sku.previewImageUrl}
                  alt={item.sku.product.name}
                  className="w-16 h-16 object-cover rounded-md shadow-md mr-4"
                />
                <div>
                  <p className="font-semibold">{item.sku.product.name}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="text-purple-700 font-semibold">
                ${item.unitPrice.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border p-4 rounded-md mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold">Subtotal:</p>
            <p className="text-lg">${order.totals.itemsAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold">Shipping Charge:</p>
            <p className="text-lg">${order.totals.shippingAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold">Taxes:</p>
            <p className="text-lg">${order.totals.taxAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold">Discount:</p>
            <p className="text-lg">${order.totals.discountAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">Total:</p>
            <p className="text-xl font-bold text-purple-700">
              ${order.totals.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <button className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default OrderReceipt;
