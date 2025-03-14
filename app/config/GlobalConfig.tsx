/**
 * Configuración global para los componentes principales de la aplicación
 * Este archivo maneja la carga dinámica de componentes y la configuración activa
 */

"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Configuración global por defecto de la aplicación
 */
export const globalConfig: GlobalConfig = {
  activeFooter: "Footer01",
  activeNavbar: "Navbar01",
  activeProductCard: "ProductCard03",
  whatsappButton: {
    isActive: true,
    link: process.env.NEXT_PUBLIC_WHATSAPP_LINK || "",
  },
};

// **************************************************
// ************** Tipos de Componentes **************
// **************************************************

type FooterType = "Footer01" | "Footer02" | "Footer03";
type NavbarType = "Navbar01" | "Navbar02" | "NavbarBanner";
type ProductCardType =
  | "ProductCard01"
  | "ProductCard02"
  | "ProductCard03"
  | "ProductCard04";

// **************************************************
// ************** Componentes de Carga **************
// **************************************************
//Componente de carga general para secciones grandes

const LoadingComponent = () => (
  <div className="animate-pulse bg-gray-100 h-96" />
);

const NavLoadingComponent = () => (
  <div className="animate-pulse bg-gray-100 h-20" />
);

// **************************************************
// ********** Configuración de Componentes **********
// **************************************************
//Configuración de los diferentes tipos de Footer disponibles

const footerComponents = {
  Footer01: dynamic(
    () => import("@/components/PIXELUP/Footer/Footer01/Footer01"),
    { loading: LoadingComponent, ssr: true }
  ),
  Footer02: dynamic(
    () => import("@/components/PIXELUP/Footer/Footer02/Footer02"),
    { loading: LoadingComponent, ssr: true }
  ),
  Footer03: dynamic(
    () => import("@/components/PIXELUP/Footer/Footer03/Footer03"),
    { loading: LoadingComponent, ssr: true }
  ),
} as const;

/**
 * Configuración de los diferentes tipos de Navbar disponibles
 */

const navbarComponents = {
  Navbar01: dynamic(
    () => import("@/components/PIXELUP/Navbar/Navbar01/Navbar01"),
    { loading: NavLoadingComponent, ssr: true }
  ),
  Navbar02: dynamic(
    () => import("@/components/PIXELUP/Navbar/Navbar02/Navbar02"),
    { loading: NavLoadingComponent, ssr: true }
  ),
  NavbarBanner: dynamic(
    () => import("@/components/PIXELUP/Navbar/NavbarBanner/NavbarBanner"),
    { loading: NavLoadingComponent, ssr: true }
  ),
} as const;

/**
 * Configuración de los diferentes tipos de ProductCard disponibles
 */

const productCardComponents = {
  ProductCard01: dynamic(
    () =>
      import("@/components/PIXELUP/ProductCards/ProductCards01/ProductCard01"),
    { loading: LoadingComponent, ssr: true }
  ),
  ProductCard02: dynamic(
    () =>
      import("@/components/PIXELUP/ProductCards/ProductCards02/ProductCard02"),
    { loading: LoadingComponent, ssr: true }
  ),
  ProductCard03: dynamic(
    () =>
      import("@/components/PIXELUP/ProductCards/ProductCards03/ProductCard03"),
    { loading: LoadingComponent, ssr: true }
  ),
  ProductCard04: dynamic(
    () =>
      import("@/components/PIXELUP/ProductCards/ProductCards04/ProductCards04"),
    { loading: LoadingComponent, ssr: true }
  ),
} as const;

// **************************************************
// ******* Interfaces y Configuración Global ********
// **************************************************
//Interface que define la estructura de la configuración global

export interface GlobalConfig {
  activeFooter: FooterType;
  activeNavbar: NavbarType;
  activeProductCard: ProductCardType;
  whatsappButton: {
    isActive: boolean;
    link: string;
  };
}

/**
 * Obtiene los componentes activos según la configuración global
 * @returns Objeto con los componentes Footer, Navbar y ProductCard activos
 */
export function getActiveComponents() {
  const Footer = footerComponents[globalConfig.activeFooter];
  const Navbar = navbarComponents[globalConfig.activeNavbar];
  const ProductCard = productCardComponents[globalConfig.activeProductCard];
  return { Footer, Navbar, ProductCard };
}
