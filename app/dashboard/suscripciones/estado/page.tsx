/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loader from "@/components/common/Loader";

interface SubscriptionData {
  id: string;
  name: string;
  description: string;
  statusCode: string;
  startDate: Date;
  endDate: Date;
}

interface SubscriptionResponse {
  subscriptions: SubscriptionData[];
  totalRecords: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  productType: {
    id: string;
    code: string;
    name: string;
  };
  productPricings: Array<{
    amount: number;
  }>;
  projectType: {
    id: string;
    name: string;
    description: string | null;
  };
}

const RenovarSuscripcion = () => {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [renewalOptions, setRenewalOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const token = getCookie("AdminTokenAuth");

  // Función para obtener la suscripción
  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/subscriptions?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Respuesta de suscripciones:", response.data);

      // Asumimos que queremos la primera suscripción activa
      const activeSubscription = response.data.subscriptions.find(
        (sub: SubscriptionData) => sub.statusCode === "ACTIVE"
      );

      if (activeSubscription) {
        setSubscriptionData(activeSubscription);
        // Usar este ID para la renovación
        console.log(
          "ID de suscripción para renovación:",
          activeSubscription.id
        );
      }
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      setError("Error al obtener la suscripción.");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener las opciones de renovación
  const fetchRenewalOptions = async () => {
    if (!subscriptionData?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/subscriptions/${subscriptionData.id}/renewals/products?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Verificar si el producto individual existe y no está en el array de productos
      const productsArray: Product[] = response.data.products || [];
      const singleProduct: Product | null = response.data.product || null;

      const allProducts =
        singleProduct &&
        !productsArray.some((p: Product) => p.id === singleProduct.id)
          ? [singleProduct, ...productsArray]
          : productsArray;

      setRenewalOptions(allProducts);
      console.log(allProducts, "renewalOptions");
    } catch (err) {
      console.error("Error fetching renewal options:", err);
      setError("Error al obtener las opciones de renovación.");
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la selección de un producto
  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId);
  };

  // Función para generar la renovación
  const handleRenewSubscription = async () => {
    if (!selectedProduct || !subscriptionData?.id) {
      alert("Por favor selecciona una opción de renovación.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/subscriptions/${subscriptionData.id}/renewals`,
        {
          productId: selectedProduct,
          currencyCodeId: "8ccc1abd-b35b-45ff-b814-b7c78fff3594",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Obtener el ID de la orden de la respuesta
      const orderId = response.data.subscription.orderId;

      // Construir la URL de redirección según el entorno
      const orderUrl = `${process.env.NEXT_PUBLIC_PIXELUP_URL}/order-checkout?orderId=${orderId}`;

      // Redirigir al usuario a la página de pago
      window.location.href = orderUrl;
    } catch (error) {
      console.error("Error al renovar la suscripción:", error);
    }
  };

  useEffect(() => {
    fetchSubscription();
    // Solo llamar a fetchRenewalOptions cuando tengamos el subscriptionData
  }, [token]);

  useEffect(() => {
    if (subscriptionData?.id) {
      fetchRenewalOptions();
    }
  }, [subscriptionData]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white py-8">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px_16px]"></div>
        <div className="relative mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100 animate-fade-in">
              Renueva Tu Suscripción
            </h1>
            <p className="text-base text-gray-100 max-w-2xl mx-auto leading-relaxed opacity-90 animate-fade-in-up">
              Mantén activos todos los beneficios de tu suscripción PixelUp
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center   bg-gray-100">
        <div className="p-6 mt-10">
          <h1 className="text-xl font-bold mb-4">Suscripción Actual</h1>
          {subscriptionData ? (
            <div className="bg-gray-50 p-4 rounded-xl shadow">
              <p>
                <strong>Nombre:</strong> {subscriptionData.name}
              </p>

              <p>
                <strong>Estado:</strong> {subscriptionData.statusCode}
              </p>
              <p>
                <strong>Fecha de inicio:</strong>{" "}
                {new Date(subscriptionData.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Fecha de fin:</strong>{" "}
                {new Date(subscriptionData.endDate).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p>No se encontró información de la suscripción.</p>
          )}

          <h1 className="text-xl font-bold mt-10">Opciones de Renovación</h1>
          <h2 className="text-sm  mb-4">
            Elige la opción que mejor se ajuste a tus necesidades
          </h2>
          {renewalOptions.length > 0 ? (
            <ul className="pt-6">
              {renewalOptions.map((product: any) => (
                <li
                  key={product.id}
                  className="border-b last:border-0 py-4 mb-4 flex justify-between items-center cursor-pointer rounded-xl hover:bg-gray-100 p-6 bg-gray-50  shadow"
                  onClick={() => handleSelectProduct(product.id)} // Hace clickeable todo el <li>
                >
                  <label
                    htmlFor={product.id}
                    className="flex flex-col flex-grow cursor-pointer mx-4" // Flex para hacer que el contenido crezca y ocupe todo el espacio
                  >
                    <p className="font-bold text-md">{product.name}</p>

                    <p className=" font-bold text-rosa">
                      {product.productPricings[0]?.amount
                        ? product.productPricings[0].amount.toLocaleString(
                            "es-CL",
                            { style: "currency", currency: "CLP" }
                          )
                        : "N/A"}
                    </p>
                  </label>
                  <input
                    type="radio"
                    id={product.id}
                    name="renewalOption"
                    className="w-6 h-6 ml-4" // Tamaño del radio button y margen izquierdo
                    value={product.id}
                    checked={selectedProduct === product.id}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay opciones de renovación disponibles.</p>
          )}

          <div className="flex justify-center mb-20">
            <button
              onClick={handleRenewSubscription}
              className="mt-4 bg-dark px-4 py-2 text-white p-2 rounded hover:scale-105 transition-all"
            >
              Confirmar Renovación
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RenovarSuscripcion;
