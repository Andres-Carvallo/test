import { Metadata } from "next";
import CheckoutPago from "@/components/Checkout/CheckoutPago";
import { Suspense } from "react";
import Loader from "@/components/common/Loader";

export const metadata: Metadata = {
  title: "Pago",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const Pago = () => {
  return (
    <div className="container pb-16 pt-8">
      <CheckoutPago />
    </div>
  );
};

const OkWithSuspense = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Pago />
    </Suspense>
  );
};

export default OkWithSuspense;
