import Banner01 from "@/components/Banners/Banner01";
import ProductList01 from "@/components/Products/ProductList01";
import Testimonial01 from "@/components/Testimonials/Testimonial01";
import Stats01 from "@/components/Stats/Stats01";
import CTA01 from "@/components/CTA/CTA01";
import Stats02 from "@/components/Stats/Stats02";
import Collection01 from "@/components/Collections/Collection01";

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-between w-full">
      <Banner01 />
      <Stats02 />
      <ProductList01 />
      <Collection01 />
      <CTA01 />
      <Stats01 />
      <Testimonial01 />
    </section>
  );
}
