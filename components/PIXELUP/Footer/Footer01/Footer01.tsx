/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import MailchimpForm from "@/components/Core/MailChimp/MailchimpForm";
import axios from "axios";
import { mainMenuConfig, socialConfig } from "@/app/config/menulinks";
import { slugify } from "@/app/utils/slugify";
import { useLogo } from "@/context/LogoContext";

export default function Footer() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const { logo } = useLogo();

  // Filtrar los enlaces del menú que son visibles
  const menuItems = mainMenuConfig.showInFooter
    ? mainMenuConfig.links.filter(
        (link) => link.isVisible && link.title !== "Colecciones"
      )
    : [];

  // Encontrar el enlace de colecciones
  const collectionsLink = mainMenuConfig.links.find(
    (link) => link.isDropdown && link.dropdownType === "collections"
  );

  // Filtrar los enlaces de redes sociales que son visibles
  const socialItems = socialConfig.showInFooter
    ? socialConfig.links.filter((link) => link.isVisible)
    : [];

  // Verificar qué secciones están disponibles
  const hasCollections = collections.length > 0 && collectionsLink;
  const hasSocial = socialConfig.showInFooter && socialItems.length > 0;

  // Determinar el número de columnas para el grid
  const getGridColumns = () => {
    let count = 1; // Siempre tenemos al menos la columna de enlaces
    if (hasCollections) count++;
    if (hasSocial) count++;
    return count;
  };

  // Obtener la clase de grid basada en el número de columnas
  const getGridClass = () => {
    const columns = getGridColumns();
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "sm:grid-cols-2";
      case 3:
        return "sm:grid-cols-2 lg:grid-cols-3";
      default:
        return "sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  const fetchCollections = async () => {
    try {
      const siteid = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/collections?pageNumber=1&pageSize=50&siteId=${siteid}`
      );
      setCollections(response.data.collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <footer className="bg-primary flex items-center justify-center w-full">
      <div className="max-w-7xl w-full mx-auto py-16 px-6 sm:px-8 lg:py-20 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Logo y descripción */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <img
              alt={process.env.NEXT_PUBLIC_NOMBRE_TIENDA}
              className="h-40 object-fit object-contain  max-w-[150px] md:max-w-[250px]"
              src={logo?.mainImage?.url || process.env.NEXT_PUBLIC_LOGO_COLOR}
            />
          </div>

          {/* Enlaces y contenido */}
          <div className="lg:col-span-8">
            <div className={`grid ${getGridClass()} gap-8`}>
              {/* Enlaces del menú principal - siempre visible */}
              <div className="text-center sm:text-left">
                <h3 className="text-lg text-white underline mb-6">Enlaces</h3>
                <ul className="mt-4 space-y-3">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.path}
                        className="text-base hover:underline uppercase text-white"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Colecciones - visible solo si hay colecciones */}
              {hasCollections && (
                <div className="text-center sm:text-left">
                  <h3 className="text-lg text-white underline mb-6">
                    {collectionsLink.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {collections.slice(0, 3).map((collection) => (
                      <li key={collection.id}>
                        <Link
                          href={`/tienda/colecciones/${slugify(
                            collection.title
                          )}`}
                          className="text-base hover:underline uppercase text-white"
                        >
                          {collection.title}
                        </Link>
                      </li>
                    ))}
                    {collections.length > 3 && (
                      <li>
                        <Link
                          href="/tienda/colecciones"
                          className="text-base underline hover:no-underline uppercase text-white"
                        >
                          Ver todas
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Redes sociales - visible solo si hay redes sociales */}
              {hasSocial && (
                <div className="text-center sm:text-left">
                  <h3 className="text-lg text-white underline mb-6">
                    Síguenos
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {socialItems.map((social, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-center sm:justify-start"
                      >
                        <a
                          href={social.url}
                          rel="noreferrer"
                          target="_blank"
                          className="text-secondary hover:text-white transition-colors flex items-center"
                        >
                          <span className="mr-2">{social.icon}</span>
                          <span className="text-base hover:underline uppercase">
                            {social.platform}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pie de página con copyright */}
        <div className="mt-12 border-t border-gray-100 pt-8">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center">
            <p className="text-xs text-gray-200 text-center sm:text-left">
              &copy; {new Date().getFullYear()}{" "}
              {process.env.NEXT_PUBLIC_NOMBRE_TIENDA} | All rights reserved.
            </p>

            {/* Redes sociales en versión móvil */}
            {hasSocial && (
              <ul className="flex justify-center sm:justify-end gap-6 mt-4 sm:mt-0">
                {socialItems.map((social, index) => (
                  <li key={index}>
                    <a
                      href={social.url}
                      rel="noreferrer"
                      target="_blank"
                      className="text-secondary transition hover:opacity-35"
                    >
                      <span className="sr-only">{social.platform}</span>
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal de tabla de tallas */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-4 text-4xl"
            >
              &times;
            </button>
            <img
              src="/img/Tabladetallas/TabladeTallas.webp"
              alt="Tabla de Tallas"
              className="max-w-full max-h-full object-contain"
              style={{ maxWidth: "80vw", maxHeight: "80vh" }}
            />
          </div>
        </div>
      )}
    </footer>
  );
}
