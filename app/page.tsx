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
import Destacados01 from "@/components/PIXELUP/Destacados/Destacado01";
import Parallax01 from "@/components/PIXELUP/Parallax01/Parallax01";
import MarcasFijas from "@/components/PIXELUP/Marcas/MarcasFijas01/MarcasFijas01";
const Marcas = {
  titulo: "Marcas con las que trabajamos",
  marcas: [
    "https://assets.website-files.com/6357722e2a5f19121d37f84d/635b3fe26718fe228c33ca3b_Microsoft%20Logo.svg",
    "https://assets.website-files.com/6357722e2a5f19121d37f84d/635b3fe2b505e19a1c8ee724_PayPal%20Logo.svg",
    "https://assets.website-files.com/6357722e2a5f19121d37f84d/635b3fdca5c3b6500a5eb898_Google%20Logo.svg",
    "https://assets.website-files.com/6357722e2a5f19121d37f84d/635b3fdf5ff5f86ee7d119de_Chase%20Logo.svg",
    "https://assets.website-files.com/6357722e2a5f19121d37f84d/635b3fe2a5c3b692285eb8bc_Walmart%20Logo.svg",
    "https://assets.website-files.com/6357722e2a5f19121d37f84d/635b40da2bca81dd9374cfbe_Slack%20Logo-2.svg",
  ],
};
export default function Home() {
  return (
    <>
      <MarqueeTOP />
      {/* <Header /> */}
      <Navbar01 />
      <div className="flex min-h-screen flex-col items-center justify-between w-full">
        <BannerPrincipal />
        <ContentBienvenida />
        <Destacados01 />
        <Parallax01 />

        {/* <Hero01 /> */}
        <BannersCategorias />
        <MarcasFijas MarcasFijasData={Marcas} />
        <HomeForm />

        {/* <Sidebarprueba /> */}
      </div>
      {/* <Footer /> */}
      <Footer03 />
    </>
  );
}
