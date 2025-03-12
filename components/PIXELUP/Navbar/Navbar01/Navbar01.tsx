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
import { mainMenuConfig, layoutConfig } from "@/app/config/menulinks";
import { slugify } from "@/app/utils/slugify";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const { theme, setTheme } = useTheme();
  const [productosIniciales, setProductosIniciales] = useState([]);

  const Logo = process.env.NEXT_PUBLIC_LOGO_COLOR;
  const AdminToken = getCookie("AdminTokenAuth");
  const ClientToken = getCookie("ClientTokenAuth");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [pathname, setPathname] = useState("");

  // Filtrar los enlaces del menú que son visibles
  const menuItems = mainMenuConfig.showInNavbar
    ? mainMenuConfig.links.filter((link) => link.isVisible)
    : [];

  // Obtener las configuraciones de colores del menú
  const menuColor = mainMenuConfig.menuColor || "red-500";
  const activeFontWeight = mainMenuConfig.activeFontWeight || "font-bold";

  // Clases de color para el menú
  const activeColorClass = `text-${menuColor}`;
  const hoverColorClass = `hover:text-${menuColor}`;

  const excludedIds = `${process.env.NEXT_PUBLIC_BANNER_NAVBAR}`;
  const filteredCollections = collections
    .filter((collection) => !excludedIds.includes(collection.id))
    .sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);

  // Función para verificar si una ruta está activa
  const isActive = (path: string) => {
    if (!pathname) return false;

    // Verificar si es la ruta exacta
    if (pathname === path) return true;

    // Caso especial para la tienda
    if (path === "/tienda" && pathname.startsWith("/tienda/")) return true;

    // Verificar si es una subruta (para colecciones)
    if (path !== "/" && pathname.startsWith(path)) return true;

    return false;
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

  // Limpiar el timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleDropdownEnter = (index: number) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms de retraso antes de cerrar
    setDropdownTimeout(timeout as NodeJS.Timeout);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg relative">
      {/* Barra principal de navegación */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center ${
            layoutConfig.logoCentered
              ? "justify-between relative"
              : "justify-between"
          } h-24`}
        >
          {/* Menú principal - versión escritorio */}
          <div
            className={`hidden xl:flex ${
              layoutConfig.logoCentered
                ? "order-1 justify-start w-1/3"
                : "order-2 flex-grow justify-center"
            }`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-8 uppercase">
              {menuItems.map((item, index) => {
                // Si es un menú desplegable de colecciones
                if (item.isDropdown && item.dropdownType === "collections") {
                  return (
                    <li
                      key={index}
                      className="relative"
                      onMouseEnter={() => handleDropdownEnter(index)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <p
                        className={`cursor-pointer text-base font-medium flex items-center ${hoverColorClass} ${
                          pathname.includes("/tienda/colecciones")
                            ? `${activeColorClass} ${activeFontWeight}`
                            : ""
                        }`}
                      >
                        {item.title}
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
                      {/* Área de padding invisible para facilitar la navegación al submenú */}
                      <div className="absolute h-4 w-full left-0 top-full"></div>
                      <ul
                        className={`absolute uppercase left-0 w-64 z-50 bg-white dark:bg-gray-800  dark:border-gray-700 shadow-lg rounded-md py-2 mt-4 transition-all duration-300 ${
                          activeDropdown === index
                            ? "opacity-100 visible"
                            : "opacity-0 invisible"
                        }`}
                      >
                        {filteredCollections.map((collection) => {
                          const collectionPath = `/tienda/colecciones/${slugify(
                            collection.title
                          )}`;
                          return (
                            <li
                              key={collection.id}
                              className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                                pathname === collectionPath
                                  ? "bg-gray-100 dark:bg-gray-600"
                                  : ""
                              }`}
                            >
                              <Link
                                href={collectionPath}
                                className={`flex items-center px-4 py-2 text-sm ${hoverColorClass} ${
                                  pathname === collectionPath
                                    ? `${activeColorClass} font-medium`
                                    : ""
                                }`}
                              >
                                <span className="mr-2">
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
                                {collection.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                }
                // Si es un enlace normal
                return (
                  <li
                    key={index}
                    className={
                      isActive(item.path)
                        ? `${activeColorClass} ${activeFontWeight}`
                        : ""
                    }
                  >
                    <Link
                      href={item.path}
                      className={`text-base font-medium ${hoverColorClass} ${
                        isActive(item.path) ? activeColorClass : ""
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Logo - puede estar centrado o a la izquierda según la configuración */}
          <div
            className={`flex items-center gap-6 min-w-[120px] ${
              layoutConfig.logoCentered
                ? "xl:order-2 xl:absolute xl:left-1/2 xl:transform xl:-translate-x-1/2 order-1 flex-grow justify-center"
                : "order-1"
            }`}
          >
            <div className="flex-shrink-0 pr-4">
              <Link href="/">
                <img
                  className="w-24"
                  src={Logo}
                  alt={process.env.NEXT_PUBLIC_NOMBRE_TIENDA}
                />
              </Link>
            </div>
          </div>

          {/* Botones de acción - versión escritorio */}
          <div
            className={`hidden xl:flex items-center gap-4 ${
              layoutConfig.logoCentered
                ? "order-3 w-1/3 justify-end"
                : "order-3"
            }`}
          >
            <div className="hidden xl:flex">
              <Buscador productosIniciales={productosIniciales} />
            </div>
            <div className="hidden xl:flex">
              <CartCanvas />
            </div>
            <div className="hidden xl:flex">
              {AdminToken ? (
                <DropdownAdmin />
              ) : ClientToken ? (
                <DropdownUser />
              ) : (
                !AdminToken && (
                  <Link href="/tienda/login">
                    <div className="py-1 px-3 bg-primary uppercase text-xs hover:bg-secondary hover:text-primary rounded-md text-white">
                      Login
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Botones de acción - versión móvil */}
          <div
            className={`flex xl:hidden items-center gap-4 order-2 justify-end`}
          >
            <div className="flex items-center">
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
        </div>
      </div>

      {/* Menú móvil */}
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
                alt={process.env.NEXT_PUBLIC_NOMBRE_TIENDA}
              />
            </Link>
          </div>

          <ul className="flex flex-col text-center pb-8">
            {menuItems.map((item, index) => {
              // Si es un menú desplegable de colecciones en versión móvil
              if (item.isDropdown && item.dropdownType === "collections") {
                return (
                  <li
                    key={index}
                    className={`${
                      pathname.includes("/tienda/colecciones")
                        ? `${activeColorClass} ${activeFontWeight}`
                        : ""
                    }`}
                  >
                    <button
                      className={`relative flex items-center justify-center ${hoverColorClass} text-base font-medium w-full py-2 ${
                        pathname.includes("/tienda/colecciones")
                          ? activeColorClass
                          : ""
                      }`}
                      onClick={toggleVisibility}
                    >
                      {item.title}
                      <span className="ml-2">
                        {isVisible ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 15.75 7.5-7.5 7.5 7.5"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        )}
                      </span>
                    </button>
                  </li>
                );
              }
              // Si es un enlace normal en versión móvil
              return (
                <li
                  key={index}
                  className={
                    isActive(item.path)
                      ? `${activeColorClass} ${activeFontWeight}`
                      : ""
                  }
                >
                  <Link
                    href={item.path}
                    className={`${hoverColorClass} text-base font-medium ${
                      isActive(item.path) ? activeColorClass : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title.toUpperCase()}
                  </Link>
                </li>
              );
            })}

            {isVisible && (
              <div className="border-t border-gray-200 dark:border-gray-700 py-3 mt-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                {collections.length > 0 && (
                  <ul className="flex flex-col space-y-2 text-center px-4">
                    {filteredCollections.map((collection) => {
                      const collectionPath = `/tienda/colecciones/${collection.id}`;
                      return (
                        <li
                          key={collection.id}
                          className={`${
                            pathname === collectionPath
                              ? `${activeColorClass} ${activeFontWeight}`
                              : ""
                          } transition-colors duration-200`}
                        >
                          <Link
                            href={collectionPath}
                            className={`flex items-center justify-center ${hoverColorClass} text-base font-medium uppercase py-1 ${
                              pathname === collectionPath
                                ? activeColorClass
                                : ""
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="mr-2">
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
                            {collection.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            <li
              className={
                pathname ===
                "/tienda/colecciones/e2b1263f-7cd3-42b9-b08a-8d26e59d91d8"
                  ? `${activeColorClass} ${activeFontWeight}`
                  : ""
              }
            >
              <Link
                href="/tienda/colecciones/e2b1263f-7cd3-42b9-b08a-8d26e59d91d8"
                className={`${hoverColorClass} text-base font-medium uppercase ${
                  pathname ===
                  "/tienda/colecciones/e2b1263f-7cd3-42b9-b08a-8d26e59d91d8"
                    ? activeColorClass
                    : ""
                }`}
              >
                PROMOCIONES
              </Link>
            </li>
          </ul>

          <div className="w-full py-4 flex flex-col items-center">
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
