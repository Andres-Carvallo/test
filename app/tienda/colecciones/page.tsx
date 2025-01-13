import React from "react";
import Colecciones from "@/components/conMantenedor/colecciones";
import { getCollections } from "@/app/utils/colecciones";
import { slugify } from "@/app/utils/slugify";

export default async function ColeccionesPage() {
  try {
    const data = await getCollections();
    const activeCollections = data.collections
      .filter((collection: any) =>
        collection.products.some(
          (product: any) => product.statusCode === "ACTIVE"
        )
      )
      .map((collection: any) => ({
        ...collection,
        slug: slugify(collection.title),
      }));

    return (
      <section>
        <Colecciones collections={activeCollections} />
      </section>
    );
  } catch (error) {
    console.error("Error loading collections:", error);
    return (
      <section className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Error al cargar las colecciones
          </h2>
          <p>Por favor, intenta nuevamente más tarde.</p>
        </div>
      </section>
    );
  }
}
