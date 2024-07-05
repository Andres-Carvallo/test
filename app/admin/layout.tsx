import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";
import Navbar01 from "@/components/PIXELUP/Navbar/Navbar01/Navbar01";
import Footer01 from "@/components/PIXELUP/Footer/Footer01/Footer01";
import Navbar02 from "@/components/PIXELUP/Navbar/Navbar02/Navbar02";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

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
