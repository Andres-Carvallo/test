import ProductList01 from "@/components/Products/ProductList01";
import Testimonial01 from "@/components/Testimonials/Testimonial01";
import Stats01 from "@/components/Stats/Stats01";
import CTA01 from "@/components/CTA/CTA01";
import Collection01 from "@/components/Collections/Collection01";
import Header from "@/components/Header/Header";
import MarqueeTOP from "@/components/conMantenedor/MarqueeTOP";
import Footer from "@/components/Footer/Footer";
import BannerPrincipal from "@/components/conMantenedor/BannerPrincipal";
import ContentBienvenida from "@/components/conMantenedor/ContentBienvenida";

export default function Home() {
  return (
    <>
      <MarqueeTOP />
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between w-full">
        <BannerPrincipal />
        <ContentBienvenida />
        <ProductList01 />
        <Collection01 />
        <CTA01 />
      </main>
      <Footer />
    </>
  );
}
