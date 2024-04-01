"use client";
import React, { useContext, useState, createContext } from "react";

const APIContextProductType = createContext();

export function APIContextProvider({ children }) {
  const [productType, setProductType] = useState([]);
  const [products, setProducts] = useState([]);

  return (
    <APIContextProductType.Provider
      value={{
        productType,
        setProductType,
        products,
        setProducts,
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
