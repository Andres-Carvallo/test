/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import Link from "next/link";

export default function NavbarBannerAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Mantener el efecto de scroll
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setIsScrolled(window.scrollY > 50);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Modificar esta función para que redirija a la página principal con el anchor
  const handleNavigation = (sectionId: string) => {
    window.location.href = `/#${sectionId}`;
  };

  return (
    <nav
      className={`w-full z-[1000] transition-all duration-300 font-montserrat ${
        isScrolled ? "bg-[#F5F7F2] shadow-md" : "bg-[#F5F7F2]"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-[#4A6741]">
              <span className="text-lg font-light tracking-wider font-poppins uppercase">
                Health Coach
              </span>
              <div className="text-lg uppercase tracking-[0.3em] text-[#6B8E4E] mt-[-2px]">
                Pepa
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Menú desktop */}
            <div className="hidden md:flex space-x-6 text-xs tracking-wider uppercase font-bold">
              <button
                onClick={() => handleNavigation("inicio")}
                className="text-[#4A6741] hover:opacity-80 uppercase"
              >
                Inicio
              </button>
              <button
                onClick={() => handleNavigation("que-es")}
                className="text-[#4A6741] hover:opacity-80 uppercase"
              >
                ¿Qué es?
              </button>
              <button
                onClick={() => handleNavigation("planes")}
                className="text-[#4A6741] hover:opacity-80 uppercase"
              >
                Servicios
              </button>
              <button
                onClick={() => handleNavigation("redes")}
                className="text-[#4A6741] hover:opacity-80 uppercase"
              >
                Recetas
              </button>
              <button
                onClick={() => handleNavigation("conoceme")}
                className="text-[#4A6741] hover:opacity-80 uppercase"
              >
                Conóceme
              </button>
              <button
                onClick={() => handleNavigation("contacto")}
                className="text-[#4A6741] hover:opacity-80 uppercase"
              >
                CONTACTO
              </button>
            </div>

            {/* Iconos sociales */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="https://www.instagram.com/healthcoach_pepa/"
                target="_blank"
                className="text-[#4A6741] hover:opacity-80 transition-opacity"
              >
                <FaInstagram size={20} />
              </Link>
              <Link
                href={`https://wa.me/15819947712?text=${encodeURIComponent(
                  "Hola! Me gustaría obtener más información sobre tus servicios"
                )}`}
                target="_blank"
                className="text-[#4A6741] hover:opacity-80 transition-opacity"
              >
                <FaWhatsapp size={20} />
              </Link>
            </div>

            {/* Botón de menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-2xl"
            >
              <div className="text-[#4A6741]">{isMenuOpen ? "✕" : "☰"}</div>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden absolute left-0 right-0 mt-3 z-[999] ${
            isMenuOpen ? "max-h-[300px]" : "max-h-0"
          }`}
          style={{
            background: "#F5F7F2",
            boxShadow: isMenuOpen
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              : "none",
          }}
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-col space-y-4 py-6">
              {/* Links del menú móvil */}
              <div className="flex flex-col space-y-4 text-sm tracking-wider uppercase font-bold text-[#4A6741]">
                <button
                  onClick={() => {
                    handleNavigation("inicio");
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-[#6B8E4E] transition-colors duration-200 text-left"
                >
                  Inicio
                </button>
                <button
                  onClick={() => {
                    handleNavigation("que-es");
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-[#6B8E4E] transition-colors duration-200 text-left"
                >
                  ¿Qué es?
                </button>
                <button
                  onClick={() => {
                    handleNavigation("planes");
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-[#6B8E4E] transition-colors duration-200 text-left"
                >
                  Servicios
                </button>
                <button
                  onClick={() => {
                    handleNavigation("redes");
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-[#6B8E4E] transition-colors duration-200 text-left"
                >
                  Recetas
                </button>
                <button
                  onClick={() => {
                    handleNavigation("conoceme");
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-[#6B8E4E] transition-colors duration-200 text-left"
                >
                  Conóceme
                </button>
                <button
                  onClick={() => {
                    handleNavigation("contacto");
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-[#6B8E4E] transition-colors duration-200 text-left"
                >
                  Contacto
                </button>
              </div>

              {/* Separador */}
              <div className="h-px w-full bg-[#4A6741]/10"></div>

              {/* Iconos sociales móvil */}
              <div className="flex items-center gap-6 justify-center pt-2">
                <Link
                  href="https://www.instagram.com/healthcoach_pepa/"
                  target="_blank"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#4A6741] hover:text-[#6B8E4E] transition-colors"
                >
                  <FaInstagram size={24} />
                </Link>
                <Link
                  href={`https://wa.me/15819947712?text=${encodeURIComponent(
                    "Hola! Me gustaría obtener más información sobre tus servicios"
                  )}`}
                  target="_blank"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#4A6741] hover:text-[#6B8E4E] transition-colors"
                >
                  <FaWhatsapp size={24} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}