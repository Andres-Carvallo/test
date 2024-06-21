import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";
import Navbar01 from "@/components/PIXELUP/Navbar01/Navbar01";
import Footer03 from "@/components/PIXELUP/Footer03/Footer03";

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
      <Footer03 />
    </>
  );
}
