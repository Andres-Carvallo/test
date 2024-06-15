/* eslint-disable @next/next/no-img-element */
//import DropdownUser from "../Dropdown/DropdownUser/User";

import Link from "next/link";
import CartCanvas from "../CartCanva/CartCanvas";
import DropdownUser from "../Dropdown/DropdownUser/DropdownUser";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import Buscador from "../PIXELUP/Buscador/Buscador01";

const Header = () => {
  const cookieStore = cookies();
  const AdminTokenAuth = cookieStore.get("AdminTokenAuth")?.value;
  const decodeToken = AdminTokenAuth ? jwtDecode(AdminTokenAuth) : null;
  console.log("Token:", decodeToken);

  return (
    <section>
      <header className="border-b bg-white font-sans min-h-[60px]">
        <div className="flex flex-wrap items-center justify-between px-10 py-3 gap-4 relative">
          <a
            href="/"
            className="text-2xl font-bold"
          >
            <img
              src="/img/logo-1.png"
              alt=""
              className="h-14"
            />
          </a>

          <div className="flex items-center max-lg:ml-auto lg:order-1">
            <span className="relative hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                className="cursor-pointer fill-[#333] hover:fill-[#007bff] inline"
                viewBox="0 0 64 64"
              >
                <path
                  d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                  data-original="#000000"
                />
              </svg>
              <span className="absolute left-auto -ml-1 top-0 rounded-full bg-black px-1 py-0 text-xs text-white">
                1
              </span>
            </span>
            <span className="relative ml-8">
              <CartCanvas />
            </span>
            <Buscador />
            <button
              id="toggle"
              className="lg:hidden ml-7"
            >
              <svg
                className="w-7 h-7"
                fill="#000"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <Link
              href="/dashboard/productos"
              className="ml-7"
            ></Link>
            {AdminTokenAuth ? (
              <DropdownUser />
            ) : (
              <section className="flex">
                <div>
                  <Link
                    className="p-2 bg-dark uppercase text-xs hover:bg-primary hover:text-dark rounded-md m-1 text-white"
                    href="/tienda/login"
                  >
                    Login
                  </Link>
                </div>
                <div>
                  <Link
                    className="p-2 bg-dark uppercase text-xs hover:bg-primary hover:text-dark rounded-md m-1 text-white"
                    href="/tienda/registrar"
                  >
                    Registrarse
                  </Link>
                </div>
              </section>
            )}
          </div>
          <ul
            id="collapseMenu"
            className="lg:!flex max-lg:hidden max-lg:w-full lg:space-x-10 max-lg:space-y-4 max-lg:my-4"
          >
            <li className="max-lg:border-b max-lg:py-2">
              <Link
                href="/"
                className="hover:text-celeste   text-dark uppercase  rounded text-[18px] font-medium font-sans  block"
              >
                inicio
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-2">
              <Link
                href="/tienda"
                className="hover:text-celeste   text-dark uppercase  rounded text-[18px] font-medium font-sans  block"
              >
                Tienda
              </Link>
            </li>

            <li className="max-lg:border-b max-lg:py-2">
              <a
                href="javascript:void(0)"
                className="hover:text-celeste   text-dark uppercase  rounded text-[18px] font-medium font-sans  block"
              >
                About
              </a>
            </li>
            <li className="max-lg:border-b max-lg:py-2">
              <Link
                href="/tienda/contacto"
                className="hover:text-celeste   text-dark uppercase  rounded text-[18px] font-medium font-sans  block"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </section>
  );
};

export default Header;
