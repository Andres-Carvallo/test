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
import DropdownAdminMobile from "@/components/Dropdown/DropdownAdmin/DropdownAdminMobile";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [productTypes, setProductTypes] = useState([]);
  const AdminToken = getCookie("AdminTokenAuth");
  const ClientToken = getCookie("ClientTokenAuth");
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const Logo = process.env.NEXT_PUBLIC_LOGO_COLOR;
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
    fetchProductTypes();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleKeydown = (event: any) => {
    if (event.key === "Escape") {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      window.addEventListener("keydown", handleKeydown);
    } else {
      window.removeEventListener("keydown", handleKeydown);
    }
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [showModal]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const toggleVisibility1 = () => {
    setIsVisible1(!isVisible1);
  };

  const fetchProductTypes = async () => {
    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/product-types?siteId=${SiteId}&pageNumber=1&pageSize=50`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product types");
      }
      const data = await response.json();
      setProductTypes(data.productTypes);
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  const excludedIds = `${process.env.NEXT_PUBLIC_BANNER_NAVBAR}`;
  const filteredCollections = collections
    .filter((collection) => !excludedIds.includes(collection.id))
    .sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);

  return (
    <nav className="bg-white shadow-lg relative">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden grid grid-cols-3 items-center h-32">
          {/* Columna izquierda - Botón de menú en mobile y menú en desktop */}
          <div className="flex items-center justify-start gap-2">
            <div>
              <Buscador />
            </div>
            <div className="hidden lg:flex">
              <CartCanvas />
            </div>
            <div className="hidden lg:flex pl-2">
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
          </div>

          {/* Columna central - Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <img className="h-24 w-24" src={Logo} alt="FBM Joyas" />
            </Link>
          </div>

          {/* Columna derecha - Buscar y Login */}
          <div className="flex items-center justify-end">
            {/* Botón de menú en mobile */}
            <div className="-mr-2 flex lg:hidden">
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
            </div>

            {/* Menú en desktop */}
            <div className="hidden lg:block">
              <ul className="flex flex-col md:flex-row md:space-x-4">
                <li className={pathname === "/" ? "text-primary" : ""}>
                  <Link href="/" className="text-base font-medium">
                    Inicio
                  </Link>
                </li>
                {/*             <li className={pathname === "/tienda" ? "text-primary" : ""}>
              <Link
                href="/tienda"
                className="hover:text-primary text-base font-medium"
              >
                Tienda
              </Link>
            </li> */}
                {collections.length > 0 && (
                  <li className="group relative">
                    <p className="hover:text-primary cursor-pointer text-base font-medium flex items-center">
                      Tienda
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
                    <ul className="hidden absolute left-0 w-48 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg group-hover:block">
                      {productTypes.map((productType: any) => (
                        <li
                          key={productType.id}
                          className="flex gap-2 pb-2 border-b pl-2 py-2"
                        >
                          <span className="self-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </span>
                          <Link
                            href={`/tienda?categoria=${productType.id}`}
                            className="hover:text-primary text-base text-[15px] block"
                          >
                            {productType.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                {collections.length > 0 && (
                  <li className="group relative">
                    <p className="hover:text-primary cursor-pointer text-base font-medium flex items-center">
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
                    <ul className="hidden absolute left-0 w-48 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg group-hover:block">
                      {collections.map((collection) => (
                        <li
                          key={collection.id}
                          className="flex gap-2 pb-2 border-b pl-2 py-2"
                        >
                          <span className="self-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </span>
                          <Link
                            href={`/tienda/colecciones/${collection.id}`}
                            className="hover:text-primary text-base text-[15px] block"
                          >
                            {collection.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                <li className={pathname === "/fbm" ? "text-primary" : ""}>
                  <Link
                    href="/fbm"
                    className="hover:text-primary text-base font-medium"
                  >
                    FBM
                  </Link>
                </li>
                <li className={pathname === "/about" ? "text-primary" : ""}>
                  <button
                    className="hover:text-primary text-base font-medium"
                    onClick={() => setShowModal(true)}
                  >
                    Tallas
                  </button>
                </li>
                <li className={pathname === "/contacto" ? "text-primary" : ""}>
                  <Link
                    href="/contacto"
                    className="hover:text-primary text-base font-medium"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>


        <div className="hidden lg:grid grid-cols-3 items-center h-32">
          {/* Columna izquierda - Botón de menú en mobile y menú en desktop */}
          <div className="flex items-center justify-start">
            {/* Botón de menú en mobile */}
            <div className="-mr-2 flex lg:hidden">
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
            </div>

            {/* Menú en desktop */}
            <div className="hidden lg:block">
              <ul className="flex flex-col md:flex-row md:space-x-4">
                <li className={pathname === "/" ? "text-primary" : ""}>
                  <Link href="/" className="text-base font-medium">
                    Inicio
                  </Link>
                </li>
                {/*             <li className={pathname === "/tienda" ? "text-primary" : ""}>
              <Link
                href="/tienda"
                className="hover:text-primary text-base font-medium"
              >
                Tienda
              </Link>
            </li> */}
                {collections.length > 0 && (
                  <li className="group relative">
                    <p className="hover:text-primary cursor-pointer text-base font-medium flex items-center">
                      Tienda
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
                    <ul className="hidden absolute left-0 w-48 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg group-hover:block">
                      {productTypes.map((productType: any) => (
                        <li
                          key={productType.id}
                          className="flex gap-2 pb-2 border-b pl-2 py-2"
                        >
                          <span className="self-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </span>
                          <Link
                            href={`/tienda?categoria=${productType.id}`}
                            className="hover:text-primary text-base text-[15px] block"
                          >
                            {productType.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                {collections.length > 0 && (
                  <li className="group relative">
                    <p className="hover:text-primary cursor-pointer text-base font-medium flex items-center">
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
                    <ul className="hidden absolute left-0 w-48 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg group-hover:block">
                      {collections.map((collection) => (
                        <li
                          key={collection.id}
                          className="flex gap-2 pb-2 border-b pl-2 py-2"
                        >
                          <span className="self-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </span>
                          <Link
                            href={`/tienda/colecciones/${collection.id}`}
                            className="hover:text-primary text-base text-[15px] block"
                          >
                            {collection.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                <li className={pathname === "/fbm" ? "text-primary" : ""}>
                  <Link
                    href="/fbm"
                    className="hover:text-primary text-base font-medium"
                  >
                    FBM
                  </Link>
                </li>
                <li className={pathname === "/about" ? "text-primary" : ""}>
                  <button
                    className="hover:text-primary text-base font-medium"
                    onClick={() => setShowModal(true)}
                  >
                    Tallas
                  </button>
                </li>
                <li className={pathname === "/contacto" ? "text-primary" : ""}>
                  <Link
                    href="/contacto"
                    className="hover:text-primary text-base font-medium"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Columna central - Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <img className="h-24 w-24" src={Logo} alt="FBM Joyas" />
            </Link>
          </div>

          {/* Columna derecha - Buscar y Login */}

          <div className="flex items-center justify-end gap-2">
            <div>
              <Buscador />
            </div>
            <div className="hidden lg:flex">
              <CartCanvas />
            </div>
            <div className="hidden lg:flex pl-2">
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
          </div>
        </div>
      </div>

      {/* Menu desplegable en mobile */}
      <div
        className={`fixed inset-0 z-50 bg-white dark:bg-gray-800 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="pt-2 pb-3 space-y-1 px-6 text-3xl">
          <div className="flex-shrink-0 flex justify-center items-center mb-8">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <img className="w-40" src={Logo} alt="FBM Joyas" />
            </Link>
          </div>

          <ul className="flex flex-col text-center pb-8">
            <li className={` ${pathname === "/" ? "text-primary" : ""}`}>
              <Link
                href="/"
                className="hover:text-primary text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                INICIO
              </Link>
            </li>
            {/*             <li className={pathname === "/tienda" ? "text-primary" : ""}>
                <Link
                  href="/tienda"
                  className="hover:text-primary text-base font-medium"
                >
                  TIENDA
                </Link>
              </li> */}
            <li className={`${pathname === "/" ? "text-primary" : ""}`}>
              <button
                className="relative items-center justify-center hover:text-primary text-base font-medium"
                onClick={toggleVisibility}
              >
                TIENDA
                <div className="absolute" style={{ top: "3px", left: "65px" }}>
                  {isVisible ? (
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </li>
            {isVisible && (
              <div className="border-b border-t pb-2 mt-2">
                {collections.length > 0 && (
                  <ul className="flex flex-col space-y-1 text-center ">
                    {productTypes.map((productType: any) => (
                      <li
                        key={productType.id}
                        className={`${
                          pathname === `/tienda?categoria=${productType.id}` ? "text-primary" : ""
                        }`}
                      >
                        <Link
                          href={`/tienda?categoria=${productType.id}`}
                          className="hover:text-primary text-base font-medium uppercase"
                          onClick={() => setIsOpen(false)}
                        >
                          {productType.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <li className={`${pathname === "/" ? "text-primary" : ""}`}>
              <button
                className="relative items-center justify-center hover:text-primary text-base font-medium"
                onClick={toggleVisibility1}
              >
                COLECCIONES
                <div className="absolute" style={{ top: "3px", left: "121px" }}>
                  {isVisible1 ? (
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </li>
            {isVisible1 && (
              <div className="border-b border-t pb-2 mt-2">
                {collections.length > 0 && (
                  <ul className="flex flex-col space-y-1 text-center ">
                    {filteredCollections.map((collection) => (
                      <li
                        key={collection.id}
                        className={`${
                          pathname === "/tienda" ? "text-primary" : ""
                        }`}
                      >
                        <Link
                          href={`/tienda/colecciones/${collection.id}`}
                          className="hover:text-primary text-base font-medium uppercase"
                          onClick={() => setIsOpen(false)}
                        >
                          {collection.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <li className={pathname === "/fbm" ? "text-primary" : ""}>
              <Link
                href="/fbm"
                className="hover:text-primary text-base font-medium uppercase"
              >
                FBM
              </Link>
            </li>
            <li className={pathname === "/nosotros" ? "text-primary" : ""}>
              <button
                className="hover:text-primary text-base font-medium"
                onClick={() => setShowModal(true)}
              >
                TALLAS
              </button>
            </li>
            <li className={pathname === "/contacto" ? "text-primary" : ""}>
              <Link
                href="/contacto"
                className="hover:text-primary text-base font-medium uppercase"
              >
                CONTACTO
              </Link>
            </li>
          </ul>

          <div className="w-full py-4 flex  items-center">
            <div className="w-full flex justify-center items-center mb-4">
              {AdminToken ? (
                <DropdownAdminMobile toggleMenu={toggleMenu} />
              ) : ClientToken ? (
                <DropdownUserMobile toggleMenu={toggleMenu} />
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
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
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
    </nav>
  );
}
