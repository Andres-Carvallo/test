import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableUsers from "@/components/Tables/TableUsers";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "CRUD de Usuarios | PixelUP",
  description: "PixelUP",
  // other metadata
};

const UsuariosPage = () => {
  return (
    <>
      <Breadcrumb pageName="Usuarios" />

      <div className="flex flex-col gap-10">
        <TableUsers />
      </div>
    </>
  );
};

export default UsuariosPage;
