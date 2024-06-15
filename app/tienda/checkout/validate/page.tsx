import { Metadata } from "next";
import Validate from "@/components/Checkout/Validate";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Pago OK",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const Ok = () => {
  return (
    <div className="container py-16">
      <Validate />
    </div>
  );
};

const OkWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Ok />
    </Suspense>
  );
};

export default OkWithSuspense;
