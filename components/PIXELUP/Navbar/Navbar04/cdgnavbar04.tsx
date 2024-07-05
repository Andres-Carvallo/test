/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Importa useRouter
import { useTheme } from "next-themes";
import ThemeToggler from "@/components/PIXELUP/Theme/ThemeToggler";
import Buscador from "@/components/PIXELUP/Buscador/Buscador02";
import CartCanvas from "@/components/CartCanva/CartCanvas";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import DropdownAdmin from "@/components/Dropdown/DropdownAdmin/DropdownAdmin";
import DropdownUser from "@/components/Dropdown/DropdownUser/DropdownUser";
import DropdownUserMobile from "@/components/Dropdown/DropdownUser/DropdownUserMobile";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const AdminToken = getCookie("AdminTokenAuth");
  const ClientToken = getCookie("ClientTokenAuth");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [pathname, setPathname] = useState(""); // Estado para almacenar el pathname

  useEffect(() => {
    // Este efecto solo se ejecutará en el cliente
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname); // Obtén el pathname del cliente
    }
  }, []);

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-32">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 pr-4">
              <Link href="/">
                <img
                  className="h-24 w-24"
                  src="/img/Logo/tavola.jpeg"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="hidden md:block">
              <ul className="flex flex-col md:flex-row md:space-x-4">
                <li className={pathname === "/" ? "text-primary" : ""}>
                  <Link
                    href="/"
                    className="text-base font-medium"
                  >
                    Inicio
                  </Link>
                </li>
                {collections.length > 0 && (
                  <ul className="flex flex-col md:flex-row md:space-x-4">
                    {collections.map((collection) => (
                      <li
                        key={collection.id}
                        className="group relative"
                      >
                        <Link
                          href={`/tienda/colecciones/${collection.id}`}
                          className="hover:text-primary text-base font-medium"
                        >
                          {collection.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <li className={pathname === "/tallas" ? "text-primary" : ""}>
                  <a
                    href="#"
                    className="hover:text-primary text-base font-medium"
                  >
                    Tallas
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <Buscador />
            </div>
            <div className="hidden md:flex">
              <CartCanvas />
            </div>
            <div className="hidden md:flex pl-2">
              {AdminToken ? (
                <DropdownAdmin />
              ) : ClientToken ? (
                <DropdownUser />
              ) : (
                !AdminToken && (
                  <section className="flex">
                    <div>
                      <Link href="/tienda/login">
                        <div className="py-1 px-2 bg-primary uppercase text-xs hover:bg-secondary hover:text-primary rounded-md m-1 text-white">
                          Login
                        </div>
                      </Link>
                    </div>
                    <div className="hidden">
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
            {/*             <div className="hidden md:flex">
              <ThemeToggler />
            </div> */}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300"
              aria-label="Main menu"
              aria-expanded="false"
            >
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <div className="md:hidden self-center mr-4">
              <CartCanvas />
            </div>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 pl-4">
          <ul className="flex flex-col md:flex-row md:space-x-4">
            <li
              className={`max-lg:py-2 ${
                pathname === "/tienda" ? "text-primary" : ""
              }`}
            >
              <Link
                href="/"
                className="hover:text-primary text-base font-semibold"
              >
                Inicio
              </Link>
            </li>
            {collections.length > 0 && (
              <ul className="flex flex-col md:flex-row md:space-x-4">
                {collections.map((collection) => (
                  <li
                    key={collection.id}
                    className={`max-lg:py-2 ${
                      pathname === "/tienda" ? "text-primary" : ""
                    }`}
                  >
                    <Link
                      href={`/tienda/colecciones/${collection.id}`}
                      className="hover:text-primary text-base font-medium"
                    >
                      {collection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <li
              className={`max-lg:py-2 ${
                pathname === "/tallas" ? "text-primary" : ""
              }`}
            >
              <a
                href="#"
                className="hover:text-primary text-base font-medium"
              >
                Tallas
              </a>
            </li>
          </ul>

          <div className="border-y py-4">
            {AdminToken ? (
              <DropdownAdmin />
            ) : ClientToken ? (
              <DropdownUserMobile />
            ) : (
              !AdminToken && (
                <section className="flex">
                  <div>
                    <Link href="/tienda/login">
                      <div className="py-1 px-2 bg-primary uppercase text-xs hover:bg-secondary hover:text-primary rounded-md m-1 text-white">
                        Login
                      </div>
                    </Link>
                  </div>
                  <div>
                    <Link
                      className="p-2 hidden bg-primary uppercase text-xs hover:bg-secondary hover:text-primary rounded-md m-1 text-white"
                      href="/tienda/register"
                    >
                      Registrarse
                    </Link>
                  </div>
                </section>
              )
            )}
          </div>
          {/*           <div className="lg:hidden pt-2 pl-2">
            <ThemeToggler />
          </div> */}
        </div>
      </div>
    </nav>
  );
}
