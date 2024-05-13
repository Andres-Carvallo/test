import { Metadata } from "next";
import Validate from "@/components/Checkout/Validate";

export const metadata: Metadata = {
  title: "Pago OK",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const Ok = () => {
  return (
    <>
      <div className="container py-16">
        <Validate />
      </div>
    </>
  );
};

export default Ok;
