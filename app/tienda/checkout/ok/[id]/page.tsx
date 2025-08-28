/* eslint-disable @next/next/no-img-element */

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/common/Loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { useLogo } from "@/context/LogoContext";

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
      id: any;
      mainImageUrl: string;
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
  deliveryType?: {
    code: string;
  };
}

const OrderReceipt: React.FC = () => {
  const { id } = useParams();
  const { logo } = useLogo();
  const [attributesMap, setAttributesMap] = useState<{ [key: string]: any }>(
    {}
  );

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const imagePath = logo?.mainImage?.url || process.env.NEXT_PUBLIC_LOGO_COLOR;
  const handleDownloadPdf = async () => {
    const buttonElement = document.getElementById("download-button");
    if (buttonElement) {
      buttonElement.style.display = "none"; // Oculta el botón
    }

    if (printRef.current) {
      // Crear una copia del elemento para aplicar estilos específicos para PDF
      const element = printRef.current.cloneNode(true) as HTMLElement;
      
      // Aplicar estilos inline para evitar colores oklch
      const style = document.createElement('style');
      style.textContent = `
        * {
          color: #000000 !important;
          background-color: #ffffff !important;
          border-color: #d1d5db !important;
        }
        .bg-primary {
          background-color: #3b82f6 !important;
        }
        .text-white {
          color: #ffffff !important;
        }
        .text-gray-500 {
          color: #6b7280 !important;
        }
        .text-gray-700 {
          color: #374151 !important;
        }
        .bg-gray-200 {
          background-color: #e5e7eb !important;
        }
        .text-gray-400 {
          color: #9ca3af !important;
        }
        .text-primary {
          color: #3b82f6 !important;
        }
      `;
      element.appendChild(style);
      
      // Agregar temporalmente al DOM
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
      document.body.appendChild(element);
      
      try {
        const canvas = await html2canvas(element, {
          useCORS: true, // Permite imágenes de origen cruzado
          allowTaint: true,
          backgroundColor: '#ffffff',
        });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4", // Tamaño estándar A4
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calcula la escala para ajustar la imagen dentro de la página
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

              pdf.addImage(imgData, "PNG", 0, 0, scaledWidth, scaledHeight);
        pdf.save(`Orden_Número_${order?.correlative}.pdf`);
      } finally {
        // Limpiar el elemento temporal
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }

      if (buttonElement) {
        buttonElement.style.display = "block"; // Vuelve a mostrar el botón
      }
    }
  };

  const fetchAttributesForItems = async (items: any) => {
    const attributesData: { [key: string]: any } = {};
    for (const item of items) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products/${item.sku.product.id}/skus/${item.sku.id}/attributes?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
        );
        attributesData[item.sku.id] = response.data.skuAttributes.map(
          (attr: any) => ({
            name: attr.attribute.name,
            value: attr.value,
          })
        );
      } catch (error) {
        console.error(
          `Error al obtener atributos para el SKU ${item.sku.id}:`,
          error
        );
      }
    }
    setAttributesMap(attributesData);
  };

  useEffect(() => {
    if (id) {
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";

      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/orders/${id}?siteId=${siteId}`
        )
        .then((response) => {
          const data = response.data;
          if (data.code === 0) {
            setOrder(data.order);
            fetchAttributesForItems(data.order.items); // Llama a la función para obtener atributos
          } else {
            setError(data.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("No se pudo obtener los detalles de la orden");
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
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-gray-100">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar la orden</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Orden no encontrada</h2>
          <p className="text-gray-600 mb-4">No se pudo encontrar la orden solicitada. Verifica que el enlace sea correcto.</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Detalle Orden</title>
      <div className="mx-auto flex w-full justify-center items-center bg-gray-100">
        <div
          className="max-w-6xl mx-auto px-10 bg-white shadow-md rounded-md my-20 py-10"
          id="order-receipt"
          ref={printRef}
        >
          <div className="flex justify-end print:hidden">
            <button
              id="download-button" // Añade un id al botón
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-primary text-white rounded-md mt-4"
            >
              Descargar PDF
            </button>
          </div>
          <div className="text-center mt-6 mb-6">
            <img
              src={imagePath}
              alt="Logo"
              className="mx-auto max-h-40"
            />
          </div>
          <h1 className="text-3xl font-bold text-center text-primary">
            Detalle de tu Orden
          </h1>
          <p className="text-center mb-12">
            ¡Gracias por comprar con nosotros!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="border p-4 rounded-md ">
              <h2 className="text-lg font-semibold mb-4">
                Información de la Orden
              </h2>
              <p>
                <strong>N° Orden:</strong> {order.correlative}
              </p>
              <p>
                <strong>Fecha de Creación:</strong>{" "}
                {new Date(order.creationDate).toLocaleString()}
              </p>
              <p>
                <strong>Estado:</strong> {getStatusCodeText(order.statusCode)}
              </p>

              {order.paymentMethod && (
                <p>
                  <strong>Método de Pago:</strong> {order.paymentMethod}
                </p>
              )}
            </div>
            <div className="border p-4 rounded-md ">
              <h2 className="text-lg font-semibold mb-4">Cliente</h2>
              <p>
                <strong>Nombre:</strong> {order.customer.firstname}{" "}
                {order.customer.lastname}
              </p>
              <p>
                <strong>Email:</strong> {order.customer.email}
              </p>
              <p>
                <strong>Número de Teléfono:</strong>{" "}
                {order.customer.phoneNumber}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <div className="border p-4 rounded-md ">
              <h2 className="text-lg font-semibold mb-4">
                {order.deliveryType?.code === "WITHDRAWAL_FROM_STORE" 
                  ? "Retiro en Tienda" 
                  : "Dirección de Envío"}
              </h2>
              {order.deliveryType?.code === "WITHDRAWAL_FROM_STORE" ? (
                <>
                  <h3 className="text-lg font-medium text-gray-500 mb-2 ">Dirección de Facturación:</h3>
                  <p>
                    <strong>Dirección:</strong> {order.customer.addressLine1}
                    {order.customer.addressLine2 && `, ${order.customer.addressLine2}`}
                  </p>
                  <p>
                    <strong>Comuna:</strong> {order.customer.commune.name},{" "}
                    {order.customer.commune.region.name}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Dirección:</strong>{" "}
                    {order.shippingInfo.addressLine1}
                    {order.shippingInfo.addressLine2 && `, ${order.shippingInfo.addressLine2}`}
                  </p>
                  <p>
                    <strong>Comuna:</strong> {order.shippingInfo.commune.name},{" "}
                    {order.shippingInfo.commune.region.name}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="border p-4 rounded-md mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Artículos en tu Carrito de Compras
            </h2>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col rounded-lg sm:flex-row sm:items-center my-4 border border-gray-300 pb-4 p-4"
              >
                                 {/* Imagen del producto */}
                 <div className="sm:w-24 w-full mb-4 sm:mb-0 sm:mr-4 flex justify-center">
                   {item.sku.mainImageUrl ? (
                     <img
                       src={item.sku.mainImageUrl}
                       alt={item.sku.product.name}
                       className="w-16 h-16 object-cover rounded-lg"
                       onError={(e) => {
                         e.currentTarget.style.display = 'none';
                         e.currentTarget.nextElementSibling?.classList.remove('hidden');
                       }}
                     />
                   ) : null}
                   <div className={`w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center ${item.sku.mainImageUrl ? 'hidden' : ''}`}>
                     <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                   </div>
                 </div>

                {/* Información del producto */}
                <div className="flex-1">
                  <p className="font-semibold text-lg">
                    {item.sku.product.name}
                  </p>

                  {/* Mostrar atributos si existen */}
                  {attributesMap[item.sku.id]?.length > 0 ? (
                    <ul className="text-gray-500 space-y-1">
                      {attributesMap[item.sku.id].map((attribute: any) => (
                        <li
                          key={attribute.name}
                          className="text-sm"
                        >
                          {attribute.name}:{" "}
                          <span className="font-semibold text-gray-700">
                            {attribute.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Sin atributos</p>
                  )}
                </div>

                {/* Precio del producto */}
                <div className="mt-4 sm:mt-0 sm:ml-4 text-right">
                  <p className="text-gray-500 mb-2">
                    Cantidad: {item.quantity}
                  </p>
                  <p className="font-semibold text-lg">
                    ${item.unitPrice.toLocaleString("es-CL")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border p-4 rounded-md mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-semibold">Subtotal:</p>
              <p className="text-lg">
                ${order.totals.itemsAmount.toLocaleString("es-CL")}
              </p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-semibold">Envío:</p>
              <p className="text-lg">
                ${order.totals.shippingAmount.toLocaleString("es-CL")}
              </p>
            </div>
            {/* <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold">Impuestos:</p>
            <p className="text-lg">
              ${order.totals.taxAmount.toLocaleString("es-CL")}
            </p>
          </div> */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-semibold">Descuento:</p>
              <p className="text-lg">
                ${order.totals.discountAmount.toLocaleString("es-CL")}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold">Total:</p>
              <p className="text-xl font-bold ">
                ${order.totals.totalAmount.toLocaleString("es-CL")}
              </p>
            </div>
          </div>

          {/*         <button className="bg-blue-500 hidden text-white p-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none">
          Descargar PDF
        </button> */}
        </div>
      </div>
    </>
  );
};

export default OrderReceipt;
