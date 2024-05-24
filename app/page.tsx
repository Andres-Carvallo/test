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

export default function Home() {
  return (
    <>
      <MarqueeTOP />
      <Header />
      <div className="flex min-h-screen flex-col items-center justify-between w-full">
        <BannerPrincipal />
        <ContentBienvenida />
        <ProductList01 />
        <BannersCategorias />
        <HomeForm />
      </div>
      <Footer />
    </>
  );
}
