"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import axios from "axios";
import Loader from "@/components/common/Loader"; // Usa tu componente de Loader si es necesario
import Breadcrumb from "@/components/Core/Breadcrumbs/Breadcrumb"; // Usa tu componente de Breadcrumb si es necesario
import Link from "next/link";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Importar los estilos de Quill
import Modal from "@/components/Core/Modals/ModalSeo";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Interfaz del canje (Exchange)
interface ExchangeDetail {
  companyImageUrl: string | undefined;
  product: {
    productPricings: {
      currencyCodeId: string;
      amount: number;
    }[];
  } | null;
  mainImageUrl: any;
  id: string;
  companyName: string;
  name: string;
  description: string;
  extendedDescription: string;
  stock: number;
  creditAmount: number;
}

export default function DetalleCanje() {
  const { id } = useParams(); // Extrae el ID del canje desde la URL
  const [exchange, setExchange] = useState<ExchangeDetail | null>(null);
  const [loadingPurchase, setLoadingPurchase] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "MONEY" | "PIXELCOINS" | null
  >(null);
  const Token = String(getCookie("AdminTokenAuth"));
  const router = useRouter(); // Para redirigir después de la compra

  useEffect(() => {
    const fetchExchange = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/exchanges/${id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setExchange(response.data.exchange);
      } catch (error) {
        console.error("Error al obtener el detalle del canje:", error);
        toast.error("Error al obtener el detalle del canje.");
      }
    };

    fetchExchange();
  }, [id, Token]);

  const handlePurchase = async () => {
    if (!exchange || loadingPurchase || !paymentMethod) return;

    setLoadingPurchase(true); // Indicamos que la compra está en proceso

    try {
      const body = {
        exchangeId: exchange.id,
        paymentMethodCode: paymentMethod,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/exchanges/generations?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (paymentMethod === "MONEY") {
        const orderId = response.data.exchange.orderId;
        const checkoutUrl = `${process.env.NEXT_PUBLIC_CHECKOUT_URL}/order-checkout?orderId=${orderId}`;
        router.push(checkoutUrl);
      } else {
        toast.success(
          "Compra realizada con éxito. Recibirás un correo con la confirmación."
        );
      }

      setLoadingPurchase(false);
      setShowModal(false); // Cerrar el modal después de la compra
    } catch (error: any) {
      console.error("Error en la compra:", error.response?.data || error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
      setLoadingPurchase(false); // Terminamos el proceso de compra
    }
  };

  const openPurchaseModal = (method: "MONEY" | "PIXELCOINS") => {
    setPaymentMethod(method);
    setShowModal(true);
  };

  if (!exchange) {
    return <Loader />; // Muestra un loader mientras se obtienen los datos
  }

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white py-8">
        <div className="mx-auto px-4">
          <div className="flex items-center">
            <Link
              href="/dashboard/tienda-pixelup/"
              className="inline-flex items-center px-4 py-2 bg-white/20 
                       hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal mejorado */}
      <div className=" mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Banner y logo */}
          <div className="relative h-96">
            <img
              src={exchange?.mainImageUrl}
              alt={exchange?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <img
              src={exchange?.companyImageUrl}
              alt={exchange?.companyName}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2
                       w-40 h-40 rounded-2xl border-2 border-gray-50 shadow-md 
                       bg-white object-contain p-2"
            />
          </div>

          {/* Contenido */}
          <div className="p-8 pt-20">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
              {exchange?.name}
            </h1>
            <p className="text-xl text-gray-600 mb-8 text-center">
              {exchange?.companyName}
            </p>

            {/* Stats mejorados - Ajustado para móvil */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl text-center">
                <p className="text-2xl sm:text-3xl font-bold text-rosa mb-1">
                  {exchange?.creditAmount?.toLocaleString("es-CL")}
                </p>
                <p className="text-sm text-gray-600">PixelCoins</p>
              </div>

              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                  {exchange?.product?.productPricings?.[0]?.amount
                    ? `$${exchange.product.productPricings[0].amount.toLocaleString(
                        "es-CL"
                      )}`
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-600">Precio CLP</p>
              </div>

              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                  {exchange?.stock || "Agotado"}
                </p>
                <p className="text-sm text-gray-600">Stock Disponible</p>
              </div>
            </div>

            {/* Botones de acción - Ajustados para móvil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
              <button
                onClick={() => openPurchaseModal("PIXELCOINS")}
                disabled={!exchange?.stock || loadingPurchase}
                className="bg-gray-800 hover:bg-gray-900 text-white py-3 px-6
                          rounded-xl font-medium transition-all duration-300
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transform hover:scale-[1.02]"
              >
                {loadingPurchase ? "Procesando..." : "Canjear con PixelCoins"}
              </button>

              <button
                onClick={() => openPurchaseModal("MONEY")}
                disabled={!exchange?.stock || loadingPurchase}
                className="bg-rosa hover:bg-rosa/90 text-white py-3 px-6
                          rounded-xl font-medium transition-all duration-300
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transform hover:scale-[1.02]"
              >
                {loadingPurchase ? "Procesando..." : "Comprar"}
              </button>
            </div>

            {/* Descripción */}
            <div className="prose max-w-none">
              <ReactQuill
                value={exchange?.extendedDescription}
                readOnly={true}
                theme="bubble"
                className="text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal mejorado */}
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Confirmar {paymentMethod === "MONEY" ? "compra" : "canje"}
          </h2>
          <p className="text-gray-600 mb-6">
            ¿Estás seguro de que deseas{" "}
            {paymentMethod === "MONEY" ? "comprar" : "canjear"}
            este producto?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg
                       text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handlePurchase}
              disabled={loadingPurchase}
              className="px-6 py-2 bg-rosa text-white rounded-lg
                       hover:bg-rosa/90 transition-colors disabled:opacity-50"
            >
              {loadingPurchase ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
