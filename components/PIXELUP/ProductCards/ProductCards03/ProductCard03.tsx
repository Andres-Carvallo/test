/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

type ProductCardProps = {
  key: any;
  product: any;
  addToCartHandler: (skuId: string, quantity: number) => void;
  isOnSale: any;
  stock: number | null;
};

const ProductCard03: React.FC<ProductCardProps> = ({
  addToCartHandler,
  product,
  isOnSale,
  stock,
}) => {
  const renderPrice = () => {
    let priceRange = {
      min: Infinity,
      max: -Infinity,
    };

    // Si el producto no tiene variaciones y tiene ofertas, mostrar solo el precio de la oferta
    if (!product.hasVariations && product.offers && product.offers.length > 0) {
      const offerPrice = product.offers[0].amount;
      return <span>${offerPrice.toLocaleString("es-CL")}</span>;
    }

    // Verificar si tiene variaciones y rangos de precios
    if (product.hasVariations && product.pricingRanges) {
      priceRange.min = Math.min(
        priceRange.min,
        product.pricingRanges[0].minimumAmount
      );
      priceRange.max = Math.max(
        priceRange.max,
        product.pricingRanges[0].maximumAmount
      );
    } else if (product.pricings) {
      priceRange.min = Math.min(priceRange.min, product.pricings[0].amount);
      priceRange.max = Math.max(priceRange.max, product.pricings[0].amount);
    }

    // Si existe una oferta, se debe tomar como prioridad el precio de oferta
    if (product.offers && product.offers.length > 0) {
      product.offers.forEach((offer: any) => {
        priceRange.min = Math.min(priceRange.min, offer.amount);
        priceRange.max = Math.max(priceRange.max, offer.amount);
      });
    }

    // Asegurarse de que el precio mínimo siempre sea menor al máximo
    const finalMin = Math.min(priceRange.min, priceRange.max);
    const finalMax = Math.max(priceRange.min, priceRange.max);

    // Mostrar el rango o un solo precio si son iguales
    if (finalMin === finalMax) {
      return <span>${finalMin.toLocaleString("es-CL")}</span>;
    } else {
      return (
        <span>
          ${finalMin.toLocaleString("es-CL")} - $
          {finalMax.toLocaleString("es-CL")}
        </span>
      );
    }
  };

  const handleButtonClick = () => {
    if (product.hasVariations) {
      window.location.href = `/tienda/productos/${slugify(product.name)}`;
    } else {
      addToCartHandler(product.skuId, 1);
    }
  };

  return (
    <div className="relative flex flex-col items-center mt-8 ">
      {isOnSale && (
        <span
          className={`mt-6 absolute top-0 -right-2 bg-white text-black text-[14px] py-1 px-2`}
        >
          En Oferta
        </span>
      )}
      <Link href={`/tienda/productosv2/${slugify(product.name)}`}>
        {/* <div className="absolute top-4 right-4 bg-primary text-secondary px-2 py-1 rounded-bl-lg">{productType.name}</div> */}
        <img
          src={product.mainImageUrl}
          alt={product.name}
          className="w-96 object-cover "
          style={{ borderRadius: "var(--radius)" }}
        />
        <p className={`font-semibold mt-4 `}>{product.name}</p>
        <p className={`font-bold mt-2 `}>{renderPrice()}</p>
        <button
          type="button"
          className={`mt-4 uppercase w-full inline-flex items-center justify-center rounded-md border-2 border-transparent bg-primary md:hover:scale-105 duration-300 px-12 py-3 text-center text-base font-bold text-white transition-all ease-in-out focus:shadow`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 mr-3 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Ver Detalle
        </button>
      </Link>
    </div>
  );
};

export default ProductCard03;