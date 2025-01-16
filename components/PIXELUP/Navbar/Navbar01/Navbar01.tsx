/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Buscador from "@/components/Core/Buscador/Buscador";
import CartCanvas from "@/components/Core/CartCanva/CartCanvas";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import DropdownAdmin from "@/components/Core/Dropdown/DropdownAdmin/DropdownAdmin";
import DropdownUser from "@/components/Core/Dropdown/DropdownUser/DropdownUser";
import DropdownUserMobile from "@/components/Core/Dropdown/DropdownUser/DropdownUserMobile";
import DropdownAdminMobile from "@/components/Core/Dropdown/DropdownAdmin/DropdownAdminMobile";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { theme, setTheme } = useTheme();
  const [productosIniciales, setProductosIniciales] = useState([]);

  const Logo=process.env.NEXT_PUBLIC_LOGO_COLOR;
  const AdminToken = getCookie("AdminTokenAuth");
  const ClientToken = getCookie("ClientTokenAuth");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [pathname, setPathname] = useState("");

  const excludedIds = `${process.env.NEXT_PUBLIC_BANNER_NAVBAR}`;
  const filteredCollections = collections
    .filter((collection) => !excludedIds.includes(collection.id))
    .sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
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

    // Cargar productos iniciales
    useEffect(() => {
      const loadInitialData = async () => {
        try {
          const productsData = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
            { next: { revalidate: 3600 } }
          ).then((res) => res.json());
  
          if (productsData.code === 0) {
            setProductosIniciales(productsData.products);
          }
        } catch (error) {
          console.error("Error loading initial data:", error);
        }
      };
  
      loadInitialData();
    }, []);

    
  useEffect(() => {
    fetchCollections();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg relative">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-32">
          <div className="flex items-center gap-6 min-w-[120px]">
            <div className="flex-shrink-0 pr-4">
              <Link href="/">
                <img
                  className="w-24"
                  src={Logo}
                  alt="FBM Joyas"
                />
              </Link>
            </div>
          </div>
          <div className="hidden xl:flex flex-grow justify-center">
            <ul className="flex flex-col md:flex-row md:space-x-8 uppercase">
              <li className={pathname === "/" ? "text-primary" : ""}>
                <Link
                  href="/"
                  className="text-base font-medium"
                >
                  Inicio
                </Link>
              </li>
              <li className={pathname === "/tienda" ? "text-primary" : ""}>
                <Link
                  href="/tienda"
                  className="text-base font-medium"
                >
                  Tienda
                </Link>
              </li>
              {collections.length > 0 && (
                <li className="group relative">
                  <p className="hover:text-primary cursor-pointer text-base font-medium flex items-center">
                    PRODUCTOS
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
                  <ul className="hidden absolute uppercase left-0 w-52 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg group-hover:block">
                    {filteredCollections.map((collection) => (
                      <li
                        key={collection.id}
                        className="flex w-auto pb-2 border-b pl-2 py-2 uppercase"
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
                          className="hover:text-primary text-base text-[15px] block "
                        >
                          {collection.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              <li
                className={
                  pathname ===
                  "/tienda/colecciones/e2b1263f-7cd3-42b9-b08a-8d26e59d91d8"
                    ? "text-primary"
                    : ""
                }
              >
                <Link
                  href="/tienda/colecciones/e2b1263f-7cd3-42b9-b08a-8d26e59d91d8"
                  className="hover:text-primary text-base font-medium uppercase"
                >
                  PROMOCIONES
                </Link>
              </li>
              <li className={pathname === "/nosotros" ? "text-primary" : ""}>
                <Link
                  href="/nosotros"
                  className="hover:text-primary text-base font-medium uppercase"
                >
                  nosotros
                </Link>
              </li>
              <li
                className={
                  pathname === "/cotiza-tu-evento" ? "text-primary" : ""
                }
              >
                <Link
                  href="/cotiza-tu-evento"
                  className="hover:text-primary text-base font-medium uppercase"
                >
                  Cotiza Tu evento
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden xl:flex">
              <Buscador productosIniciales={productosIniciales}/>
            </div>
            <div className="hidden xl:flex">
              <CartCanvas />
            </div>
            <div className="hidden xl:flex pl-2">
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
          <div className="flex xl:hidden items-center gap-4">
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
            <div className="">
              <Buscador productosIniciales={productosIniciales} />
            </div>
            <div className="self-center">
              <CartCanvas />
            </div>
            <div className="self-center">
              {AdminToken ? (
                <DropdownAdmin />
              ) : ClientToken ? (
                <DropdownUser />
              ) : (
                !AdminToken && (
                  <Link href="/tienda/login">
                    <div className="py-1 px-2 bg-primary uppercase text-xs hover:bg-secondary hover:text-primary rounded-md text-white">
                      Login
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>

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
          <div className="flex-shrink-0 flex justify-center items-center">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
            >
              <img
                className="w-48"
                src={Logo}
                alt="FBM Joyas"
              />
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
            <li className={pathname === "/tienda" ? "text-primary" : ""}>
                <Link
                  href="/tienda"
                  className="hover:text-primary text-base font-medium"
                >
                  TIENDA
                </Link>
              </li>
            <li className={`${pathname === "/" ? "text-primary" : ""}`}>
              <button
                className="relative items-center justify-center hover:text-primary text-base font-medium"
                onClick={toggleVisibility}
              >
                PRODUCTOS
                <div
                  className="absolute"
                  style={{ top: "3px", left: "121px" }}
                >
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

            <li
              className={
                pathname ===
                "/tienda/colecciones/e2b1263f-7cd3-42b9-b08a-8d26e59d91d8"
                  ? "text-primary"
                  : ""
              }
            >
              <Link
                href="/tienda/colecciones/e2b1263f-7cd3-42b9-b08a-8d26e59d91d8"
                className="hover:text-primary text-base font-medium uppercase"
              >
                PROMOCIONES
              </Link>
            </li>
            <li className={pathname === "/nosotros" ? "text-primary" : ""}>
              <Link
                href="/nosotros"
                className="hover:text-primary text-base font-medium uppercase"
              >
                nosotros
              </Link>
            </li>
            <li
              className={pathname === "/cotiza-tu-evento" ? "text-primary" : ""}
            >
              <Link
                href="/cotiza-tu-evento"
                className="hover:text-primary text-base font-medium uppercase"
              >
                Cotiza Tu evento
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
    </nav>
  );
}