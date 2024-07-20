"use client";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useAPI } from "@/app/Context/ProductTypeContext";
import axios from "axios";
import CreateCategory from "@/components/Products/Category/CreateCategory";
import EditCategory from "@/components/Products/Category/EditCategory";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const CategoriasPage: React.FC = () => {
  const { productType, setProductType } = useAPI();
  const [activeTab, setActiveTab] = useState("create");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const fetchProducTypes = async () => {
    try {
      const token = getCookie("AdminTokenAuth");

      const PageNumber = 1;
      const PageSize = 100;

      const productTypeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/product-types?pageNumber=${PageNumber}&pageSize=${PageSize}&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        productTypeResponse.data.productTypes,
        "productTypeResponse.data.productTypes"
      );
      setProductType(productTypeResponse.data.productTypes);
    } catch (error) {
      console.error("Error al obtener los tipos de producto: er2", error);
    }
  };

  useEffect(() => {
    fetchProducTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="py-10 mx-10">
      <Breadcrumb pageName="Categorías" />
      <div className="">
        <div className="flex  min-w-96  my-4 p-4 rounded-xl gap-6">
          <button
            className={`flex-1 p-4 rounded-xl bg-gray-200 text-primary shadow-md ${
              activeTab === "create" ? "bg-primary text-white" : ""
            }`}
            onClick={() => handleTabChange("create")}
          >
            Crear Categoría
          </button>
          <button
            className={`flex-1 p-4 rounded-xl bg-gray-200 text-primary shadow-md ${
              activeTab === "edit" ? "bg-primary text-white" : ""
            }`}
            onClick={() => handleTabChange("edit")}
          >
            Editar Categoría
          </button>
        </div>
        <div className=" bg-white rounded-xl min-w-96">
          {activeTab === "create" && (
            <div>
              <CreateCategory
                handleCloseModal={null}
                fetchData={fetchProducTypes}
              />
            </div>
          )}
          {activeTab === "edit" && (
            <EditCategory
              handleCloseModal={null}
              fetchData={fetchProducTypes}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriasPage;
