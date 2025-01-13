import Breadcrumb from "@/components/Core/Breadcrumbs/Breadcrumb";
import TableUsers from "@/components/Core/Tables/TableUsers";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "CRUD de Usuarios | PixelUP",
  description: "PixelUP",
  // other metadata
};

const UsuariosPage = () => {
  return (
    <section className="p-10">
      <Breadcrumb pageName="Usuarios" />

      <div className="flex flex-col gap-10 min-h-screen">
        <TableUsers />
      </div>
    </section>
  );
};

export default UsuariosPage;
