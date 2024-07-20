"use client";
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/Marquee";
import Navbar01 from "@/components/PIXELUP/Navbar/Navbar01/Navbar01";
import Footer01 from "@/components/PIXELUP/Footer/Footer01/Footer01";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MarqueeTOP />
      <Navbar01 />
      <div>{children}</div>
      <Footer01 />
    </>
  );
}
