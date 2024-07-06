/* eslint-disable @next/next/no-img-element */
// Sidebar.tsx
"use client";
import React, { useState } from "react";
import "tailwindcss/tailwind.css";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <aside className="fixed top-6  left-6 bottom-6 flex flex-col gap-2.5 w-72 rounded-lg p-4 border border-white/20 bg-black/80 backdrop-blur-lg transition-all duration-500">
      <header className="flex items-center h-18 pb-4 border-b border-white/20">
        <button className="w-13">
          <i className="ai-three-line-horizontal text-lg"></i>
        </button>
        <img
          src="/img/pixelup.png"
          className="h-20"
          alt="Logo"
        />
      </header>
      <ul className="grid list-none p-0 m-0 w-full">
        <li>
          <button
            type="button"
            onClick={() => toggleMenu("Dashboard")}
            className={`font-semibold flex gap-4 items-center h-12 w-full rounded-md px-4 text-primary ${
              activeMenu === "Dashboard" ? "bg-black/30" : "hover:bg-black/10"
            }`}
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                fill=""
              />
              <path
                d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                fill=""
              />
              <path
                d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                fill=""
              />
              <path
                d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                fill=""
              />
            </svg>
            <i className="ai-home-alt1"></i>
            <p className="flex">Dashboard</p>
            <i
              className={`transition-transform ${
                activeMenu === "Dashboard" ? "rotate-180" : ""
              }`}
            ></i>
          </button>

          {activeMenu === "Dashboard" && (
            <div className="transition-all duration-500">
              <ul className="grid list-none p-0 m-0 w-full">
                <li className="flex items-center before:content-['•'] before:text-primary before:text-3xl before:mr-2 before:mb-1 pl-8 text-left w-full py-2">
                  <button className="text-left text-secondary py-2 ml-4">
                    E-Commerce
                  </button>
                </li>
              </ul>
            </div>
          )}
        </li>
        <li>
          <button
            type="button"
            onClick={() => toggleMenu("Productos")}
            className={`font-semibold flex gap-4 items-center h-12 w-full rounded-md px-4 text-primary ${
              activeMenu === "Productos" ? "bg-black/30" : "hover:bg-black/10"
            }`}
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                fill=""
              />
              <path
                d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                fill=""
              />
              <path
                d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                fill=""
              />
              <path
                d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                fill=""
              />
            </svg>
            <i className="ai-dashboard"></i>
            <p className="flex">Productos</p>
            <i
              className={`ai-chevron-down-small transition-transform ${
                activeMenu === "Productos" ? "rotate-180" : ""
              }`}
            ></i>
          </button>
          {activeMenu === "Productos" && (
            <div className="transition-all duration-500">
              <ul className="grid list-none p-0 m-0 w-full">
                <li className="flex items-center before:content-['•'] before:text-primary before:text-3xl before:mr-2 before:mb-1 pl-8 text-left w-full py-2">
                  <button className="text-left text-secondary py-2 ml-4">
                    Productos
                  </button>
                </li>
                <li className="flex items-center before:content-['•'] before:text-primary before:text-3xl before:mr-2 before:mb-1 pl-8 text-left w-full py-2">
                  <button className="text-left text-secondary py-2 ml-4">
                    Crear Producto Simple
                  </button>
                </li>
                <li className="flex items-center before:content-['•'] before:text-primary before:text-3xl before:mr-2 before:mb-1 pl-8 text-left w-full py-2">
                  <button className="text-left text-secondary py-2 ml-4">
                    Crear Producto Variable
                  </button>
                </li>
              </ul>
            </div>
          )}
        </li>
        <li>
          <button
            type="button"
            onClick={() => toggleMenu("Pedidos")}
            className={`font-semibold flex gap-4 items-center h-12 w-full rounded-md px-4 text-primary ${
              activeMenu === "Pedidos" ? "bg-black/30" : "hover:bg-black/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="22"
              height="22"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
              />
            </svg>
            <i className="ai-gear"></i>
            <p className="flex">Pedidos</p>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => toggleMenu("Componentes")}
            className={`font-semibold flex gap-4 items-center h-12 w-full rounded-md px-4 text-primary ${
              activeMenu === "Componentes" ? "bg-black/30" : "hover:bg-black/10"
            }`}
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                fill=""
              />
              <path
                d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                fill=""
              />
              <path
                d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                fill=""
              />
              <path
                d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                fill=""
              />
            </svg>
            <i className="ai-folder-add"></i>
            <p className="flex">Componentes</p>
            <i
              className={`ai-chevron-down-small transition-transform ${
                activeMenu === "Componentes" ? "rotate-180" : ""
              }`}
            ></i>
          </button>
          {activeMenu === "Componentes" && (
            <div className="transition-all duration-500">
              <ul className="grid list-none p-0 m-0 w-full">
                {/*                 <li>
                  <button className="pl-14 text-left w-full py-2">Banner</button>
                </li> */}
                <li className="flex items-center before:content-['•'] before:text-primary before:text-3xl before:mr-2 before:mb-1 pl-8 text-left w-full py-2">
                  <button className="text-left text-secondary py-2 ml-4">
                    Banner
                  </button>
                </li>
                <li className="flex items-center before:content-['•'] before:text-primary before:text-3xl before:mr-2 before:mb-1 pl-8 text-left w-full py-2">
                  <button className="text-left text-secondary py-2 ml-4">
                    Catergorias
                  </button>
                </li>
                <li className="flex items-center before:content-['•'] before:text-primary before:text-3xl before:mr-2 before:mb-1 pl-8 text-left w-full py-2">
                  <button className="text-left text-secondary py-2 ml-4">
                    Colecciones
                  </button>
                </li>
              </ul>
            </div>
          )}
        </li>
        <li>
          <button
            type="button"
            onClick={() => toggleMenu("Content Block")}
            className={`font-semibold flex gap-4 items-center h-12 w-full rounded-md px-4 text-primary ${
              activeMenu === "Content Block"
                ? "bg-black/30"
                : "hover:bg-black/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="22"
              height="22"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
              />
            </svg>
            <i className="ai-person"></i>
            <p className="flex">Content Block</p>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => toggleMenu("Zona Repartos")}
            className={`font-semibold flex gap-4 items-center h-12 w-full rounded-md px-4 text-primary ${
              activeMenu === "Zona Repartos"
                ? "bg-black/30"
                : "hover:bg-black/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="22"
              height="22"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
              />
            </svg>
            <i className="ai-bell"></i>
            <p className="flex">Zona Repartos</p>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => toggleMenu("Cupones")}
            className={`font-semibold flex gap-4 items-center h-12 w-full rounded-md px-4 text-primary ${
              activeMenu === "Cupones" ? "bg-black/30" : "hover:bg-black/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="22"
              height="22"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
              />
            </svg>
            <i className="ai-cart"></i>
            <p className="flex">Cupones</p>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => toggleMenu("clientes")}
            className={`font-semibold flex gap-4 items-center h-12 w-full rounded-md px-4 text-primary ${
              activeMenu === "clientes" ? "bg-black/30" : "hover:bg-black/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="22"
              height="22"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
            <i className="ai-lock-on"></i>
            <p className="flex">Clientes</p>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => toggleMenu("usuarios")}
            className={`font-semibold flex gap-4 items-center h-12 w-full rounded-md px-4 text-primary ${
              activeMenu === "usuarios" ? "bg-black/30" : "hover:bg-black/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="22"
              height="22"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            <i className="ai-lock-on"></i>
            <p className="flex">Usuarios</p>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
