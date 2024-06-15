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
      <div className="bg-white rounded-lg shadow-2xl text-center w-[800px] h-[500px] flex flex-col items-center justify-center">
                <div className="w-full h-[500px] p-8 bg-red-600 rounded-t-lg flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-white mb-2">Pago Rechazado</h1>
                </div>
                <div className="p-8 flex flex-col items-center">
                    <p className="text-gray-600 m-4">Se rechazo la transaccion, Elige otra forma de pago o comunicate con la entidad emisora de la tarjeta.</p>
                </div>
      </div>
    </>
  );
};

export default Fail;
