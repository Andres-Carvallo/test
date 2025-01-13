"use client";
import React from "react";
import { redirect, useSearchParams } from "next/navigation";
import ValidateComponent from "./ValidateComponent";

const ValidatePage: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const token_ws = searchParams.get("token_ws");

  return (
    <div>
      {orderId && token_ws && (
        <ValidateComponent
          orderId={orderId}
          token_ws={token_ws}
        />
      )}

      {!orderId && !token_ws && redirect("/tienda/")}
    </div>
  );
};

export default ValidatePage;
