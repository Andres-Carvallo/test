import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Importa useRouter
import { useTheme } from "next-themes";
import ThemeToggler from "../Theme/ThemeToggler";
import Buscador from "../Buscador/Buscador02";
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
  const [showModal, setShowModal] = useState(false);
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

  const handleKeydown = (event:any) => {
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

  return (
    <nav className="bg-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-32">
          <div className="flex items-center flex-grow">
            <div className="hidden md:block">
              <ul className="flex flex-col md:flex-row md:space-x-4">
                <li className={pathname === "/" ? "text-primary" : ""}>
                  <Link href="/" className="text-base font-medium">
                    Inicio
                  </Link>
                </li>
                <li className={pathname === "/tienda" ? "text-primary" : ""}>
                  <Link href="/tienda" className="hover:text-primary text-base font-medium">
                    Tienda
                  </Link>
                </li>
                {collections.length > 0 && (
                  <li className="group relative">
                    <p className="hover:text-primary cursor-pointer text-base font-medium flex items-center">
                      Colecciones
                      <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" className="ml-1" viewBox="0 0 24 24">
                        <path d="M12 16a1 1 0 0 1-.71-.29l-6-6a1 1 0 0 1 1.42-1.42l5.29 5.3 5.29-5.29a1 1 0 0 1 1.41 1.41l-6 6a1 1 0 0 1-.7.29z" data-name="16" data-original="#000000" />
                      </svg>
                    </p>
                    <ul className="hidden absolute left-0 w-48 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg group-hover:block">
                      {collections.map((collection) => (
                        <li key={collection.id} className="flex gap-2 pb-2 border-b pl-2 py-2">
                          <span className="self-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                          </span>
                          <Link href={`/tienda/colecciones/${collection.id}`} className="hover:text-primary text-base text-[15px] block">
                            {collection.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                <li className={pathname === "/fbm" ? "text-primary" : ""}>
                  <Link href="/fbm" className="hover:text-primary text-base font-medium">
                    FBM
                  </Link>
                </li>
                <li className={pathname === "/about" ? "text-primary" : ""}>
                  <Link href="javascript:void(0)" className="hover:text-primary text-base font-medium">
                    <button onClick={() => setShowModal(true)}>
                      Tallas
                    </button>
                  </Link>
                </li>
                <li className={pathname === "/contacto" ? "text-primary" : ""}>
                  <Link href="/contacto" className="hover:text-primary text-base font-medium">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center w-full">
              <Link href="/">
                <img className="h-24 w-24" src="/img/Logo/LogoFBM_300.png" alt="Logo" />
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-grow justify-end">
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
                      <Link className="p-2 bg-primary uppercase text-xs hover:bg-secondary hover:text-primary rounded-md m-1 text-white" href="/tienda/register">
                        Registrarse
                      </Link>
                    </div>
                  </section>
                )
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300"
              aria-label="Main menu"
              aria-expanded="false"
            >
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
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
          <ul>
            <li className={`max-lg:border-b max-lg:py-2 ${pathname === "/tienda" ? "text-primary" : ""}`} />
            <Link href="/tienda" className="hover:text-primary text-base font-semibold">
              Tienda
            </Link>
            {collections.length > 0 && (
              <li className="group">
                <p className="hover:text-primary border-b cursor-pointer text-base font-medium py-2 fill-primary lg:hover:fill-secondary flex items-center">
                  Colecciones
                  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" className="ml-1" viewBox="0 0 24 24">
                    <path d="M12 16a1 1 0 0 1-.71-.29l-6-6a1 1 0 0 1 1.42-1.42l5.29 5.3 5.29-5.29a1 1 0 0 1 1.41 1.41l-6 6a1 1 0 0 1-.7.29z" data-name="16" data-original="#000000" />
                  </svg>
                </p>
                <ul className="hidden group-hover:block mt-2 space-y-2">
                  {collections.map((collection) => (
                    <li key={collection.id} className="flex gap-2 pb-2 border-b pl-2">
                      <span className="self-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </span>
                      <Link href={`/tienda/colecciones/${collection.id}`} className="hover:text-primary text-base text-[15px] block">
                        {collection.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
            <li className={`max-lg:border-b max-lg:py-2 ${pathname === "/fbm" ? "text-primary" : ""}`}>
              <Link href="/fbm" className="hover:text-primary text-base font-medium">
                FBM
              </Link>
            </li>
            <li className={`max-lg:border-b max-lg:py-2 ${pathname === "/about" ? "text-primary" : ""}`}>
              <Link href="javascript:void(0)" className="hover:text-primary text-base font-medium">
                <button onClick={() => setShowModal(true)}>
                  Tallas
                </button>
              </Link>
            </li>
            <li className={`max-lg:py-2 ${pathname === "/contacto" ? "text-primary" : ""}`}>
              <Link href="/contacto" className="hover:text-primary text-base font-medium">
                Contacto
              </Link>
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
                    <Link className="p-2 hidden bg-primary uppercase text-xs hover:bg-secondary hover:text-primary rounded-md m-1 text-white" href="/tienda/register">
                      Registrarse
                    </Link>
                  </div>
                </section>
              )
            )}
          </div>
        </div>
      </div>
      {/* Modal de confirmación */}
      {showModal && (
        <div
  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50"
  onClick={() => setShowModal(false)}
>
  <div className="bg-white p-6 rounded-lg shadow-lg relative" onClick={(e) => e.stopPropagation()}>
    <button onClick={() => setShowModal(false)} className="absolute top-2 right-4 text-4xl">
      &times;
    </button>
    <img 
      src="/img/Tabladetallas/TabladeTallas.webp" 
      alt="Tabla de Tallas" 
      className="max-w-full max-h-full object-contain" 
      style={{ maxWidth: '80vw', maxHeight: '80vh' }} 
    />
  </div>
</div>
      )}
    </nav>
  );
}
