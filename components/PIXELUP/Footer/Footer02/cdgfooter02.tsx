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
      <div className="  max-w-7xl  mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-12 xl:gap-8 ">
          <div className="xl:col-span-2 space-y-8">
            <img
              alt="Logo"
              className="h-40 object-cover mx-auto"
              src={img}
            />
          </div>
          <div className="justify-center text-center md:text-left xl:col-span-6 mt-12 grid grid-cols gap-8 xl:mt-0 mx-12">
            <div className="max-w-2xl md:grid md:grid-cols-2 md:gap-16 text-primary">
              <div>
                {/*                 <h3 className="text-sm font-bold tracking-wider uppercase">
                Enlaces Rápidos
                </h3> */}
                <ul className="uppercase space-y-2">
                  <li>
                    <Link
                      className="text-base hover:underline "
                      href="#"
                    >
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-base hover:underline "
                      href="/tienda"
                    >
                      Tienda
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-base hover:underline "
                      href="/nosotros"
                    >
                      nosotros
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-base hover:underline "
                      href="/cotiza-tu-evento"
                    >
                      Cotiza tu evento
                    </Link>
                  </li>
                </ul>
              </div>
              {collections.length > 0 && (
                <div>
                  {/*                   <h3 className="text-sm font-bold tracking-wider uppercase mt-8 md:mt-0">
                    Colecciones
                  </h3> */}
                  <ul className=" space-y-2 uppercase">
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
                {/*                 <h3 className="text-sm font-bold tracking-wider uppercase mt-8 md:mt-0">
                  Otros
                </h3> */}
                {/*                 <ul className=" space-y-2">
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
                </ul> */}
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
          {/*           <div className="text-center md:text-left col-span-2 lg:col-span-3 lg:flex ml-auto md:mt-4 lg:mt-0  mt-8 ">
            <div className=" max-w-md mx-auto w-full px-4 lg:px-0">
              <h3 className="text-sm font-bold tracking-wider uppercase ">
                ¡Sé parte de la Comunidad!
              </h3>
              <p className="mt-2 ">
                Suscríbete para enterarte de nuestras novedades
              </p>
              <MailchimpForm />
            </div>
          </div> */}
          <div className="mt-8 lg:mt-0 w-full lg:w-72 flex flex-col items-center">
            <h4 className="text-base font-semibold leading-4 mb-2 uppercase">
              Síguenos en nuestras redes sociales
            </h4>
            <div className="w-full flex justify-center xl:justify-start space-x-6 mt-4">
              <a
                className="hover:text-secondary relative p-2 inline-flex items-center justify-center bg-primary hover:bg-secondary rounded-full"
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
                  className="text-secondary hover:text-primary"
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
                className="hover:text-secondary relative p-2 inline-flex items-center justify-center bg-primary hover:bg-secondary rounded-full"
                href="#"
              >
                <svg
                  className="h-6 w-6 text-secondary hover:text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-primary">
          <div className="flex justify-center space-x-6">
            {/*  <a
              className="text-primary hover:text-secondary"
              href="https://www.instagram.com/latavoladelchef?igsh=bjg5cXh2NDBpZW5q"
              target="_blank"
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
            </a> */}
            {/*             <a
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
            </a> */}
            {/*             <a
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
            </a> */}
            {/*             <a
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
            </a> */}
            {/* <a
              className="text-primary hover:text-secondary"
              target="_blank"
              href="https://www.facebook.com/LaTavolaDelChef?mibextid=qi2Omg&rdid=WtLSlha9ttb8TAWb"
            >
              <svg
                className="h-6 w-6 hover:text-secondary"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a> */}
          </div>
          <div className="text-center text-base text-gray-500 ">
            © Copyright 2024 LaTavolaDelChef | All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
