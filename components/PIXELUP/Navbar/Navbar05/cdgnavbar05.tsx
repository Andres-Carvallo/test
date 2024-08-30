import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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

  const [pathname, setPathname] = useState("");

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

  useEffect(() => {
    fetchCollections();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg relative">
      <div className="max-w-8xl mx-6 px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-32">
          <div className="flex items-center gap-6 min-w-[120px]">
            <div className="flex-shrink-0 pr-4">
              <Link href="/">
                <img className="w-24" src="/img/Logo/tavola.jpeg" alt="Logo" />
              </Link>
            </div>
            <div className="hidden xl:block">
              <ul className="flex flex-col md:flex-row md:space-x-8 uppercase">
                <li className={pathname === "/" ? "text-primary" : ""}>
                  <Link href="/" className="text-base font-medium">
                    Inicio
                  </Link>
                </li>
                {collections.length > 0 && (
                  <ul className="flex flex-col md:flex-row md:space-x-8">
                    {collections.map((collection) => (
                      <li key={collection.id} className="group relative">
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
          </div>
          <div className="-mr-2 flex xl:hidden">
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
  <Link href="/">
    <img className="w-48" src="/img/Logo/tavola.jpeg" alt="Logo" />
  </Link>
</div>

          <ul className="flex flex-col text-center pb-8">
            <li className={`py-2 ${pathname === "/tienda" ? "text-primary" : ""}`}>
              <Link href="#" className="hover:text-primary text-base font-medium">
                INICIO
              </Link>
            </li>
            {collections.length > 0 && (
              <ul className="flex flex-col space-y-1 text-center">
                {collections.map((collection) => (
                  <li
                    key={collection.id}
                    className={`${pathname === "/tienda" ? "text-primary" : ""}`}
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
            <li className={`py-2 text-center ${pathname === "/cotiza-tu-evento" ? "text-primary" : ""}`}>
              <Link href="/cotiza-tu-evento" className="hover:text-primary text-base font-medium uppercase">
                Cotiza tu evento
              </Link>
            </li>
          </ul>

          <div className="border-y  py-4 flex justify-center items-center">
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
        </div>
      </div>
    </nav>
  );
}
