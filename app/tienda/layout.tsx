"use client";
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";
import Navbar02 from "@/components/PIXELUP/Navbar/Navbar02/Navbar02";
import Footer01 from "@/components/PIXELUP/Footer/Footer01/Footer01";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MarqueeTOP />
      <Navbar02 />
      <div>{children}</div>
      <Footer01 />
    </>
  );
}
