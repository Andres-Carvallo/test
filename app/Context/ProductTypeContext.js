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
  const [totalItems, setTotalItems] = useState([]);

  const [attributes, setAttributes] = useState([]);
  const fetchAttributes = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/attributes?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.code === 0) {
        setAttributes(data.attributes);
      } else {
        console.error("Error fetching attributes:", data.message);
      }
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  };

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

      // Intentamos hacer fetch de los datos del carrito para verificar si el cartId es válido
      let isValidCart = await validateCartId(cartId);

      if (!cartId || !isValidCart) {
        // Si la cookie de cartId es null o inválida, la eliminamos
        console.log(
          "CartId is null or invalid, removing the cookie and creating a new cart."
        );
        setCookie("cartId", "", { maxAge: -1 }); // Elimina la cookie

        // Crear un nuevo carrito y obtener su ID
        cartId = await createCart(skuId, quantity);
        if (cartId) {
          // Guardar el ID del carrito en las cookies si se creó correctamente
          setCookie("cartId", cartId);
          toast.success("Producto agregado al carrito");
        } else {
          toast.error(
            "Error al crear el carrito. Inténtalo de nuevo más tarde."
          );
          return; // Salir de la función si no se pudo crear el carrito
        }
      } else {
        // Agregar el producto al carrito existente
        await addToCart(cartId, skuId, quantity);
      }

      setIsMenuOpen(true);
      fetchCartData();
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      toast.error(
        "Error al agregar producto al carrito. Inténtalo de nuevo más tarde."
      );
    }
  };

  // Función para validar si el cartId es válido haciendo un fetch
  const validateCartId = async (cartId) => {
    if (!cartId) return false;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/carts/${cartId}?siteId=${SiteId}`
      );

      // Si el fetch es exitoso, el cartId es válido
      return response.status === 200;
    } catch (error) {
      return false; // Si hay un error en el fetch, el cartId no es válido
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

        // Obtener los datos del carrito de la respuesta
        const cartData = response.data.cart;

        // Verificar si hay items en el carrito
        if (cartData && cartData.items) {
          let totalItems = 0;

          // Sumar las cantidades de los elementos del carrito
          cartData.items.forEach((item) => {
            totalItems += item.quantity;
          });

          // Actualizar el estado con los datos del carrito y el total de elementos
          setCartItems(cartData.items);
          setCartData(cartData);
          setTotalItems(totalItems);
        }
      } else {
        // Si no hay cartId, no hagas la solicitud HTTP y maneja la lógica correspondiente aquí
        console.log("No cartId found. Unable to fetch cart data.");
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  // Función para agregar un elemento al carrito existente
  const addToCart = async (cartId, skuId, quantity) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/carts/${cartId}/items?siteId=${SiteId}`,
        {
          skuId: skuId,
          quantity: quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Producto agregado al carrito");
      setIsMenuOpen(true);
      fetchCartData();
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        console.log(errorMessage);
        toast.error(errorMessage);
      } else {
        console.error("Error al agregar elemento al carrito:", error);
        toast.error(
          "Error al agregar producto al carrito. Inténtalo de nuevo más tarde."
        );
      }
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
        setCartData,
        pedidos,
        setPedidos,
        isMenuOpen,
        setIsMenuOpen,
        handleMenuOpen,
        handleMenuClose,
        totalItems,
        setTotalItems,
        fetchAttributes,
        attributes,
        setAttributes,
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
