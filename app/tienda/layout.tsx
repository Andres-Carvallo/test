import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";

export const metadata: Metadata = {
  title: "TIENDA",
  description: "buff your bussiness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MarqueeTOP />
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
}
