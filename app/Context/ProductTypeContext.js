"use client";
import React, { useContext, useState, createContext } from "react";
import axios from "axios";
import { setCookie, getCookie } from "cookies-next";
import toast, { Toaster } from "react-hot-toast";

const APIContextProductType = createContext();

export function APIContextProvider({ children, SiteId }) {
  const [productType, setProductType] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState({});
  const [pedidos, setPedidos] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  // Función para manejar la lógica de agregar un producto al carrito
  const addToCartHandler = async (skuId, quantity) => {
    try {
      let cartId = getCookie("cartId");

      if (!cartId) {
        // Crear un nuevo carrito y obtener su ID
        cartId = await createCart(skuId, quantity);
        // Guardar el ID del carrito en las cookies
        setCookie("cartId", cartId);
        toast.success("Producto agregado al carrito");
        setIsMenuOpen(true);
        fetchCartData();
      } else {
        // Agregar el producto al carrito existente
        await addToCart(cartId, skuId, quantity);
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  };

  // Función para crear un nuevo carrito
  const createCart = async (skuId, quantity) => {
    try {
      const currencyCodeId = "8ccc1abd-b35b-45ff-b814-b7c78fff3594";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/carts?siteId=${SiteId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currencyCodeId: currencyCodeId,
            items: [
              {
                skuId: skuId,
                quantity: quantity,
              },
            ],
          }),
        }
      );
      const data = await response.json();
      console.log("Nuevo carrito creado:", data.cart.id);
      return data.cart.id; // Devolver el ID del carrito creado
    } catch (error) {
      console.error("Error al crear un nuevo carrito:", error);
      return null;
    }
  };
  const fetchCartData = async () => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const cartId = getCookie("cartId");

      // Verificar si hay un cartId válido antes de hacer la solicitud HTTP
      if (cartId) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/carts/${cartId}?siteId=${SiteId}`
        );
        setCartItems(response.data.cart.items);
        setCartData(response.data.cart);
      } else {
        // Si no hay cartId, no hagas la solicitud HTTP y maneja la lógica correspondiente aquí
        console.log("No cartId found. Unable to fetch cart data.");
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  // Función para agregar un elemento al carrito
  const addToCart = async (cartId, skuId, quantity) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/carts/${cartId}/items?siteId=${SiteId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skuId: skuId,
            quantity: quantity,
          }),
        }
      );
      const data = await response.json();
      console.log("Elemento agregado al carrito:", data);
      toast.success("Producto agregado al carrito");
      setIsMenuOpen(true);
      fetchCartData();
    } catch (error) {
      console.error("Error al agregar elemento al carrito:", error);
    }
  };

  return (
    <APIContextProductType.Provider
      value={{
        productType,
        setProductType,
        products,
        setProducts,
        addToCart,
        addToCartHandler,
        cartItems,
        setCartItems,
        fetchCartData,
        cartData,
        pedidos,
        setPedidos,
        isMenuOpen,
        setIsMenuOpen,
        handleMenuOpen,
        handleMenuClose,
      }}
    >
      {children}
    </APIContextProductType.Provider>
  );
}

export function useAPI() {
  const context = useContext(APIContextProductType);
  return context;
}
