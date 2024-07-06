/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useAPI } from "@/app/Context/ProductTypeContext";
import { getCookie } from "cookies-next";
import { obtenerPedidos } from "@/app/utils/obtenerPedidos";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

function PedidosBO() {
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const { setPedidos, pedidos } = useAPI();

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  const toggleActionsDropdown = () => {
    setActionsDropdownVisible(!actionsDropdownVisible);
  };

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status: any) => {
    setStatusFilter(status);
  };

  const fetchPedidos = async (PageNumber: any, PageSize: any) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const data = await obtenerPedidos(PageNumber, PageSize, token);
      setPedidos(data.orders);
      setTotalOrders(data.orders.length); // Asumiendo que la API devuelve el total de pedidos
      console.log(data.orders.length, "orders");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Ocurrió un error:", error.message);
      } else {
        console.error("Ocurrió un error desconocido:", error);
      }
    }
  };

  useEffect(() => {
    fetchPedidos(pageNumber, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize]); // Ejecutar cada vez que cambie pageNumber o pageSize

  const statusMap = {
    PAYMENT_PENDING: "Pendiente de pago",
    PAYMENT_COMPLETED: "Pagado",
    CREATED: "Creada",
    // Agrega más estados aquí si es necesario
  };

  const filteredPedidos = pedidos.filter((pedido: any) => {
    const matchesStatus = statusFilter
      ? pedido.statusCode === statusFilter
      : true;
    const matchesSearch = searchTerm
      ? pedido.customer.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        pedido.correlative.toString().includes(searchTerm)
      : true;
    return matchesStatus && matchesSearch;
  });

  const handlePageChange = (newPageNumber: any) => {
    setPageNumber(newPageNumber);
  };

  return (
    <section>
      <Breadcrumb pageName="Mis Pedidos" />
      <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 relative">
        <div className="mx-auto max-w-screen-xl px-2 lg:px-12">
          {/* Start coding here */}
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label
                    htmlFor="simple-search"
                    className="sr-only"
                  >
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Busca por Email o N° de Pedido"
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    id="filterDropdownButton"
                    onClick={toggleFilterDropdown}
                    className="w-full md:w-auto flex items-center justify-center py-2 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="h-4 w-4 mr-2 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Filter
                    <svg
                      className="-mr-1 ml-1.5 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </button>
                  <div
                    id="filterDropdown"
                    className={`z-10 ${
                      filterDropdownVisible ? "block" : "hidden"
                    } w-48 p-3 absolute top-16 right-0 bg-white rounded-lg shadow dark:bg-gray-700`}
                  >
                    <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                      Filtrar por estado
                    </h6>
                    <ul
                      className="space-y-2 text-sm"
                      aria-labelledby="filterDropdownButton"
                    >
                      <li className="flex items-center">
                        <input
                          id="all"
                          type="checkbox"
                          checked={statusFilter === ""}
                          onChange={() => handleStatusFilterChange("")}
                          className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="all"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Todos
                        </label>
                      </li>
                      <li className="flex items-center">
                        <input
                          id="payment_completed"
                          type="checkbox"
                          checked={statusFilter === "PAYMENT_COMPLETED"}
                          onChange={() =>
                            handleStatusFilterChange("PAYMENT_COMPLETED")
                          }
                          className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="payment_completed"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Pagado
                        </label>
                      </li>
                      <li className="flex items-center">
                        <input
                          id="payment_pending"
                          type="checkbox"
                          checked={statusFilter === "PAYMENT_PENDING"}
                          onChange={() =>
                            handleStatusFilterChange("PAYMENT_PENDING")
                          }
                          className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="payment_pending"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Pendiente de pago
                        </label>
                      </li>
                      <li className="flex items-center">
                        <input
                          id="created"
                          type="checkbox"
                          checked={statusFilter === "CREATED"}
                          onChange={() => handleStatusFilterChange("CREATED")}
                          className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="created"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Creada
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-3 min-w-10 text-center"
                    >
                      N°
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 max-w-16"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3"
                    >
                      Cliente
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 max-w-16"
                    >
                      Tipo Delivery
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3"
                    >
                      Monto
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPedidos.map((pedido: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b dark:border-gray-700"
                    >
                      {/* Detalles de cada producto */}

                      <td className="px-2 py-3 flex items-center justify-center align-middle  text-center">
                        {pedido.correlative}
                      </td>
                      <td className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white min-w-16">
                        {new Date(pedido.creationDate).toLocaleDateString(
                          "es-ES",
                          {
                            year: "2-digit",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </td>
                      <td className="px-2 py-3 max-w-20">
                        <div className="flex flex-col ">
                          <div className=" overflow-hidden whitespace-nowrap overflow-ellipsis">
                            {pedido.customer.firstname}{" "}
                            {pedido.customer.lastname}
                          </div>
                          <div className="font-bold overflow-hidden whitespace-nowrap overflow-ellipsis">
                            {pedido.customer.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3 max-w-20">
                        {pedido.deliveryType.code === "HOME_DELIVERY"
                          ? "Delivery"
                          : "Retiro en Tienda"}
                      </td>

                      <td className="px-2 py-3">
                        {new Intl.NumberFormat("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        }).format(pedido.totals.totalAmount)}
                      </td>
                      <td
                        className={`px-2 py-3 w-16 ${
                          pedido.statusCode === "PAYMENT_COMPLETED"
                            ? "text-green-600"
                            : pedido.statusCode === "PAYMENT_PENDING"
                            ? "text-yellow-600"
                            : ""
                        }`}
                      >
                        {statusMap[
                          pedido.statusCode as keyof typeof statusMap
                        ] || "Estado desconocido"}
                      </td>
                      <td className="px-2 py-3 flex items-center justify-center ">
                        <div className="flex items-center pt-2 space-x-3.5">
                          <Link href={`/dashboard/pedidos/${pedido.id}`}>
                            <svg
                              className="fill-current hover:fill-primary"
                              width="24"
                              height="24"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                fill=""
                              />
                              <path
                                d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                fill=""
                              />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <nav
              className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
              aria-label="Table navigation"
            >
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Página{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {pageNumber} - {pageSize}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <button
                    onClick={() => handlePageChange(pageNumber - 1)}
                    disabled={pageNumber === 1}
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
                {totalOrders > 0 &&
                  Array.from(
                    { length: Math.ceil(totalOrders / pageSize) },
                    (_, page) => (
                      <li key={page}>
                        <button
                          onClick={() => handlePageChange(page + 1)}
                          className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                            pageNumber === page + 1
                              ? "text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700"
                              : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                          } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                        >
                          {page + 1}
                        </button>
                      </li>
                    )
                  )}

                <li>
                  <button
                    onClick={() => handlePageChange(pageNumber + 1)}
                    disabled={pageNumber === Math.ceil(totalOrders / pageSize)}
                    className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PedidosBO;
