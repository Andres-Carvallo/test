"use client";
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MarqueeTOP from "@/components/PIXELUP/Marquee/MarqueeTop/Marquee";
import Navbar04 from "@/components/PIXELUP/Navbar/Navbar04/Navbar04";
import Footer02 from "@/components/PIXELUP/Footer/Footer02/Footer02";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MarqueeTOP />
      <Navbar04 />
      <div>{children}</div>
      <Footer02 />
    </>
  );
}
