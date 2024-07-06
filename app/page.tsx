import ProductList01 from "@/components/Products/ProductList01";
import Testimonial01 from "@/components/Testimonials/Testimonial01";
import Stats01 from "@/components/Stats/Stats01";
import HomeForm from "@/components/ContactForm/Home";
import Collection01 from "@/components/Collections/Collection01";
import Header from "@/components/Header/Header";
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";
import BannerPrincipal from "@/components/conMantenedor/BannerPrincipal";
import Footer01 from "@/components/PIXELUP/Footer/Footer01/Footer01";
import Navbar01 from "@/components/PIXELUP/Navbar/Navbar01/Navbar01";
import BannerSinFoto from "@/components/PIXELUP/BannerSinFoto/BannerSinFoto";
import Categoria05 from "@/components/PIXELUP/Categorias/Categoria05/Categoria05";
import Frase01 from "@/components/PIXELUP/Frases/Frase01/Frase01";
import Carrusel from "@/components/PIXELUP/Carrusel/Carrusel";
import Frase02 from "@/components/PIXELUP/Frases/Frase02/Frase02";
import Hero02 from "@/components/PIXELUP/Hero/Hero02/Hero02";
import Footer02 from "@/components/PIXELUP/Footer/Footer02/Footer02";
import Footer03 from "@/components/PIXELUP/Footer/Footer03/Footer03";
import Navbar02 from "@/components/PIXELUP/Navbar/Navbar02/Navbar02";
import Colecciones01 from "@/components/PIXELUP/Colecciones/Colecciones01/Colecciones01";
import Navbar04 from "@/components/PIXELUP/Navbar/Navbar04/Navbar04";

export default function Home() {
  return (
    <>
      <title>PixelUP</title>
      <meta
        name="description"
        content="My page description"
      />

      <MarqueeTOP />
      {/* <Header /> */}
      {/* <Navbar01 /> */}
      <Navbar04 />
      {/* <Navbar03 /> */}
      <BannerPrincipal />
      <Colecciones01 />
      <BannerSinFoto />
      <Categoria05 />
      <Frase01 />
      <Carrusel />
      <Hero02 />
      <Frase02 />
      <Footer02 />
    </>
  );
}
