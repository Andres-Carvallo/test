/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import AsideTotal from "@/components/Checkout/AsideTotal";
import React, { useEffect, useState } from "react";
import { useAPI } from "@/app/Context/ProductTypeContext";
import { getCookie, deleteCookie } from "cookies-next";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AutoSubmitForm from "@/components/Checkout/AutoSubmitForm";
import CartList from "@/components/CartCanva/CartList";

function Checkout() {
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const { cartItems, setCartItems, fetchCartData, cartData } = useAPI();
  const totalAmount = cartData?.totals?.totalAmount;
  const subtotalAmount = cartData?.totals?.subtotalAmount;
  const discountAmount = cartData?.totals?.discountAmount;

  const [deliveryType, setDeliveryType] = useState(""); // Valor predeterminado: entrega a domicilio
  const [deliveryTypeID, setDeliveryTypeID] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false); // Nuevo estado para controlar si se ha enviado la orden
  const [transactionData, setTransactionData] = useState<{
    url: string;
    token: string;
  } | null>(null);

  const cartId = getCookie("cartId");

  const [customer, setCustomer] = useState({
    cartId: cartId,
    deliveryTypeId: "",
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
    discountCoupons: {
      code: "",
    },
  });

  const [discountCode, setDiscountCode] = useState(""); // Nuevo estado para el código de descuento
  const [discountApplied, setDiscountApplied] = useState(false); // Estado para controlar si se ha aplicado un descuento

  const applyDiscount = () => {
    // Aquí implementa la lógica para aplicar el descuento al total
    // Puedes usar el estado de 'discountCode' para verificar el código de descuento ingresado
    // y luego actualizar el estado 'discountApplied' en consecuencia
  };

  // Función para quitar el descuento
  const removeDiscount = () => {
    // Aquí implementa la lógica para quitar el descuento y recalcular el total
    // Puedes simplemente restablecer el estado 'discountApplied' a false y el 'discountCode' a vacío
  };

  // Modificar la función 'handleSubmitOrder' para manejar el botón "Calcular" y "Pagar"
  const handleSubmitOrder = async () => {
    if (discountCode && !discountApplied) {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/orders?siteId=${SiteId}`,
        {
          cartId: customer.cartId,
          deliveryTypeId: deliveryTypeID,
          useDifferentShippingAddress: false,
          customer: {
            firstname: customer.customer.firstname,
            lastname: customer.customer.lastname,
            phoneNumber: customer.customer.phoneNumber,
            email: customer.customer.email,
            addressLine1: customer.customer.addressLine1,
            addressLine2: customer.customer.addressLine2,
            communeId: customer.customer.communeId,
          },
          discountCoupons: {
            code: customer.discountCoupons.code,
          },
        }
      );
      console.log("Respuesta del servidor:", response.data);
      setDiscountApplied(true);
    } else {
      handleSubmitOrderSinCupon();
    }
  };

  const handleSubmitOrderSinCupon = async () => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/orders?siteId=${SiteId}`,
        {
          cartId: customer.cartId,
          deliveryTypeId: deliveryTypeID,
          useDifferentShippingAddress: false,
          customer: {
            firstname: customer.customer.firstname,
            lastname: customer.customer.lastname,
            phoneNumber: customer.customer.phoneNumber,
            email: customer.customer.email,
            addressLine1: customer.customer.addressLine1,
            addressLine2: customer.customer.addressLine2,
            communeId: customer.customer.communeId,
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);

      if (response.data.code === 0) {
        const orderId = response.data.order.id;

        const paymentGatewayResponse = await axios.get(
          `https://pixelup-site-api-git-development-pixelups-projects.vercel.app/api/v1/payment-gateways?statusCode=ACTIVE`
        );
        const paymentGateways = paymentGatewayResponse.data.paymentGateways;
        const activePaymentGatewayId = paymentGateways[0].id; // Supongamos que tomamos el primer medio de pago

        // Cuarta solicitud para actualizar el estado de la orden con el medio de pago correspondiente
        const updateOrderUrl = `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/orders/${orderId}?siteId=${SiteId}`;
        const updateOrderResponse = await axios.put(updateOrderUrl, {
          statusCode: "PAYMENT_PENDING",
          initTransactionInfo: {
            paymentGatewayId: activePaymentGatewayId,
            errorUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/checkout/error?orderId=${orderId}`,
            returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/checkout/validate?orderId=${orderId}`,
          },
        });
        if (updateOrderResponse.data.code === 0) {
          toast(
            "¡Datos enviados correctamente y orden actualizada con medio de pago!"
          );

          setTransactionData({
            token: updateOrderResponse.data.transaction.token,
            url: updateOrderResponse.data.transaction.url,
          });

          // Marca la orden como enviada
          setOrderSubmitted(true);
        } else {
          console.error(
            "Error al actualizar la orden con el medio de pago:",
            updateOrderResponse.data
          );
          toast.error("Error al actualizar la orden con el medio de pago");
        }
      }
    } catch (error) {
      console.error("Error al enviar la orden:", error);
      // Manejo de errores dentro del bloque try...catch
    } finally {
      // Restablecer el estado del cliente y manejar la respuesta del servidor
      deleteCookie("cartId");
      setCustomer({
        cartId: "",
        deliveryTypeId: "",
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
        discountCoupons: {
          code: "",
        },
      });
      // Aquí puedes manejar la respuesta del servidor según sea necesario
    }
  };

  const handleDiscountCodeChange = (e: any) => {
    const newDiscountCode = e.target.value;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      discountCoupons: {
        code: newDiscountCode,
      },
    }));
  };

  const incrementQuantity = async (itemId: string) => {
    try {
      const itemIndex = cartItems.findIndex((item: any) => item.id === itemId);
      if (itemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[itemIndex] = {
          ...updatedCartItems[itemIndex],
          quantity: updatedCartItems[itemIndex].quantity + 1,
        };
        setCartItems(updatedCartItems);

        // Actualizar la cantidad en la API
        const cartId = getCookie("cartId");
        const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/carts/${cartId}/items/${itemId}?siteId=${SiteId}`,
          { quantity: updatedCartItems[itemIndex].quantity }
        );
        fetchCartData();
      }
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  const decrementQuantity = async (itemId: string) => {
    try {
      const itemIndex = cartItems.findIndex((item: any) => item.id === itemId);
      if (itemIndex !== -1 && cartItems[itemIndex].quantity > 1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[itemIndex] = {
          ...updatedCartItems[itemIndex],
          quantity: updatedCartItems[itemIndex].quantity - 1,
        };
        setCartItems(updatedCartItems);

        // Actualizar la cantidad en la API
        const cartId = getCookie("cartId");
        const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/carts/${cartId}/items/${itemId}?siteId=${SiteId}`,
          { quantity: updatedCartItems[itemIndex].quantity }
        );
        fetchCartData();
      }
    } catch (error) {
      console.error("Error decrementing quantity:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const cartId = getCookie("cartId");
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/carts/${cartId}/items/${itemId}?siteId=${SiteId}`
      );
      // Si la solicitud se completa con éxito, actualiza el estado del carrito eliminando el elemento correspondiente
      setCartItems((prevItems: any) =>
        prevItems.filter((item: any) => item.id !== itemId)
      );
      fetchCartData();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const fetchRegions = async () => {
    try {
      const Pais = "CL";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/countries/${Pais}/regions`
      );
      console.log(response.data.regions, "response");
      setRegions(response.data.regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const fetchCommunes = async (regionId: any) => {
    try {
      const Pais = "CL";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/countries/${Pais}/regions/${regionId}/communes`
      );
      setCommunes(response.data.communes);
    } catch (error) {
      console.error("Error fetching communes:", error);
    }
  };

  const handleRegionChange = (e: any) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedCommune(""); // Reset selected commune when region changes
    if (regionId) {
      fetchCommunes(regionId);
    } else {
      setCommunes([]); // Reset communes if no region is selected
    }
  };

  const handleCommuneChange = (e: any) => {
    const communeId = e.target.value;
    setSelectedCommune(communeId);
    console.log(communeId, "communeId");
    setCustomer({
      ...customer,
      customer: {
        ...customer.customer,
        communeId: communeId,
      },
    });
  };

  const handleChangeDeliveryType = async (newValue: any) => {
    console.log("Nuevo valor de deliveryType:", newValue);
    setDeliveryType(newValue);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/delivery-types?statusCode=ACTIVE`
      );
      const deliveryTypes = response.data.deliveryTypes;
      const selectedDeliveryType = deliveryTypes.find(
        (type: any) => type.code === newValue
      );
      if (selectedDeliveryType) {
        console.log(
          "ID del deliveryType seleccionado:",
          selectedDeliveryType.id
        );
        setDeliveryTypeID(selectedDeliveryType.id);
      } else {
        console.error(
          "No se encontró el deliveryType seleccionado en la respuesta de la API"
        );
      }
    } catch (error) {
      console.error("Error al obtener los tipos de entrega:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
    fetchRegions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pb-12">
      <>
        <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
          <a
            href="#"
            className="text-2xl font-bold text-gray-800"
          >
            Checkout
          </a>
          <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
            <div className="relative">
              <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
                <li className="flex items-center space-x-3 text-left sm:space-x-4">
                  <a
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-700"
                    href="#"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </a>
                  <span className="font-semibold text-gray-900">Tienda</span>
                </li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <li className="flex items-center space-x-3 text-left sm:space-x-4">
                  <a
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white ring ring-gray-600 ring-offset-2"
                    href="#"
                  >
                    2
                  </a>
                  <span className="font-semibold text-gray-900">Envio</span>
                </li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <li className="flex items-center space-x-3 text-left sm:space-x-4">
                  <a
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white"
                    href="#"
                  >
                    3
                  </a>
                  <span className="font-semibold text-gray-500">Pago</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
          <div className="px-4 pt-8">
            <p className="text-xl font-medium">Order Summary</p>
            <p className="text-gray-400 mb-4">
              Check your items. And select a suitable shipping method.
            </p>
            <div className="w-full  bg-white shadow-lg relative ml-auto h-auto">
              <div className="overflow-auto p-6 ">
                <CartList
                  cartItems={cartItems}
                  incrementQuantity={incrementQuantity}
                  decrementQuantity={decrementQuantity}
                  removeItem={removeItem}
                />
              </div>
            </div>
          </div>
          <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">Payment Details</p>
            <p className="text-gray-400">
              Complete your order by providing your payment details.
            </p>
            <div className="">
              <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <label
                    htmlFor="firstname"
                    className="block mt-4"
                  >
                    First Name
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={customer.customer.firstname}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          customer: {
                            ...customer.customer,
                            firstname: e.target.value,
                          },
                        })
                      }
                      className="block w-full rounded-md border-dark/50 border p-1 mt-1"
                    />
                  </label>
                  <label
                    htmlFor="lastname"
                    className="block mt-4"
                  >
                    Last Name
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={customer.customer.lastname}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          customer: {
                            ...customer.customer,
                            lastname: e.target.value,
                          },
                        })
                      }
                      className="block w-full rounded-md  border-dark/50 border p-1 mt-1"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    htmlFor="phoneNumber"
                    className="block mt-4"
                  >
                    Phone Number
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={customer.customer.phoneNumber}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          customer: {
                            ...customer.customer,
                            phoneNumber: e.target.value,
                          },
                        })
                      }
                      className="block w-full rounded-md border-dark/50 border p-1 mt-1"
                    />
                  </label>
                  <label
                    htmlFor="email"
                    className="block mt-4"
                  >
                    Email
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={customer.customer.email}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          customer: {
                            ...customer.customer,
                            email: e.target.value,
                          },
                        })
                      }
                      className="block w-full rounded-md border-dark/50 border p-1 mt-1"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    htmlFor="addressLine1"
                    className="block mt-4"
                  >
                    Address Line 1
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={customer.customer.addressLine1}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          customer: {
                            ...customer.customer,
                            addressLine1: e.target.value,
                          },
                        })
                      }
                      className="block w-full rounded-md  border-dark/50 border p-1 mt-1"
                    />
                  </label>
                  <label
                    htmlFor="addressLine2"
                    className="block mt-4"
                  >
                    Address Line 2
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={customer.customer.addressLine2}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          customer: {
                            ...customer.customer,
                            addressLine2: e.target.value,
                          },
                        })
                      }
                      className="block w-full rounded-md  border-dark/50 border p-1 mt-1"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    htmlFor="RegionId"
                    className="block mt-4"
                  >
                    Región
                    <select
                      id="region"
                      value={selectedRegion}
                      onChange={(event) => {
                        handleRegionChange(event);
                      }}
                      className="block w-full rounded-md text-sm  border-dark/50 border p-2 mt-1 bg-white"
                    >
                      <option>Selecciona Región</option>
                      {regions.map((region: any) => (
                        <option
                          key={region.id}
                          value={region.id}
                        >
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label
                    htmlFor="communeId"
                    className="block mt-4"
                  >
                    Comuna
                    <select
                      id="commune"
                      value={selectedCommune}
                      onChange={(event) => {
                        handleCommuneChange(event);
                      }}
                      disabled={!selectedRegion}
                      className="block w-full rounded-md text-sm border-dark/50 border p-2 mt-1 bg-white"
                    >
                      <option>Selecciona Comuna</option>
                      {communes.map((commune: any) => (
                        <option
                          key={commune.id}
                          value={commune.id}
                        >
                          {commune.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label htmlFor="discountCode">
                    Codigo Descuento
                    <input
                      type="text"
                      className="block w-full rounded-md text-sm  border-dark/50 border p-2 mt-1 bg-white"
                      value={customer.discountCoupons.code} // Usamos el valor del código de descuento del estado customer
                      onChange={handleDiscountCodeChange} // Llamamos a la función handleDiscountCodeChange para actualizar el código de descuento
                    />
                    {discountCode && (
                      <button onClick={removeDiscount}>Quitar Descuento</button>
                    )}
                  </label>
                </div>
              </div>

              <p className="mt-8 text-lg font-medium">Shipping Methods</p>
              <form className="mt-5 grid gap-6">
                <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_retiroTienda"
                    type="radio"
                    name="radio"
                    value="WITHDRAWAL_FROM_STORE"
                    checked={deliveryType === "WITHDRAWAL_FROM_STORE"}
                    onChange={() =>
                      handleChangeDeliveryType("WITHDRAWAL_FROM_STORE")
                    }
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_retiroTienda"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                      />
                    </svg>
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">
                        Retiro en Tienda
                      </span>
                      <p className="text-slate-500 text-sm leading-6">
                        Delivery: 0-1 Days
                      </p>
                    </div>
                  </label>
                </div>
                <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_delivery"
                    type="radio"
                    name="radio"
                    value="HOME_DELIVERY"
                    checked={deliveryType === "HOME_DELIVERY"}
                    onChange={() => handleChangeDeliveryType("HOME_DELIVERY")}
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                  <label
                    className="peer-checked:border-2  peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_delivery"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">Delivery</span>
                      <p className="text-slate-500 text-sm leading-6">
                        Delivery: 2-4 Days
                      </p>
                    </div>
                  </label>
                </div>
              </form>

              {/* Total */}
              <div className="mt-6 border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Subtotal</p>
                  <p className="font-semibold text-gray-900">
                    $ {subtotalAmount}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Descuento</p>
                  <p className="font-semibold text-gray-900">
                    $ {discountAmount}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  $ {totalAmount}
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmitOrder}
              className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
            >
              Pagar
            </button>
          </div>
        </div>
      </>
      {orderSubmitted && transactionData && (
        <AutoSubmitForm
          action={transactionData.url}
          method="post"
          token={transactionData.token}
        />
      )}
    </div>
  );
}

export default Checkout;
