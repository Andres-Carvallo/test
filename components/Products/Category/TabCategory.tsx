"use client";

import React, { useState, useEffect } from "react";
import CreateCategory from "@/components/Products/Category/CreateCategory";
import EditCategory from "@/components/Products/Category/EditCategory";

interface TabsProps {
  handleCloseModal: any;
  fetchData: any;
}
const Tabs: React.FC<TabsProps> = ({ handleCloseModal, fetchData }) => {
  const [activeTab, setActiveTab] = useState("create");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-[45vw] min-w-[45vw] mx-auto">
      <div className="flex mt-[10vh] min-w-96  bg-white my-4 p-4 rounded-xl">
        <button
          className={`flex-1 p-4 rounded-xl ${
            activeTab === "create" ? "bg-gray-200" : ""
          }`}
          onClick={() => handleTabChange("create")}
        >
          Create Category
        </button>
        <button
          className={`flex-1 p-4 rounded-xl ${
            activeTab === "edit" ? "bg-gray-200" : ""
          }`}
          onClick={() => handleTabChange("edit")}
        >
          Edit Category
        </button>
      </div>
      <div className=" bg-white rounded-xl min-w-96">
        {activeTab === "create" && (
          <div>
            <CreateCategory
              handleCloseModal={handleCloseModal}
              fetchData={fetchData}
            />
          </div>
        )}
        {activeTab === "edit" && (
          <EditCategory
            handleCloseModal={handleCloseModal}
            fetchData={fetchData}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;
