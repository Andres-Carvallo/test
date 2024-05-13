import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pago Fail",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const Fail = () => {
  return (
    <>
      <Breadcrumb pageName="Checkout" />
      <div className="container py-16">
        <h1 className="text-center text-4xl">pago Fail</h1>
      </div>
    </>
  );
};

export default Fail;
