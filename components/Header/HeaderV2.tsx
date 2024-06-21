/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center">
        <Link href="/">
          <img
            src="/img/pixelup.png"
            alt="Logo"
            className="w-10 h-10"
          />
        </Link>
      </div>

      <nav className="md:mx-auto">
        <ul className="md:flex gap-4">
          <li>
            <Link href="/">
              <span className="text-gray-700 hover:text-gray-500">Inicio</span>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <span className="text-gray-700 hover:text-gray-500">
                Sobre nosotros
              </span>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <span className="text-gray-700 hover:text-gray-500">
                Contacto
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-700 hover:text-gray-500"
        >
          {isMenuOpen ? "Cerrar" : "Menú"}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <ul className="mt-4">
            <li>
              <Link href="/">
                <span className="text-gray-700 hover:text-gray-500 block p-2">
                  Inicio
                </span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span className="text-gray-700 hover:text-gray-500 block p-2">
                  Sobre nosotros
                </span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span className="text-gray-700 hover:text-gray-500 block p-2">
                  Contacto
                </span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
