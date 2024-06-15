import ProductList01 from "@/components/Products/ProductList01";
import Testimonial01 from "@/components/Testimonials/Testimonial01";
import Stats01 from "@/components/Stats/Stats01";
import HomeForm from "@/components/ContactForm/Home";
import Collection01 from "@/components/Collections/Collection01";
import Header from "@/components/Header/Header";
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";
import Footer from "@/components/Footer/Footer";
import BannerPrincipal from "@/components/conMantenedor/BannerPrincipal";
import ContentBienvenida from "@/components/conMantenedor/ContentBienvenida";
import BannersCategorias from "@/components/conMantenedor/BannersCategorias";
import BannerTienda from "@/components/conMantenedor/BannerTienda";
import Hero01 from "@/components/PIXELUP/Hero01/Hero01";
import Footer03 from "@/components/PIXELUP/Footer03/Footer03";
import Navbar01 from "@/components/PIXELUP/Navbar01/Navbar01";
import Productos from "@/components/PIXELUP/Productos03/Productos";
import Sidebarprueba from "@/components/sidebarprueba";

export default function Home() {
  return (
    <>
      <MarqueeTOP />
      {/* <Header /> */}
      <Navbar01 />
      <div className="flex min-h-screen flex-col items-center justify-between w-full">
        <BannerPrincipal />
        <ContentBienvenida />

        <Productos />
        <Hero01 />
        <BannersCategorias />
        <HomeForm />

        {/* <Sidebarprueba /> */}
      </div>
      {/* <Footer /> */}
      <Footer03 />
    </>
  );
}
