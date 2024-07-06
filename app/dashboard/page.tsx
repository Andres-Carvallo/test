import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | PixelUP",
  description: "Dashboard Pixelup",
};
const inicioDashboard = () => {
  return (
    <div className="text-gray-600 body-font">
      <Breadcrumb pageName="Inicio" />
      <h1>hola</h1>
    </div>
  );
};

export default inicioDashboard;
