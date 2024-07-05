/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Buscador from "@/components/PIXELUP/Buscador/Buscador01";
import ThemeToggler from "@/components/PIXELUP/Theme/ThemeToggler";
import CartCanvas from "@/components/CartCanva/CartCanvas";
import DropdownUser from "@/components/Dropdown/DropdownUser/DropdownUser";
import DropdownAdmin from "@/components/Dropdown/DropdownAdmin/DropdownAdmin";
import { getCookie } from "cookies-next";
import axios from "axios";

const Navbar01: React.FC = ({}) => {
  const AdminToken = getCookie("AdminTokenAuth");
  const ClientToken = getCookie("ClientTokenAuth");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="flex flex-wrap place-items-center w-full font-bold">
      <section className="relative mx-auto w-full item">
        <nav className="flex justify-between bg-background text-primary">
          <div className="flex-1 flex items-center justify-start px-5 xl:px-12 ">
            {/* Nav Links */}
            <ul
              className={`lg:!flex max-lg:w-full lg:space-x-10 max-lg:space-y-4 z-50 ${
                menuOpen
                  ? "max-lg:flex max-lg:flex-col max-lg:absolute max-lg:top-full max-lg:left-0 max-lg:w-full max-lg:bg-background"
                  : "max-lg:hidden"
              }`}
            >
              <li className="max-lg:border-b max-lg:py-2">
                <a
                  href="/"
                  className="hover:text-secondary text-primary text-[15px] block"
                >
                  Inicio
                </a>
              </li>

              {collections.length > 0 && (
                <li className="group max-lg:border-b max-lg:py-2 relative">
                  <p className="hover:text-secondary text-primary text-[15px] fill-primary lg:hover:fill-secondary flex items-center">
                    Colecciones
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16px"
                      height="16px"
                      className="ml-1"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 16a1 1 0 0 1-.71-.29l-6-6a1 1 0 0 1 1.42-1.42l5.29 5.3 5.29-5.29a1 1 0 0 1 1.41 1.41l-6 6a1 1 0 0 1-.7.29z"
                        data-name="16"
                        data-original="#000000"
                      />
                    </svg>
                  </p>
                  <div className="w-full h-4" />
                  <ul className="absolute top-8 hidden group-hover:block shadow-lg bg-foreground px-6 pb-4 pt-6 space-y-3 -left-6 min-w-[250px] z-50">
                    {collections.map((collection) => (
                      <li key={collection.id}>
                        <Link
                          href={`/tienda/colecciones/${collection.id}`}
                          className="hover:text-secondary text-primary text-[15px] block"
                        >
                          {collection.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}

              <li className="max-lg:border-b max-lg:py-2">
                <Link
                  href="/tienda"
                  className="hover:text-secondary text-primary text-[15px] block"
                >
                  Tienda
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2">
                <a
                  href="#"
                  className="hover:text-secondary text-primary text-[15px] block"
                >
                  FBM
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-2">
                <a
                  href="#"
                  className="hover:text-secondary text-primary text-[15px] block"
                >
                  About
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-2">
                <a
                  href="#"
                  className="hover:text-secondary text-primary text-[15px] block"
                >
                  Tallas
                </a>
              </li>
            </ul>
          </div>
          <div className="flex-none px-5 xl:px-12 py-6">
            {/* Logo */}
            <a
              href="#"
              className="flex justify-center w-full"
            >
              <img
                className="object-cover h-20"
                src="/img/pixelup.png"
                alt="logo"
              />
            </a>
          </div>
          <div className="flex-1 items-center justify-end px-5 xl:px-12 hidden xl:flex">
            {/* Header Icons */}
          </div>
          {/* Icons for mobile menu */}
          <div className=" self-center">
            <div className="flex gap-10 xl:gap-4 self-center">
              <Buscador />
              <CartCanvas />
              <div>
                {AdminToken ? (
                  <DropdownAdmin />
                ) : ClientToken ? (
                  <DropdownUser />
                ) : (
                  !AdminToken && (
                    <section className="flex">
                      <div>
                        <Link
                          className="p-2 bg-primary uppercase text-xs hover:bg-secondary hover:text-primary rounded-md m-1 text-white"
                          href="/tienda/login"
                        >
                          Login
                        </Link>
                      </div>
                      <div>
                        <Link
                          className="p-2 bg-primary uppercase text-xs hover:bg-secondary hover:text-primary rounded-md m-1 text-white"
                          href="/tienda/register"
                        >
                          Registrarse
                        </Link>
                      </div>
                    </section>
                  )
                )}
              </div>
            </div>
          </div>
          {/* Responsive navbar toggle */}
          <div className="self-center flex">
            <ThemeToggler />
          </div>{" "}
          <button
            className=" navbar-burger self-center mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 hover:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>
      </section>
    </div>
  );
};

export default Navbar01;
