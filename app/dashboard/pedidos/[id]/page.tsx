"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from "react";
import { obtenerOrdenesId } from "@/app/utils/obtenerOrdenesIDBO";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";
import Loader from "@/components/common/Loader";

interface Order {
  id: string;
  correlative: string;
  statusCode: string;
  creationDate: string;
  currencyCode: {
    code: string;
    name: string;
  };
  customer: {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    commune: {
      name: string;
      region: {
        name: string;
      };
    };
  };
  deliveryType: {
    description: string;
  };
  shippingInfo: {
    addressLine1: string;
    addressLine2?: string;
    commune: {
      name: string;
      region: {
        name: string;
      };
    };
  };
  totals: {
    itemsAmount: number;
    shippingAmount: number;
    discountAmount: number;
    netAmount: number;
    taxAmount: number;
    totalAmount: number;
  };
  items: {
    id: string;
    unitPrice: number;
    quantity: number;
    sku: {
      product: {
        name: string;
        description?: string;
      };
      previewImageUrl?: string;
      mainImageUrl?: string;
    };
  }[];
}

export default function DetalleOrdenes() {
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);
  const [pedido, setPedido] = useState<Order | null>(null);
  const Token = String(getCookie("AdminTokenAuth"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerOrdenesId(id, Token);
        setPedido(data.order);
      } catch (error) {
        console.error("Error al obtener el pedido:", error);
      }
    };
    fetchData();
  }, [id, Token]);

  const handleDownloadPdf = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // Increase the scale to improve resolution
        useCORS: true, // Enable cross-origin images
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4", // Standard A4 size
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate the scale to fit the image within the page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      pdf.addImage(imgData, "PNG", 0, 0, scaledWidth, scaledHeight);
      pdf.save(`order_${pedido?.correlative}.pdf`);
    }
  };

  if (!pedido) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb pageName="Mis Pedidos" />
      <div className="flex justify-between w-full ">
        <Link
          href="/dashboard/pedidos"
          className="px-4 py-2 bg-primary text-white rounded-md mt-4"
        >
          Volver
        </Link>
        <button
          onClick={handleDownloadPdf}
          className="px-4 py-2 bg-primary text-white rounded-md mt-4"
        >
          Descargar PDF
        </button>
      </div>
      <div className="flex items-center w-full justify-center">
        <div
          className="mb-4 p-6 max-w-[900px]"
          ref={printRef}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border p-3 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Pedido</h3>
              <p>N°: {pedido.correlative}</p>
              <p>Fecha: {new Date(pedido.creationDate).toLocaleDateString()}</p>
              <p>Estado: {pedido.statusCode}</p>
            </div>
            <div className="border p-3 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Cliente</h3>
              <p>
                Nombre: {pedido.customer.firstname} {pedido.customer.lastname}
              </p>
              <p>Email: {pedido.customer.email}</p>
              <p>Teléfono: {pedido.customer.phoneNumber}</p>
            </div>
            <div className="border p-3 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Dirección</h3>
              <p>
                {pedido.shippingInfo.addressLine1},{" "}
                {pedido.shippingInfo.addressLine2},{" "}
                {pedido.shippingInfo.commune.name},{" "}
                {pedido.shippingInfo.commune.region.name}
              </p>
            </div>
          </div>
          <div className="rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            {pedido.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center my-2 border p-4 rounded-lg"
              >
                {item.sku.previewImageUrl && (
                  <img
                    src={item.sku.previewImageUrl}
                    alt={item.sku.product.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{item.sku.product.name}</p>
                  <p className="text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-semibold">${item.unitPrice}</p>
              </div>
            ))}
          </div>
          <div className="border p-4 rounded-lg ">
            <div className="flex justify-between mb-2">
              <p>Subtotal</p>
              <p>${pedido.totals.itemsAmount}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Costo Despacho</p>
              <p>${pedido.totals.shippingAmount}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Descuento</p>
              <p>${pedido.totals.discountAmount}</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <p>Total</p>
              <p>${pedido.totals.totalAmount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
