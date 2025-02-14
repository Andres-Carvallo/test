import type { Metadata } from "next";
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";
import Footer02 from "@/components/PIXELUP/Footer/Footer02/Footer02";
import Footer01 from "@/components/PIXELUP/Footer/Footer01/Footer01";
import Navbar02 from "@/components/PIXELUP/Navbar/Navbar02/Navbar02";

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
