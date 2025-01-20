/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

interface PricingRange {
  minimumAmount: string | number;
  maximumAmount: string | number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface Offer {
  amount: string | number;
}

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
    // Para productos con variaciones
    if (product.hasVariations) {
      // Obtener todos los precios normales y de oferta
      const normalPrices = product.pricingRanges.map((range: PricingRange) => ({
        min: Number(range.minimumAmount) || 0,
        max: Number(range.maximumAmount) || 0
      })).filter((price: PriceRange) => price.min > 0 && price.max > 0);

      const offerPrices = product.offers?.map((offer: Offer) => Number(offer.amount) || 0)
        .filter((price: number) => price > 0) || [];

      // Si hay ofertas, mostrar ambos rangos de precios
      if (isOnSale && offerPrices.length > 0) {
        const minNormalPrice = Math.min(...normalPrices.map((p: PriceRange) => p.min));
        const maxNormalPrice = Math.max(...normalPrices.map((p: PriceRange) => p.max));
        const minOfferPrice = Math.min(...offerPrices);
        const maxOfferPrice = Math.max(...offerPrices);

        return (
          <div className="flex flex-col">
            <span className="line-through text-gray-500 text-sm">
              {minNormalPrice === maxNormalPrice
                ? `$${minNormalPrice.toLocaleString("es-CL")}`
                : `$${Math.min(minNormalPrice, maxNormalPrice).toLocaleString("es-CL")} - $${Math.max(minNormalPrice, maxNormalPrice).toLocaleString("es-CL")}`
              }
            </span>
            <span className="text-red-600 font-semibold text-base">
              {minOfferPrice === maxOfferPrice
                ? `$${minOfferPrice.toLocaleString("es-CL")}`
                : `$${Math.min(minOfferPrice, maxOfferPrice).toLocaleString("es-CL")} - $${Math.max(minOfferPrice, maxOfferPrice).toLocaleString("es-CL")}`
              }
            </span>
          </div>
        );
      }

      // Si no hay ofertas, mostrar rango de precios normal
      if (normalPrices.length > 0) {
        const minPrice = Math.min(...normalPrices.map((p: PriceRange) => p.min));
        const maxPrice = Math.max(...normalPrices.map((p: PriceRange) => p.max));

        return (
          <span>
            {minPrice === maxPrice
              ? `$${minPrice.toLocaleString("es-CL")}`
              : `$${Math.min(minPrice, maxPrice).toLocaleString("es-CL")} - $${Math.max(minPrice, maxPrice).toLocaleString("es-CL")}`
            }
          </span>
        );
      }
    } else {
      // Para productos sin variaciones
      const normalPrice = Number(product.pricings?.[0]?.amount) || 0;
      const offerPrice = isOnSale && product.offers?.[0]?.amount 
        ? Number(product.offers[0].amount) 
        : null;

      if (offerPrice) {
        return (
          <div className="flex flex-col">
            <span className="line-through text-gray-500 text-sm">
              ${normalPrice.toLocaleString("es-CL")}
            </span>
            <span className="text-red-600 font-semibold text-base">
              ${offerPrice.toLocaleString("es-CL")}
            </span>
          </div>
        );
      }

      if (normalPrice > 0) {
        return <span>${normalPrice.toLocaleString("es-CL")}</span>;
      }
    }

    return null;
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