/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import MailchimpForm from "@/components/PIXELUP/MailChimp/MailchimpForm";
import { useState, useEffect } from "react";
import axios from "axios";

interface FooterProps {
  FooterData: {
    titulo: string;
    subtitulo: string;
    parrafo: string;
    img: string;
  };
}

const Footer: React.FC<FooterProps> = ({ FooterData }) => {
  const { titulo, subtitulo, parrafo, img } = FooterData;
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
    <footer className="bg-background">
      <div className=" border-t border-gray-200"></div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-12 xl:gap-8">
          <div className="xl:col-span-2 space-y-8">
            <img
              alt="Logo"
              className="h-40 object-cover mx-auto"
              src={img}
            />
          </div>
          <div className="xl:col-span-6 mt-12 grid grid-cols gap-8 xl:mt-0 mx-12">
            <div className="md:grid md:grid-cols-3 md:gap-16 text-primary">
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase">
                  Useful Links
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a
                      className="text-base hover:underline "
                      href="#"
                    >
                      Inicio
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-base hover:underline "
                      href="#"
                    >
                      Contacto
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-base hover:underline "
                      href="#"
                    >
                      Tallas
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-base hover:underline "
                      href="#"
                    >
                      Cuentas
                    </a>
                  </li>
                </ul>
              </div>
              {collections.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase mt-8 md:mt-0">
                    Colecciones
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {collections.map((collection) => (
                      <li key={collection.id}>
                        <Link
                          href={`/tienda/colecciones/${collection.id}`}
                          className="text-base hover:underline"
                        >
                          {collection.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase mt-8 md:mt-0">
                  Otros
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a
                      className="text-base hover:underline "
                      href="#"
                    >
                      Contacto
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-base hover:underline "
                      href="#"
                    >
                      About Me
                    </a>
                  </li>
                </ul>
              </div>
              {/*             <div className="col-span-2 lg:col-span-8">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.1963033199368!2d-70.60771022165558!3d-33.41812615403303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf7358daf7a9%3A0x83125960d2216e74!2sBold%20Mall%20Costanera%20Center!5e0!3m2!1ses!2scl!4v1716325679905!5m2!1ses!2scl" 
            width="600" 
            height="450" 
            style={{border: 0}} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div> */}
            </div>
          </div>
          <div className="col-span-2 lg:col-span-3 lg:flex ml-auto md:mt-0 mt-8 ">
            <div className="max-w-md mx-auto w-full px-4 lg:px-0">
              <h3 className="text-sm font-bold tracking-wider uppercase ">
                ¡Sé parte de la Comunidad!
              </h3>
              <p className="mt-2 ">
                Suscríbete para enterarte de nuestras novedades
              </p>
              <MailchimpForm />
            </div>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-primary">
          <div className="flex justify-center space-x-6">
            <a
              className="text-primary hover:text-secondary"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  width="20"
                  height="20"
                  x="2"
                  y="2"
                  rx="5"
                  ry="5"
                />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line
                  x1="17.5"
                  x2="17.51"
                  y1="6.5"
                  y2="6.5"
                />
              </svg>
            </a>
            <a
              className="text-primary hover:text-secondary"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                />
                <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
                <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
                <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
              </svg>
            </a>
            <a
              className="text-primary hover:text-secondary"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a
              className="text-primary hover:text-secondary"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3z" />
              </svg>
            </a>
          </div>
          <div className="mt-8 text-center text-base text-gray-500 ">
            © Copyright 2024 PixelUp | All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
