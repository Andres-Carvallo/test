/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { obtenerOrdenesId } from "@/app/utils/obtenerOrdenesIDBO";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
interface Order {
  [x: string]: any;
  correlative: string;
  // Add other properties as needed
}
export default function DetalleOrdenes() {
  const { id } = useParams();
  const [pedidos, setPedidos] = useState<Order | null>(null);
  const Token = String(getCookie("AdminTokenAuth"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerOrdenesId(id, Token);
        setPedidos(data.order);
        console.log(data.order, "orders");
      } catch (error) {
        console.error("Error al obtener el contacto:", error);
      }
    };
    fetchData();
    return () => {};
  }, [id, Token]);

  if (!pedidos) {
    return <div>Cargando...</div>;
  }
  return (
    <>
      <Breadcrumb pageName="Detalle Orden de Compra" />
      <div className="bg-white dark:bg-black p-4 rounded-lg shadow-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="font-medium">Order number</div>
            <div>#{pedidos.correlative}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <div className="font-medium">Customer</div>
              <div>
                {pedidos.customer.firstname} {pedidos.customer.lastname}
              </div>
              <div className="font-bold">{pedidos.customer.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-medium">Email</div>
            <div>{pedidos.customer.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-medium">Fecha Creación</div>
            <div>{pedidos.creationDate}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-medium">Status</div>
            <div>{pedidos.statusCode}</div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-black p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
          Items
        </h2>
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-strokedark text-left ">
              <th className="py-4">Name</th>
              <th className="py-4">Quantity</th>
              <th className="py-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.items.map((item: any) => (
              <tr
                key={item.id}
                className="border-b dark:border-strokedark"
              >
                <td className="font-medium py-4">{item.sku.product.name}</td>
                <td>{item.quantity}</td>
                <td>${item.unitPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white dark:bg-black p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
          Payment
        </h2>
        <div className="grid gap-4">
          <div className="flex items-center">
            <div>Subtotal</div>
            <div className="ml-auto">${pedidos.totals.netAmount}</div>
          </div>
          <div className="flex items-center">
            <div>Discount</div>
            <div className="ml-auto">-${pedidos.totals.discountAmount}</div>
          </div>
          <hr className="border-t dark:border-strokedark" />
          <div className="flex items-center font-medium">
            <div>Total</div>
            <div className="ml-auto">${pedidos.totals.totalAmount}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button className="px-4 py-2 bg-primary text-white rounded-md">
            Crear PDF
          </button>
        </div>
      </div>
    </>
  );
}
