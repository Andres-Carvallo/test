"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type FooterType = "Footer01" | "Footer02" | "Footer03";
type NavbarType = "Navbar02" | "NavbarBanner";

const LoadingComponent = () => (
  <div className="animate-pulse bg-gray-100 h-96" />
);

const NavLoadingComponent = () => (
  <div className="animate-pulse bg-gray-100 h-20" />
);

const footerComponents = {
  Footer01: dynamic(
    () => import("@/components/PIXELUP/Footer/Footer01/Footer01"),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  Footer02: dynamic(
    () => import("@/components/PIXELUP/Footer/Footer02/Footer02"),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  Footer03: dynamic(
    () => import("@/components/PIXELUP/Footer/Footer03/Footer03"),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
} as const;

const navbarComponents = {
  Navbar02: dynamic(
    () => import("@/components/PIXELUP/Navbar/Navbar02/Navbar02"),
    {
      loading: NavLoadingComponent,
      ssr: true,
    }
  ),
  NavbarBanner: dynamic(
    () => import("@/components/PIXELUP/Navbar/NavbarBanner/NavbarBanner"),
    {
      loading: NavLoadingComponent,
      ssr: true,
    }
  ),
} as const;

export interface GlobalConfig {
  activeFooter: FooterType;
  activeNavbar: NavbarType;
}

export const globalConfig: GlobalConfig = {
  activeFooter: "Footer02",
  activeNavbar: "Navbar02",
};

export function getActiveComponents() {
  const Footer = footerComponents[globalConfig.activeFooter];
  const Navbar = navbarComponents[globalConfig.activeNavbar];
  return { Footer, Navbar };
}
