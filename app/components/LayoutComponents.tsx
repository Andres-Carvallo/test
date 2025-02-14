"use client";

import { getActiveComponents } from "@/app/config/GlobalConfig";

export function DynamicNavbar() {
  const { Navbar } = getActiveComponents();
  return <Navbar />;
}

export function DynamicFooter() {
  const { Footer } = getActiveComponents();
  return <Footer />;
}
