"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import CrearUsuarioForm from "@/components/Offcanvas/form/CrearUsuarioForm";

function UserCanvas() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const offcanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  useEffect(() => {
    if (!offcanvasRef.current) {
      return;
    }

    if (isMenuOpen) {
      offcanvasRef.current.classList.add("translate-x-0");
    } else {
      offcanvasRef.current.classList.remove("translate-x-0");
      offcanvasRef.current.classList.add("translate-x-full");
    }
  }, [isMenuOpen]);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      <Link
        href="#"
        onClick={handleMenuOpen}
        className="menu-open-btn ease-in-up rounded-sm bg-primary px-8 py-3 text-base font-medium text-secondary shadow-btn transition duration-300 hover:bg-secondary hover:text-primary hover:shadow-btn-hover md:block md:px-9 lg:px-6 xl:px-9"
      >
        Crear Usuario
      </Link>
      <div
        ref={offcanvasRef}
        className={`offcanvas-menu fixed z-99 bg-primary h-screen dark:border-strokedark dark:bg-form-strokedark top-20 right-0 p-6 w-2/3 md:w-[430px] ease-in-out duration-1000 shadow-md flex items-center ${
          isMenuOpen ? "" : "translate-x-full"
        }`}
      >
        <Link
          href="#"
          onClick={handleMenuClose}
          className="menu-close-btn absolute top-6 left-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </Link>
        <div className="flex flex-col w-full mt-[-4rem]">
          <h1 className="text-secondary text-2xl font-bold text-center mb-8">
            Crear Nuevo Usuario
          </h1>
          <CrearUsuarioForm onClose={handleMenuClose} />
        </div>
      </div>
    </div>
  );
}

export default UserCanvas;
