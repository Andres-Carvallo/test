"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import axios from "axios";
import Loader from "@/components/common/Loader"; // Usa tu componente de Loader si es necesario
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"; // Usa tu componente de Breadcrumb si es necesario
import Link from "next/link";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Importar los estilos de Quill
import Modal from "@/components/Modals/ModalSeo";

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
        const checkoutUrl = `${process.env.NEXT_PUBLIC_PIXELUP_URL}/order-checkout?orderId=${orderId}`;
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

      // Mostrar el error en un toast y cerrar el modal
      toast.error(`${error.response?.data?.message || error.message}`);
      setLoadingPurchase(false); // Terminamos el proceso de compra
      setShowModal(false); // Cerrar el modal en caso de error
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
    <>
      <title>{exchange.name}</title>
      <section className="p-10">
        <Breadcrumb pageName="Detalle del Canje" />
        <div className="flex justify-between w-full mb-4">
          <Link
            href="/dashboard/tienda-pixelup/"
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Volver
          </Link>
        </div>

        {/* Detalle del Canje con estilo de portada */}
        <div className="max-w-[900px] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Imagen principal tipo banner */}
          <div className="relative">
            {exchange.mainImageUrl ? (
              <img
                src={exchange.mainImageUrl}
                alt={exchange.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500">Imagen no disponible</p>
              </div>
            )}

            {/* Imagen de la compañía en formato circular */}
            {exchange.companyImageUrl ? (
              <img
                src={exchange.companyImageUrl}
                alt={exchange.companyName}
                className="absolute -bottom-12 left-6 w-36 h-36 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500">Imagen no disponible</p>
              </div>
            )}
          </div>

          {/* Información del canje */}
          <div className="p-6 pt-16">
            <h1 className="text-3xl font-bold mb-4 text-center">
              {exchange.name || "Nombre no disponible"}
            </h1>

            {/* Destacar Créditos y Precio */}
            <div className="flex justify-around mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-rosa">
                  {exchange.creditAmount !== undefined
                    ? exchange.creditAmount.toLocaleString("es-CL")
                    : "N/A"}
                </h2>
                <p className="text-gray-700">PixelCoins</p>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                  {exchange.stock > 0 ? exchange.stock : "Agotado"}
                </h2>
                <p className="text-gray-700">Stock</p>
              </div>
              {exchange.product?.productPricings &&
              exchange.product.productPricings.length > 0 ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-rosa">
                    $
                    {exchange.product.productPricings[0].amount.toLocaleString(
                      "es-CL"
                    )}
                  </h2>
                  <p className="text-gray-700">Precio CLP</p>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-500">N/A</h2>
                  <p className="text-gray-700">Precio no disponible</p>
                </div>
              )}
            </div>

            {/* Botones de compra */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                {/* Botón para canjear con PixelCoins */}
                <button
                  className={`bg-dark w-full hover:bg-rosa text-white py-2 px-4 rounded-md ${
                    exchange.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => openPurchaseModal("PIXELCOINS")}
                  disabled={exchange.stock === 0 || loadingPurchase}
                >
                  {loadingPurchase ? "Procesando..." : "Canjear con PixelCoins"}
                </button>
              </div>

              <div>
                {/* Botón para comprar con dinero */}
                <button
                  className={`bg-dark w-full hover:bg-rosa text-white py-2 px-4 rounded-md ${
                    exchange.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => openPurchaseModal("MONEY")}
                  disabled={exchange.stock === 0 || loadingPurchase}
                >
                  {loadingPurchase ? "Procesando..." : "Comprar"}
                </button>
              </div>
            </div>

            {/* Descripción extendida */}
            <div className="mt-10 px-4 pb-6">
              {exchange.extendedDescription ? (
                <ReactQuill
                  value={exchange.extendedDescription}
                  readOnly={true}
                  theme="bubble"
                  className="text-gray-700 mt-2"
                />
              ) : (
                <p className="text-gray-500">
                  Descripción extendida no disponible
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal de confirmación */}
        <Modal
          showModal={showModal}
          onClose={() => setShowModal(false)}
        >
          <h2 className="text-xl font-semibold mb-4">
            Confirmar compra con{" "}
            {paymentMethod === "MONEY" ? "dinero" : "PixelCoins"}
          </h2>
          <p className="mb-6">
            ¿Estás seguro de que deseas realizar esta compra?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
            <button
              className="bg-rosa text-white py-2 px-4 rounded-md"
              onClick={handlePurchase}
              disabled={loadingPurchase}
            >
              {loadingPurchase ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </Modal>
      </section>
    </>
  );
}
