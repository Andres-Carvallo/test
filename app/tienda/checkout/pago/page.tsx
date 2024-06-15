import { Metadata } from "next";
import CheckoutPago from "@/components/Checkout/CheckoutPago";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Pago",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const Pago = () => {
  return (
    <div className="container py-16">
      <CheckoutPago />
    </div>
  );
};

const OkWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Pago />
    </Suspense>
  );
};

export default OkWithSuspense;
